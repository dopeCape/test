import Feed from "@/components/Feed";
import BottomNav from "@/components/BottomNav";
import { getNotes, getSettings } from "@/lib/db";
import { buildFeed } from "@/lib/feed";

export const dynamic = "force-dynamic";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: { seed?: string };
}) {
  const [notes, settings] = await Promise.all([getNotes(), getSettings()]);
  const seed = Number(searchParams.seed) || settings.shuffleSeed || Date.now();
  const ordered = buildFeed(notes, settings, seed);
  return (
    <main className="min-h-dvh bg-zinc-950">
      <Feed notes={ordered} />
      <BottomNav />
    </main>
  );
}
