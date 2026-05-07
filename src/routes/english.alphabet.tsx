import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { useSettings } from "@/hooks/use-settings";
import { useProgress } from "@/hooks/use-progress";
import { speak } from "@/lib/tts";

export const Route = createFileRoute("/english/alphabet")({
  component: AlphabetPage,
});

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function AlphabetPage() {
  const { settings } = useSettings();
  const { mark } = useProgress();
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => { mark("en.alphabet", "visited"); }, [mark]);

  return (
    <>
      <TopBar title="A to Z" />
      <PageShell>
        <p className="mt-2 text-center text-lg text-muted-foreground">Tap a letter to hear it.</p>
        <div className="mx-auto mt-6 grid w-full max-w-4xl grid-cols-6 gap-3 md:grid-cols-9">
          {LETTERS.map((l) => (
            <motion.button
              key={l}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                setPicked(l);
                speak(l, { enabled: settings.soundOn, rate: settings.voiceRate });
                if (l === "Z") mark("en.alphabet", "practiced");
              }}
              className="aspect-square rounded-2xl bg-card text-3xl font-bold text-foreground shadow ring-1 ring-border"
              style={picked === l ? { backgroundColor: "var(--english)" } : undefined}
            >
              {l}
            </motion.button>
          ))}
        </div>

        {picked && (
          <motion.div
            key={picked}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mt-8 flex h-44 w-44 items-center justify-center rounded-3xl bg-[var(--english)] text-8xl font-bold text-[var(--english-foreground)] shadow"
          >
            {picked}
          </motion.div>
        )}
      </PageShell>
    </>
  );
}
