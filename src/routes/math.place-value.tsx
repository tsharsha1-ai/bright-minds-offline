import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/math/place-value")({
  component: PlaceValuePage,
});

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function PlaceValuePage() {
  const { mark } = useProgress();
  const [seed, setSeed] = useState(0);
  const num = useMemo(() => rand(11, 99), [seed]);
  const tens = Math.floor(num / 10);
  const ones = num % 10;

  useEffect(() => {
    mark("math.place-value", "visited");
  }, [mark]);

  return (
    <>
      <TopBar title="Place Value" />
      <PageShell>
        <div className="mx-auto mt-4 flex w-full max-w-3xl flex-col items-center gap-6 rounded-3xl bg-card p-8 shadow ring-1 ring-border">
          <div className="text-7xl font-extrabold text-[var(--math-foreground)]">{num}</div>
          <p className="text-center text-lg text-muted-foreground">
            <span className="font-semibold text-foreground">{tens}</span> tens and{" "}
            <span className="font-semibold text-foreground">{ones}</span> ones
          </p>

          <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start md:justify-around">
            <Bundle label="Tens" count={tens} symbol="🟦" big />
            <Bundle label="Ones" count={ones} symbol="🟨" />
          </div>

          <button
            onClick={() => {
              mark("math.place-value", "practiced");
              setSeed((s) => s + 1);
            }}
            className="rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground"
          >
            Next number
          </button>
        </div>
      </PageShell>
    </>
  );
}

function Bundle({ label, count, symbol, big }: { label: string; count: number; symbol: string; big?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-base font-semibold text-foreground">{label}</div>
      <div className={`flex max-w-xs flex-wrap justify-center gap-1 ${big ? "text-3xl" : "text-2xl"}`}>
        {Array.from({ length: count }).map((_, i) => (
          <span key={i}>{symbol}</span>
        ))}
        {count === 0 && <span className="text-muted-foreground">—</span>}
      </div>
    </div>
  );
}
