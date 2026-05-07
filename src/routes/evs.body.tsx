import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { SpeakButton } from "@/components/SpeakButton";
import { useSettings } from "@/hooks/use-settings";
import { useProgress } from "@/hooks/use-progress";
import { speak } from "@/lib/tts";

export const Route = createFileRoute("/evs/body")({
  component: BodyPage,
});

type Tab = "parts" | "senses" | "inside";

function BodyPage() {
  const [tab, setTab] = useState<Tab>("parts");
  const { mark } = useProgress();
  useEffect(() => { mark("evs.body", "visited"); }, [mark]);

  return (
    <>
      <TopBar title="My Body" />
      <PageShell>
        <div className="mx-auto mt-2 flex w-fit gap-1 rounded-2xl bg-card p-1 ring-1 ring-border">
          {(
            [
              ["parts", "Body Parts"],
              ["senses", "Five Senses"],
              ["inside", "Inside Me"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="rounded-xl px-4 py-2 text-base font-semibold md:text-lg"
              style={{
                backgroundColor: tab === key ? "var(--evs)" : "transparent",
                color: tab === key ? "var(--evs-foreground)" : "var(--foreground)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "parts" && <Parts />}
          {tab === "senses" && <Senses />}
          {tab === "inside" && <Inside />}
        </div>
      </PageShell>
    </>
  );
}

const PARTS = [
  { name: "Head", emoji: "🧠", x: 50, y: 12 },
  { name: "Eyes", emoji: "👀", x: 50, y: 22 },
  { name: "Ears", emoji: "👂", x: 70, y: 22 },
  { name: "Nose", emoji: "👃", x: 50, y: 28 },
  { name: "Mouth", emoji: "👄", x: 50, y: 34 },
  { name: "Hands", emoji: "✋", x: 18, y: 60 },
  { name: "Legs", emoji: "🦵", x: 40, y: 80 },
  { name: "Feet", emoji: "🦶", x: 40, y: 95 },
];

function Parts() {
  const { settings } = useSettings();
  const { mark } = useProgress();
  const [picked, setPicked] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const tap = (name: string) => {
    setPicked(name);
    speak(name, { enabled: settings.soundOn, rate: settings.voiceRate });
    setCount((c) => {
      const n = c + 1;
      if (n >= 4) mark("evs.body", "practiced");
      return n;
    });
  };

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6 md:grid-cols-2">
      <div className="relative mx-auto flex aspect-[3/5] w-full max-w-xs items-center justify-center rounded-3xl bg-[var(--evs)]/30 ring-1 ring-border">
        {/* Friendly stylized child */}
        <div className="text-[12rem] leading-none">🧒</div>
        {PARTS.map((p) => (
          <motion.button
            key={p.name}
            whileTap={{ scale: 0.85 }}
            onClick={() => tap(p.name)}
            className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-card text-2xl shadow ring-2 ring-border"
            style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
            aria-label={p.name}
          >
            {p.emoji}
          </motion.button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 rounded-3xl bg-card p-6 ring-1 ring-border">
        <p className="text-center text-lg text-muted-foreground">Tap a part of the body.</p>
        {picked ? (
          <motion.div
            key={picked}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="text-7xl">{PARTS.find((p) => p.name === picked)?.emoji}</div>
            <h3 className="text-3xl font-bold text-foreground">{picked}</h3>
            <SpeakButton text={picked} />
          </motion.div>
        ) : (
          <p className="text-center text-foreground">Pick any glowing dot.</p>
        )}
      </div>
    </div>
  );
}

const SENSES = [
  { sense: "See", part: "Eyes", emoji: "👀", example: "🌼", text: "I see a flower." },
  { sense: "Hear", part: "Ears", emoji: "👂", example: "🔔", text: "I hear a bell." },
  { sense: "Smell", part: "Nose", emoji: "👃", example: "🌹", text: "I smell a rose." },
  { sense: "Taste", part: "Mouth", emoji: "👅", example: "🍓", text: "I taste a strawberry." },
  { sense: "Touch", part: "Hands", emoji: "✋", example: "🧸", text: "I touch a soft toy." },
];

function Senses() {
  const [i, setI] = useState(0);
  const s = SENSES[i];
  return (
    <div>
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-card p-8 shadow ring-1 ring-border"
      >
        <div className="flex items-center gap-6 text-7xl">
          <span>{s.emoji}</span>
          <span className="text-3xl text-muted-foreground">→</span>
          <span>{s.example}</span>
        </div>
        <h3 className="text-3xl font-bold text-foreground">{s.sense}</h3>
        <p className="text-xl text-muted-foreground">{s.text}</p>
        <SpeakButton text={s.text} />
      </motion.div>
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={() => setI((p) => (p - 1 + SENSES.length) % SENSES.length)}
          className="rounded-2xl bg-card px-5 py-3 text-lg font-semibold ring-1 ring-border"
        >
          Back
        </button>
        <button
          onClick={() => setI((p) => (p + 1) % SENSES.length)}
          className="rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Inside() {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6 md:grid-cols-2">
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-card p-8 ring-1 ring-border">
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="text-9xl"
        >
          ❤️
        </motion.div>
        <h3 className="text-2xl font-bold text-foreground">My Heart</h3>
        <p className="text-center text-muted-foreground">Your heart beats. It keeps you going.</p>
        <SpeakButton text="Your heart beats. It keeps you going." />
      </div>
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-card p-8 ring-1 ring-border">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-9xl"
        >
          🫁
        </motion.div>
        <h3 className="text-2xl font-bold text-foreground">Breathing</h3>
        <p className="text-center text-muted-foreground">Breathe in… breathe out. Slow and calm.</p>
        <SpeakButton text="Breathe in. Breathe out. Slow and calm." />
      </div>
    </div>
  );
}
