import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { LessonCard, LevelTabs, PageShell, type Level } from "@/components/learning";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/math/")({
  component: MathHub,
});

const lessonsByLevel: Record<Level, Array<{ id: string; to: string; title: string; emoji: string }>> = {
  beginner: [
    { id: "math.numbers", to: "/math/numbers", title: "Numbers 1–100", emoji: "🔢" },
    { id: "math.counting", to: "/math/counting", title: "Counting", emoji: "🍎" },
    { id: "math.shapes", to: "/math/shapes", title: "Shapes", emoji: "🔺" },
  ],
  intermediate: [
    { id: "math.addsub", to: "/math/addsub", title: "Add & Subtract", emoji: "➕" },
    { id: "math.compare", to: "/math/compare", title: "More or Less", emoji: "⚖️" },
    { id: "math.place-value", to: "/math/place-value", title: "Place Value", emoji: "🔟" },
  ],
  advanced: [
    { id: "math.times-tables", to: "/math/times-tables", title: "Times Tables", emoji: "✖️" },
  ],
};

function MathHub() {
  const { progress } = useProgress();
  const [level, setLevel] = useState<Level>("beginner");
  const lessons = lessonsByLevel[level];
  return (
    <>
      <TopBar title="Numbers" />
      <PageShell>
        <LevelTabs value={level} onChange={setLevel} />
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {lessons.map((l) => (
            <LessonCard key={l.id} {...l} status={progress.lessons[l.id]} />
          ))}
        </div>
      </PageShell>
    </>
  );
}
