# Page Studio

A schema-driven landing page studio built with Next.js App Router, TypeScript, Redux Toolkit, Contentful, Tailwind, and shadcn/ui.

## 1. Architecture Overview

Page Studio has three main surfaces:

- `/preview/[slug]`: Loads a page from the Contentful adapter when credentials are present, otherwise from local mock data for development. The client validates the page with Zod and renders sections through a single typed registry.
- `/studio/[slug]`: Loads draft content, hydrates a per-page Redux store, and lets editors add, reorder, and edit supported section props with a WYSIWYG-lite experience.
- `/api/publish`: Validates the draft, applies deterministic SemVer rules, and writes immutable JSON snapshots to `releases/<slug>/<version>.json`.

Shared architecture rules:

- Contentful-specific SDK logic stays in `src/lib/contentful/contentfulClient.ts`.
- Section rendering stays in `src/lib/registry/sectionRegistry.ts`.
- Zod schemas and section metadata live in `src/lib/schema/section.ts`.
- Route and publish permissions are enforced server-side in `src/proxy.ts` and `src/app/api/publish/route.ts`.

## 2. Redux Slice Responsibilities

- `draftPageSlice`: Owns the editable draft page state, including title updates, prop changes, add/remove, and reorder operations.
- `uiSlice`: Owns transient editor UI state such as the selected section, add-section dialog state, and preview mode toggle.
- `publishSlice`: Owns publish lifecycle state, including pending/success/error status, changelog text, and the last published version.

Draft persistence is isolated per slug using `page-studio-draft:<slug>` localStorage keys so one page draft cannot overwrite another.

## 3. Contentful Model + Adapter Explanation

The app expects a Contentful `page` content type with:

- `pageId: string`
- `slug: string`
- `title: string`
- `sections: Array<{ type: string; props: Record<string, unknown> }>`

The adapter:

- creates either the Content Delivery API client or Preview API client
- fetches by slug
- adapts Contentful fields into the app-facing `AdaptedPage` shape
- keeps all Contentful SDK usage out of React UI code

If Contentful credentials are absent, development falls back to local mock data. If credentials are present, the app uses Contentful only.

## 4. Publish + SemVer Logic

Publishing compares the incoming draft to the latest stored release for the slug.

Rules:

- Patch: text changes, value changes, optional prop removal
- Minor: added section, added optional prop
- Major: removed section, section type change, removed required prop, added required prop

Additional guarantees:

- Re-publishing an identical draft is idempotent and does not create a new version.
- Releases are stored as immutable snapshots in `releases/<slug>/<version>.json`.
- Release lookup is semantic-version aware, so `10.0.0` sorts after `2.0.0`.

## 5. Accessibility Evidence

Accessibility is enforced through both implementation and automation:

- keyboard-selectable studio controls without nested interactive wrappers
- visible `focus-visible` rings on editor and preview controls
- labelled form controls in the property editor, with `aria-invalid` and accessible error text
- reduced-motion-aware transitions via `motion-safe`
- Playwright + axe checks that write `a11y-report.json`
- CI fails if any critical axe violations are found

## 6. What Is Incomplete and Why

The repository is runnable and automated, but a few environment-dependent items still require project secrets or external setup:

- real Contentful data requires valid `CONTENTFUL_*` environment variables
- Vercel deployment requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` GitHub secrets
- production auth still uses role header/cookie simulation for the sprint instead of a full identity provider

## Local Commands

```bash
npm ci
npm run typecheck
npm run lint
npm run test:unit
npm run build
npm run test:e2e
```
