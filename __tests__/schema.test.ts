import { describe, it, expect } from "vitest";
import { validatePage } from "../src/lib/schema";

describe("Schema Validation", () => {
  it("validates a correct page object", () => {
    const validPage = {
      pageId: "123",
      slug: "home",
      title: "Home",
      sections: [
        {
          id: "s1",
          type: "hero",
          props: {
            heading: "Welcome",
            ctaLabel: "Click me",
            ctaUrl: "https://example.com"
          }
        }
      ]
    };

    const result = validatePage(validPage);
    expect(result.success).toBe(true);
  });

  it("fails when a section has an unknown type", () => {
    const invalidPage = {
      pageId: "123",
      slug: "home",
      title: "Home",
      sections: [
        {
          id: "s1",
          type: "unknownType",
          props: {}
        }
      ]
    };

    const result = validatePage(invalidPage);
    expect(result.success).toBe(false);
  });

  it("fails when section props are invalid", () => {
    const invalidPage = {
      pageId: "123",
      slug: "home",
      title: "Home",
      sections: [
        {
          id: "s1",
          type: "hero",
          props: {
            heading: "" // Empty string fails .min(1)
          }
        }
      ]
    };

    const result = validatePage(invalidPage);
    expect(result.success).toBe(false);
  });
});
