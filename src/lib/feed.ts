import { Category, Note, Settings } from "./types";

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
 * Weighted shuffle: notes with higher `weight` are more likely to appear near
 * the top, so pinned reminders keep resurfacing but aren't the only thing shown.
 */
export function buildFeed(
  notes: Note[],
  settings: Settings,
  seed = settings.shuffleSeed,
): Note[] {
  const enabled = new Set<Category>(settings.enabledCategories);
  const pool = notes.filter((n) => enabled.has(n.category));
  const rand = mulberry32(seed);

  return pool
    .map((n) => {
      const w = Math.max(0.1, n.weight || 1);
      const key = -Math.log(rand() + 1e-9) / w;
      return { n, key };
    })
    .sort((a, b) => a.key - b.key)
    .map((x) => x.n);
}
