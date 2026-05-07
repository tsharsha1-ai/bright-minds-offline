import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { Reward } from "@/components/Reward";
import { useSettings } from "@/hooks/use-settings";
import { useProgress } from "@/hooks/use-progress";
import { speak } from "@/lib/tts";

export const Route = createFileRoute("/math/times-tables")({
  component: TimesTablesPage,
});

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function TimesTablesPage() {
  const { settings } = useSettings();
  const { mark } = useProgress();
  const [table, setTable] = useState(2);
  const [mode, setMode] = useState<"learn" | "quiz">("learn");
  const [seed, setSeed] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [reward, setReward] = useState(false);

  useEffect(() => {
    mark("math.times-tables", "visited");
  }, [mark]);

  const { b, answer, choices } = useMemo(() => {
    const b = rand(1, 10);
    const answer = table * b;
    const set = new Set<number>([answer]);
    while (set.size < 4) set.add(Math.max(1, answer + rand(-5, 5) || answer + 1));
    return { b, answer, choices: Array.from(set).sort(() => Math.random() - 0.5) };
  }, [table, seed]);

  const handlePick = (n: number) => {
    setPicked(n);
    if (n === answer) {
      speak(`${table} times ${b} is ${answer}`, { enabled: settings.soundOn, rate: settings.voiceRate });
      mark("math.times-tables", "practiced");
      setTimeout(() => setReward(true), 500);
    } else {
      speak("Try again", { enabled: settings.soundOn, rate: settings.voiceRate });
      setTimeout(() => setPicked(null), 700);
    }
  };

  const next = () => {
    setReward(false);
    setPicked(null);
    setSeed((s) => s + 1);
  };

  return (
    <>
      <TopBar title="Times Tables" />
      <PageShell>
        <div className="mx-auto mt-2 flex w-full max-w-3xl flex-wrap items-center justify-center gap-2">
          {[2, 3, 4, 5, 10].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTable(t);
                setSeed((s) => s + 1);
                setPicked(null);
              }}
              className="h-12 w-12 rounded-2xl text-lg font-bold ring-1 ring-border"
              style={{
                backgroundColor: table === t ? "var(--math)" : "var(--card)",
                color: table === t ? "var(--math-foreground)" : "var(--foreground)",
              }}
            >
              {t}×
            </button>
          ))}
        </div>

        <div className="mx-auto mt-4 flex w-fit gap-2 rounded-2xl bg-card p-1 ring-1 ring-border">
          {(["learn", "quiz"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="rounded-xl px-4 py-2 text-sm font-semibold capitalize"
              style={{
                backgroundColor: mode === m ? "var(--math)" : "transparent",
                color: mode === m ? "var(--math-foreground)" : "var(--foreground)",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {mode === "learn" ? (
          <div className="mx-auto mt-6 grid w-full max-w-md grid-cols-2 gap-3">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((k) => (
              <button
                key={k}
                onClick={() =>
                  speak(`${table} times ${k} is ${table * k}`, { enabled: settings.soundOn, rate: settings.voiceRate })
                }
                className="rounded-2xl bg-card p-4 text-center text-xl font-semibold text-foreground ring-1 ring-border"
              >
                {table} × {k} = <span className="text-[var(--math-foreground)]">{table * k}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="mx-auto mt-6 flex w-full max-w-xl items-center justify-center gap-4 rounded-3xl bg-card p-8 text-5xl font-bold text-foreground ring-1 ring-border">
              <span>{table}</span>
              <span className="text-muted-foreground">×</span>
              <span>{b}</span>
              <span className="text-muted-foreground">=</span>
              <span className="flex h-16 w-20 items-center justify-center rounded-2xl bg-[var(--math)] text-[var(--math-foreground)]">?</span>
            </div>

            <div className="mx-auto mt-6 flex flex-wrap justify-center gap-3">
              {choices.map((c) => (
                <button
                  key={c}
                  onClick={() => handlePick(c)}
                  className="h-20 w-20 rounded-3xl bg-card text-3xl font-bold text-foreground shadow ring-1 ring-border"
                  style={
                    picked === c
                      ? c === answer
                        ? { backgroundColor: "var(--evs)" }
                        : { backgroundColor: "var(--sand)" }
                      : undefined
                  }
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button onClick={next} className="rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground">
                Next
              </button>
            </div>
          </>
        )}

        <Reward show={reward} onDone={next} />
      </PageShell>
    </>
  );
}
