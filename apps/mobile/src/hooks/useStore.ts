import { useSyncExternalStore } from "react";
import type { Store } from "@/core/Store";

export const useStore = <S extends object>(store: Store<S>): S =>
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
