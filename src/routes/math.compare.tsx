import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { Reward } from "@/components/Reward";
import { SpeakButton } from "@/components/SpeakButton";
import { useSettings } from "@/hooks/use-settings";
import { useProgress } from "@/hooks/use-progress";
import { speak } from "@/lib/tts";

export const Route = createFileRoute("/math/compare")({
  component: ComparePage,
});

type Step = 0 | 1 | 2 | 3 | 4 | 5;

function ComparePage() {
  const { settings } = useSettings();
  const { mark } = useProgress();
  const [step, setStep] = useState<Step>(0);

  useEffect(() => { mark("math.compare", "visited"); }, [mark]);
  useEffect(() => { if (step === 5) mark("math.compare", "practiced"); }, [step, mark]);

  const steps = [
    <Step1 onNext={() => setStep(1)} key="1" />,
    <Step2 onNext={() => setStep(2)} key="2" settings={settings} />,
    <Step3 onNext={() => setStep(3)} key="3" />,
    <Step4 onNext={() => setStep(4)} key="4" />,
    <Step5 onNext={() => setStep(5)} key="5" />,
    <Step6 onComplete={() => mark("math.compare", "mastered")} key="6" settings={settings} />,
  ];

  return (
    <>
      <TopBar title="More or Less" />
      <PageShell>
        <Stepper step={step} total={6} />
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </PageShell>
    </>
  );
}

function Stepper({ step, total }: { step: number; total: number }) {
  return (
    <div className="mx-auto mb-4 mt-2 flex gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-2 w-8 rounded-full"
          style={{ backgroundColor: i <= step ? "var(--primary)" : "var(--border)" }}
        />
      ))}
    </div>
  );
}

function NextBtn({ onClick, label = "Next" }: { onClick: () => void; label?: string }) {
  return (
    <div className="mt-8 flex justify-center">
      <button
        onClick={onClick}
        className="rounded-2xl bg-primary px-8 py-4 text-xl font-semibold text-primary-foreground shadow"
      >
        {label} →
      </button>
    </div>
  );
}

function Pond({ count, item, label }: { count: number; item: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl bg-[var(--math)]/40 p-5 ring-1 ring-border">
      <div className="grid min-h-32 max-w-[14rem] grid-cols-3 gap-2 place-content-center place-items-center">
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="text-4xl md:text-5xl">{item}</span>
        ))}
      </div>
      <div className="text-2xl font-bold text-foreground">{count}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

// Step 1 — observe
function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <h2 className="text-center text-2xl font-semibold text-foreground">
        Look at the two ponds. <SpeakInline text="Look at the two ponds. The right pond has more ducks." />
      </h2>
      <div className="mx-auto mt-6 grid w-full max-w-3xl grid-cols-2 gap-6">
        <Pond count={3} item="🦆" label="Left pond" />
        <Pond count={6} item="🦆" label="Right pond" />
      </div>
      <p className="mt-6 text-center text-xl text-foreground">
        The right pond has <strong>more</strong> ducks. 🦊 points to the bigger group.
      </p>
      <NextBtn onClick={onNext} />
    </div>
  );
}

// Step 2 — choose which has more
function Step2({ onNext, settings }: { onNext: () => void; settings: ReturnType<typeof useSettings>["settings"] }) {
  const [picked, setPicked] = useState<"left" | "right" | null>(null);
  const [showReward, setShowReward] = useState(false);
  const left = 4, right = 7;

  const pick = (side: "left" | "right") => {
    if (side === "right") {
      setPicked(side);
      speak("Yes! Seven is more than four.", { enabled: settings.soundOn, rate: settings.voiceRate });
      setTimeout(() => setShowReward(true), 500);
    } else {
      speak("Look again, which one has more?", { enabled: settings.soundOn, rate: settings.voiceRate });
      setPicked("left");
      setTimeout(() => setPicked(null), 800);
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-semibold text-foreground">
        Tap the tray with <strong>more</strong> apples.
        <span className="ml-2 inline-block align-middle"><SpeakInline text="Tap the tray with more apples." /></span>
      </h2>
      <div className="mx-auto mt-6 grid w-full max-w-3xl grid-cols-2 gap-6">
        <motion.button
          animate={picked === "left" ? { scale: [1, 1.05, 1] } : {}}
          onClick={() => pick("left")}
          className="rounded-3xl"
        >
          <Pond count={left} item="🍎" label="Left tray" />
        </motion.button>
        <button onClick={() => pick("right")} className="rounded-3xl">
          <Pond count={right} item="🍎" label="Right tray" />
        </button>
      </div>
      <Reward show={showReward} onDone={() => { setShowReward(false); onNext(); }} />
    </div>
  );
}

// Step 3 — equal
function Step3({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <h2 className="text-center text-2xl font-semibold text-foreground">
        Both plates have the same. They are <strong>equal</strong>.
        <span className="ml-2 inline-block align-middle"><SpeakInline text="Both plates have the same. They are equal. Equal means same." /></span>
      </h2>
      <div className="mx-auto mt-6 grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-6">
        <Pond count={4} item="🍪" label="Left plate" />
        <div className="text-7xl font-bold text-primary">=</div>
        <Pond count={4} item="🍪" label="Right plate" />
      </div>
      <NextBtn onClick={onNext} />
    </div>
  );
}

// Step 4 — friendly crocodile mouth
function Step4({ onNext }: { onNext: () => void }) {
  const [side, setSide] = useState<"left" | "right">("left");
  return (
    <div>
      <h2 className="text-center text-2xl font-semibold text-foreground">
        The friendly crocodile eats the <strong>bigger</strong> group. Tap to face it that way.
        <span className="ml-2 inline-block align-middle"><SpeakInline text="The crocodile mouth opens to the bigger group." /></span>
      </h2>
      <div className="mx-auto mt-6 grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-6">
        <Pond count={3} item="🐟" label="3 fish" />
        <button
          onClick={() => setSide(side === "left" ? "right" : "left")}
          className="rounded-3xl bg-card p-4 text-7xl shadow ring-1 ring-border"
          style={{ transform: side === "left" ? "scaleX(-1)" : "scaleX(1)" }}
          aria-label="Flip crocodile"
        >
          🐊
        </button>
        <Pond count={7} item="🐟" label="7 fish" />
      </div>
      <p className="mt-4 text-center text-muted-foreground">
        {side === "right" ? "Yes! Mouth opens to 7." : "Tap the crocodile to flip it."}
      </p>
      <NextBtn onClick={onNext} label={side === "right" ? "Next" : "Skip"} />
    </div>
  );
}

// Step 5 — symbol reveal
function Step5({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <h2 className="text-center text-2xl font-semibold text-foreground">
        The mouth becomes a sign. <strong>&lt;</strong> means <em>less than</em>.
        <span className="ml-2 inline-block align-middle"><SpeakInline text="The mouth becomes a sign. Less than. Three is less than seven." /></span>
      </h2>
      <div className="mx-auto mt-8 grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-6">
        <div className="rounded-3xl bg-[var(--math)]/40 p-6 text-center text-6xl font-bold">3</div>
        <div className="text-8xl font-extrabold text-primary">{"<"}</div>
        <div className="rounded-3xl bg-[var(--math)]/40 p-6 text-center text-6xl font-bold">7</div>
      </div>
      <p className="mt-6 text-center text-lg text-foreground">
        Bigger side, open mouth. Smaller side, pointy tip.
      </p>
      <NextBtn onClick={onNext} />
    </div>
  );
}

// Step 6 — practice mixing > < ==
function Step6({ onComplete, settings }: { onComplete: () => void; settings: ReturnType<typeof useSettings>["settings"] }) {
  const rounds = useMemo(() => {
    const r: { a: number; b: number }[] = [];
    while (r.length < 5) {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      r.push({ a, b });
    }
    return r;
  }, []);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [done, setDone] = useState(false);

  const cur = rounds[idx];
  const correct = cur.a > cur.b ? ">" : cur.a < cur.b ? "<" : "=";

  const pick = (s: string) => {
    setPicked(s);
    if (s === correct) {
      speak(`${cur.a} ${s === ">" ? "greater than" : s === "<" ? "less than" : "equal to"} ${cur.b}`, {
        enabled: settings.soundOn, rate: settings.voiceRate,
      });
      setTimeout(() => {
        if (idx === rounds.length - 1) {
          setShowReward(true);
          setDone(true);
        } else {
          setIdx((i) => i + 1);
          setPicked(null);
        }
      }, 700);
    } else {
      speak("Look again", { enabled: settings.soundOn, rate: settings.voiceRate });
      setTimeout(() => setPicked(null), 600);
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-semibold text-foreground">Practice ({idx + 1} of {rounds.length})</h2>
      <div className="mx-auto mt-6 grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-6">
        <Pond count={cur.a} item="⭐" label={`${cur.a}`} />
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-card text-5xl font-bold ring-1 ring-border">?</div>
        <Pond count={cur.b} item="⭐" label={`${cur.b}`} />
      </div>
      <div className="mt-8 flex justify-center gap-4">
        {[">", "=", "<"].map((s) => (
          <motion.button
            key={s}
            whileTap={{ scale: 0.92 }}
            onClick={() => pick(s)}
            className="h-20 w-20 rounded-3xl text-4xl font-extrabold shadow ring-1 ring-border"
            style={{
              backgroundColor:
                picked === s
                  ? s === correct
                    ? "var(--evs)"
                    : "var(--sand)"
                  : "var(--card)",
            }}
          >
            {s}
          </motion.button>
        ))}
      </div>
      <Reward show={showReward} message="Mastered!" onDone={() => { setShowReward(false); onComplete(); }} />
      {done && (
        <p className="mt-6 text-center text-lg text-muted-foreground">Beautiful work. Tap Home or Back when ready.</p>
      )}
    </div>
  );
}

function SpeakInline({ text }: { text: string }) {
  return <SpeakButton text={text} />;
}
