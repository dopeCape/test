type SearchParams = { next?: string; error?: string };

const ERROR_MESSAGES: Record<string, string> = {
  bad: "Wrong password.",
  missing: "Enter a password.",
  server: "Server misconfigured. Check env vars.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const next = searchParams.next || "/feed";
  const error = searchParams.error ? ERROR_MESSAGES[searchParams.error] : null;

  return (
    <main className="min-h-dvh grid place-items-center bg-zinc-950 text-zinc-100 px-6">
      <form
        method="post"
        action={`/api/login?next=${encodeURIComponent(next)}`}
        className="w-full max-w-sm space-y-6"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Learning Feed
          </h1>
          <p className="text-sm text-zinc-400">Enter your password to continue.</p>
        </div>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          placeholder="Password"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-base outline-none focus:border-zinc-600"
        />
        {error ? (
          <p className="text-sm text-rose-400 text-center">{error}</p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-xl bg-zinc-100 text-zinc-900 py-3 font-medium hover:bg-white transition"
        >
          Unlock
        </button>
      </form>
    </main>
  );
}
