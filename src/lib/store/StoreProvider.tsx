"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

export function StoreProvider({
  children,
  storageKey,
}: {
  children: React.ReactNode;
  storageKey?: string;
}) {
  const [store] = useState(() => makeStore(storageKey));

  return <Provider store={store}>{children}</Provider>;
}
