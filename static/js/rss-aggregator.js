// ===== CONFIG =====
const FEEDS = [
  {
    name: "Example Blog",
    url: "https://example.com/rss.xml"
  },
  {
    name: "Another Blog",
    url: "https://another.com/feed"
  }
];

// OPTIONAL: public proxy (for testing only)
const CORS_PROXY = "https://api.allorigins.win/raw?url=";

// ===== MAIN =====
async function loadFeeds() {
  const container = document.getElementById("rss-feed");
  container.innerHTML = "Loading...";

  let allItems = [];

  for (let feed of FEEDS) {
    try {
      const response = await fetch(CORS_PROXY + encodeURIComponent(feed.url));
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");

      const items = xml.querySelectorAll("item");

      items.forEach(item => {
        const title = item.querySelector("title")?.textContent ?? "No title";
        const link = item.querySelector("link")?.textContent ?? "#";
        const description = item.querySelector("description")?.textContent ?? "";
        const pubDate = item.querySelector("pubDate")?.textContent ?? "";
        const date = new Date(pubDate);

        allItems.push({
          title,
          link,
          description,
          date,
          source: feed.name
        });
      });

    } catch (err) {
      console.error("Failed to load feed:", feed.url, err);
    }
  }

  // Sort newest first
  allItems.sort((a, b) => b.date - a.date);

  renderItems(allItems.slice(0, 20));
}

function renderItems(items) {
  const container = document.getElementById("rss-feed");
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = "No items found.";
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "rss-item";

    div.innerHTML = `
      <h3>
        <a href="${item.link}" target="_blank" rel="noopener">
          ${item.title}
        </a>
      </h3>
      <small>${item.source} — ${item.date.toLocaleDateString()}</small>
      <p>${stripHtml(item.description).slice(0, 200)}...</p>
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

loadFeeds();
