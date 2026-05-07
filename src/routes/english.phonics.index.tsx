import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { LevelTabs, PageShell, type Level } from "@/components/learning";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/english/phonics/")({
  component: PhonicsHub,
});

type Item = { id: string; to: string; title: string; subtitle?: string; emoji?: string; color?: string };

const BY_LEVEL: Record<Level, { groups: Item[]; practice: Item[] }> = {
  beginner: {
    groups: [
      { id: "en.phonics.g1", to: "/english/phonics/group-1", title: "Group 1", subtitle: "s a t i p n", color: "var(--english)" },
      { id: "en.phonics.g2", to: "/english/phonics/group-2", title: "Group 2", subtitle: "ck e h r m d", color: "var(--math)" },
      { id: "en.phonics.g3", to: "/english/phonics/group-3", title: "Group 3", subtitle: "g o u l f b", color: "var(--evs)" },
    ],
    practice: [
      { id: "en.phonics.blending", to: "/english/phonics/blending", title: "Blending", emoji: "🔗" },
    ],
  },
  intermediate: {
    groups: [
      { id: "en.phonics.g4", to: "/english/phonics/group-4", title: "Group 4", subtitle: "ai j oa ie ee or", color: "var(--star)" },
      { id: "en.phonics.g5", to: "/english/phonics/group-5", title: "Group 5", subtitle: "z w ng v oo OO", color: "var(--english)" },
    ],
    practice: [
      { id: "en.phonics.cvc", to: "/english/phonics/cvc-words", title: "CVC Words", emoji: "🐱" },
      { id: "en.phonics.tricky", to: "/english/phonics/tricky-words", title: "Tricky Words", emoji: "✨" },
    ],
  },
  advanced: {
    groups: [
      { id: "en.phonics.g6", to: "/english/phonics/group-6", title: "Group 6", subtitle: "y x ch sh th TH", color: "var(--math)" },
      { id: "en.phonics.g7", to: "/english/phonics/group-7", title: "Group 7", subtitle: "qu ou oi ue er ar", color: "var(--evs)" },
    ],
    practice: [
      { id: "en.phonics.rhymes", to: "/english/phonics/rhymes", title: "Rhyming Words", emoji: "🎶" },
    ],
  },
};

const BLURB: Record<Level, string> = {
  beginner: "Start with the first sounds and learn to blend.",
  intermediate: "New letter teams, CVC words, and tricky words.",
  advanced: "Trickier digraphs and rhyming play.",
};

function PhonicsHub() {
  const { progress } = useProgress();
  const [level, setLevel] = useState<Level>("beginner");
  const data = BY_LEVEL[level];
  return (
    <>
      <TopBar title="Jolly Phonics" />
      <PageShell>
        <LevelTabs value={level} onChange={setLevel} />
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">{BLURB[level]}</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {data.groups.map((g) => {
            const status = progress.lessons[g.id];
            return (
              <Link key={g.id} to={g.to}>
                <div
                  className="relative flex h-40 flex-col justify-between rounded-3xl p-5 shadow ring-1 ring-border transition-transform active:scale-[0.97]"
                  style={{ backgroundColor: g.color }}
                >
                  <div className="text-sm font-bold uppercase tracking-wide text-foreground/80">{g.title}</div>
                  <div className="text-3xl font-extrabold text-foreground">{g.subtitle}</div>
                  {status && <span className="absolute right-3 top-3 h-3 w-3 rounded-full bg-foreground/80" aria-label={status} />}
                </div>
              </Link>
            );
          })}
        </div>

        <h2 className="mx-auto mt-10 max-w-2xl text-center text-lg font-bold text-foreground">Practice</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {data.practice.map((e) => {
            const status = progress.lessons[e.id];
            return (
              <Link key={e.id} to={e.to}>
                <div className="relative flex h-32 flex-col items-center justify-center gap-1 rounded-3xl bg-card p-3 text-center shadow-sm ring-1 ring-border transition active:scale-[0.97]">
                  <div className="text-4xl">{e.emoji}</div>
                  <div className="text-base font-semibold text-foreground">{e.title}</div>
                  {status && <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
              </Link>
            );
          })}
        </div>
      </PageShell>
    </>
  );
}
