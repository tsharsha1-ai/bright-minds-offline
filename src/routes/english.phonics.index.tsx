import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { LessonCard, PageShell } from "@/components/learning";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/english/phonics/")({
  component: PhonicsHub,
});

const SECTIONS = [
  { id: "en.phonics.letters", to: "/english/phonics/letter-sounds", title: "Letter Sounds", emoji: "🔤" },
  { id: "en.phonics.short", to: "/english/phonics/short-vowels", title: "Short Vowels", emoji: "🅰️" },
  { id: "en.phonics.long", to: "/english/phonics/long-vowels", title: "Long Vowels", emoji: "🎵" },
  { id: "en.phonics.blends", to: "/english/phonics/blends", title: "Blends", emoji: "🔗" },
  { id: "en.phonics.cvc", to: "/english/phonics/cvc-words", title: "CVC Words", emoji: "🐱" },
  { id: "en.phonics.rhymes", to: "/english/phonics/rhymes", title: "Rhyming Words", emoji: "🎶" },
];

function PhonicsHub() {
  const { progress } = useProgress();
  return (
    <>
      <TopBar title="Phonics" />
      <PageShell>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {SECTIONS.map((s) => (
            <LessonCard key={s.id} to={s.to} title={s.title} emoji={s.emoji} status={progress.lessons[s.id]} />
          ))}
        </div>
      </PageShell>
    </>
  );
}
