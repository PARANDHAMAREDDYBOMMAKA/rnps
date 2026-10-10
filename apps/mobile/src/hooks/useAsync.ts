import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

export interface AsyncState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  reload: () => void;
}

export const useAsync = <T>(loader: () => Promise<T>, deps: unknown[]): AsyncState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const latest = useRef(loader);
  latest.current = loader;

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setError(null);
      setLoading((prev) => prev || data === null);
      latest
        .current()
        .then((result) => alive && setData(result))
        .catch((e: Error) => alive && setError(e.message))
        .finally(() => alive && setLoading(false));
      return () => {
        alive = false;
      };
    }, [...deps, tick]),
  );

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, error, loading, reload };
};
