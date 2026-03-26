import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface PublishState {
  status: "idle" | "diffing" | "publishing" | "success" | "error";
  version: string | null;
  changelog: string | null;
  error: string | null;
  lastPublishedAt: string | null;
}

const initialState: PublishState = {
  status: "idle",
  version: null,
  changelog: null,
  error: null,
  lastPublishedAt: null,
};

export const publishSlice = createSlice({
  name: "publish",
  initialState,
  reducers: {
    startDiff(state) {
      state.status = "diffing";
      state.error = null;
    },
    startPublish(state) {
      state.status = "publishing";
      state.error = null;
    },
    publishSuccess(
      state,
      action: PayloadAction<{ version: string; changelog: string }>
    ) {
      state.status = "success";
      state.version = action.payload.version;
      state.changelog = action.payload.changelog;
      state.lastPublishedAt = new Date().toISOString();
      state.error = null;
    },
    publishError(state, action: PayloadAction<string>) {
      state.status = "error";
      state.error = action.payload;
    },
    resetPublish(state) {
      state.status = "idle";
      state.error = null;
      state.changelog = null;
    },
  },
});

export const {
  startDiff,
  startPublish,
  publishSuccess,
  publishError,
  resetPublish,
} = publishSlice.actions;
