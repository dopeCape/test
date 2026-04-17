import { CuratedItem } from "../types";
import { isFresh, readCache, writeCache } from "./cache";

const TTL_MS = 12 * 60 * 60 * 1000; // 12h

type GHRepo = {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  owner: { login: string };
  pushed_at: string;
};

type GHSearchResponse = {
  items: GHRepo[];
};

export async function fetchGithubTrending(force = false): Promise<CuratedItem[]> {
  const cached = await readCache("github");
  if (!force && isFresh(cached, TTL_MS)) return cached!.items;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    `created:>${sevenDaysAgo} stars:>50`,
  )}&sort=stars&order=desc&per_page=25`;

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "learning-feed/0.1",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`github ${res.status}`);
    const data = (await res.json()) as GHSearchResponse;
    const now = new Date().toISOString();
    const items: CuratedItem[] = (data.items ?? []).map((r) => ({
      id: `github:${r.id}`,
      source: "github",
      title: r.full_name,
      summary: r.description ?? "",
      url: r.html_url,
      author: r.owner.login,
      publishedAt: r.pushed_at,
      meta: [
        `${r.stargazers_count.toLocaleString()} ★`,
        r.language ?? undefined,
        "past 7 days",
      ]
        .filter(Boolean)
        .join(" · "),
      fetchedAt: now,
    }));
    if (items.length > 0) await writeCache("github", items);
    return items;
  } catch (e) {
    if (cached) return cached.items;
    console.error("fetchGithubTrending failed:", e);
    return [];
  }
}
