import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { LessonCard, PageShell } from "@/components/learning";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/math/")({
  component: MathHub,
});

const lessons = [
  { id: "math.numbers", to: "/math/numbers", title: "Numbers 1–100", emoji: "🔢" },
  { id: "math.counting", to: "/math/counting", title: "Counting", emoji: "🍎" },
  { id: "math.addsub", to: "/math/addsub", title: "Add & Subtract", emoji: "➕" },
  { id: "math.shapes", to: "/math/shapes", title: "Shapes", emoji: "🔺" },
  { id: "math.compare", to: "/math/compare", title: "More or Less", emoji: "⚖️" },
];

function MathHub() {
  const { progress } = useProgress();
  return (
    <>
      <TopBar title="Numbers" />
      <PageShell>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {lessons.map((l) => (
            <LessonCard key={l.id} {...l} status={progress.lessons[l.id]} />
          ))}
        </div>
      </PageShell>
    </>
  );
}
