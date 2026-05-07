import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useProfiles } from "./use-profiles";

export type ProgressState = {
  // Maps a lesson id to one of: visited | practiced | mastered
  lessons: Record<string, "visited" | "practiced" | "mastered">;
};

const BASE_KEY = "ll.progress.v1";
const DEFAULT: ProgressState = { lessons: {} };

type Store = { state: ProgressState; key: string };

const stores = new Map<string, ProgressState>();
const listeners = new Set<() => void>();
let activeKey: string = BASE_KEY;

function storageKey(profileId: string | null): string {
  return profileId ? `${BASE_KEY}.${profileId}` : BASE_KEY;
}

function load(key: string): ProgressState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function ensureLoaded(key: string) {
  if (!stores.has(key)) {
    stores.set(key, load(key));
  }
}

function persist(key: string, s: ProgressState) {
  stores.set(key, s);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(s));
    } catch {}
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = (): Store => {
  ensureLoaded(activeKey);
  return { state: stores.get(activeKey)!, key: activeKey };
};
const getServerSnapshot = (): Store => ({ state: DEFAULT, key: activeKey });

const RANK = { visited: 1, practiced: 2, mastered: 3 } as const;

/**
 * Per-kid progress. Falls back to a shared key when no profile is active.
 */
export function useProgress() {
  const { activeId } = useProfiles();

  // Update active key reactively
  useEffect(() => {
    activeKey = storageKey(activeId);
    ensureLoaded(activeKey);
    listeners.forEach((l) => l());
  }, [activeId]);

  const { state: progress, key } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const mark = useCallback(
    (lessonId: string, level: "visited" | "practiced" | "mastered") => {
      const current = stores.get(key)?.lessons[lessonId];
      if (current && RANK[current] >= RANK[level]) return;
      const cur = stores.get(key) ?? DEFAULT;
      persist(key, { lessons: { ...cur.lessons, [lessonId]: level } });
    },
    [key],
  );

  const reset = useCallback(() => persist(key, DEFAULT), [key]);

  return { progress, mark, reset };
}

/** Read a specific kid's progress (for parent dashboard). */
export function getProgressFor(profileId: string): ProgressState {
  const key = storageKey(profileId);
  ensureLoaded(key);
  return stores.get(key)!;
}
