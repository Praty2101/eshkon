import type { Page } from "@/lib/schema";
import {
  compareSemVer,
  diffPages,
  bumpVersion,
  pagesAreIdentical,
} from "./semver";
import fs from "fs/promises";
import path from "path";

const RELEASES_DIR = path.join(process.cwd(), "releases");

export interface Release {
  version: string;
  slug: string;
  snapshot: Page;
  changelog: string[];
  publishedAt: string;
}

/**
 * Get the directory for a specific slug's releases.
 */
function getSlugDir(slug: string): string {
  return path.join(RELEASES_DIR, slug);
}

function getVersionFromFilename(fileName: string): string {
  return fileName.replace(/\.json$/, "");
}

/**
 * Get the latest release for a slug, or null if none exists.
 */
export async function getLatestRelease(slug: string): Promise<Release | null> {
  const slugDir = getSlugDir(slug);
  try {
    await fs.access(slugDir);
  } catch {
    return null;
  }

  const files = await fs.readdir(slugDir);
  const versionFiles = files
    .filter((f) => f.endsWith(".json"))
    .sort((left, right) =>
      compareSemVer(getVersionFromFilename(right), getVersionFromFilename(left))
    );

  if (versionFiles.length === 0) return null;

  const raw = await fs.readFile(path.join(slugDir, versionFiles[0]), "utf-8");
  return JSON.parse(raw) as Release;
}

/**
 * Get all releases for a slug.
 */
export async function getAllReleases(slug: string): Promise<Release[]> {
  const slugDir = getSlugDir(slug);
  try {
    await fs.access(slugDir);
  } catch {
    return [];
  }

  const files = await fs.readdir(slugDir);
  const versionFiles = files
    .filter((f) => f.endsWith(".json"))
    .sort((left, right) =>
      compareSemVer(getVersionFromFilename(left), getVersionFromFilename(right))
    );

  const releases: Release[] = [];
  for (const file of versionFiles) {
    const raw = await fs.readFile(path.join(slugDir, file), "utf-8");
    releases.push(JSON.parse(raw) as Release);
  }

  return releases;
}

/**
 * Publish a page as a new immutable release.
 *
 * Returns the release if published, or null if the draft is
 * identical to the latest release (idempotent).
 */
export async function publishPage(draft: Page): Promise<Release | null> {
  const latest = await getLatestRelease(draft.slug);

  // Idempotent: same draft → no new version
  if (latest && pagesAreIdentical(latest.snapshot, draft)) {
    return null;
  }

  let version: string;
  let changelog: string[];

  if (!latest) {
    // First release
    version = "1.0.0";
    changelog = ["Initial release"];
  } else {
    const diff = diffPages(latest.snapshot, draft);
    version = bumpVersion(latest.version, diff.bump);
    changelog = diff.changes;
  }

  const release: Release = {
    version,
    slug: draft.slug,
    snapshot: structuredClone(draft),
    changelog,
    publishedAt: new Date().toISOString(),
  };

  // Save immutable snapshot
  const slugDir = getSlugDir(draft.slug);
  const releasePath = path.join(slugDir, `${version}.json`);
  await fs.mkdir(slugDir, { recursive: true });

  try {
    const existing = await fs.readFile(releasePath, "utf-8");
    const parsed = JSON.parse(existing) as Release;
    if (pagesAreIdentical(parsed.snapshot, draft)) {
      return null;
    }
  } catch {
    // File does not exist yet, so this publish can proceed.
  }

  await fs.writeFile(
    releasePath,
    JSON.stringify(release, null, 2),
    "utf-8"
  );

  return release;
}
