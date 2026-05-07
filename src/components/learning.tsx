import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export type Level = "beginner" | "intermediate" | "advanced";

const LEVEL_META: Record<Level, { label: string; emoji: string; color: string }> = {
  beginner: { label: "Beginner", emoji: "🌱", color: "var(--evs)" },
  intermediate: { label: "Intermediate", emoji: "🌿", color: "var(--math)" },
  advanced: { label: "Advanced", emoji: "🌟", color: "var(--english)" },
};

export function LevelTabs({
  value,
  onChange,
}: {
  value: Level;
  onChange: (l: Level) => void;
}) {
  const levels: Level[] = ["beginner", "intermediate", "advanced"];
  return (
    <div className="mx-auto mt-2 flex w-full max-w-2xl gap-2 rounded-3xl bg-card p-1.5 ring-1 ring-border">
      {levels.map((l) => {
        const m = LEVEL_META[l];
        const active = value === l;
        return (
          <button
            key={l}
            onClick={() => onChange(l)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-semibold transition md:text-base"
            style={{
              backgroundColor: active ? m.color : "transparent",
              color: active ? "var(--foreground)" : "var(--muted-foreground)",
            }}
            aria-pressed={active}
          >
            <span aria-hidden>{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SubjectTile({
  to,
  title,
  emoji,
  bg,
  fg,
  disabled,
}: {
  to: string;
  title: string;
  emoji: string;
  bg: string;
  fg: string;
  disabled?: boolean;
}) {
  const inner = (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[2rem] p-3 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5 transition-transform duration-150 active:scale-[0.96] sm:gap-4 sm:p-6"
      style={{ backgroundColor: bg, color: fg, opacity: disabled ? 0.4 : 1 }}
    >
      <div className="text-5xl leading-none drop-shadow-sm sm:text-7xl md:text-[6rem]">{emoji}</div>
      <div className="text-base font-semibold sm:text-2xl md:text-3xl">{title}</div>
    </div>
  );

  if (disabled) {
    return <div aria-disabled className="aspect-square w-full">{inner}</div>;
  }
  return (
    <Link to={to} className="aspect-square w-full">
      {inner}
    </Link>
  );
}

export function LessonCard({
  to,
  title,
  emoji,
  status,
}: {
  to: string;
  title: string;
  emoji: string;
  status?: "visited" | "practiced" | "mastered";
}) {
  return (
    <Link to={to}>
      <div
        className="relative flex h-44 flex-col items-center justify-center gap-2 rounded-3xl bg-card p-4 text-center shadow-sm ring-1 ring-border transition-transform duration-150 active:scale-[0.97]"
      >
        <div className="text-6xl">{emoji}</div>
        <div className="text-lg font-semibold text-foreground">{title}</div>
        {status && (
          <span
            className="absolute right-3 top-3 h-3 w-3 rounded-full"
            style={{
              backgroundColor:
                status === "mastered"
                  ? "var(--star)"
                  : status === "practiced"
                    ? "var(--evs)"
                    : "var(--primary)",
            }}
            aria-label={status}
          />
        )}
      </div>
    </Link>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-3 pb-8 pt-2 sm:px-4 md:px-8 md:pb-10">
      {children}
    </main>
  );
}
