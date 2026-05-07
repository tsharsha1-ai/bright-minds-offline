import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { SpeakButton } from "@/components/SpeakButton";
import { useProgress } from "@/hooks/use-progress";

type Item = { name: string; emoji: string; sound?: string };

export function GalleryLesson({
  lessonId,
  title,
  items,
  speakHint,
}: {
  lessonId: string;
  title: string;
  items: Item[];
  speakHint?: (it: Item) => string;
}) {
  const { mark } = useProgress();
  const [i, setI] = useState(0);
  useEffect(() => { mark(lessonId, "visited"); }, [mark, lessonId]);
  const it = items[i];

  return (
    <>
      <TopBar title={title} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-10 md:px-8">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-card p-10 shadow ring-1 ring-border"
        >
          <div className="text-[11rem] leading-none">{it.emoji}</div>
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold text-foreground">{it.name}</h2>
            <SpeakButton text={speakHint ? speakHint(it) : `${it.name}.${it.sound ? " " + it.sound : ""}`} />
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => setI((p) => (p - 1 + items.length) % items.length)}
            className="rounded-2xl bg-card px-5 py-3 text-lg font-semibold ring-1 ring-border"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (i === items.length - 1) mark(lessonId, "practiced");
              setI((p) => (p + 1) % items.length);
            }}
            className="rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground"
          >
            Next
          </button>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
          {items.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setI(idx)}
              className="rounded-2xl px-3 py-2 text-2xl ring-1 ring-border"
              style={i === idx ? { backgroundColor: "var(--evs)" } : { backgroundColor: "var(--card)" }}
              aria-label={x.name}
            >
              {x.emoji}
            </button>
          ))}
        </div>
      </main>
    </>
  );
}

