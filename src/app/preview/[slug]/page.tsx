import Link from "next/link";
import { fetchPageBySlug, isContentfulConfigured } from "@/lib/contentful";
import { getMockPage } from "@/lib/contentful/mockData";
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

  if (isContentfulConfigured()) {
    pageData = await fetchPageBySlug(slug, isPreview);
  } else {
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

  return <PreviewClient pageData={pageData} isPreview={isPreview} />;
}
