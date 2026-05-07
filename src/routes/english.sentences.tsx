import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { Reward } from "@/components/Reward";
import { SpeakButton } from "@/components/SpeakButton";
import { useSettings } from "@/hooks/use-settings";
import { useProgress } from "@/hooks/use-progress";
import { speak } from "@/lib/tts";

export const Route = createFileRoute("/english/sentences")({
  component: SentencesPage,
});

const SCENES = [
  { emoji: "🐱", words: ["The", "cat", "is", "happy"], target: "happy" },
  { emoji: "🌞", words: ["I", "see", "the", "sun"], target: "sun" },
  { emoji: "🐶", words: ["My", "dog", "can", "run"], target: "dog" },
  { emoji: "🍎", words: ["I", "like", "the", "apple"], target: "apple" },
];

function SentencesPage() {
  const { settings } = useSettings();
  const { mark } = useProgress();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const s = SCENES[i];

  useEffect(() => { mark("en.sentences", "visited"); }, [mark]);

  const pick = (w: string) => {
    setPicked(w);
    speak(w, { enabled: settings.soundOn, rate: settings.voiceRate });
    if (w.toLowerCase() === s.target.toLowerCase()) {
      setTimeout(() => {
        setShowReward(true);
        if (i === SCENES.length - 1) mark("en.sentences", "practiced");
      }, 500);
    } else {
      setTimeout(() => setPicked(null), 700);
    }
  };

  return (
    <>
      <TopBar title="Picture Words" />
      <PageShell>
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-4 flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-card p-8 shadow ring-1 ring-border"
        >
          <div className="text-[10rem] leading-none">{s.emoji}</div>
          <p className="text-2xl text-muted-foreground">Find the word for the picture:</p>
        </motion.div>

        <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-3">
          {s.words.map((w) => (
            <motion.button
              key={w}
              whileTap={{ scale: 0.94 }}
              onClick={() => pick(w)}
              className="rounded-2xl bg-card px-6 py-4 text-2xl font-bold text-foreground shadow ring-1 ring-border"
              style={
                picked === w
                  ? w.toLowerCase() === s.target.toLowerCase()
                    ? { backgroundColor: "var(--evs)" }
                    : { backgroundColor: "var(--sand)" }
                  : undefined
              }
            >
              {w}
            </motion.button>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <SpeakButton text={s.words.join(" ")} />
          <button
            onClick={() => { setPicked(null); setI((p) => (p + 1) % SCENES.length); }}
            className="rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground"
          >
            Next
          </button>
        </div>

        <Reward show={showReward} onDone={() => { setShowReward(false); setPicked(null); setI((p) => (p + 1) % SCENES.length); }} />
      </PageShell>
    </>
  );
}
