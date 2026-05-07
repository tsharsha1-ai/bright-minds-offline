import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { SpeakButton } from "@/components/SpeakButton";
import { Reward } from "@/components/Reward";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/assessment")({
  component: DailyAssessment,
});

type Question = {
  prompt: string;
  speak: string;
  options: { label: string; emoji?: string; correct?: boolean }[];
  subject: "Math" | "English" | "World";
};

const POOL: Question[] = [
  // Math
  { subject: "Math", prompt: "Which is 3?", speak: "Which one is three?", options: [
    { label: "2", correct: false }, { label: "3", correct: true }, { label: "5", correct: false }, { label: "1", correct: false },
  ]},
  { subject: "Math", prompt: "Count the apples", speak: "How many apples?", options: [
    { label: "🍎🍎🍎 = 2", correct: false }, { label: "🍎🍎🍎 = 3", correct: true }, { label: "🍎🍎🍎 = 4", correct: false },
  ]},
  { subject: "Math", prompt: "2 + 1 = ?", speak: "Two plus one?", options: [
    { label: "2" }, { label: "3", correct: true }, { label: "4" }, { label: "5" },
  ]},
  { subject: "Math", prompt: "Which is bigger?", speak: "Which is bigger?", options: [
    { label: "5", correct: true }, { label: "2" },
  ]},
  { subject: "Math", prompt: "What shape?", speak: "What shape is this?", options: [
    { label: "⭕ Circle", correct: true }, { label: "🔺 Triangle" }, { label: "🟦 Square" },
  ]},
  // English
  { subject: "English", prompt: "Which letter starts 'Apple'?", speak: "Which letter starts apple?", options: [
    { label: "A", correct: true }, { label: "B" }, { label: "C" }, { label: "D" },
  ]},
  { subject: "English", prompt: "Which starts with 'C'?", speak: "Which word starts with C?", options: [
    { label: "🐱 Cat", correct: true }, { label: "🐶 Dog" }, { label: "🐟 Fish" },
  ]},
  { subject: "English", prompt: "Pick the short 'a' word", speak: "Pick the short a word", options: [
    { label: "cat", correct: true }, { label: "bee" }, { label: "moon" },
  ]},
  { subject: "English", prompt: "Pick the long 'e' word", speak: "Pick the long e word", options: [
    { label: "bee", correct: true }, { label: "cat" }, { label: "pig" },
  ]},
  { subject: "English", prompt: "Which rhymes with 'cat'?", speak: "Which rhymes with cat?", options: [
    { label: "hat", correct: true }, { label: "dog" }, { label: "sun" },
  ]},
  // World / EVS
  { subject: "World", prompt: "Which animal says 'meow'?", speak: "Which animal says meow?", options: [
    { label: "🐱", correct: true }, { label: "🐶" }, { label: "🐮" },
  ]},
  { subject: "World", prompt: "Which do we eat?", speak: "Which do we eat?", options: [
    { label: "🍎", correct: true }, { label: "🪨" }, { label: "👟" },
  ]},
  { subject: "World", prompt: "Sunny day weather?", speak: "Sunny day weather?", options: [
    { label: "☀️", correct: true }, { label: "🌧️" }, { label: "❄️" },
  ]},
  { subject: "World", prompt: "We see with our…", speak: "We see with our?", options: [
    { label: "👀 Eyes", correct: true }, { label: "👂 Ears" }, { label: "👃 Nose" },
  ]},
  { subject: "World", prompt: "Plants need…", speak: "Plants need?", options: [
    { label: "💧 Water", correct: true }, { label: "🍕 Pizza" }, { label: "📺 TV" },
  ]},
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUESTIONS_PER_DAY = 6;

function DailyAssessment() {
  const { mark } = useProgress();
  const questions = useMemo(() => shuffle(POOL).slice(0, QUESTIONS_PER_DAY), []);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => { mark("assessment.daily", "visited"); }, [mark]);

  const q = questions[idx];
  const shuffledOptions = useMemo(() => shuffle(q.options.map((o, i) => ({ ...o, _i: i }))), [q]);

  const choose = (correct: boolean, i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        setDone(true);
        setShowReward(true);
        mark("assessment.daily", "practiced");
      } else {
        setIdx((n) => n + 1);
        setPicked(null);
      }
    }, 900);
  };

  if (done) {
    return (
      <>
        <TopBar title="Daily Practice" />
        <PageShell>
          <Reward show={showReward} message={`You scored ${score} of ${questions.length}!`} onDone={() => setShowReward(false)} duration={2400} />
          <div className="mx-auto mt-10 flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl bg-card p-10 text-center shadow ring-1 ring-border">
            <div className="text-8xl">🏆</div>
            <h2 className="text-3xl font-bold text-foreground">All Done!</h2>
            <p className="text-xl text-muted-foreground">You got {score} out of {questions.length} right.</p>
            <button
              onClick={() => { setIdx(0); setScore(0); setPicked(null); setDone(false); }}
              className="rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground"
            >
              Play Again
            </button>
          </div>
        </PageShell>
      </>
    );
  }

  return (
    <>
      <TopBar title="Daily Practice" />
      <PageShell>
        <div className="mx-auto mt-2 flex w-full max-w-2xl items-center justify-between text-sm font-semibold text-muted-foreground">
          <span>Question {idx + 1} of {questions.length}</span>
          <span>⭐ {score}</span>
        </div>
        <div className="mx-auto mt-2 h-2 w-full max-w-2xl overflow-hidden rounded-full bg-card ring-1 ring-border">
          <div className="h-full bg-primary transition-all" style={{ width: `${((idx) / questions.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-center gap-5 rounded-3xl bg-card p-8 shadow ring-1 ring-border"
          >
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary-foreground">{q.subject}</span>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-foreground">{q.prompt}</h2>
              <SpeakButton text={q.speak} />
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              {shuffledOptions.map((opt, i) => {
                const isPicked = picked === i;
                const reveal = picked !== null;
                const ok = !!opt.correct;
                return (
                  <button
                    key={i}
                    onClick={() => choose(ok, i)}
                    disabled={picked !== null}
                    className="rounded-2xl px-4 py-5 text-2xl font-semibold ring-2 transition active:scale-[0.98]"
                    style={{
                      backgroundColor: reveal && ok ? "var(--evs)" : "var(--card)",
                      "--tw-ring-color": reveal && ok ? "var(--evs)" : reveal && isPicked && !ok ? "var(--destructive, #ef4444)" : "var(--border)",
                      opacity: reveal && !ok && !isPicked ? 0.55 : 1,
                    } as React.CSSProperties}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </PageShell>
    </>
  );
}
