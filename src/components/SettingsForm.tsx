"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  CATEGORIES,
  Category,
  Settings,
  SOURCES,
  SourceId,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export default function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [enabledCats, setEnabledCats] = useState<Set<Category>>(
    new Set(initial.enabledCategories),
  );
  const [enabledSrcs, setEnabledSrcs] = useState<Set<SourceId>>(
    new Set(initial.enabledSources),
  );
  const [seed, setSeed] = useState<number>(initial.shuffleSeed);
  const [curatedWeight, setCuratedWeight] = useState<number>(
    initial.curatedWeight,
  );
  const [saving, startTransition] = useTransition();
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  function toggleCat(c: Category) {
    setEnabledCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }
  function toggleSrc(s: SourceId) {
    setEnabledSrcs((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  async function save() {
    setStatus(null);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enabledCategories: Array.from(enabledCats),
        enabledSources: Array.from(enabledSrcs),
        shuffleSeed: seed,
        curatedWeight,
      }),
    });
    if (!res.ok) {
      setStatus("Save failed");
      return;
    }
    setStatus("Saved");
    startTransition(() => router.refresh());
  }

  async function refresh() {
    setRefreshing(true);
    setStatus(null);
    try {
      const res = await fetch("/api/refresh", { method: "POST" });
      if (!res.ok) throw new Error("refresh failed");
      const data = (await res.json()) as { counts: Record<string, number> };
      const parts = Object.entries(data.counts).map(
        ([s, n]) => `${s} ${n}`,
      );
      setStatus(`Fetched: ${parts.join(", ")}`);
    } catch {
      setStatus("Refresh failed");
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-medium mb-2">Note categories in feed</h2>
        <p className="text-sm text-zinc-400 mb-3">
          Your own notes. Toggle categories to hide them from the scroll.
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const on = enabledCats.has(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCat(c.id)}
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
        <h2 className="font-medium mb-2">Curated sources</h2>
        <p className="text-sm text-zinc-400 mb-3">
          External feeds mixed into your scroll. Cached for a few hours — hit
          refresh for the latest.
        </p>
        <div className="space-y-2">
          {SOURCES.map((s) => {
            const on = enabledSrcs.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSrc(s.id)}
                className={cn(
                  "w-full flex items-start gap-3 text-left rounded-lg border p-3 transition",
                  on
                    ? "border-zinc-600 bg-zinc-900"
                    : "border-zinc-800 hover:border-zinc-700",
                )}
              >
                <span
                  className={cn(
                    "mt-1 inline-block h-2 w-2 rounded-full flex-shrink-0",
                    s.color,
                  )}
                />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-zinc-100">
                    {s.label}
                  </span>
                  <span className="block text-xs text-zinc-400">
                    {s.description}
                  </span>
                </span>
                <span
                  className={cn(
                    "text-xs",
                    on ? "text-emerald-400" : "text-zinc-500",
                  )}
                >
                  {on ? "on" : "off"}
                </span>
              </button>
            );
          })}
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="mt-4 rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:border-zinc-500 disabled:opacity-60"
        >
          {refreshing ? "Refreshing…" : "Refresh sources now"}
        </button>
      </section>

      <section>
        <h2 className="font-medium mb-2">Mix balance</h2>
        <p className="text-sm text-zinc-400 mb-3">
          Curated weight: {curatedWeight.toFixed(1)}. Higher = curated items
          surface more often relative to your notes.
        </p>
        <input
          type="range"
          min={0.2}
          max={5}
          step={0.1}
          value={curatedWeight}
          onChange={(e) => setCuratedWeight(Number(e.target.value))}
          className="w-full"
        />
      </section>

      <section>
        <h2 className="font-medium mb-2">Shuffle seed</h2>
        <p className="text-sm text-zinc-400 mb-3">
          Change this to re-shuffle the feed order.
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
