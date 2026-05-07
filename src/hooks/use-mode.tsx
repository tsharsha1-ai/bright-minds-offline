import { useCallback, useSyncExternalStore } from "react";

export type Mode = "offline" | "online";
const KEY = "ll.mode.v1";
const listeners = new Set<() => void>();
let cached: Mode | null = null;

function read(): Mode {
  if (cached) return cached;
  if (typeof window === "undefined") return "offline";
  try {
    const v = localStorage.getItem(KEY);
    cached = v === "online" ? "online" : "offline";
  } catch {
    cached = "offline";
  }
  return cached!;
}

function write(m: Mode) {
  cached = m;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, m);
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

export function useMode() {
  const mode = useSyncExternalStore(subscribe, read, () => "offline" as Mode);
  const setMode = useCallback((m: Mode) => write(m), []);
  return { mode, setMode };
}
