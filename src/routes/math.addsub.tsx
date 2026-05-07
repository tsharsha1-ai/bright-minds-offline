import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { Reward } from "@/components/Reward";
import { useSettings } from "@/hooks/use-settings";
import { useProgress } from "@/hooks/use-progress";
import { speak } from "@/lib/tts";

export const Route = createFileRoute("/math/addsub")({
  component: AddSubPage,
});

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function AddSubPage() {
  const { settings } = useSettings();
  const { mark } = useProgress();
  const [op, setOp] = useState<"+" | "−">("+");
  const [seed, setSeed] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    mark("math.addsub", "visited");
  }, [mark]);

  const { a, b, answer, choices } = useMemo(() => {
    let a = rand(1, 5);
    let b = rand(1, 5);
    if (op === "−" && b > a) [a, b] = [b, a];
    const answer = op === "+" ? a + b : a - b;
    const set = new Set<number>([answer]);
    while (set.size < 3) set.add(Math.max(0, answer + rand(-2, 2) || 1));
    const choices = Array.from(set).sort(() => Math.random() - 0.5);
    return { a, b, answer, choices };
  }, [op, seed]);

  const next = () => {
    setPicked(null);
    setSeed((s) => s + 1);
  };

  const handlePick = (n: number) => {
    setPicked(n);
    if (n === answer) {
      speak(`${a} ${op === "+" ? "plus" : "minus"} ${b} is ${answer}`, {
        enabled: settings.soundOn,
        rate: settings.voiceRate,
      });
      setTimeout(() => {
        setShowReward(true);
        mark("math.addsub", "practiced");
      }, 600);
    } else {
      speak("Look again", { enabled: settings.soundOn, rate: settings.voiceRate });
      setTimeout(() => setPicked(null), 700);
    }
  };

  return (
    <>
      <TopBar title="Add and Subtract" />
      <PageShell>
        <div className="mx-auto mt-2 flex w-fit gap-2 rounded-2xl bg-card p-1 ring-1 ring-border">
          {(["+", "−"] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOp(o)}
              className="rounded-xl px-5 py-2 text-lg font-semibold"
              style={{
                backgroundColor: op === o ? "var(--math)" : "transparent",
                color: op === o ? "var(--math-foreground)" : "var(--foreground)",
              }}
            >
              {o === "+" ? "Add +" : "Take away −"}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-6 flex w-full max-w-3xl items-center justify-around gap-4 rounded-3xl bg-card p-6 ring-1 ring-border">
          <Group n={a} />
          <div className="text-6xl font-bold text-muted-foreground">{op}</div>
          <Group n={op === "+" ? b : -b} />
          <div className="text-6xl font-bold text-muted-foreground">=</div>
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[var(--math)] text-5xl font-bold text-[var(--math-foreground)]">
            ?
          </div>
        </div>

        <div className="mx-auto mt-8 flex flex-wrap justify-center gap-4">
          {choices.map((c) => (
            <motion.button
              key={c}
              whileTap={{ scale: 0.92 }}
              onClick={() => handlePick(c)}
              className="h-24 w-24 rounded-3xl bg-card text-4xl font-bold text-foreground shadow ring-1 ring-border"
              style={
                picked === c
                  ? c === answer
                    ? { backgroundColor: "var(--evs)" }
                    : { backgroundColor: "var(--sand)" }
                  : undefined
              }
            >
              {c}
            </motion.button>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button onClick={next} className="rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground">
            Next
          </button>
        </div>

        <Reward show={showReward} onDone={() => { setShowReward(false); next(); }} />
      </PageShell>
    </>
  );
}

function Group({ n }: { n: number }) {
  const cnt = Math.abs(n);
  const cross = n < 0;
  return (
    <div className="flex min-h-24 min-w-24 flex-wrap content-center items-center justify-center gap-1">
      {Array.from({ length: cnt }).map((_, i) => (
        <span key={i} className="relative text-3xl">
          🍓
          {cross && <span className="absolute inset-0 flex items-center justify-center text-2xl">✖️</span>}
        </span>
      ))}
    </div>
  );
}
