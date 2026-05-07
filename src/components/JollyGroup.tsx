import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { SpeakButton } from "@/components/SpeakButton";
import { useProgress } from "@/hooks/use-progress";

export type JollySound = {
  letter: string; // e.g. "s", "ai", "sh"
  word: string; // example word
  emoji: string;
  action: string; // Jolly Phonics action description
  sound?: string; // optional spoken hint, defaults to letter + word
};

export function JollyGroup({
  lessonId,
  groupNumber,
  sounds,
}: {
  lessonId: string;
  groupNumber: number;
  sounds: JollySound[];
}) {
  const { mark } = useProgress();
  const [i, setI] = useState(0);
  useEffect(() => { mark(lessonId, "visited"); }, [mark, lessonId]);
  const s = sounds[i];

  return (
    <>
      <TopBar title={`Group ${groupNumber}`} />
      <PageShell>
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-4 flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-card p-8 shadow ring-1 ring-border"
        >
          <div className="text-[8rem] font-extrabold leading-none text-[var(--english-foreground)]">{s.letter}</div>
          <div className="text-7xl">{s.emoji}</div>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-semibold text-foreground">{s.word}</div>
            <SpeakButton text={s.sound ?? `${s.letter}. ${s.word}`} />
          </div>
          <div className="mt-2 flex items-start gap-3 rounded-2xl bg-secondary px-4 py-3 text-left">
            <span className="text-2xl" aria-hidden>🤸</span>
            <div className="flex-1 text-sm text-secondary-foreground">
              <div className="font-bold">Action</div>
              <div>{s.action}</div>
            </div>
            <SpeakButton text={s.action} />
          </div>
        </motion.div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => setI((p) => (p - 1 + sounds.length) % sounds.length)}
            className="rounded-2xl bg-card px-5 py-3 text-lg font-semibold ring-1 ring-border"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (i === sounds.length - 1) mark(lessonId, "practiced");
              setI((p) => (p + 1) % sounds.length);
            }}
            className="rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground"
          >
            Next
          </button>
        </div>

        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
          {sounds.map((x, idx) => (
            <button
              key={x.letter}
              onClick={() => setI(idx)}
              className="rounded-2xl px-3 py-2 text-xl font-bold ring-1 ring-border"
              style={i === idx ? { backgroundColor: "var(--english)" } : { backgroundColor: "var(--card)" }}
              aria-label={x.letter}
            >
              {x.letter}
            </button>
          ))}
        </div>
      </PageShell>
    </>
  );
}
