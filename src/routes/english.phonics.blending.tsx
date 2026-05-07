import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { SpeakButton } from "@/components/SpeakButton";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/english/phonics/blending")({
  component: BlendingPage,
});

const WORDS = [
  { letters: ["s", "a", "t"], word: "sat", emoji: "🪑" },
  { letters: ["p", "i", "n"], word: "pin", emoji: "📍" },
  { letters: ["c", "a", "t"], word: "cat", emoji: "🐱" },
  { letters: ["d", "o", "g"], word: "dog", emoji: "🐶" },
  { letters: ["h", "e", "n"], word: "hen", emoji: "🐔" },
  { letters: ["b", "u", "s"], word: "bus", emoji: "🚌" },
  { letters: ["m", "a", "p"], word: "map", emoji: "🗺️" },
  { letters: ["s", "u", "n"], word: "sun", emoji: "☀️" },
];

function BlendingPage() {
  const { mark } = useProgress();
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { mark("en.phonics.blending", "visited"); }, [mark]);
  const w = WORDS[i];

  const next = () => {
    if (i === WORDS.length - 1) mark("en.phonics.blending", "practiced");
    setRevealed(false);
    setI((p) => (p + 1) % WORDS.length);
  };

  return (
    <>
      <TopBar title="Blending" />
      <PageShell>
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-4 flex w-full max-w-2xl flex-col items-center gap-5 rounded-3xl bg-card p-8 shadow ring-1 ring-border"
        >
          <div className="text-7xl">{w.emoji}</div>

          <div className="flex items-center gap-3">
            {w.letters.map((l, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <button
                  onClick={() => {
                    const u = new SpeechSynthesisUtterance(l);
                    u.rate = 0.8;
                    speechSynthesis.speak(u);
                  }}
                  className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--english)] text-5xl font-extrabold text-foreground ring-1 ring-border active:scale-95"
                >
                  {l}
                </button>
              </div>
            ))}
          </div>

          {revealed ? (
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-foreground">{w.word}</div>
              <SpeakButton text={w.word} />
            </div>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground"
            >
              Blend it!
            </button>
          )}
        </motion.div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => { setRevealed(false); setI((p) => (p - 1 + WORDS.length) % WORDS.length); }}
            className="rounded-2xl bg-card px-5 py-3 text-lg font-semibold ring-1 ring-border"
          >
            Back
          </button>
          <button onClick={next} className="rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground">
            Next
          </button>
        </div>
      </PageShell>
    </>
  );
}
