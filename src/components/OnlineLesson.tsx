import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { SpeakButton } from "@/components/SpeakButton";
import { Reward } from "@/components/Reward";
import { fetchContent, type ContentItem } from "@/server/content.functions";
import { useProgress } from "@/hooks/use-progress";
import type { Level } from "@/components/learning";

export function OnlineLesson({
  module,
  level,
  title,
}: {
  module: string;
  level: Level;
  title: string;
}) {
  const { mark } = useProgress();
  const [seed, setSeed] = useState(0);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [showReward, setShowReward] = useState(false);

  const query = useQuery({
    queryKey: ["online-content", module, level, seed],
    queryFn: () => fetchContent({ data: { module, level, fresh: seed > 0 } }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    mark(`online.${module}`, "visited");
  }, [mark, module]);

  const items = query.data?.items ?? [];
  const item: ContentItem | undefined = items[idx];

  const total = items.length;
  const isLast = idx >= total - 1;

  const refresh = () => {
    setSeed((s) => s + 1);
    setIdx(0);
    setPicked(null);
    setRevealed(false);
    setScore(0);
  };

  const next = () => {
    if (isLast) {
      mark(`online.${module}`, "practiced");
      setShowReward(true);
      return;
    }
    setIdx((n) => n + 1);
    setPicked(null);
    setRevealed(false);
  };

  const choose = (correct: boolean, i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (correct) setScore((s) => s + 1);
    setTimeout(next, 900);
  };

  const shuffledOptions = useMemo(() => {
    if (!item?.options) return [];
    const a = item.options.map((o, i) => ({ ...o, _i: i }));
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <>
      <TopBar title={title} />
      <PageShell>
        <Reward show={showReward} message={`Great job! ${score}/${total}`} onDone={() => setShowReward(false)} duration={2200} />

        <div className="mx-auto mt-2 flex w-full max-w-2xl items-center justify-between text-sm font-semibold text-muted-foreground">
          <span>{query.isLoading ? "Loading…" : total > 0 ? `${idx + 1} / ${total}` : ""}</span>
          <button
            type="button"
            onClick={refresh}
            className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 ring-1 ring-border"
            aria-label="New questions"
          >
            <RefreshCw className="h-4 w-4" /> New set
          </button>
        </div>

        {query.isLoading && (
          <div className="mx-auto mt-10 flex w-full max-w-xl flex-col items-center gap-4 rounded-3xl bg-card p-10 text-center shadow ring-1 ring-border">
            <div className="text-6xl animate-pulse">✨</div>
            <p className="text-lg font-semibold text-foreground">Getting fresh questions…</p>
          </div>
        )}

        {query.isError && (
          <div className="mx-auto mt-10 flex w-full max-w-xl flex-col items-center gap-4 rounded-3xl bg-card p-8 text-center shadow ring-1 ring-border">
            <div className="text-6xl">😕</div>
            <p className="text-lg font-semibold text-foreground">Couldn’t load content.</p>
            <button onClick={refresh} className="rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
              Try again
            </button>
          </div>
        )}

        {item && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${seed}-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl bg-card p-6 shadow ring-1 ring-border sm:p-10"
            >
              {item.emoji && <div className="text-7xl sm:text-8xl">{item.emoji}</div>}
              <div className="flex items-center gap-3 text-center">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{item.prompt}</h2>
                <SpeakButton text={item.speak ?? item.prompt} />
              </div>

              {item.kind === "mcq" && shuffledOptions.length > 0 && (
                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                  {shuffledOptions.map((opt, i) => {
                    const isPicked = picked === i;
                    const reveal = picked !== null;
                    const ok = !!opt.correct;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => choose(ok, i)}
                        disabled={picked !== null}
                        className="rounded-2xl px-4 py-5 text-xl font-semibold ring-2 transition active:scale-[0.98]"
                        style={{
                          backgroundColor: reveal && ok ? "var(--evs)" : "var(--card)",
                          ["--tw-ring-color" as never]: reveal && ok ? "var(--evs)" : reveal && isPicked && !ok ? "var(--destructive, #ef4444)" : "var(--border)",
                          opacity: reveal && !ok && !isPicked ? 0.55 : 1,
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {item.kind === "flashcard" && (
                <>
                  <button
                    type="button"
                    onClick={() => setRevealed((r) => !r)}
                    className="rounded-2xl bg-secondary px-5 py-3 font-semibold text-secondary-foreground"
                  >
                    {revealed ? "Hide" : "Show answer"}
                  </button>
                  {revealed && item.answer && (
                    <div className="flex items-center gap-3 rounded-2xl bg-background px-4 py-3">
                      <p className="text-xl font-semibold text-foreground">{item.answer}</p>
                      <SpeakButton text={item.answer} />
                    </div>
                  )}
                </>
              )}

              {item.kind === "speak" && item.answer && (
                <div className="flex items-center gap-3 rounded-2xl bg-background px-4 py-3 text-center">
                  <p className="text-lg font-semibold text-foreground sm:text-xl">{item.answer}</p>
                  <SpeakButton text={item.answer} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {item && item.kind !== "mcq" && (
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIdx((p) => Math.max(0, p - 1));
                setRevealed(false);
              }}
              className="rounded-2xl bg-card px-5 py-3 font-semibold ring-1 ring-border"
            >
              Back
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
            >
              {isLast ? "Finish" : "Next"}
            </button>
          </div>
        )}
      </PageShell>
    </>
  );
}
