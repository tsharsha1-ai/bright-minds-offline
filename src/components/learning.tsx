import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

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
    <motion.div
      whileTap={disabled ? undefined : { scale: 0.96 }}
      className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-[2rem] p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5"
      style={{ backgroundColor: bg, color: fg, opacity: disabled ? 0.4 : 1 }}
    >
      <div className="text-[6rem] leading-none drop-shadow-sm">{emoji}</div>
      <div className="text-2xl font-semibold md:text-3xl">{title}</div>
    </motion.div>
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
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="relative flex h-44 flex-col items-center justify-center gap-2 rounded-3xl bg-card p-4 text-center shadow-sm ring-1 ring-border"
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
      </motion.div>
    </Link>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-10 pt-2 md:px-8">
      {children}
    </main>
  );
}
