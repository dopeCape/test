import { promises as fs } from "fs";
import path from "path";
import { CuratedItem, SourceId } from "../types";

const CACHE_DIR = path.join(process.cwd(), "data", "cache");

type CacheEnvelope = {
  fetchedAt: string;
  items: CuratedItem[];
};

async function ensureDir() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
}

function file(source: SourceId): string {
  return path.join(CACHE_DIR, `${source}.json`);
}

export async function readCache(source: SourceId): Promise<CacheEnvelope | null> {
  try {
    const raw = await fs.readFile(file(source), "utf-8");
    return JSON.parse(raw) as CacheEnvelope;
  } catch {
    return null;
  }
}

export async function writeCache(
  source: SourceId,
  items: CuratedItem[],
): Promise<void> {
  await ensureDir();
  const envelope: CacheEnvelope = {
    fetchedAt: new Date().toISOString(),
    items,
  };
  await fs.writeFile(file(source), JSON.stringify(envelope, null, 2));
}

export function isFresh(envelope: CacheEnvelope | null, ttlMs: number): boolean {
  if (!envelope) return false;
  const age = Date.now() - new Date(envelope.fetchedAt).getTime();
  return age < ttlMs;
}
