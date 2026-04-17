"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CATEGORIES, Category, Settings } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState<Set<Category>>(
    new Set(initial.enabledCategories),
  );
  const [seed, setSeed] = useState<number>(initial.shuffleSeed);
  const [saving, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  function toggle(c: Category) {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  async function save() {
    setStatus(null);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enabledCategories: Array.from(enabled),
        shuffleSeed: seed,
      }),
    });
    if (!res.ok) {
      setStatus("Save failed");
      return;
    }
    setStatus("Saved");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-medium mb-2">Categories in feed</h2>
        <p className="text-sm text-zinc-400 mb-3">
          Disable categories to hide them from the scroll.
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const on = enabled.has(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition",
                  on
                    ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                    : "border-zinc-800 text-zinc-500 hover:border-zinc-600",
                )}
              >
                <span className={cn("inline-block h-2 w-2 rounded-full mr-2", c.color)} />
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-2">Shuffle seed</h2>
        <p className="text-sm text-zinc-400 mb-3">
          Change this to re-shuffle the feed order. The feed is weighted — notes
          with higher weight appear near the top more often.
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            value={seed}
            onChange={(e) => setSeed(Number(e.target.value) || 0)}
            className="w-32 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-zinc-600"
          />
          <button
            onClick={() => setSeed(Math.floor(Math.random() * 1e9))}
            className="rounded-lg border border-zinc-800 px-3 py-2 text-sm hover:border-zinc-600"
          >
            Randomize
          </button>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-zinc-100 text-zinc-900 px-4 py-2 font-medium disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {status ? <span className="text-sm text-zinc-400">{status}</span> : null}
      </div>
    </div>
  );
}
