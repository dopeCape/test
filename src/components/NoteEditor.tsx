"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { CATEGORIES, Category, Note } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  note?: Note;
  onClose: () => void;
};

export default function NoteEditor({ note, onClose }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const [category, setCategory] = useState<Category>(note?.category ?? "remind-me");
  const [weight, setWeight] = useState<number>(note?.weight ?? 1);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    const payload = { title, body, category, weight };
    const url = note ? `/api/notes/${note.id}` : "/api/notes";
    const method = note ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      setError("Save failed");
      return;
    }
    startTransition(() => {
      router.refresh();
      onClose();
    });
  }

  async function remove() {
    if (!note) return;
    if (!confirm("Delete this note?")) return;
    const res = await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Delete failed");
      return;
    }
    startTransition(() => {
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur grid place-items-end sm:place-items-center">
      <form
        onSubmit={submit}
        className="w-full sm:max-w-lg bg-zinc-900 border-t sm:border border-zinc-800 sm:rounded-2xl p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {note ? "Edit note" : "New note"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200"
          >
            Close
          </button>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          autoFocus
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-zinc-600"
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body (two blank lines = new paragraph)"
          rows={6}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-zinc-600 resize-y"
        />

        <div>
          <label className="text-xs text-zinc-400">Category</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition",
                  category === c.id
                    ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                    : "border-zinc-800 text-zinc-300 hover:border-zinc-600",
                )}
              >
                <span className={cn("inline-block h-2 w-2 rounded-full mr-2", c.color)} />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-400">
            Weight — {weight.toFixed(1)} (higher = appears more often)
          </label>
          <input
            type="range"
            min={0.2}
            max={5}
            step={0.1}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full mt-2"
          />
        </div>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <div className="flex items-center justify-between gap-3 pt-2">
          {note ? (
            <button
              type="button"
              onClick={remove}
              className="text-rose-400 hover:text-rose-300 text-sm"
            >
              Delete
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-zinc-100 text-zinc-900 px-4 py-2 font-medium disabled:opacity-60"
          >
            {pending ? "Saving…" : note ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
