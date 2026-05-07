import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { useSettings } from "@/hooks/use-settings";
import { useProgress } from "@/hooks/use-progress";
import { speak } from "@/lib/tts";

export const Route = createFileRoute("/math/numbers")({
  component: NumbersPage,
});

function NumbersPage() {
  const { settings } = useSettings();
  const { mark } = useProgress();
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    mark("math.numbers", "visited");
  }, [mark]);

  return (
    <>
      <TopBar title="Numbers 1 to 100" />
      <PageShell>
        <p className="mt-2 text-center text-lg text-muted-foreground">
          Tap a number to hear it.
        </p>

        <div className="mx-auto mt-6 grid w-full max-w-3xl grid-cols-10 gap-2">
          {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => {
                setSelected(n);
                speak(String(n), { enabled: settings.soundOn, rate: settings.voiceRate });
                if (n === 100) mark("math.numbers", "practiced");
              }}
              className="aspect-square rounded-xl bg-card text-base font-semibold text-foreground shadow-sm ring-1 ring-border transition active:scale-95"
              style={selected === n ? { backgroundColor: "var(--math)" } : undefined}
            >
              {n}
            </button>
          ))}
        </div>

        {selected !== null && (
          <motion.div
            key={selected}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mt-8 flex h-40 w-40 items-center justify-center rounded-3xl bg-[var(--math)] text-7xl font-bold text-[var(--math-foreground)] shadow-lg"
          >
            {selected}
          </motion.div>
        )}
      </PageShell>
    </>
  );
}
