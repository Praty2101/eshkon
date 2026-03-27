"use client";

import type { MouseEvent, ReactNode } from "react";
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
  const handleEditableContentClick = (
    event: MouseEvent<HTMLElement>,
    sectionId: string
  ) => {
    const target = event.target as HTMLElement;

    if (
      target.closest(
        'a, button, input, textarea, select, [role="button"], [role="link"]'
      ) &&
      !target.closest('[data-section-select-control="true"]')
    ) {
      event.preventDefault();
      event.stopPropagation();
      onSectionClick?.(sectionId);
    }
  };

  return (
    <main aria-label={page.title}>
      {page.sections.map((section) => {
        const Component = getSectionComponent(section.type);
        const isSelected = selectedSectionId === section.id;

        const wrapper = (children: ReactNode) => {
          if (!editable) return <div key={section.id}>{children}</div>;

          return (
            <div
              key={section.id}
              className={`relative cursor-pointer transition-all ${
                isSelected
                  ? "ring-2 ring-purple-500 ring-offset-2"
                  : "hover:ring-1 hover:ring-purple-300 hover:ring-offset-1"
              }`}
              onClick={() => onSectionClick?.(section.id)}
              onClickCapture={(event) =>
                handleEditableContentClick(event, section.id)
              }
            >
              <div className="absolute top-2 right-2 z-20 flex items-center gap-2">
                {isSelected && (
                  <div className="rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white shadow-lg">
                    {section.type}
                  </div>
                )}
                <button
                  type="button"
                  data-section-select-control="true"
                  className="rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-xs font-medium text-slate-900 shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSectionClick?.(section.id);
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Select ${section.type} section`}
                >
                  {isSelected ? "Selected" : "Select"}
                </button>
              </div>
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
