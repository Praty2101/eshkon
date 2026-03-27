import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { draftPageSlice } from "./draftPageSlice";
import { uiSlice } from "./uiSlice";
import { publishSlice } from "./publishSlice";

// ── localStorage persistence ──────────────────────────────────
const DEFAULT_STORAGE_KEY = "page-studio-draft";

function loadPersistedState(storageKey: string) {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { draftPage: parsed.draftPage };
    }
  } catch {
    // ignore
  }
  return undefined;
}

function saveState(state: RootState, storageKey: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ draftPage: state.draftPage })
    );
  } catch {
    // ignore quota errors
  }
}

// ── Store setup ───────────────────────────────────────────────
const rootReducer = combineReducers({
  draftPage: draftPageSlice.reducer,
  ui: uiSlice.reducer,
  publish: publishSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore(storageKey = DEFAULT_STORAGE_KEY) {
  const preloadedState = loadPersistedState(storageKey);

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as Partial<RootState> | undefined,
    devTools: process.env.NODE_ENV !== "production",
  });

  // Persist draftPage on every change
  store.subscribe(() => {
    saveState(store.getState(), storageKey);
  });

  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
