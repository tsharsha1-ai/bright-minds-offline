import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { Reward } from "@/components/Reward";
import { SpeakButton } from "@/components/SpeakButton";
import { useSettings } from "@/hooks/use-settings";
import { useProgress } from "@/hooks/use-progress";
import { speak } from "@/lib/tts";

export const Route = createFileRoute("/math/counting")({
  component: CountingPage,
});

const ITEMS = ["🍎", "🐝", "🐠", "🌼", "⭐", "🍓", "🐞", "🥕"];

function CountingPage() {
  const { settings } = useSettings();
  const { mark } = useProgress();
  const [round, setRound] = useState(0);
  const [tapped, setTapped] = useState<number[]>([]);
  const [showReward, setShowReward] = useState(false);

  const { item, count } = useMemo(() => {
    const item = ITEMS[round % ITEMS.length];
    const count = (round % 9) + 2; // 2..10
    return { item, count };
  }, [round]);

  useEffect(() => {
    mark("math.counting", "visited");
  }, [mark]);

  useEffect(() => {
    setTapped([]);
  }, [round]);

  const handleTap = (i: number) => {
    if (tapped.includes(i)) return;
    const next = [...tapped, i];
    setTapped(next);
    speak(String(next.length), { enabled: settings.soundOn, rate: settings.voiceRate });
    if (next.length === count) {
      setTimeout(() => {
        setShowReward(true);
        mark("math.counting", "practiced");
      }, 400);
    }
  };

  return (
    <>
      <TopBar title="Counting" />
      <PageShell>
        <div className="mt-2 flex items-center justify-center gap-3">
          <p className="text-center text-xl text-foreground">
            Tap each {item === "🍎" ? "apple" : "one"} to count.
          </p>
          <SpeakButton text={`Count to ${count}. Tap each one.`} />
        </div>

        <div className="mx-auto mt-8 grid w-full max-w-3xl grid-cols-5 gap-4">
          {Array.from({ length: count }).map((_, i) => {
            const isTapped = tapped.includes(i);
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleTap(i)}
                className="relative flex aspect-square items-center justify-center rounded-3xl bg-card text-5xl shadow ring-1 ring-border md:text-6xl"
                style={isTapped ? { backgroundColor: "var(--math)", opacity: 0.85 } : undefined}
              >
                {item}
                {isTapped && (
                  <span className="absolute right-1 top-1 rounded-full bg-white/90 px-2 text-sm font-bold text-foreground">
                    {tapped.indexOf(i) + 1}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setRound((r) => r + 1)}
            className="rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground shadow"
          >
            Next
          </button>
        </div>

        <Reward
          show={showReward}
          message={`You counted to ${count}!`}
          onDone={() => {
            setShowReward(false);
            setRound((r) => r + 1);
          }}
        />
      </PageShell>
    </>
  );
}
