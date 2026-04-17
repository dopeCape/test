"use client";

import Link from "next/link";
import { Note } from "@/lib/types";
import FeedCard from "./FeedCard";

export default function Feed({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return (
      <div className="min-h-dvh grid place-items-center px-6 text-center">
        <div className="max-w-sm space-y-4">
          <h1 className="text-2xl font-semibold">Your feed is empty</h1>
          <p className="text-zinc-400">
            Add a note or reminder and it will start appearing here in the
            scroll.
          </p>
          <Link
            href="/notes?new=1"
            className="inline-block rounded-full bg-zinc-100 text-zinc-900 px-5 py-2.5 font-medium"
          >
            Add your first note
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="feed-scroller h-dvh overflow-y-scroll snap-y snap-mandatory">
      {notes.map((n) => (
        <FeedCard key={n.id} note={n} />
      ))}
    </div>
  );
}
