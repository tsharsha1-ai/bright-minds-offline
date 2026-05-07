import { useCallback, useEffect, useSyncExternalStore } from "react";

export type Settings = {
  soundOn: boolean;
  voiceRate: number;
  largeFont: boolean;
  dyslexicFont: boolean;
  highContrast: boolean;
  difficulty: "gentle" | "standard";
  subjectsEnabled: { math: boolean; english: boolean; evs: boolean };
  dailyLimitMin: 0 | 15 | 30 | 45 | 60; // 0 = unlimited
};

const DEFAULTS: Settings = {
  soundOn: true,
  voiceRate: 0.85,
  largeFont: false,
  dyslexicFont: false,
  highContrast: false,
  difficulty: "gentle",
  subjectsEnabled: { math: true, english: true, evs: true },
  dailyLimitMin: 0,
};

const KEY = "ll.settings.v1";

const listeners = new Set<() => void>();
let cache: Settings = DEFAULTS;
let hydrated = false;

function load(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed, subjectsEnabled: { ...DEFAULTS.subjectsEnabled, ...(parsed.subjectsEnabled ?? {}) } };
  } catch {
    return DEFAULTS;
  }
}

function persist(s: Settings) {
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

function getSnapshot() {
  return cache;
}

function getServerSnapshot() {
  return DEFAULTS;
}

export function useSettings() {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!hydrated) {
      hydrated = true;
      cache = load();
      listeners.forEach((l) => l());
    }
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    persist({ ...cache, ...patch, subjectsEnabled: { ...cache.subjectsEnabled, ...(patch.subjectsEnabled ?? {}) } });
  }, []);

  const reset = useCallback(() => persist(DEFAULTS), []);

  return { settings, update, reset };
}

// Apply theme/font classes globally
export function useApplySettings() {
  const { settings } = useSettings();
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("hc", settings.highContrast);
    root.classList.toggle("text-scale-lg", settings.largeFont);
    root.classList.toggle("font-dyslexic", settings.dyslexicFont);
  }, [settings.highContrast, settings.largeFont, settings.dyslexicFont]);
}
