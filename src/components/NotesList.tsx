"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CATEGORIES, Note } from "@/lib/types";
import { cn } from "@/lib/utils";
import NoteEditor from "./NoteEditor";

export default function NotesList({ notes }: { notes: Note[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("edit");
  const isNew = params.get("new") === "1";
  const editing = useMemo(
    () => (editId ? notes.find((n) => n.id === editId) : undefined),
    [editId, notes],
  );
  const [showNew, setShowNew] = useState(isNew);

  function closeEditor() {
    if (editId || isNew) {
      const url = new URL(window.location.href);
      url.searchParams.delete("edit");
      url.searchParams.delete("new");
      router.replace(url.pathname + (url.search || ""));
    }
    setShowNew(false);
  }

  return (
    <>
      <div className="px-5 pt-8 pb-24 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Notes</h1>
          <button
            onClick={() => setShowNew(true)}
            className="rounded-full bg-zinc-100 text-zinc-900 px-4 py-2 text-sm font-medium"
          >
            + New
          </button>
        </div>

        {notes.length === 0 ? (
          <p className="text-zinc-400">
            No notes yet. Tap <span className="text-zinc-200">+ New</span> to add
            your first one.
          </p>
        ) : (
          <ul className="space-y-3">
            {notes.map((n) => {
              const cat = CATEGORIES.find((c) => c.id === n.category);
              return (
                <li
                  key={n.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-zinc-700 transition cursor-pointer"
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set("edit", n.id);
                    router.replace(url.pathname + "?" + url.searchParams);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn("h-2 w-2 rounded-full", cat?.color ?? "bg-zinc-400")}
                    />
                    <span className="text-xs uppercase tracking-widest text-zinc-400">
                      {cat?.label ?? n.category}
                    </span>
                    <span className="ml-auto text-xs text-zinc-500">
                      w {n.weight}
                    </span>
                  </div>
                  <h3 className="font-medium text-zinc-100">{n.title}</h3>
                  {n.body ? (
                    <p className="mt-1 text-sm text-zinc-400 line-clamp-2 whitespace-pre-wrap">
                      {n.body}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {(showNew || editing) && (
        <NoteEditor note={editing} onClose={closeEditor} />
      )}
    </>
  );
}
