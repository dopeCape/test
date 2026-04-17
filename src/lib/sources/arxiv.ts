import { CuratedItem } from "../types";
import { isFresh, readCache, writeCache } from "./cache";

const TTL_MS = 6 * 60 * 60 * 1000; // 6h
const CATEGORIES = [
  "cs.AI",
  "cs.LG",
  "cs.CL",
  "cs.SE",
  "cs.PL",
  "cs.DC",
  "cs.DB",
  "cs.OS",
];

const ENDPOINT = `https://export.arxiv.org/api/query?search_query=${CATEGORIES.map(
  (c) => `cat:${c}`,
).join("+OR+")}&sortBy=submittedDate&sortOrder=descending&max_results=30`;

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extract(tag: string, block: string): string | undefined {
  const m = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`));
  return m ? decode(m[1]) : undefined;
}

function parseEntries(xml: string): CuratedItem[] {
  const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];
  const now = new Date().toISOString();
  return entries.flatMap((block) => {
    const inner = block.replace(/^<entry>|<\/entry>$/g, "");
    const id = extract("id", inner);
    const title = extract("title", inner);
    const summary = extract("summary", inner);
    const published = extract("published", inner);
    const authors = Array.from(
      inner.matchAll(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g),
    ).map((m) => decode(m[1]));
    if (!id || !title) return [];
    return [
      {
        id: `arxiv:${id}`,
        source: "arxiv" as const,
        title,
        summary: summary ?? "",
        url: id,
        author: authors.slice(0, 4).join(", ") || undefined,
        publishedAt: published,
        meta: published ? `arXiv · ${published.slice(0, 10)}` : "arXiv",
        fetchedAt: now,
      },
    ];
  });
}

export async function fetchArxiv(force = false): Promise<CuratedItem[]> {
  const cached = await readCache("arxiv");
  if (!force && isFresh(cached, TTL_MS)) return cached!.items;
  try {
    const res = await fetch(ENDPOINT, {
      headers: { "User-Agent": "learning-feed/0.1" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`arxiv ${res.status}`);
    const xml = await res.text();
    const items = parseEntries(xml);
    if (items.length > 0) await writeCache("arxiv", items);
    return items;
  } catch (e) {
    if (cached) return cached.items;
    console.error("fetchArxiv failed:", e);
    return [];
  }
}
