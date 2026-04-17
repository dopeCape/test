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

export type Settings = {
  enabledCategories: Category[];
  shuffleSeed: number;
};

export const DEFAULT_SETTINGS: Settings = {
  enabledCategories: CATEGORIES.map((c) => c.id),
  shuffleSeed: 1,
};
