import type { ComponentType } from "react";
import type { SectionType } from "@/lib/schema";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureGridSection } from "@/components/sections/FeatureGridSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { CtaSection } from "@/components/sections/CtaSection";

/**
 * Central registry mapping section type → React component.
 *
 * To add a new section:
 *  1. Create the component in components/sections/
 *  2. Add its Zod schema in lib/schema/section.ts
 *  3. Register it here
 *
 * Removing an entry will cause TypeScript to error if the type
 * is still used, and at runtime the renderer will show the
 * UnsupportedSection fallback.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sectionRegistry: Record<SectionType, ComponentType<any>> = {
  hero: HeroSection,
  featureGrid: FeatureGridSection,
  testimonial: TestimonialSection,
  cta: CtaSection,
};

/**
 * Look up a component for the given section type.
 * Returns undefined for unknown types.
 */
export function getSectionComponent(type: string): ComponentType<Record<string, unknown>> | undefined {
  return sectionRegistry[type as SectionType];
}
