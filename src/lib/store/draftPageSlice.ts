import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Page, SectionType } from "@/lib/schema";

export interface DraftPageState {
  page: Page | null;
  isDirty: boolean;
  lastSavedAt: string | null;
}

const initialState: DraftPageState = {
  page: null,
  isDirty: false,
  lastSavedAt: null,
};

export const draftPageSlice = createSlice({
  name: "draftPage",
  initialState,
  reducers: {
    /**
     * Load a page into the editor.
     */
    loadPage(state, action: PayloadAction<Page>) {
      state.page = action.payload;
      state.isDirty = false;
    },

    /**
     * Update the page title.
     */
    updateTitle(state, action: PayloadAction<string>) {
      if (state.page) {
        state.page.title = action.payload;
        state.isDirty = true;
      }
    },

    /**
     * Update a specific section's props.
     */
    updateSectionProps(
      state,
      action: PayloadAction<{ sectionId: string; props: Record<string, unknown> }>
    ) {
      if (!state.page) return;
      const section = state.page.sections.find((s) => s.id === action.payload.sectionId);
      if (section) {
        section.props = { ...section.props, ...action.payload.props };
        state.isDirty = true;
      }
    },

    /**
     * Add a new section at the end (or at a specific index).
     */
    addSection(
      state,
      action: PayloadAction<{
        section: { id: string; type: SectionType; props: Record<string, unknown> };
        index?: number;
      }>
    ) {
      if (!state.page) return;
      const { section, index } = action.payload;
      if (index !== undefined && index >= 0 && index <= state.page.sections.length) {
        state.page.sections.splice(index, 0, section);
      } else {
        state.page.sections.push(section);
      }
      state.isDirty = true;
    },

    /**
     * Remove a section by ID.
     */
    removeSection(state, action: PayloadAction<string>) {
      if (!state.page) return;
      state.page.sections = state.page.sections.filter((s) => s.id !== action.payload);
      state.isDirty = true;
    },

    /**
     * Reorder sections by moving from one index to another.
     */
    reorderSections(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      if (!state.page) return;
      const { fromIndex, toIndex } = action.payload;
      const sections = state.page.sections;
      if (fromIndex < 0 || fromIndex >= sections.length) return;
      if (toIndex < 0 || toIndex >= sections.length) return;

      const [moved] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, moved);
      state.isDirty = true;
    },

    /**
     * Mark draft as saved.
     */
    markSaved(state) {
      state.isDirty = false;
      state.lastSavedAt = new Date().toISOString();
    },

    /**
     * Clear the draft.
     */
    clearDraft() {
      return initialState;
    },
  },
});

export const {
  loadPage,
  updateTitle,
  updateSectionProps,
  addSection,
  removeSection,
  reorderSections,
  markSaved,
  clearDraft,
} = draftPageSlice.actions;
