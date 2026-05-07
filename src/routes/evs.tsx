import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { LessonCard, PageShell } from "@/components/learning";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/evs")({
  component: EvsHub,
});

const lessons = [
  { id: "evs.animals", to: "/evs/animals", title: "Animals", emoji: "🐶" },
  { id: "evs.food", to: "/evs/food", title: "Food", emoji: "🍎" },
  { id: "evs.family", to: "/evs/family", title: "Family", emoji: "👨‍👩‍👧" },
  { id: "evs.emotions", to: "/evs/emotions", title: "Feelings", emoji: "😊" },
  { id: "evs.routines", to: "/evs/routines", title: "My Day", emoji: "🌞" },
  { id: "evs.body", to: "/evs/body", title: "My Body", emoji: "🧒" },
];

function EvsHub() {
  const { progress } = useProgress();
  return (
    <>
      <TopBar title="World" />
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
