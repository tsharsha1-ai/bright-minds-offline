import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { LessonCard, LevelTabs, PageShell, type Level } from "@/components/learning";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/english/")({
  component: EnglishHub,
});

const lessonsByLevel: Record<Level, Array<{ id: string; to: string; title: string; emoji: string }>> = {
  beginner: [
    { id: "en.alphabet", to: "/english/alphabet", title: "A to Z", emoji: "🔤" },
    { id: "en.phonics", to: "/english/phonics", title: "Phonics", emoji: "🗣️" },
    { id: "en.tracing", to: "/english/tracing", title: "Tracing", emoji: "✏️" },
  ],
  intermediate: [
    { id: "en.sight", to: "/english/sight-words", title: "Sight Words", emoji: "📖" },
    { id: "en.digraphs", to: "/english/digraphs", title: "Digraphs", emoji: "🔠" },
    { id: "en.sentences", to: "/english/sentences", title: "Picture Words", emoji: "🖼️" },
    { id: "en.speech", to: "/english/speech", title: "Speech", emoji: "💬" },
  ],
  advanced: [
    { id: "en.spelling", to: "/english/spelling", title: "Spelling", emoji: "🧩" },
  ],
};

function EnglishHub() {
  const { progress } = useProgress();
  const [level, setLevel] = useState<Level>("beginner");
  const lessons = lessonsByLevel[level];
  return (
    <>
      <TopBar title="Letters" />
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
