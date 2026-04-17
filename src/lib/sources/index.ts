import { CuratedItem, SourceId } from "../types";
import { fetchArxiv } from "./arxiv";
import { fetchGithubTrending } from "./github";
import { fetchHN } from "./hn";
import { fetchNpmTrending } from "./npm";

const FETCHERS: Record<SourceId, (force?: boolean) => Promise<CuratedItem[]>> = {
  arxiv: fetchArxiv,
  github: fetchGithubTrending,
  npm: fetchNpmTrending,
  hn: fetchHN,
};

export async function fetchCurated(
  sources: SourceId[],
  force = false,
): Promise<CuratedItem[]> {
  const results = await Promise.all(
    sources.map(async (s) => {
      try {
        return await FETCHERS[s](force);
      } catch (e) {
        console.error(`source ${s} failed:`, e);
        return [];
      }
    }),
  );
  return results.flat();
}

export async function refreshAll(): Promise<Record<SourceId, number>> {
  const entries = await Promise.all(
    (Object.keys(FETCHERS) as SourceId[]).map(async (s) => {
      const items = await FETCHERS[s](true);
      return [s, items.length] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<SourceId, number>;
}
