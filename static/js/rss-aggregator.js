const FEED_URL = "/hugo/feed.xml";

async function loadFeed() {
  const container = document.getElementById("rss-feed");
  container.innerHTML = "Loading...";

  try {
    const response = await fetch(FEED_URL);
    const text = await response.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");

    let items = [];

    // Handle RSS
    xml.querySelectorAll("item").forEach(item => {
      items.push({
        title: item.querySelector("title")?.textContent ?? "No title",
        link: item.querySelector("link")?.textContent ?? "#",
        description: item.querySelector("description")?.textContent ?? "",
        date: new Date(item.querySelector("pubDate")?.textContent ?? "")
      });
    });

    // Handle Atom
    xml.querySelectorAll("entry").forEach(entry => {
      items.push({
        title: entry.querySelector("title")?.textContent ?? "No title",
        link: entry.querySelector("link")?.getAttribute("href") ?? "#",
        description: entry.querySelector("summary")?.textContent ??
                     entry.querySelector("content")?.textContent ?? "",
        date: new Date(entry.querySelector("updated")?.textContent ?? "")
      });
    });

    items.sort((a, b) => b.date - a.date);

    renderItems(items.slice(0, 30));

  } catch (err) {
    container.innerHTML = "Failed to load feed.";
    console.error(err);
  }
}

function renderItems(items) {
  const container = document.getElementById("rss-feed");
  container.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "rss-item";

    div.innerHTML = `
      <h3>
        <a href="${item.link}" target="_blank" rel="noopener">
          ${item.title}
        </a>
      </h3>
      <small>${item.date.toLocaleDateString()}</small>
      <p>${stripHtml(item.description).slice(0, 250)}...</p>
      <hr/>
    `;

    container.appendChild(div);
  });
}

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

loadFeed();
