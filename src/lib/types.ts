export type Category =
  | "remind-me"
  | "tech"
  | "ai"
  | "papers"
  | "code"
  | "idea";

export const CATEGORIES: { id: Category; label: string; color: string }[] = [
  { id: "remind-me", label: "Remind Me", color: "bg-rose-500" },
  { id: "tech", label: "Tech", color: "bg-sky-500" },
  { id: "ai", label: "AI", color: "bg-violet-500" },
  { id: "papers", label: "Papers", color: "bg-emerald-500" },
  { id: "code", label: "Code", color: "bg-amber-500" },
  { id: "idea", label: "Ideas", color: "bg-fuchsia-500" },
];

export type Note = {
  id: string;
  title: string;
  body: string;
  category: Category;
  weight: number;
  createdAt: string;
  updatedAt: string;
};

export type SourceId = "arxiv" | "github" | "npm" | "hn";

export const SOURCES: {
  id: SourceId;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    id: "arxiv",
    label: "arXiv",
    description: "Recent CS papers (AI, ML, PL, SE, distributed systems)",
    color: "bg-emerald-500",
  },
  {
    id: "github",
    label: "GitHub Trending",
    description: "Repos gaining the most stars this week",
    color: "bg-amber-500",
  },
  {
    id: "npm",
    label: "npm Packages",
    description: "Active & popular JS/TS packages",
    color: "bg-rose-500",
  },
  {
    id: "hn",
    label: "Hacker News",
    description: "Front-page tech stories",
    color: "bg-sky-500",
  },
];

export type CuratedItem = {
  id: string;
  source: SourceId;
  title: string;
  summary: string;
  url: string;
  author?: string;
  meta?: string;
  publishedAt?: string;
  fetchedAt: string;
};

export type FeedEntry =
  | { kind: "note"; note: Note; weight: number }
  | { kind: "curated"; item: CuratedItem; weight: number };

export type Settings = {
  enabledCategories: Category[];
  enabledSources: SourceId[];
  shuffleSeed: number;
  curatedWeight: number;
};

export const DEFAULT_SETTINGS: Settings = {
  enabledCategories: CATEGORIES.map((c) => c.id),
  enabledSources: SOURCES.map((s) => s.id),
  shuffleSeed: 1,
  curatedWeight: 1,
};
