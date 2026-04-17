import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

type Note = {
  id: string;
  title: string;
  body: string;
  category: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
};

const now = new Date().toISOString();

const SAMPLES: Omit<Note, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Ship small, ship often",
    body:
      "Momentum beats perfection. A rough PR merged today is worth more than a polished one next week.\n\nReviewers can push back; silence can't.",
    category: "remind-me",
    weight: 3,
  },
  {
    title: "ADHD tip: externalize the next step",
    body:
      "When stuck, write the literal next physical action on a sticky note. Not the goal, the action.\n\n\"Open the repo.\" \"Click new branch.\" Make it smaller than you think.",
    category: "remind-me",
    weight: 2.5,
  },
  {
    title: "Agents: tool-use is the bottleneck, not reasoning",
    body:
      "Most production agent failures are tool orchestration bugs — retries, schema drift, context bloat — not the model being dumb.",
    category: "ai",
    weight: 2,
  },
  {
    title: "Read: Reflexion (self-reflective agents)",
    body:
      "Agents that keep a short episodic memory of past failures outperform vanilla ReAct on long-horizon tasks. Worth re-reading when designing retry loops.",
    category: "papers",
    weight: 1.5,
  },
  {
    title: "Server components aren't free",
    body:
      "Every RSC streams HTML + RSC payload. Putting interactive bits deep in the tree still hydrates the whole branch — colocate 'use client' carefully.",
    category: "tech",
    weight: 1,
  },
  {
    title: "Snippet: debounce with AbortController",
    body:
      "function debounce<T extends (...a: any[]) => any>(fn: T, ms: number) {\n  let ac: AbortController | null = null;\n  return (...args: Parameters<T>) => {\n    ac?.abort();\n    ac = new AbortController();\n    const signal = ac.signal;\n    setTimeout(() => { if (!signal.aborted) fn(...args); }, ms);\n  };\n}",
    category: "code",
    weight: 1,
  },
  {
    title: "Idea: reel-style learning feed",
    body:
      "Replace the reel doomscroll with your own notes + curated tech drops. Config first, content later.\n\n(You are here.)",
    category: "idea",
    weight: 1.5,
  },
];

async function main() {
  const dataDir = path.join(process.cwd(), "data");
  await fs.mkdir(dataDir, { recursive: true });
  const notesFile = path.join(dataDir, "notes.json");

  const existing: Note[] = await fs
    .readFile(notesFile, "utf-8")
    .then((raw) => JSON.parse(raw) as Note[])
    .catch(() => []);

  const seeded: Note[] = SAMPLES.map((s) => ({
    ...s,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }));

  const merged = [...seeded, ...existing];
  await fs.writeFile(notesFile, JSON.stringify(merged, null, 2));
  console.log(`Seeded ${seeded.length} notes → ${notesFile}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
