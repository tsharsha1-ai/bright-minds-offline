import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { Reward } from "@/components/Reward";
import { SpeakButton } from "@/components/SpeakButton";
import { useSettings } from "@/hooks/use-settings";
import { useProgress } from "@/hooks/use-progress";
import { speak } from "@/lib/tts";

export const Route = createFileRoute("/english/spelling")({
  component: SpellingPage,
});

const WORDS = [
  { word: "cat", emoji: "🐱" },
  { word: "dog", emoji: "🐶" },
  { word: "fish", emoji: "🐟" },
  { word: "moon", emoji: "🌙" },
  { word: "star", emoji: "⭐" },
  { word: "tree", emoji: "🌳" },
  { word: "milk", emoji: "🥛" },
  { word: "ball", emoji: "⚽" },
  { word: "frog", emoji: "🐸" },
  { word: "book", emoji: "📖" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function SpellingPage() {
  const { settings } = useSettings();
  const { mark } = useProgress();
  const [seed, setSeed] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [reward, setReward] = useState(false);

  const target = useMemo(() => WORDS[seed % WORDS.length], [seed]);
  const letters = useMemo(() => {
    const extras = "aeioustrnlk".split("");
    const pool = [...target.word.split(""), ...shuffle(extras).slice(0, Math.max(2, 6 - target.word.length))];
    return shuffle(pool).map((ch, i) => ({ ch, id: `${seed}-${i}` }));
  }, [seed, target]);

  useEffect(() => {
    mark("en.spelling", "visited");
  }, [mark]);

  const current = picked.join("");
  const correct = current === target.word;

  useEffect(() => {
    if (correct) {
      speak(`${target.word}. Well done!`, { enabled: settings.soundOn, rate: settings.voiceRate });
      mark("en.spelling", "practiced");
      const t = setTimeout(() => setReward(true), 400);
      return () => clearTimeout(t);
    }
  }, [correct, target, mark, settings.soundOn, settings.voiceRate]);

  const onPick = (id: string, ch: string) => {
    if (picked.length >= target.word.length) return;
    setPicked((p) => [...p, ch]);
    setUsed((u) => [...u, id]);
  };

  const [used, setUsed] = useState<string[]>([]);

  const reset = () => {
    setPicked([]);
    setUsed([]);
  };

  const next = () => {
    setReward(false);
    setSeed((s) => s + 1);
    reset();
  };

  return (
    <>
      <TopBar title="Spelling" />
      <PageShell>
        <div className="mx-auto mt-4 flex w-full max-w-2xl flex-col items-center gap-5 rounded-3xl bg-card p-8 shadow ring-1 ring-border">
          <div className="text-[8rem] leading-none">{target.emoji}</div>
          <div className="flex items-center gap-3">
            <p className="text-lg text-muted-foreground">Spell the word</p>
            <SpeakButton text={target.word} />
          </div>

          <div className="flex min-h-16 gap-2">
            {target.word.split("").map((_, i) => (
              <div
                key={i}
                className="flex h-14 w-12 items-center justify-center rounded-xl bg-background text-3xl font-bold uppercase text-foreground ring-1 ring-border"
                style={correct ? { backgroundColor: "var(--evs)" } : undefined}
              >
                {picked[i] ?? ""}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2">
          {letters.map(({ ch, id }) => (
            <button
              key={id}
              disabled={used.includes(id) || correct}
              onClick={() => onPick(id, ch)}
              className="h-14 w-14 rounded-2xl bg-card text-2xl font-bold uppercase text-foreground shadow ring-1 ring-border disabled:opacity-30"
            >
              {ch}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button onClick={reset} className="rounded-2xl bg-card px-5 py-3 font-semibold ring-1 ring-border">
            Clear
          </button>
          <button onClick={next} className="rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground">
            Next word
          </button>
        </div>

        <Reward show={reward} onDone={next} />
      </PageShell>
    </>
  );
}
