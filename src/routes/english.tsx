import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { LessonCard, PageShell } from "@/components/learning";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/english")({
  component: EnglishHub,
});

const lessons = [
  { id: "en.alphabet", to: "/english/alphabet", title: "A to Z", emoji: "🔤" },
  { id: "en.phonics", to: "/english/phonics", title: "Phonics", emoji: "🗣️" },
  { id: "en.tracing", to: "/english/tracing", title: "Tracing", emoji: "✏️" },
  { id: "en.sight", to: "/english/sight-words", title: "Sight Words", emoji: "📖" },
  { id: "en.sentences", to: "/english/sentences", title: "Picture Words", emoji: "🖼️" },
];

function EnglishHub() {
  const { progress } = useProgress();
  return (
    <>
      <TopBar title="Letters" />
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
