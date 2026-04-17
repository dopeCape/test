import BottomNav from "@/components/BottomNav";
import NotesList from "@/components/NotesList";
import { getNotes } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await getNotes();
  return (
    <main className="min-h-dvh bg-zinc-950">
      <NotesList notes={notes} />
      <BottomNav />
    </main>
  );
}
