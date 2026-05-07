import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { SpeakButton } from "@/components/SpeakButton";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/math/shapes")({
  component: ShapesPage,
});

const SHAPES = [
  { name: "Circle", emoji: "⚪", desc: "A circle is round." },
  { name: "Square", emoji: "🟦", desc: "A square has four equal sides." },
  { name: "Triangle", emoji: "🔺", desc: "A triangle has three sides." },
  { name: "Star", emoji: "⭐", desc: "A star has five points." },
  { name: "Heart", emoji: "❤️", desc: "A heart shape." },
  { name: "Diamond", emoji: "🔷", desc: "A diamond shape." },
];

function ShapesPage() {
  const { mark } = useProgress();
  const [i, setI] = useState(0);
  useEffect(() => { mark("math.shapes", "visited"); }, [mark]);

  const s = SHAPES[i];
  return (
    <>
      <TopBar title="Shapes" />
      <PageShell>
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-center gap-6 rounded-3xl bg-card p-10 shadow ring-1 ring-border"
        >
          <div className="text-[10rem] leading-none">{s.emoji}</div>
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold text-foreground">{s.name}</h2>
            <SpeakButton text={`${s.name}. ${s.desc}`} />
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => setI((p) => (p - 1 + SHAPES.length) % SHAPES.length)}
            className="rounded-2xl bg-card px-5 py-3 text-lg font-semibold ring-1 ring-border"
          >
            Back
          </button>
          <button
            onClick={() => {
              setI((p) => (p + 1) % SHAPES.length);
              if (i === SHAPES.length - 1) mark("math.shapes", "practiced");
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
