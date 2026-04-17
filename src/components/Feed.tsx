"use client";

import Link from "next/link";
import { FeedEntry } from "@/lib/types";
import FeedCard from "./FeedCard";

export default function Feed({ entries }: { entries: FeedEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="min-h-dvh grid place-items-center px-6 text-center">
        <div className="max-w-sm space-y-4">
          <h1 className="text-2xl font-semibold">Your feed is empty</h1>
          <p className="text-zinc-400">
            Add a note or enable some curated sources in Settings.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/notes?new=1"
              className="rounded-full bg-zinc-100 text-zinc-900 px-5 py-2.5 font-medium"
            >
              Add note
            </Link>
            <Link
              href="/settings"
              className="rounded-full border border-zinc-700 px-5 py-2.5 font-medium"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="feed-scroller h-dvh overflow-y-scroll snap-y snap-mandatory">
      {entries.map((e) => (
        <FeedCard
          key={e.kind === "note" ? `n:${e.note.id}` : `c:${e.item.id}`}
          entry={e}
        />
      ))}
    </div>
  );
}
