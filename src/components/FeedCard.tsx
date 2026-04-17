import Link from "next/link";
import { CATEGORIES, CuratedItem, FeedEntry, Note, SOURCES } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatBody(body: string): string[] {
  return body.split(/\n{2,}/g).map((p) => p.trim()).filter(Boolean);
}

function NoteCard({ note }: { note: Note }) {
  const cat = CATEGORIES.find((c) => c.id === note.category);
  const paragraphs = formatBody(note.body);
  return (
    <>
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 opacity-20 blur-3xl pointer-events-none",
          cat?.color ?? "bg-zinc-700",
        )}
      />
      <div className="relative flex-1 flex flex-col justify-center px-6 pt-16 pb-36 max-w-xl mx-auto w-full">
        <div className="mb-4 flex items-center gap-2">
          <span
            className={cn(
              "inline-block h-2 w-2 rounded-full",
              cat?.color ?? "bg-zinc-400",
            )}
          />
          <span className="text-xs uppercase tracking-widest text-zinc-400">
            {cat?.label ?? note.category}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-zinc-50">
          {note.title}
        </h2>
        {paragraphs.length > 0 ? (
          <div className="mt-5 space-y-4 text-zinc-300 text-base sm:text-lg leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-wrap">
                {p}
              </p>
            ))}
          </div>
        ) : null}
        <div className="mt-8 flex items-center gap-3 text-xs text-zinc-500">
          <span>weight {note.weight}</span>
          <span>·</span>
          <Link
            href={`/notes?edit=${note.id}`}
            className="underline-offset-2 hover:underline"
          >
            edit
          </Link>
        </div>
      </div>
    </>
  );
}

function CuratedCard({ item }: { item: CuratedItem }) {
  const src = SOURCES.find((s) => s.id === item.source);
  const summary =
    item.summary.length > 500 ? item.summary.slice(0, 500) + "…" : item.summary;
  return (
    <>
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 opacity-20 blur-3xl pointer-events-none",
          src?.color ?? "bg-zinc-700",
        )}
      />
      <div className="relative flex-1 flex flex-col justify-center px-6 pt-16 pb-36 max-w-xl mx-auto w-full">
        <div className="mb-4 flex items-center gap-2">
          <span
            className={cn(
              "inline-block h-2 w-2 rounded-full",
              src?.color ?? "bg-zinc-400",
            )}
          />
          <span className="text-xs uppercase tracking-widest text-zinc-400">
            {src?.label ?? item.source}
          </span>
          {item.author ? (
            <span className="text-xs text-zinc-500">· {item.author}</span>
          ) : null}
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold leading-tight tracking-tight text-zinc-50">
          {item.title}
        </h2>
        {summary ? (
          <p className="mt-4 text-zinc-300 text-base leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>
        ) : null}
        {item.meta ? (
          <p className="mt-4 text-xs text-zinc-500">{item.meta}</p>
        ) : null}
        <div className="mt-8">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-100 text-zinc-900 px-4 py-2 text-sm font-medium hover:bg-white transition"
          >
            Open
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7M10 7h7v7" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}

export default function FeedCard({ entry }: { entry: FeedEntry }) {
  return (
    <article
      className="relative snap-start snap-always h-dvh w-full flex flex-col"
      aria-label={entry.kind === "note" ? entry.note.title : entry.item.title}
    >
      {entry.kind === "note" ? (
        <NoteCard note={entry.note} />
      ) : (
        <CuratedCard item={entry.item} />
      )}
    </article>
  );
}
