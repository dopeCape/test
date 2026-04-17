import { CuratedItem } from "../types";
import { isFresh, readCache, writeCache } from "./cache";

const TTL_MS = 3 * 60 * 60 * 1000;

type HNHit = {
  objectID: string;
  title?: string;
  url?: string;
  points?: number;
  num_comments?: number;
  author?: string;
  created_at?: string;
  story_text?: string;
};

type HNSearch = { hits: HNHit[] };

export async function fetchHN(force = false): Promise<CuratedItem[]> {
  const cached = await readCache("hn");
  if (!force && isFresh(cached, TTL_MS)) return cached!.items;

  const url =
    "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=25";
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "learning-feed/0.1" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`hn ${res.status}`);
    const data = (await res.json()) as HNSearch;
    const now = new Date().toISOString();
    const items: CuratedItem[] = (data.hits ?? [])
      .filter((h) => h.title && (h.url || h.objectID))
      .map((h) => {
        const href =
          h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`;
        const comments = `https://news.ycombinator.com/item?id=${h.objectID}`;
        return {
          id: `hn:${h.objectID}`,
          source: "hn" as const,
          title: h.title!,
          summary: h.story_text ? stripHtml(h.story_text) : "",
          url: href,
          author: h.author,
          publishedAt: h.created_at,
          meta: [
            h.points != null ? `${h.points} pts` : undefined,
            h.num_comments != null ? `${h.num_comments} comments` : undefined,
            `HN discussion: ${comments}`,
          ]
            .filter(Boolean)
            .join(" · "),
          fetchedAt: now,
        };
      });
    if (items.length > 0) await writeCache("hn", items);
    return items;
  } catch (e) {
    if (cached) return cached.items;
    console.error("fetchHN failed:", e);
    return [];
  }
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}
