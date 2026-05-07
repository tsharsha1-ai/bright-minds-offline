import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { SpeakButton } from "@/components/SpeakButton";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/english/sight-words")({
  component: SightWordsPage,
});

const WORDS = ["the", "and", "is", "a", "to", "in", "see", "go", "we", "my", "like", "you"];

function SightWordsPage() {
  const { mark } = useProgress();
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { mark("en.sight", "visited"); }, [mark]);
  useEffect(() => { setFlipped(false); }, [i]);

  return (
    <>
      <TopBar title="Sight Words" />
      <PageShell>
        <p className="mt-2 text-center text-lg text-muted-foreground">Tap the card to hear the word.</p>
        <div className="mx-auto mt-6 w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => setFlipped(true)}
              className="flex h-64 w-full items-center justify-center rounded-3xl bg-[var(--english)] text-7xl font-extrabold text-[var(--english-foreground)] shadow ring-1 ring-border"
            >
              {WORDS[i]}
            </motion.button>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <SpeakButton text={WORDS[i]} />
          <button
            onClick={() => setI((p) => (p - 1 + WORDS.length) % WORDS.length)}
            className="rounded-2xl bg-card px-5 py-3 text-lg font-semibold ring-1 ring-border"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (i === WORDS.length - 1) mark("en.sight", "practiced");
              setI((p) => (p + 1) % WORDS.length);
            }}
            className="rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground"
          >
            Next
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">{flipped ? `“${WORDS[i]}”` : ""}</p>
      </PageShell>
    </>
  );
}
