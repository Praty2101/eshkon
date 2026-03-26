"use client";

import type { Page } from "@/lib/schema";
import { getSectionComponent } from "@/lib/registry/sectionRegistry";
import { UnsupportedSection } from "@/components/sections/UnsupportedSection";

interface PageRendererProps {
  page: Page;
  onSectionClick?: (sectionId: string) => void;
  selectedSectionId?: string | null;
  editable?: boolean;
}

export function PageRenderer({
  page,
  onSectionClick,
  selectedSectionId,
  editable = false,
}: PageRendererProps) {
  return (
    <main aria-label={page.title}>
      {page.sections.map((section) => {
        const Component = getSectionComponent(section.type);

        const wrapper = (children: React.ReactNode) => {
          if (!editable) return <div key={section.id}>{children}</div>;

          return (
            <div
              key={section.id}
              role="button"
              tabIndex={0}
              aria-label={`Edit ${section.type} section`}
              className={`relative cursor-pointer transition-all ${
                selectedSectionId === section.id
                  ? "ring-2 ring-purple-500 ring-offset-2"
                  : "hover:ring-1 hover:ring-purple-300 hover:ring-offset-1"
              }`}
              onClick={() => onSectionClick?.(section.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSectionClick?.(section.id);
                }
              }}
            >
              {selectedSectionId === section.id && (
                <div className="absolute top-2 right-2 z-20 rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white shadow-lg">
                  {section.type}
                </div>
              )}
              {children}
            </div>
          );
        };

        if (!Component) {
          return wrapper(
            <UnsupportedSection type={section.type} id={section.id} />
          );
        }

        return wrapper(
          <Component {...(section.props as Record<string, unknown>)} />
        );
      })}
    </main>
  );
}
