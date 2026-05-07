import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { LessonCard, LevelTabs, PageShell, type Level } from "@/components/learning";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/evs/")({
  component: EvsHub,
});

const lessonsByLevel: Record<Level, Array<{ id: string; to: string; title: string; emoji: string }>> = {
  beginner: [
    { id: "evs.animals", to: "/evs/animals", title: "Animals", emoji: "🐶" },
    { id: "evs.food", to: "/evs/food", title: "Food", emoji: "🍎" },
    { id: "evs.body", to: "/evs/body", title: "My Body", emoji: "🧒" },
  ],
  intermediate: [
    { id: "evs.family", to: "/evs/family", title: "Family", emoji: "👨‍👩‍👧" },
    { id: "evs.emotions", to: "/evs/emotions", title: "Feelings", emoji: "😊" },
    { id: "evs.plants", to: "/evs/plants", title: "Plants", emoji: "🌳" },
  ],
  advanced: [
    { id: "evs.routines", to: "/evs/routines", title: "My Day", emoji: "🌞" },
    { id: "evs.weather", to: "/evs/weather", title: "Weather", emoji: "🌦️" },
  ],
};

function EvsHub() {
  const { progress } = useProgress();
  const [level, setLevel] = useState<Level>("beginner");
  const lessons = lessonsByLevel[level];
  return (
    <>
      <TopBar title="World" />
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
