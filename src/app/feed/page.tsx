import Feed from "@/components/Feed";
import BottomNav from "@/components/BottomNav";
import { getNotes, getSettings } from "@/lib/db";
import { buildFeed } from "@/lib/feed";
import { fetchCurated } from "@/lib/sources";

export const dynamic = "force-dynamic";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: { seed?: string };
}) {
  const [notes, settings] = await Promise.all([getNotes(), getSettings()]);
  const curated = await fetchCurated(settings.enabledSources ?? []);
  const seed = Number(searchParams.seed) || settings.shuffleSeed || Date.now();
  const entries = buildFeed(notes, curated, settings, seed);
  return (
    <main className="min-h-dvh bg-zinc-950">
      <Feed entries={entries} />
      <BottomNav />
    </main>
  );
}
