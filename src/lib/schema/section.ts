import { z } from "zod";

const pageLinkSchema = z.union([
  z.string().url("Must be a valid URL or internal path"),
  z.string().regex(/^\/[^\s]*$/, "Must be a valid URL or internal path"),
]);

// ── Hero Section ──────────────────────────────────────────────
export const HeroPropsSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  subheading: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: pageLinkSchema.optional(),
  backgroundImageUrl: z.string().url().optional(),
});
export type HeroProps = z.infer<typeof HeroPropsSchema>;

// ── Feature Grid Section ──────────────────────────────────────
export const FeatureItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().optional(),
});

export const FeatureGridPropsSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  subheading: z.string().optional(),
  features: z.array(FeatureItemSchema).min(1, "At least one feature required"),
});
export type FeatureGridProps = z.infer<typeof FeatureGridPropsSchema>;

// ── Testimonial Section ───────────────────────────────────────
export const TestimonialPropsSchema = z.object({
  quote: z.string().min(1, "Quote is required"),
  author: z.string().min(1, "Author is required"),
  role: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});
export type TestimonialProps = z.infer<typeof TestimonialPropsSchema>;

// ── CTA Section ───────────────────────────────────────────────
export const CtaPropsSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  subheading: z.string().optional(),
  buttonLabel: z.string().min(1, "Button label is required"),
  buttonUrl: pageLinkSchema,
  variant: z.enum(["primary", "secondary", "outline"]).optional(),
});
export type CtaProps = z.infer<typeof CtaPropsSchema>;

// ── Section type map ─────────────────────────────────────────
export const SectionType = z.enum(["hero", "featureGrid", "testimonial", "cta"]);
export type SectionType = z.infer<typeof SectionType>;
const knownSectionTypes = new Set<string>(SectionType.options);

export const sectionPropsSchemaMap: Record<SectionType, z.ZodTypeAny> = {
  hero: HeroPropsSchema,
  featureGrid: FeatureGridPropsSchema,
  testimonial: TestimonialPropsSchema,
  cta: CtaPropsSchema,
};

export const sectionFieldMetadata: Record<
  SectionType,
  {
    required: string[];
    optional: string[];
  }
> = {
  hero: {
    required: ["heading"],
    optional: ["subheading", "ctaLabel", "ctaUrl", "backgroundImageUrl"],
  },
  featureGrid: {
    required: ["heading", "features"],
    optional: ["subheading"],
  },
  testimonial: {
    required: ["quote", "author"],
    optional: ["role", "avatarUrl"],
  },
  cta: {
    required: ["heading", "buttonLabel", "buttonUrl"],
    optional: ["subheading", "variant"],
  },
};

function validateKnownSection(
  section: {
    type: string;
    props: Record<string, unknown>;
  },
  ctx: z.RefinementCtx
) {
  if (!isKnownSectionType(section.type)) {
    return;
  }

  const result = sectionPropsSchemaMap[section.type].safeParse(section.props);
  if (!result.success) {
    for (const issue of result.error.issues) {
      ctx.addIssue({
        code: "custom",
        message: issue.message,
        path: ["props", ...issue.path],
      });
    }
  }
}

// ── Section ──────────────────────────────────────────────────
export const SectionSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  props: z.record(z.string(), z.unknown()),
}).superRefine(validateKnownSection);
export type Section = z.infer<typeof SectionSchema>;

// ── Page ─────────────────────────────────────────────────────
export const PageSchema = z.object({
  pageId: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1, "Title is required"),
  sections: z.array(SectionSchema),
});
export type Page = z.infer<typeof PageSchema>;

/**
 * Validates a page and returns typed result.
 */
export function validatePage(data: unknown): { success: true; data: Page } | { success: false; errors: z.ZodError } {
  const result = PageSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Validates section props against their type-specific schema.
 */
export function validateSectionProps(
  type: SectionType,
  props: Record<string, unknown>
): { success: true; data: Record<string, unknown> } | { success: false; errors: z.ZodError } {
  const schema = sectionPropsSchemaMap[type];
  if (!schema) {
    return {
      success: false,
      errors: new z.ZodError([
        {
          code: "custom",
          message: `Unknown section type: ${type}`,
          path: ["type"],
        },
      ]),
    };
  }
  const result = schema.safeParse(props);
  if (result.success) {
    return { success: true, data: result.data as Record<string, unknown> };
  }
  return { success: false, errors: result.error };
}

export function isKnownSectionType(value: string): value is SectionType {
  return knownSectionTypes.has(value);
}
