// ===== CONFIG =====
const FEEDS = [
  {
    name: "Bitlair (Amersfoort)",
    url: "https://bitlair.nl/Special:Ask/-5B-5BCategory:Nieuws-5D-5D/mainlabel%3D/limit%3D50/order%3Ddesc/sort%3DNews-20date/offset%3D0/format%3Dfeed/searchlabel%3DAtom/type%3Datom/title%3DBitlair-20Nieuws/page%3Dfull"
  },
  {
    name: "Hackerspace Drenthe",
    url: "https://www.hackerspace-drenthe.nl/feed/"
  },
  {
    name: "Pixelbar (Rotterdam)",
    url: "https://www.pixelbar.nl/atom.xml"
  },
  {
    name: "Revspace (Den Haag)",
    url: "https://revspace.nl/index.php?title=Special%3AAsk&q=%5B%5BCategory%3ANewsItem%5D%5D%0D%0A&po=&eq=yes&p%5Bformat%5D=feed&sort_num=&order_num=ASC&p%5Blimit%5D=&p%5Boffset%5D=&p%5Blink%5D=all&p%5Bsort%5D=NewsItem_Date&p%5Border%5D%5Bdesc%5D=1&p%5Bheaders%5D="
  },
  {
    name: "TD-Venlo",
    url: "http://tdvenlo.nl/?feed=atom"
  },
  {
    name: "Tkkrlab (Enschede)",
    url: "https://www.tkkrlab.com/feed/"
  },
  {
    name: "Hack42 (Arnhem)",
    url: "https://hack42.nl/blog/feed"
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
