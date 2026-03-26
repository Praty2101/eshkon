import Link from "next/link";
import { fetchPageBySlug, isContentfulConfigured } from "@/lib/contentful";
import { getMockPage } from "@/lib/contentful/mockData";
import { validatePage } from "@/lib/schema";
import { PreviewClient } from "./PreviewClient";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const isPreview = sp.preview === "true";

  let pageData = null;

  // Try Contentful first, fall back to mock data
  if (isContentfulConfigured()) {
    pageData = await fetchPageBySlug(slug, isPreview);
  }

  if (!pageData) {
    pageData = getMockPage(slug);
  }

  if (!pageData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mb-4 text-6xl" aria-hidden="true">📄</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            No page with slug <code className="rounded bg-slate-200 px-2 py-0.5 font-mono text-sm dark:bg-slate-800">{slug}</code> exists.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Validate the page
  const validation = validatePage(pageData);

  if (!validation.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50 dark:bg-red-950/20">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-4 text-5xl" aria-hidden="true">⚠️</div>
          <h1 className="text-2xl font-bold text-red-800 dark:text-red-300">
            Invalid Page Data
          </h1>
          <p className="mt-2 text-red-700 dark:text-red-400">
            The page data failed schema validation.
          </p>
          <pre className="mt-4 overflow-auto rounded-lg bg-red-100 p-4 text-left text-xs text-red-900 dark:bg-red-900/30 dark:text-red-200">
            {JSON.stringify(validation.errors.issues, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return <PreviewClient page={validation.data} isPreview={isPreview} />;
}
