import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useProfiles } from "./use-profiles";

export type ProgressState = {
  lessons: Record<string, "visited" | "practiced" | "mastered">;
};

const BASE_KEY = "ll.progress.v1";
const DEFAULT: ProgressState = { lessons: {} };

const stores = new Map<string, ProgressState>();
const listeners = new Set<() => void>();

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
  return () => {
    listeners.delete(l);
  };
};

const RANK = { visited: 1, practiced: 2, mastered: 3 } as const;

export function useProgress() {
  const { activeId } = useProfiles();
  const key = storageKey(activeId);
  ensureLoaded(key);

  const getSnapshot = useCallback(() => {
    ensureLoaded(key);
    return stores.get(key)!;
  }, [key]);

  const getServerSnapshot = useCallback(() => DEFAULT, []);

  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const mark = useCallback(
    (lessonId: string, level: "visited" | "practiced" | "mastered") => {
      const cur = stores.get(key) ?? DEFAULT;
      const current = cur.lessons[lessonId];
      if (current && RANK[current] >= RANK[level]) return;
      persist(key, { lessons: { ...cur.lessons, [lessonId]: level } });
    },
    [key],
  );

  const reset = useCallback(() => persist(key, DEFAULT), [key]);

  return { progress, mark, reset };
}

export function getProgressFor(profileId: string): ProgressState {
  const key = storageKey(profileId);
  ensureLoaded(key);
  return stores.get(key)!;
}
