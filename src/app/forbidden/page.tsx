import Link from "next/link";

interface ForbiddenPageProps {
  searchParams: Promise<{ required?: string; current?: string }>;
}

export default async function ForbiddenPage({ searchParams }: ForbiddenPageProps) {
  const sp = await searchParams;
  const required = sp.required || "unknown";
  const current = sp.current || "unknown";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 text-7xl" aria-hidden="true">🔒</div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Access Denied
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          You need the <strong className="text-purple-600 dark:text-purple-400">{required}</strong> role
          to access this page.
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
          Your current role: <code className="rounded bg-slate-200 px-2 py-0.5 font-mono text-xs dark:bg-slate-800">{current}</code>
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
          >
            Go Home
          </Link>
          <Link
            href="/preview/landing"
            className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            View Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
