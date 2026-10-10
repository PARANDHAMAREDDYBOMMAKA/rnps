import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { container } from "@/core/AppContainer";
import { useStore } from "@/hooks/useStore";

export const useLiveProgress = () => {
  const state = useStore(container.progress);
  useFocusEffect(
    useCallback(() => {
      void container.progress.refreshIfStale();
    }, []),
  );
  return state;
};
