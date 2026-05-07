import { useCallback, useEffect, useSyncExternalStore } from "react";

export type KidProfile = {
  id: string;
  name: string;
  emoji: string;
  color: string; // CSS color token or hex
  createdAt: number;
};

export type ProfilesState = {
  profiles: KidProfile[];
  activeId: string | null;
};

const KEY = "ll.profiles.v1";
const DEFAULT: ProfilesState = { profiles: [], activeId: null };

const listeners = new Set<() => void>();
let cache: ProfilesState = DEFAULT;
let hydrated = false;

function load(): ProfilesState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function persist(s: ProfilesState) {
  cache = s;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {}
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => cache;
const getServerSnapshot = () => DEFAULT;

export const PROFILE_COLORS = [
  "#A7D8F0",
  "#B7E4C7",
  "#FFD8A8",
  "#F4C2C2",
  "#D7BDE2",
  "#FFE699",
];
export const PROFILE_EMOJIS = ["🦊", "🐼", "🐯", "🦄", "🐸", "🐧", "🐨", "🦁", "🐰", "🐶", "🐱", "🐵"];

export function useProfiles() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!hydrated) {
      hydrated = true;
      cache = load();
      listeners.forEach((l) => l());
    }
  }, []);

  const addProfile = useCallback((p: Omit<KidProfile, "id" | "createdAt">) => {
    const id = `kid_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const profile: KidProfile = { ...p, id, createdAt: Date.now() };
    const next = {
      profiles: [...cache.profiles, profile],
      activeId: cache.activeId ?? id,
    };
    persist(next);
    return profile;
  }, []);

  const removeProfile = useCallback((id: string) => {
    const profiles = cache.profiles.filter((p) => p.id !== id);
    const activeId = cache.activeId === id ? (profiles[0]?.id ?? null) : cache.activeId;
    persist({ profiles, activeId });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`ll.progress.v1.${id}`);
      } catch {}
    }
  }, []);

  const updateProfile = useCallback((id: string, patch: Partial<Omit<KidProfile, "id" | "createdAt">>) => {
    persist({
      ...cache,
      profiles: cache.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  }, []);

  const setActive = useCallback((id: string | null) => {
    persist({ ...cache, activeId: id });
  }, []);

  const active = state.profiles.find((p) => p.id === state.activeId) ?? null;

  return { ...state, active, addProfile, removeProfile, updateProfile, setActive };
}
