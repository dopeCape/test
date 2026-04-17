import BottomNav from "@/components/BottomNav";
import SettingsForm from "@/components/SettingsForm";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <main className="min-h-dvh bg-zinc-950">
      <div className="px-5 pt-8 pb-24 max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>
        <SettingsForm initial={settings} />
        <form method="post" action="/api/logout" className="mt-10">
          <button
            type="submit"
            className="text-sm text-zinc-400 hover:text-zinc-200 underline underline-offset-4"
          >
            Log out
          </button>
        </form>
      </div>
      <BottomNav />
    </main>
  );
}
