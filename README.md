# Page Studio

A schema-driven landing page studio that loads definition from Contentful, edits pages with a lightweight WYSIWYG studio backed by Redux, and publishes immutable versioned releases enforcing automated SemVer. WCAG 2.2 AAA-oriented.

## 1. Architecture Overview
Page Studio runs on Next.js App Router:
- **Renderer (`/preview/[slug]`)**: Server component fetches initial draft/published JSON (from Contentful or mock data fallback), validates against Zod schemas, then a `<PageRenderer>` dynamic component maps logical section structures (e.g. `hero`) to typed React UI components from `sectionRegistry.ts`. Any bad data is gracefully caught by an ErrorBoundary.
- **Studio (`/studio/[slug]`)**: Uses Redux for complex state mutation. The interface handles rearranging, adding, and modifying properties inline across a left sidebar (structure), center (preview), and right sidebar (props editor). Protected by server-side middleware enforcing the `"editor"` role.
- **Publish API (`/api/publish`)**: Enforces `"publisher"` role via middleware and server action. Converts the Redux draft to an immutable snapshot (`releases/<slug>/<version>.json`).

## 2. Redux Slice Responsibilities
We employ Redux Toolkit since the editor relies on complex cascading structure changes safely synced across views:
- **`draftPageSlice`**: Persists the single source of truth for the active edit session to localStorage. Manages `addSection`, `removeSection`, `reorderSections`, and `updateSectionProps`.
- **`uiSlice`**: Pure transient UI layer. Tracks selected tools, active sidebar states, and whether "Preview Mode" is toggled on to hide structural IDE overlays.
- **`publishSlice`**: Coordinates the API publish lifecycle (`idle` → `diffing` → `publishing` → `success`/`error`), holding current SemVer diff metadata up efficiently.

## 3. Contentful Model + Adapter Explanation
- **Model**: A Contentful Entry for `Page` contains a slug string and an array of JSON `sections` mapping `{ type: string, props: JSON }`. 
- **Adapter (`lib/contentful/contentfulClient.ts`)**: Encapsulates all Contentful SDK logic. The app relies strictly on `AdaptedPage`. The adapter pulls `fields.sections` into the safe typed object. Drafts (preview SDK) vs Published (delivery SDK) content resolution occurs silently within `fetchPageBySlug()`. Only the adapter "knows" Contentful exists.

## 4. Publish + SemVer Logic
When `/api/publish` receives a valid draft, it compares it structurally against the `releases` directory's latest snapshot:
- **Patch (1.0.x)**: Small safe modifications (text changes, property values).
- **Minor (1.x.0)**: Forward compatible structural enhancements (adding optional props or a brand new section).
- **Major (x.0.0)**: Breaking or heavily disruptive changes (removing sections, changing a section type altogether, or deleting required fields).
*Idempotent*: If there is mathematically zero diff, the API shortcuts and doesn't output an arbitrary release bump.

## 5. Accessibility Evidence
The app is built targeting automated WCAG 2.2 metrics with Axe:
- **Components**: `shadcn/ui` and Radix primitives natively implement WAI-ARIA tabs, dialogs, and button interactivity.
- **Micro-interactivity**: `motion-safe` media query wraps all hover/focus scale transforms protecting vestibular (prefers-reduced-motion) disabilities.
- **Keyboard & Reader Testing**: Verified using Playwright injecting `axe-core`: `e2e/smoke.spec.ts`. All interactive cards inherently support strict `focus-visible` offset rings.
- **Hierarchy Status**: The schemas mandate single-h1 hierarchy mapping inside `<main>`.

## 6. What is Incomplete and Why
To meet the sprint timeline effectively, the following shortcuts were taken:
- **Local JSON Releases & Storage**: Instead of wiring an external database + blob storage for published immutable JSONs, `fs` writes to the `/releases` root dir.
- **Auth Provider Bypass**: Actual RBAC integration with an external JWT provider (like NextAuth or Clerk) was simulated in `middleware.ts` reading cookie toggles for standard demonstration velocity.
- **Redux History Stack (Undo/Redo)**: Opted for persistence and immediate edits, bypassing command stack snapshots for `Cmd+Z` logic due to complexity.
- **Dynamic Contentful Delivery Key Sync**: A hardcoded `.env` environment assumption exists for `CONTENTFUL_X_TOKEN`.

---
*Run `npm run dev` to boot locally. Run `npx playwright test` to output CI accessibility JSON reports.*
