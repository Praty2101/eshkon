import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  selectedSectionId: string | null;
  sidebarOpen: boolean;
  addSectionDialogOpen: boolean;
  previewMode: boolean;
}

const initialState: UiState = {
  selectedSectionId: null,
  sidebarOpen: true,
  addSectionDialogOpen: false,
  previewMode: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    selectSection(state, action: PayloadAction<string | null>) {
      state.selectedSectionId = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setAddSectionDialogOpen(state, action: PayloadAction<boolean>) {
      state.addSectionDialogOpen = action.payload;
    },
    togglePreviewMode(state) {
      state.previewMode = !state.previewMode;
    },
    setPreviewMode(state, action: PayloadAction<boolean>) {
      state.previewMode = action.payload;
    },
  },
});

export const {
  selectSection,
  toggleSidebar,
  setSidebarOpen,
  setAddSectionDialogOpen,
  togglePreviewMode,
  setPreviewMode,
} = uiSlice.actions;
