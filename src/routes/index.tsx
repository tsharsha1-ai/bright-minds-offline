import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings as SettingsIcon, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { SubjectTile } from "@/components/learning";
import { useSettings } from "@/hooks/use-settings";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { settings, update } = useSettings();
  const subjects = [
    {
      key: "math" as const,
      to: "/math",
      title: "Numbers",
      emoji: "🔢",
      bg: "var(--math)",
      fg: "var(--math-foreground)",
    },
    {
      key: "english" as const,
      to: "/english",
      title: "Letters",
      emoji: "🔤",
      bg: "var(--english)",
      fg: "var(--english-foreground)",
    },
    {
      key: "evs" as const,
      to: "/evs",
      title: "World",
      emoji: "🌿",
      bg: "var(--evs)",
      fg: "var(--evs-foreground)",
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background px-4 py-6 md:px-10">
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground md:text-4xl"
        >
          Little Learners
        </motion.h1>

        <div className="flex items-center gap-2">
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

      <p className="mt-2 text-base text-muted-foreground md:text-lg">
        Pick something to learn today.
      </p>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
        className="mx-auto mt-10 grid w-full max-w-5xl flex-1 grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
      >
        {subjects.map((s) => (
          <motion.div
            key={s.key}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <SubjectTile
              to={s.to}
              title={s.title}
              emoji={s.emoji}
              bg={s.bg}
              fg={s.fg}
              disabled={!settings.subjectsEnabled[s.key]}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
