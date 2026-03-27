import type { Page } from "@/lib/schema";

/**
 * Mock page data for development when Contentful is not configured.
 * This allows the app to run locally without real credentials.
 */
export const mockPages: Record<string, Page> = {
  "landing": {
    pageId: "mock-landing-001",
    slug: "landing",
    title: "Welcome to PageStudio",
    sections: [
      {
        id: "hero-1",
        type: "hero",
        props: {
          heading: "Build Beautiful Pages, Effortlessly",
          subheading:
            "A schema-driven page studio with real-time editing, version control, and accessibility built in.",
          ctaLabel: "Get Started",
          ctaUrl: "/get-started",
        },
      },
      {
        id: "features-1",
        type: "featureGrid",
        props: {
          heading: "Why Page Studio?",
          subheading: "Everything you need to create, edit, and publish landing pages.",
          features: [
            {
              title: "Schema-Driven",
              description: "Every page is validated against a typed schema — no broken layouts, ever.",
              icon: "code",
            },
            {
              title: "Version Control",
              description: "Automated SemVer with immutable snapshots. Roll back any time.",
              icon: "security",
            },
            {
              title: "WYSIWYG-Lite Editor",
              description: "Drag, drop, and edit sections with a visual studio. No code required.",
              icon: "design",
            },
            {
              title: "Accessibility First",
              description: "WCAG 2.2 AAA-oriented. Keyboard-navigable, screen-reader friendly.",
              icon: "performance",
            },
            {
              title: "Contentful Integration",
              description: "Load content from Contentful. Draft and published modes supported.",
              icon: "cloud",
            },
            {
              title: "Role-Based Access",
              description: "Viewers, editors, and publishers — enforced at the server level.",
              icon: "security",
            },
          ],
        },
      },
      {
        id: "testimonial-1",
        type: "testimonial",
        props: {
          quote:
            "Page Studio transformed our content workflow. We ship landing pages 10x faster with full confidence in quality.",
          author: "Sarah Chen",
          role: "Head of Marketing, Acme Corp",
        },
      },
      {
        id: "cta-1",
        type: "cta",
        props: {
          heading: "Ready to Get Started?",
          subheading: "Create your first page in under 5 minutes.",
          buttonLabel: "Start Building",
          buttonUrl: "/get-started",
          variant: "primary",
        },
      },
    ],
  },
  "product": {
    pageId: "mock-product-001",
    slug: "product",
    title: "Product Page",
    sections: [
      {
        id: "hero-2",
        type: "hero",
        props: {
          heading: "The All-in-One CMS Studio",
          subheading: "From draft to published in minutes — not days.",
          ctaLabel: "View Demo",
          ctaUrl: "/preview/product",
        },
      },
      {
        id: "cta-2",
        type: "cta",
        props: {
          heading: "Join the Beta",
          subheading: "Limited spots available. Get early access today.",
          buttonLabel: "Request Access",
          buttonUrl: "/get-started",
          variant: "secondary",
        },
      },
    ],
  },
};

export function getMockPage(slug: string): Page | null {
  return mockPages[slug] ?? null;
}

export function getMockSlugs(): string[] {
  return Object.keys(mockPages);
}
