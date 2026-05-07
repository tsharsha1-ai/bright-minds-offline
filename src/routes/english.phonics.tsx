import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { SpeakButton } from "@/components/SpeakButton";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/english/phonics")({
  component: PhonicsPage,
});

const PHONICS = [
  { l: "A", word: "Apple", emoji: "🍎" },
  { l: "B", word: "Ball", emoji: "⚽" },
  { l: "C", word: "Cat", emoji: "🐱" },
  { l: "D", word: "Dog", emoji: "🐶" },
  { l: "E", word: "Elephant", emoji: "🐘" },
  { l: "F", word: "Fish", emoji: "🐟" },
  { l: "G", word: "Goat", emoji: "🐐" },
  { l: "H", word: "Hat", emoji: "👒" },
  { l: "I", word: "Ice", emoji: "🧊" },
  { l: "J", word: "Jug", emoji: "🫗" },
  { l: "K", word: "Kite", emoji: "🪁" },
  { l: "L", word: "Lion", emoji: "🦁" },
  { l: "M", word: "Moon", emoji: "🌙" },
  { l: "N", word: "Nest", emoji: "🪺" },
  { l: "O", word: "Owl", emoji: "🦉" },
  { l: "P", word: "Pig", emoji: "🐷" },
  { l: "Q", word: "Queen", emoji: "👸" },
  { l: "R", word: "Rabbit", emoji: "🐰" },
  { l: "S", word: "Sun", emoji: "☀️" },
  { l: "T", word: "Tree", emoji: "🌳" },
  { l: "U", word: "Umbrella", emoji: "☂️" },
  { l: "V", word: "Van", emoji: "🚐" },
  { l: "W", word: "Whale", emoji: "🐳" },
  { l: "X", word: "Box", emoji: "📦" },
  { l: "Y", word: "Yarn", emoji: "🧶" },
  { l: "Z", word: "Zebra", emoji: "🦓" },
];

function PhonicsPage() {
  const { mark } = useProgress();
  const [i, setI] = useState(0);
  useEffect(() => { mark("en.phonics", "visited"); }, [mark]);
  const p = PHONICS[i];

  return (
    <>
      <TopBar title="Phonics" />
      <PageShell>
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-card p-8 shadow ring-1 ring-border"
        >
          <div className="text-9xl font-extrabold text-[var(--english-foreground)]">{p.l}</div>
          <div className="text-8xl">{p.emoji}</div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-semibold text-foreground">{p.word}</div>
            <SpeakButton text={`${p.l}. ${p.word}`} />
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => setI((p) => (p - 1 + PHONICS.length) % PHONICS.length)}
            className="rounded-2xl bg-card px-5 py-3 text-lg font-semibold ring-1 ring-border"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (i === PHONICS.length - 1) mark("en.phonics", "practiced");
              setI((p) => (p + 1) % PHONICS.length);
            }}
            className="rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground"
          >
            Next
          </button>
        </div>
      </PageShell>
    </>
  );
}
