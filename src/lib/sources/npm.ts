import { CuratedItem } from "../types";
import { isFresh, readCache, writeCache } from "./cache";

const TTL_MS = 12 * 60 * 60 * 1000;

type NpmsSearchResult = {
  results: {
    package: {
      name: string;
      version: string;
      description?: string;
      keywords?: string[];
      date: string;
      links: { npm: string; homepage?: string; repository?: string };
      publisher?: { username?: string };
    };
    score: {
      final: number;
      detail: { popularity: number; quality: number; maintenance: number };
    };
  }[];
};

const QUERIES = [
  "keywords:ai",
  "keywords:agent",
  "keywords:llm",
  "keywords:typescript",
  "keywords:nextjs",
  "keywords:react",
  "keywords:cli",
  "keywords:devtools",
];

export async function fetchNpmTrending(force = false): Promise<CuratedItem[]> {
  const cached = await readCache("npm");
  if (!force && isFresh(cached, TTL_MS)) return cached!.items;

  try {
    const now = new Date().toISOString();
    const seen = new Set<string>();
    const items: CuratedItem[] = [];

    for (const q of QUERIES) {
      const url = `https://api.npms.io/v2/search?q=${encodeURIComponent(
        q,
      )}+not:deprecated&size=8`;
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "learning-feed/0.1" },
          signal: AbortSignal.timeout(10_000),
        });
        if (!res.ok) continue;
        const data = (await res.json()) as NpmsSearchResult;
        for (const r of data.results ?? []) {
          if (seen.has(r.package.name)) continue;
          seen.add(r.package.name);
          const pop = Math.round(r.score.detail.popularity * 100);
          const qual = Math.round(r.score.detail.quality * 100);
          items.push({
            id: `npm:${r.package.name}`,
            source: "npm",
            title: r.package.name,
            summary: r.package.description ?? "",
            url: r.package.links.npm,
            author: r.package.publisher?.username,
            publishedAt: r.package.date,
            meta: `v${r.package.version} · popularity ${pop} · quality ${qual}`,
            fetchedAt: now,
          });
        }
      } catch {
        /* skip one query failure */
      }
    }

    if (items.length > 0) await writeCache("npm", items);
    return items;
  } catch (e) {
    if (cached) return cached.items;
    console.error("fetchNpmTrending failed:", e);
    return [];
  }
}
