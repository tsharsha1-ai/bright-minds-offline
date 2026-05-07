import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { ModeTabs } from "@/components/ModeTabs";
import { useMode } from "@/hooks/use-mode";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/online/")({
  component: OnlineHub,
});

const SUBJECTS = [
  {
    key: "math",
    title: "Numbers",
    color: "var(--math)",
    modules: [
      { id: "math.counting", title: "Counting", emoji: "🔢" },
      { id: "math.numbers", title: "Numbers", emoji: "1️⃣" },
      { id: "math.addsub", title: "Add & Subtract", emoji: "➕" },
      { id: "math.compare", title: "Compare", emoji: "⚖️" },
      { id: "math.shapes", title: "Shapes", emoji: "🔺" },
      { id: "math.place-value", title: "Tens & Ones", emoji: "🔟" },
      { id: "math.times-tables", title: "Times Tables", emoji: "✖️" },
    ],
  },
  {
    key: "english",
    title: "Letters",
    color: "var(--english)",
    modules: [
      { id: "english.alphabet", title: "A to Z", emoji: "🔤" },
      { id: "english.phonics", title: "Phonics", emoji: "🗣️" },
      { id: "english.sight-words", title: "Sight Words", emoji: "📖" },
      { id: "english.digraphs", title: "Digraphs", emoji: "🔠" },
      { id: "english.spelling", title: "Spelling", emoji: "🧩" },
      { id: "english.speech", title: "WH Questions", emoji: "💬" },
    ],
  },
  {
    key: "evs",
    title: "World",
    color: "var(--evs)",
    modules: [
      { id: "evs.animals", title: "Animals", emoji: "🐶" },
      { id: "evs.food", title: "Food", emoji: "🍎" },
      { id: "evs.body", title: "My Body", emoji: "🧒" },
      { id: "evs.family", title: "Family", emoji: "👨‍👩‍👧" },
      { id: "evs.plants", title: "Plants", emoji: "🌳" },
      { id: "evs.weather", title: "Weather", emoji: "🌦️" },
    ],
  },
];

function OnlineHub() {
  const { progress } = useProgress();
  const { mode } = useMode();
  const navigate = useNavigate();
  useEffect(() => {
    if (mode === "offline") navigate({ to: "/" });
  }, [mode, navigate]);

  return (
    <>
      <TopBar title="Online Mode ✨" />
      <PageShell>
        <ModeTabs />
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground">
          Fresh AI-powered questions every time. Tap any module to start.
        </p>

        {SUBJECTS.map((sub) => (
          <section key={sub.key} className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-foreground">{sub.title}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
              {sub.modules.map((m) => {
                const status = progress.lessons[`online.${m.id}`];
                return (
                  <Link key={m.id} to="/online/$module" params={{ module: m.id }}>
                    <div
                      className="relative flex h-32 flex-col items-center justify-center gap-2 rounded-3xl p-3 text-center shadow ring-1 ring-border transition active:scale-[0.97]"
                      style={{ backgroundColor: sub.color }}
                    >
                      <div className="text-4xl">{m.emoji}</div>
                      <div className="text-base font-bold text-foreground">{m.title}</div>
                      {status && (
                        <span className="absolute right-3 top-3 h-3 w-3 rounded-full bg-foreground/80" aria-label={status} />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </PageShell>
    </>
  );
}
