import { describe, it, expect } from "vitest";
import { compareSemVer, diffPages } from "../src/lib/publish/semver";
import type { Page } from "../src/lib/schema";

const basePage: Page = {
  pageId: "1",
  slug: "test",
  title: "Test Page",
  sections: [
    {
      id: "s1",
      type: "hero",
      props: { heading: "Old Heading" },
    },
  ],
};

describe("SemVer Diff Logic", () => {
  it("returns patch for text/prop change", () => {
    const current: Page = {
      ...basePage,
      sections: [
        {
          id: "s1",
          type: "hero",
          props: { heading: "New Heading" },
        },
      ],
    };
    const diff = diffPages(basePage, current);
    expect(diff.bump).toBe("patch");
    expect(diff.changes.length).toBeGreaterThan(0);
  });

  it("returns minor for added section", () => {
    const current: Page = {
      ...basePage,
      sections: [
        ...basePage.sections,
        {
          id: "s2",
          type: "cta",
          props: { heading: "CTA", buttonLabel: "Click", buttonUrl: "http" },
        },
      ],
    };
    const diff = diffPages(basePage, current);
    expect(diff.bump).toBe("minor");
  });

  it("returns major for removed section", () => {
    const current: Page = { ...basePage, sections: [] };
    const diff = diffPages(basePage, current);
    expect(diff.bump).toBe("major");
  });

  it("returns major for section type change", () => {
    const current: Page = {
      ...basePage,
      sections: [
        {
          id: "s1", // same ID
          type: "cta", // different type
          props: { heading: "CTA", buttonLabel: "Click", buttonUrl: "http" },
        },
      ],
    };
    const diff = diffPages(basePage, current);
    expect(diff.bump).toBe("major");
  });

  it("returns major for removed required prop", () => {
    const current: Page = {
      ...basePage,
      sections: [
        {
          id: "s1",
          type: "hero",
          props: {}, // heading is removed
        },
      ],
    };
    const diff = diffPages(basePage, current);
    expect(diff.bump).toBe("major");
  });

  it("returns patch for title change", () => {
    const current: Page = { ...basePage, title: "New Title text" };
    const diff = diffPages(basePage, current);
    expect(diff.bump).toBe("patch");
  });

  it("returns patch for removing an optional prop", () => {
    const previous: Page = {
      ...basePage,
      sections: [
        {
          id: "s1",
          type: "hero",
          props: {
            heading: "Old Heading",
            subheading: "Optional copy",
          },
        },
      ],
    };

    const current: Page = {
      ...basePage,
      sections: [
        {
          id: "s1",
          type: "hero",
          props: { heading: "Old Heading" },
        },
      ],
    };

    const diff = diffPages(previous, current);
    expect(diff.bump).toBe("patch");
  });

  it("sorts semantic versions numerically", () => {
    expect(compareSemVer("1.0.10", "1.0.2")).toBeGreaterThan(0);
    expect(compareSemVer("2.0.0", "10.0.0")).toBeLessThan(0);
  });
});
