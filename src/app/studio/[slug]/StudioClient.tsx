"use client";

import { useEffect, useCallback } from "react";
import {
  isKnownSectionType,
  validatePage,
  validateSectionProps,
  type Page,
  type SectionType,
} from "@/lib/schema";
import {
  StoreProvider,
  useAppDispatch,
  useAppSelector,
  loadPage,
  updateTitle,
  updateSectionProps,
  addSection,
  removeSection,
  reorderSections,
  selectSection,
  setAddSectionDialogOpen,
  togglePreviewMode,
  startPublish,
  publishSuccess,
  publishError,
} from "@/lib/store";
import { PageRenderer } from "@/components/PageRenderer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";

interface StudioClientProps {
  initialPageData: unknown;
  storageKey: string;
  canPublish: boolean;
}

function StudioEditor({
  initialPage,
  canPublish,
}: {
  initialPage: Page;
  canPublish: boolean;
}) {
  const dispatch = useAppDispatch();
  const page = useAppSelector((s) => s.draftPage.page);
  const isDirty = useAppSelector((s) => s.draftPage.isDirty);
  const selectedSectionId = useAppSelector((s) => s.ui.selectedSectionId);
  const previewMode = useAppSelector((s) => s.ui.previewMode);
  const addDialogOpen = useAppSelector((s) => s.ui.addSectionDialogOpen);
  const publishState = useAppSelector((s) => s.publish);

  useEffect(() => {
    if (!page || page.slug !== initialPage.slug) {
      dispatch(loadPage(initialPage));
    }
  }, [dispatch, initialPage, page]);

  const selectedSection = page?.sections.find((s) => s.id === selectedSectionId);

  const handlePublish = useCallback(async () => {
    if (!page) return;
    dispatch(startPublish());
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");
      if (data.idempotent) {
        dispatch(publishSuccess({ version: data.version, changelog: "No changes — already published" }));
      } else {
        dispatch(publishSuccess({ version: data.version, changelog: data.changelog.join("\n") }));
      }
    } catch (err) {
      dispatch(publishError(err instanceof Error ? err.message : "Unknown error"));
    }
  }, [page, dispatch]);

  const handleAddSection = useCallback(
    (type: SectionType) => {
      const defaultProps: Record<SectionType, Record<string, unknown>> = {
        hero: {
          heading: "New Hero Section",
          subheading: "Add your subheading here",
          ctaLabel: "Learn More",
          ctaUrl: "/get-started",
        },
        featureGrid: {
          heading: "Features",
          subheading: "What makes us different",
          features: [
            { title: "Feature 1", description: "Description here", icon: "performance" },
            { title: "Feature 2", description: "Description here", icon: "security" },
            { title: "Feature 3", description: "Description here", icon: "design" },
          ],
        },
        testimonial: {
          quote: "This is an amazing product!",
          author: "John Doe",
          role: "CEO, Example Inc",
        },
        cta: {
          heading: "Ready to start?",
          subheading: "Join us today",
          buttonLabel: "Get Started",
          buttonUrl: "/get-started",
          variant: "primary",
        },
      };

      dispatch(
        addSection({
          section: {
            id: `section-${uuidv4().slice(0, 8)}`,
            type,
            props: defaultProps[type] || {},
          },
        })
      );
      dispatch(setAddSectionDialogOpen(false));
    },
    [dispatch]
  );

  const handleMoveSection = useCallback(
    (fromIndex: number, direction: "up" | "down") => {
      const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
      dispatch(reorderSections({ fromIndex, toIndex }));
    },
    [dispatch]
  );

  if (!page) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading editor…</p>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div>
        <div className="sticky top-0 z-50 flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
          <span className="text-sm font-medium">Preview Mode</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(togglePreviewMode())}
            className="border-slate-600 text-slate-200 hover:bg-slate-800"
          >
            Back to Editor
          </Button>
        </div>
        <ErrorBoundary>
          <PageRenderer page={page} />
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Left sidebar – Section list & controls */}
      <aside
        className="flex w-80 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        aria-label="Editor sidebar"
      >
        {/* Header */}
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Page Studio
            </h1>
            <div className="flex gap-2">
              {isDirty && (
                <Badge variant="secondary" className="text-xs">
                  Unsaved
                </Badge>
              )}
            </div>
          </div>
          <div className="mt-3">
            <Label htmlFor="page-title" className="text-xs font-medium text-slate-500">
              Page Title
            </Label>
            <Input
              id="page-title"
              value={page.title}
              onChange={(e) => dispatch(updateTitle(e.target.value))}
              className="mt-1"
              aria-label="Page title"
            />
          </div>
        </div>

        {/* Section list */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Sections ({page.sections.length})
            </h2>
            <Dialog
              open={addDialogOpen}
              onOpenChange={(open) => dispatch(setAddSectionDialogOpen(open))}
            >
              <DialogTrigger render={<Button variant="outline" size="sm" aria-label="Add section">+ Add</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Section</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  {[
                    { type: "hero", label: "Hero", icon: "🎯" },
                    { type: "featureGrid", label: "Feature Grid", icon: "📊" },
                    { type: "testimonial", label: "Testimonial", icon: "💬" },
                    { type: "cta", label: "Call to Action", icon: "🚀" },
                  ].map(({ type, label, icon }) => (
                    <button
                      key={type}
                      onClick={() => handleAddSection(type as SectionType)}
                      className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 p-4 text-center transition-all hover:border-purple-400 hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-slate-700 dark:hover:border-purple-600 dark:hover:bg-purple-950/30"
                    >
                      <span className="text-2xl" aria-hidden="true">{icon}</span>
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ul className="space-y-2" aria-label="Page sections">
            {page.sections.map((section, index) => (
              <li
                key={section.id}
                className={`group flex items-center gap-2 rounded-lg border p-3 transition-all cursor-pointer ${
                  selectedSectionId === section.id
                    ? "border-purple-500 bg-purple-50 dark:border-purple-600 dark:bg-purple-950/30"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleMoveSection(index, "up"); }}
                    disabled={index === 0}
                    className="rounded p-0.5 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 dark:hover:bg-slate-700"
                    aria-label={`Move ${section.type} up`}
                  >
                    ▲
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMoveSection(index, "down"); }}
                    disabled={index === page.sections.length - 1}
                    className="rounded p-0.5 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 dark:hover:bg-slate-700"
                    aria-label={`Move ${section.type} down`}
                  >
                    ▼
                  </button>
                </div>
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                  onClick={() => dispatch(selectSection(section.id))}
                  aria-pressed={selectedSectionId === section.id}
                  aria-label={`Select ${section.type} section`}
                >
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                    {section.type}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {section.id}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeSection(section.id));
                    if (selectedSectionId === section.id) {
                      dispatch(selectSection(null));
                    }
                  }}
                  className="rounded p-1 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 focus-visible:opacity-100 dark:hover:bg-red-900/30"
                  aria-label={`Remove ${section.type} section`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-200 p-4 space-y-2 dark:border-slate-800">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => dispatch(togglePreviewMode())}
          >
            👁 Preview
          </Button>
          {canPublish ? (
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handlePublish}
              disabled={publishState.status === "publishing"}
            >
              {publishState.status === "publishing" ? "Publishing…" : "🚀 Publish"}
            </Button>
          ) : (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
              Publisher role required to publish this draft.
            </p>
          )}
          {publishState.status === "success" && (
            <p className="text-center text-xs text-green-600 dark:text-green-400">
              ✓ Published v{publishState.version}
            </p>
          )}
          {publishState.status === "error" && (
            <p className="text-center text-xs text-red-600 dark:text-red-400">
              ✕ {publishState.error}
            </p>
          )}
        </div>
      </aside>

      {/* Center – Live preview canvas */}
      <div className="flex-1 overflow-y-auto">
        <ErrorBoundary>
          <PageRenderer
            page={page}
            editable
            selectedSectionId={selectedSectionId}
            onSectionClick={(id) => dispatch(selectSection(id))}
          />
        </ErrorBoundary>
      </div>

      {/* Right sidebar – Property editor */}
      {selectedSection && (
        <aside
          className="w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          aria-label="Section properties"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Edit: {selectedSection.type}
            </h2>
            <button
              onClick={() => dispatch(selectSection(null))}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:hover:bg-slate-800"
              aria-label="Close properties panel"
            >
              ✕
            </button>
          </div>
          <Separator className="mb-4" />

          <PropertyEditor
            sectionId={selectedSection.id}
            type={selectedSection.type}
            props={selectedSection.props}
          />
        </aside>
      )}
    </div>
  );
}

function PropertyEditor({
  sectionId,
  type,
  props,
}: {
  sectionId: string;
  type: string;
  props: Record<string, unknown>;
}) {
  const dispatch = useAppDispatch();
  const validation =
    isKnownSectionType(type) ? validateSectionProps(type, props) : null;
  const fieldErrors = new Map<string, string>();

  if (validation && !validation.success) {
    for (const issue of validation.errors.issues) {
      const fieldKey = issue.path[0];
      if (typeof fieldKey === "string" && !fieldErrors.has(fieldKey)) {
        fieldErrors.set(fieldKey, issue.message);
      }
    }
  }

  const handleChange = (key: string, value: unknown) => {
    dispatch(updateSectionProps({ sectionId, props: { [key]: value } }));
  };

  // Render editable fields based on section type
  const fields = getEditableFields(type);

  if (!isKnownSectionType(type)) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        This section type is not supported in the studio yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <Card key={field.key} className="border-slate-200 dark:border-slate-700">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase">
              <Label htmlFor={`prop-${sectionId}-${field.key}`}>{field.label}</Label>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            {field.type === "text" || field.type === "url" ? (
              <Input
                id={`prop-${sectionId}-${field.key}`}
                type={field.type === "url" ? "url" : "text"}
                value={(props[field.key] as string) || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                aria-invalid={fieldErrors.has(field.key)}
                aria-describedby={
                  fieldErrors.has(field.key)
                    ? `prop-${sectionId}-${field.key}-error`
                    : undefined
                }
              />
            ) : field.type === "textarea" ? (
              <textarea
                id={`prop-${sectionId}-${field.key}`}
                value={(props[field.key] as string) || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                aria-invalid={fieldErrors.has(field.key)}
                aria-describedby={
                  fieldErrors.has(field.key)
                    ? `prop-${sectionId}-${field.key}-error`
                    : undefined
                }
              />
            ) : null}
            {fieldErrors.has(field.key) && (
              <p
                id={`prop-${sectionId}-${field.key}-error`}
                className="mt-2 text-xs text-red-600 dark:text-red-400"
              >
                {fieldErrors.get(field.key)}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "url" | "textarea";
  placeholder?: string;
}

function getEditableFields(sectionType: string): FieldDef[] {
  switch (sectionType) {
    case "hero":
      return [
        { key: "heading", label: "Heading", type: "text", placeholder: "Enter heading…" },
        { key: "subheading", label: "Subheading", type: "textarea", placeholder: "Enter subheading…" },
        { key: "ctaLabel", label: "CTA Label", type: "text", placeholder: "e.g. Get Started" },
        { key: "ctaUrl", label: "CTA URL", type: "url", placeholder: "/get-started or https://…" },
      ];
    case "featureGrid":
      return [
        { key: "heading", label: "Heading", type: "text", placeholder: "Enter heading…" },
        { key: "subheading", label: "Subheading", type: "textarea", placeholder: "Enter subheading…" },
      ];
    case "testimonial":
      return [
        { key: "quote", label: "Quote", type: "textarea", placeholder: "Enter quote…" },
        { key: "author", label: "Author", type: "text", placeholder: "Author name" },
        { key: "role", label: "Role", type: "text", placeholder: "e.g. CEO, Acme Corp" },
      ];
    case "cta":
      return [
        { key: "heading", label: "Heading", type: "text", placeholder: "Enter heading…" },
        { key: "subheading", label: "Subheading", type: "textarea", placeholder: "Enter subheading…" },
        { key: "buttonLabel", label: "Button Label", type: "text", placeholder: "e.g. Sign Up" },
        { key: "buttonUrl", label: "Button URL", type: "url", placeholder: "/get-started or https://…" },
      ];
    default:
      return [];
  }
}

function ValidatedStudio({
  initialPageData,
  canPublish,
}: Pick<StudioClientProps, "initialPageData" | "canPublish">) {
  const validation = validatePage(initialPageData);

  if (!validation.success) {
    throw new Error(
      `Invalid page data:\n${validation.errors.issues
        .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
        .join("\n")}`
    );
  }

  return <StudioEditor initialPage={validation.data} canPublish={canPublish} />;
}

export function StudioClient({
  initialPageData,
  storageKey,
  canPublish,
}: StudioClientProps) {
  return (
    <StoreProvider storageKey={storageKey}>
      <ErrorBoundary>
        <ValidatedStudio
          initialPageData={initialPageData}
          canPublish={canPublish}
        />
      </ErrorBoundary>
    </StoreProvider>
  );
}
