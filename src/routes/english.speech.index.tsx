import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/english/speech/")({
  component: SpeechHub,
});

const TYPES = [
  { id: "what", title: "What", emoji: "❓", color: "var(--english)" },
  { id: "why", title: "Why", emoji: "🤔", color: "var(--math)" },
  { id: "who", title: "Who", emoji: "🙋", color: "var(--evs)" },
  { id: "where", title: "Where", emoji: "📍", color: "var(--star)" },
  { id: "which", title: "Which", emoji: "👉", color: "var(--english)" },
  { id: "how", title: "How", emoji: "🛠️", color: "var(--math)" },
  { id: "when", title: "When", emoji: "⏰", color: "var(--evs)" },
];

function SpeechHub() {
  const { progress } = useProgress();
  return (
    <>
      <TopBar title="Speech Training" />
      <PageShell>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground">
          Practice asking and answering common question words. Tap a card to begin.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {TYPES.map((t) => {
            const status = progress.lessons[`en.speech.${t.id}`];
            return (
              <Link key={t.id} to="/english/speech/$type" params={{ type: t.id }}>
                <div
                  className="relative flex h-36 flex-col items-center justify-center gap-2 rounded-3xl p-4 text-center shadow ring-1 ring-border transition active:scale-[0.97]"
                  style={{ backgroundColor: t.color }}
                >
                  <div className="text-5xl">{t.emoji}</div>
                  <div className="text-xl font-extrabold text-foreground">{t.title}</div>
                  {status && (
                    <span className="absolute right-3 top-3 h-3 w-3 rounded-full bg-foreground/80" aria-label={status} />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </PageShell>
    </>
  );
}
