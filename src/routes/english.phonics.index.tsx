import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/english/phonics/")({
  component: PhonicsHub,
});

const GROUPS = [
  { id: "en.phonics.g1", to: "/english/phonics/group-1", title: "Group 1", letters: "s a t i p n", color: "var(--english)" },
  { id: "en.phonics.g2", to: "/english/phonics/group-2", title: "Group 2", letters: "ck e h r m d", color: "var(--math)" },
  { id: "en.phonics.g3", to: "/english/phonics/group-3", title: "Group 3", letters: "g o u l f b", color: "var(--evs)" },
  { id: "en.phonics.g4", to: "/english/phonics/group-4", title: "Group 4", letters: "ai j oa ie ee or", color: "var(--star)" },
  { id: "en.phonics.g5", to: "/english/phonics/group-5", title: "Group 5", letters: "z w ng v oo OO", color: "var(--english)" },
  { id: "en.phonics.g6", to: "/english/phonics/group-6", title: "Group 6", letters: "y x ch sh th TH", color: "var(--math)" },
  { id: "en.phonics.g7", to: "/english/phonics/group-7", title: "Group 7", letters: "qu ou oi ue er ar", color: "var(--evs)" },
];

const EXTRAS = [
  { id: "en.phonics.blending", to: "/english/phonics/blending", title: "Blending", emoji: "🔗" },
  { id: "en.phonics.tricky", to: "/english/phonics/tricky-words", title: "Tricky Words", emoji: "✨" },
  { id: "en.phonics.cvc", to: "/english/phonics/cvc-words", title: "CVC Words", emoji: "🐱" },
  { id: "en.phonics.rhymes", to: "/english/phonics/rhymes", title: "Rhyming Words", emoji: "🎶" },
];

function PhonicsHub() {
  const { progress } = useProgress();
  return (
    <>
      <TopBar title="Jolly Phonics" />
      <PageShell>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground">
          Learn the 42 sounds in 7 groups — each with a fun action.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {GROUPS.map((g) => {
            const status = progress.lessons[g.id];
            return (
              <Link key={g.id} to={g.to}>
                <div
                  className="relative flex h-40 flex-col justify-between rounded-3xl p-5 shadow ring-1 ring-border transition-transform active:scale-[0.97]"
                  style={{ backgroundColor: g.color }}
                >
                  <div className="text-sm font-bold uppercase tracking-wide text-foreground/80">{g.title}</div>
                  <div className="text-3xl font-extrabold text-foreground">{g.letters}</div>
                  {status && (
                    <span
                      className="absolute right-3 top-3 h-3 w-3 rounded-full bg-foreground/80"
                      aria-label={status}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <h2 className="mx-auto mt-10 max-w-2xl text-center text-lg font-bold text-foreground">Practice</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {EXTRAS.map((e) => {
            const status = progress.lessons[e.id];
            return (
              <Link key={e.id} to={e.to}>
                <div className="relative flex h-32 flex-col items-center justify-center gap-1 rounded-3xl bg-card p-3 text-center shadow-sm ring-1 ring-border transition active:scale-[0.97]">
                  <div className="text-4xl">{e.emoji}</div>
                  <div className="text-base font-semibold text-foreground">{e.title}</div>
                  {status && <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
              </Link>
            );
          })}
        </div>
      </PageShell>
    </>
  );
}
