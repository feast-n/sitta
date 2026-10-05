const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://xxxxxxxxxxxxxxxxxxxx.supabase.co" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "******",
);

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-16 text-slate-900">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Supabase
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {isSupabaseConfigured ? "Connected to Supabase" : "Supabase connection pending"}
        </h1>

        <p className="mt-4 text-base text-slate-600">
          {isSupabaseConfigured
            ? "Your app is configured to use Supabase. Add your data access code and auth flows here."
            : "Add your real project URL and anon key to .env.local to finish the connection."}
        </p>

        <div className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4 text-sm font-mono text-slate-700">
          <div className="flex items-center justify-between gap-3">
            <span>URL</span>
            <span className="truncate text-right text-slate-500">
              {process.env.NEXT_PUBLIC_SUPABASE_URL ?? "Not set"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Anon key</span>
            <span className="text-slate-500">
              {isSupabaseConfigured ? "Configured" : "Missing"}
            </span>
          </div>
        </div>

        <a
          href="https://supabase.com/dashboard/project/_/settings/api"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Open Supabase API settings
        </a>
      </div>
    </main>
  );
}
