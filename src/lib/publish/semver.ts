import {
  isKnownSectionType,
  sectionFieldMetadata,
  type Page,
} from "@/lib/schema";

export type BumpType = "patch" | "minor" | "major";

export interface DiffResult {
  bump: BumpType;
  changes: string[];
}

/**
 * Compare two page versions and determine the SemVer bump.
 *
 * Rules (fixed):
 *   Patch → text/prop change
 *   Minor → add section / optional prop
 *   Major → remove section / change type / break required prop
 */
export function diffPages(previous: Page, current: Page): DiffResult {
  const changes: string[] = [];
  let bump: BumpType = "patch";

  // Track section IDs
  const prevSectionIds = new Set(previous.sections.map((s) => s.id));
  const currSectionIds = new Set(current.sections.map((s) => s.id));

  // Check for removed sections → major
  for (const id of prevSectionIds) {
    if (!currSectionIds.has(id)) {
      const section = previous.sections.find((s) => s.id === id);
      changes.push(`REMOVED section "${section?.type}" (${id})`);
      bump = "major";
    }
  }

  // Check for added sections → minor
  for (const id of currSectionIds) {
    if (!prevSectionIds.has(id)) {
      const section = current.sections.find((s) => s.id === id);
      changes.push(`ADDED section "${section?.type}" (${id})`);
      if (bump !== "major") bump = "minor";
    }
  }

  // Check for type changes → major
  for (const currSection of current.sections) {
    const prevSection = previous.sections.find((s) => s.id === currSection.id);
    if (!prevSection) continue;

    if (prevSection.type !== currSection.type) {
      changes.push(
        `CHANGED type of section ${currSection.id}: "${prevSection.type}" → "${currSection.type}"`
      );
      bump = "major";
      continue;
    }

    const currentType = currSection.type;

    // Compare props
    const prevProps = prevSection.props;
    const currProps = currSection.props;
    const fieldMetadata = isKnownSectionType(currentType)
      ? sectionFieldMetadata[currentType]
      : null;
    const requiredProps = new Set(fieldMetadata?.required ?? []);
    const optionalProps = new Set(fieldMetadata?.optional ?? []);

    // Check for removed required props → major
    for (const key of Object.keys(prevProps)) {
      if (!(key in currProps)) {
        changes.push(`REMOVED prop "${key}" from section ${currSection.id}`);
        if (requiredProps.has(key)) {
          bump = "major";
        }
      }
    }

    // Check for added props
    for (const key of Object.keys(currProps)) {
      if (!(key in prevProps)) {
        changes.push(`ADDED prop "${key}" to section ${currSection.id}`);
        if (requiredProps.has(key)) {
          bump = "major";
        } else if (optionalProps.has(key) && bump !== "major") {
          bump = "minor";
        }
      }
    }

    // Check for changed props → patch
    for (const key of Object.keys(currProps)) {
      if (key in prevProps) {
        const prevVal = JSON.stringify(prevProps[key]);
        const currVal = JSON.stringify(currProps[key]);
        if (prevVal !== currVal) {
          changes.push(`CHANGED prop "${key}" in section ${currSection.id}`);
        }
      }
    }
  }

  // Title change → patch
  if (previous.title !== current.title) {
    changes.push(`CHANGED title: "${previous.title}" → "${current.title}"`);
  }

  // If no changes detected
  if (changes.length === 0) {
    return { bump: "patch", changes: ["No changes detected"] };
  }

  return { bump, changes };
}

/**
 * Parse a semver string into components.
 */
export function parseSemVer(version: string): { major: number; minor: number; patch: number } {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return { major: 0, minor: 0, patch: 0 };
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

export function compareSemVer(a: string, b: string): number {
  const left = parseSemVer(a);
  const right = parseSemVer(b);

  if (left.major !== right.major) return left.major - right.major;
  if (left.minor !== right.minor) return left.minor - right.minor;
  return left.patch - right.patch;
}

/**
 * Bump a version string according to the bump type.
 */
export function bumpVersion(version: string, bump: BumpType): string {
  const { major, minor, patch } = parseSemVer(version);
  switch (bump) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
  }
}

/**
 * Check if two pages are identical (for idempotent publish).
 */
export function pagesAreIdentical(a: Page, b: Page): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
