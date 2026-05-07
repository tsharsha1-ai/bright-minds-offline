import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings as SettingsIcon, Volume2, VolumeX, Users } from "lucide-react";
import { SubjectTile } from "@/components/learning";
import { useSettings } from "@/hooks/use-settings";
import { useProfiles } from "@/hooks/use-profiles";
import { ProfilePicker } from "@/components/ProfilePicker";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { settings, update } = useSettings();
  const { active, profiles } = useProfiles();

  // No profile chosen yet → show kid picker
  if (!active) {
    return <ProfilePicker />;
  }

  const subjects = [
    { key: "math" as const, to: "/math", title: "Numbers", emoji: "🔢", bg: "var(--math)", fg: "var(--math-foreground)" },
    { key: "english" as const, to: "/english", title: "Letters", emoji: "🔤", bg: "var(--english)", fg: "var(--english-foreground)" },
    { key: "evs" as const, to: "/evs", title: "World", emoji: "🌿", bg: "var(--evs)", fg: "var(--evs-foreground)" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background px-3 py-4 sm:px-4 sm:py-6 md:px-10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-sm ring-1 ring-border"
            style={{ backgroundColor: active.color }}
            aria-hidden
          >
            {active.emoji}
          </div>
          <div className="min-w-0">
            <h1 className="animate-in fade-in slide-in-from-top-2 truncate text-2xl font-bold text-foreground duration-500 md:text-3xl">
              Hi, {active.name}!
            </h1>
            <p className="text-sm text-muted-foreground">Pick something to learn today.</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {profiles.length > 1 && (
            <Link
              to="/profiles"
              aria-label="Switch kid"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border"
            >
              <Users className="h-5 w-5 text-foreground" />
            </Link>
          )}
          <button
            onClick={() => update({ soundOn: !settings.soundOn })}
            aria-label={settings.soundOn ? "Sound on" : "Sound off"}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border"
          >
            {settings.soundOn ? (
              <Volume2 className="h-5 w-5 text-foreground" />
            ) : (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
          <Link
            to="/parent"
            aria-label="Parent mode"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border"
          >
            <SettingsIcon className="h-5 w-5 text-muted-foreground" />
          </Link>
        </div>
      </div>

      <Link
        to="/assessment"
        className="mx-auto mt-8 flex w-full max-w-5xl items-center justify-between gap-4 rounded-3xl p-5 shadow-sm ring-1 ring-border transition active:scale-[0.99]"
        style={{ background: "linear-gradient(135deg, var(--star) 0%, var(--english) 100%)" }}
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl">🏆</div>
          <div className="text-left">
            <div className="text-xl font-bold text-foreground md:text-2xl">Daily Practice</div>
            <div className="text-sm text-foreground/80">Mix of Math, Letters &amp; World</div>
          </div>
        </div>
        <div className="rounded-2xl bg-background/80 px-4 py-2 text-sm font-semibold text-foreground">Start →</div>
      </Link>

      <div className="mx-auto mt-6 grid w-full max-w-5xl flex-1 grid-cols-3 gap-3 sm:gap-6 md:gap-8">
        {subjects.map((s, i) => (
          <div
            key={s.key}
            className="animate-in fade-in slide-in-from-bottom-3 duration-500"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
          >
            <SubjectTile
              to={s.to}
              title={s.title}
              emoji={s.emoji}
              bg={s.bg}
              fg={s.fg}
              disabled={!settings.subjectsEnabled[s.key]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
