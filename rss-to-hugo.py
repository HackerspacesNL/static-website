#!/bin/env python3

import feedparser
import os
import re
import unicodedata
import toml
from datetime import datetime
from pathlib import Path

# Example RSS feeds
feeds = [
    "https://bitlair.nl/Special:Ask/-5B-5BCategory:Nieuws-5D-5D/mainlabel%3D/limit%3D50/order%3Ddesc/sort%3DNews-20date/offset%3D0/format%3Dfeed/searchlabel%3DAtom/type%3Datom/title%3DBitlair-20Nieuws/page%3Dfull",
    "https://hack42.nl/blog/feed",
    "https://www.hackerspace-drenthe.nl/feed/",
    "https://www.pixelbar.nl/atom.xml",
    "https://revspace.nl/index.php?title=Special%3AAsk&q=%5B%5BCategory%3ANewsItem%5D%5D%0D%0A&po=&eq=yes&p%5Bformat%5D=feed&sort_num=&order_num=ASC&p%5Blimit%5D=&p%5Boffset%5D=&p%5Blink%5D=all&p%5Bsort%5D=NewsItem_Date&p%5Border%5D%5Bdesc%5D=1&p%5Bheaders%5D=",
    "http://tdvenlo.nl/?feed=atom",
    "https://www.tkkrlab.com/feed/"
]

output_dir = Path("content/posts/rss")
output_dir.mkdir(parents=True, exist_ok=True)

# --- FUNCTIONS ---

def slugify(value):
    value = str(unicodedata.normalize('NFKD', value).encode('ascii', 'ignore'), 'ascii')
    value = re.sub(r'[^\w\s-]', '', value).strip().lower()
    return re.sub(r'[-\s]+', '-', value)

def get_entry_date(entry):
    if hasattr(entry, "published_parsed") and entry.published_parsed:
        return datetime(*entry.published_parsed[:6])
    elif hasattr(entry, "updated_parsed") and entry.updated_parsed:
        return datetime(*entry.updated_parsed[:6])
    else:
        return datetime.now()

def write_markdown_file(filepath, metadata, content):
    frontmatter = toml.dumps(metadata)
    markdown = f"+++\n{frontmatter}+++\n\n{content}"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(markdown)

def create_markdown(entry, source_name):
    title = entry.get("title", "No title")
    link = entry.get("link", "")
    summary = entry.get("summary", "")
    date_obj = get_entry_date(entry)
    date_str = date_obj.isoformat()
    slug = slugify(title)[:50]

    metadata = {
        "title": title,
        "date": date_str,
        "categories": [source_name],
        "link": link,
        "draft": False
    }

    content = summary + f"\n\n[Read more]({link})"
    filename = f"{date_obj.date()}-{slug}.md"
    filepath = output_dir / filename

    if not filepath.exists():
        write_markdown_file(filepath, metadata, content)
        print(f"✅ Created: {filename}")
    else:
        print(f"⏭️ Skipped (already exists): {filename}")

# --- MAIN ---

for feed_url in feeds:
    print(f"🔄 Processing: {feed_url}")
    d = feedparser.parse(feed_url)
    source = d.feed.get("title", "rss")

    for entry in d.entries:
        create_markdown(entry, source)
