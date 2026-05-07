import { useCallback, useEffect, useSyncExternalStore } from "react";

export type ProgressState = {
  // Maps a lesson id to one of: visited | practiced | mastered
  lessons: Record<string, "visited" | "practiced" | "mastered">;
};

const KEY = "ll.progress.v1";
const DEFAULT: ProgressState = { lessons: {} };

const listeners = new Set<() => void>();
let cache: ProgressState = DEFAULT;
let hydrated = false;

function load(): ProgressState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function persist(s: ProgressState) {
  cache = s;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {}
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const getSnapshot = () => cache;
const getServerSnapshot = () => DEFAULT;

const RANK = { visited: 1, practiced: 2, mastered: 3 } as const;

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!hydrated) {
      hydrated = true;
      cache = load();
      listeners.forEach((l) => l());
    }
  }, []);

  const mark = useCallback(
    (lessonId: string, level: "visited" | "practiced" | "mastered") => {
      const current = cache.lessons[lessonId];
      if (current && RANK[current] >= RANK[level]) return;
      persist({ lessons: { ...cache.lessons, [lessonId]: level } });
    },
    [],
  );

  const reset = useCallback(() => persist(DEFAULT), []);

  return { progress, mark, reset };
}
