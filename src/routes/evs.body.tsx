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
  { name: "Head", emoji: "🧠" },
  { name: "Eyes", emoji: "👀" },
  { name: "Ears", emoji: "👂" },
  { name: "Nose", emoji: "👃" },
  { name: "Mouth", emoji: "👄" },
  { name: "Hands", emoji: "✋" },
  { name: "Legs", emoji: "🦵" },
  { name: "Feet", emoji: "🦶" },
];

function Parts() {
  const { settings } = useSettings();
  const { mark } = useProgress();
  const [picked, setPicked] = useState<string>(PARTS[0].name);
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

  const current = PARTS.find((p) => p.name === picked) ?? PARTS[0];

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-[var(--evs)]/30 p-6 ring-1 ring-border">
        <div className="text-[10rem] leading-none">🧒</div>
        <motion.div
          key={picked}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3 rounded-2xl bg-card px-5 py-3 shadow ring-1 ring-border"
        >
          <span className="text-4xl">{current.emoji}</span>
          <span className="text-2xl font-bold text-foreground">{current.name}</span>
          <SpeakButton text={current.name} />
        </motion.div>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl bg-card p-5 ring-1 ring-border">
        <p className="text-center text-base text-muted-foreground">
          Tap a body part to learn its name.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PARTS.map((p) => {
            const active = picked === p.name;
            return (
              <motion.button
                key={p.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => tap(p.name)}
                aria-label={p.name}
                aria-pressed={active}
                className="flex flex-col items-center gap-1 rounded-2xl p-3 ring-1 ring-border transition"
                style={{ backgroundColor: active ? "var(--evs)" : "var(--background)" }}
              >
                <span className="text-4xl">{p.emoji}</span>
                <span className="text-sm font-semibold text-foreground">{p.name}</span>
              </motion.button>
            );
          })}
        </div>
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
