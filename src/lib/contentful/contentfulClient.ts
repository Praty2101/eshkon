import { createClient, type ContentfulClientApi, type EntrySkeletonType } from "contentful";

// ── Environment ───────────────────────────────────────────────
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID ?? "";
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN ?? "";
const PREVIEW_TOKEN = process.env.CONTENTFUL_PREVIEW_TOKEN ?? "";
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT ?? "master";

/**
 * Creates a Contentful client.
 * When `preview` is true, uses the preview API + preview token
 * so draft (unpublished) entries are returned.
 */
function getClient(preview = false): ContentfulClientApi<undefined> {
  return createClient({
    space: SPACE_ID,
    accessToken: preview ? PREVIEW_TOKEN : ACCESS_TOKEN,
    host: preview ? "preview.contentful.com" : "cdn.contentful.com",
    environment: ENVIRONMENT,
  });
}

// ── Types for Contentful entries ──────────────────────────────
interface ContentfulSection {
  type: string;
  props: Record<string, unknown>;
}

interface ContentfulPageFields {
  pageId: string;
  slug: string;
  title: string;
  sections: ContentfulSection[];
}

// ── Adapter types (what we return to the app) ─────────────────
export interface AdaptedPage {
  pageId: string;
  slug: string;
  title: string;
  sections: {
    id: string;
    type: string;
    props: Record<string, unknown>;
  }[];
}

/**
 * Adapt raw Contentful entry fields → clean AdaptedPage shape.
 * This is the ONLY place Contentful-specific logic lives.
 */
function adaptPage(fields: ContentfulPageFields, entryId: string): AdaptedPage {
  return {
    pageId: fields.pageId ?? entryId,
    slug: fields.slug,
    title: fields.title,
    sections: (fields.sections ?? []).map((section, index) => ({
      id: `section-${index}`,
      type: section.type,
      props: section.props ?? {},
    })),
  };
}

/**
 * Fetch a page by slug.
 * @param slug   - URL slug of the page
 * @param preview - if true, fetch draft content
 */
export async function fetchPageBySlug(
  slug: string,
  preview = false
): Promise<AdaptedPage | null> {
  try {
    const client = getClient(preview);
    const response = await client.getEntries<EntrySkeletonType>({
      content_type: "page",
      "fields.slug": slug,
      limit: 1,
      include: 3,
    });

    if (response.items.length === 0) return null;

    const entry = response.items[0];
    const fields = entry.fields as unknown as ContentfulPageFields;
    return adaptPage(fields, entry.sys.id);
  } catch (error) {
    console.error("[Contentful] Failed to fetch page:", error);
    return null;
  }
}

/**
 * Fetch all page slugs (useful for static generation).
 */
export async function fetchAllPageSlugs(preview = false): Promise<string[]> {
  try {
    const client = getClient(preview);
    const response = await client.getEntries<EntrySkeletonType>({
      content_type: "page",
      select: ["fields.slug"],
      limit: 100,
    });

    return response.items.map(
      (entry) => (entry.fields as unknown as { slug: string }).slug
    );
  } catch (error) {
    console.error("[Contentful] Failed to fetch slugs:", error);
    return [];
  }
}

/**
 * Check whether Contentful credentials are configured.
 */
export function isContentfulConfigured(): boolean {
  return Boolean(SPACE_ID && (ACCESS_TOKEN || PREVIEW_TOKEN));
}
