import Link from "next/link";
import { CATEGORIES, Note } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatBody(body: string): string[] {
  return body.split(/\n{2,}/g).map((p) => p.trim()).filter(Boolean);
}

export default function FeedCard({ note }: { note: Note }) {
  const cat = CATEGORIES.find((c) => c.id === note.category);
  const paragraphs = formatBody(note.body);
  return (
    <article
      className="relative snap-start snap-always h-dvh w-full flex flex-col"
      aria-label={note.title}
    >
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
    </article>
  );
}
