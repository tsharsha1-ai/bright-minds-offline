import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { Reward } from "@/components/Reward";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/english/tracing")({
  component: TracingPage,
});

const LETTERS = ["A", "B", "C", "D", "O", "S"];

function TracingPage() {
  const { mark } = useProgress();
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const [strokes, setStrokes] = useState<string[]>([]);
  const [drawing, setDrawing] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const cur = useRef<string>("");

  useEffect(() => { mark("en.tracing", "visited"); }, [mark]);
  useEffect(() => { setStrokes([]); setDone(false); }, [i]);

  const point = (e: React.PointerEvent) => {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 200;
    const y = ((e.clientY - rect.top) / rect.height) * 200;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const start = (e: React.PointerEvent) => {
    setDrawing(true);
    cur.current = `M${point(e)}`;
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing) return;
    cur.current += ` L${point(e)}`;
    // force re-render of in-progress stroke
    setStrokes((s) => [...s]);
  };
  const end = () => {
    if (!drawing) return;
    setDrawing(false);
    if (cur.current) setStrokes((s) => [...s, cur.current]);
    cur.current = "";
  };

  const clear = () => setStrokes([]);
  const finish = () => {
    setDone(true);
    if (i === LETTERS.length - 1) mark("en.tracing", "practiced");
  };

  return (
    <>
      <TopBar title="Tracing" />
      <PageShell>
        <p className="mt-2 text-center text-lg text-muted-foreground">
          Trace the letter <strong>{LETTERS[i]}</strong> with your finger.
        </p>

        <div className="mx-auto mt-4 w-full max-w-md rounded-3xl bg-card p-2 shadow ring-1 ring-border">
          <svg
            ref={svgRef}
            viewBox="0 0 200 200"
            className="aspect-square w-full touch-none rounded-2xl bg-[var(--english)]/30"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
          >
            <text
              x="100" y="160" textAnchor="middle"
              fontSize="180" fontWeight="800"
              fill="var(--background)"
              stroke="var(--english-foreground)"
              strokeWidth="3"
              opacity="0.45"
              style={{ fontFamily: "Lexend, sans-serif" }}
            >{LETTERS[i]}</text>
            {strokes.map((d, idx) => (
              <path key={idx} d={d} stroke="var(--primary)" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ))}
            {drawing && cur.current && (
              <path d={cur.current} stroke="var(--primary)" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={clear} className="rounded-2xl bg-card px-5 py-3 text-lg font-semibold ring-1 ring-border">Clear</button>
          <button onClick={finish} className="rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground">I did it!</button>
          <button
            onClick={() => setI((p) => (p + 1) % LETTERS.length)}
            className="rounded-2xl bg-card px-5 py-3 text-lg font-semibold ring-1 ring-border"
          >
            Next letter
          </button>
        </div>

        <Reward show={done} onDone={() => { setDone(false); setI((p) => (p + 1) % LETTERS.length); }} />
      </PageShell>
    </>
  );
}
