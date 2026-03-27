import Link from "next/link";

export default function GetStartedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-slate-50 px-6 py-16 text-slate-950">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
          Public Onboarding
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Explore Page Studio before you need editor access
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-700">
          This onboarding route is intentionally public-facing. You can preview
          the landing pages, understand the publishing model, and share the app
          without sending people into a protected editor screen.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">What you can do here</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>Preview the schema-driven landing pages.</li>
              <li>See how sections render without logging in.</li>
              <li>Share a public demo path with teammates or reviewers.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-slate-50 shadow-sm">
            <h2 className="text-xl font-semibold">When you need editing</h2>
            <p className="mt-4 text-sm text-slate-300">
              The studio remains protected by RBAC. Editors can access the
              studio route, and publishers can release immutable versions.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/preview/landing"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
          >
            View Landing Preview
          </Link>
          <Link
            href="/preview/product"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
          >
            Open Product Demo
          </Link>
        </div>
      </div>
    </main>
  );
}
