import { Category, CuratedItem, FeedEntry, Note, Settings } from "./types";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Weighted shuffle over a mixed pool of notes + curated items.
 * Higher weight → likelier to appear near the top. We use the exponential
 * trick: key = -log(U)/w, sort ascending.
 */
export function buildFeed(
  notes: Note[],
  curated: CuratedItem[],
  settings: Settings,
  seed = settings.shuffleSeed,
): FeedEntry[] {
  const enabledCats = new Set<Category>(settings.enabledCategories);
  const rand = mulberry32(seed);

  const noteEntries: FeedEntry[] = notes
    .filter((n) => enabledCats.has(n.category))
    .map((n) => ({ kind: "note", note: n, weight: Math.max(0.1, n.weight || 1) }));

  const curatedWeight = Math.max(0.1, settings.curatedWeight ?? 1);
  const curatedEntries: FeedEntry[] = curated.map((c) => ({
    kind: "curated",
    item: c,
    weight: curatedWeight,
  }));

  const pool = [...noteEntries, ...curatedEntries];

  return pool
    .map((entry) => ({
      entry,
      key: -Math.log(rand() + 1e-9) / entry.weight,
    }))
    .sort((a, b) => a.key - b.key)
    .map((x) => x.entry);
}
