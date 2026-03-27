import { cookies, headers } from "next/headers";
import { getUserRole, hasPermission } from "@/lib/auth";
import { fetchPageBySlug, isContentfulConfigured } from "@/lib/contentful";
import { getMockPage } from "@/lib/contentful/mockData";
import { StudioClient } from "./StudioClient";

interface StudioPageProps {
  params: Promise<{ slug: string }>;
}

export default async function StudioPage({ params }: StudioPageProps) {
  const { slug } = await params;
  const requestHeaders = await headers();
  const requestCookies = await cookies();
  const userRole = getUserRole(requestHeaders, requestCookies);

  let pageData = null;

  if (isContentfulConfigured()) {
    pageData = await fetchPageBySlug(slug, true); // Always use draft in studio
  } else {
    pageData = getMockPage(slug);
  }

  if (!pageData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mb-4 text-6xl" aria-hidden="true">📝</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            No page with slug <code className="rounded bg-slate-200 px-2 py-0.5 font-mono text-sm dark:bg-slate-800">{slug}</code> exists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <StudioClient
      initialPageData={pageData}
      storageKey={`page-studio-draft:${slug}`}
      canPublish={hasPermission(userRole, "publisher")}
    />
  );
}
