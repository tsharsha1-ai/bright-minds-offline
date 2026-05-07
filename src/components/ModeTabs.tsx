import { Wifi, WifiOff } from "lucide-react";
import { useMode, type Mode } from "@/hooks/use-mode";

export function ModeTabs() {
  const { mode, setMode } = useMode();
  const tabs: Array<{ id: Mode; label: string; icon: typeof Wifi; color: string }> = [
    { id: "offline", label: "Offline Mode", icon: WifiOff, color: "var(--evs)" },
    { id: "online", label: "Online Mode", icon: Wifi, color: "var(--english)" },
  ];
  return (
    <div className="mx-auto mt-4 flex w-full max-w-xl gap-2 rounded-3xl bg-card p-1.5 ring-1 ring-border">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = mode === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setMode(t.id)}
            aria-pressed={active}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-semibold transition md:text-base"
            style={{
              backgroundColor: active ? t.color : "transparent",
              color: active ? "var(--foreground)" : "var(--muted-foreground)",
            }}
          >
            <Icon className="h-4 w-4" />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
