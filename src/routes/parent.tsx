import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { useSettings } from "@/hooks/use-settings";
import { useProgress, getProgressFor } from "@/hooks/use-progress";
import { useProfiles } from "@/hooks/use-profiles";

export const Route = createFileRoute("/parent")({
  component: ParentPage,
});

function ParentPage() {
  const [unlocked, setUnlocked] = useState(false);
  return (
    <>
      <TopBar title="Parent Mode" />
      <PageShell>
        {!unlocked ? <Gate onPass={() => setUnlocked(true)} /> : <Dashboard />}
      </PageShell>
    </>
  );
}

function Gate({ onPass }: { onPass: () => void }) {
  // Simple logic question, randomized
  const [q] = useState(() => {
    const a = 5 + Math.floor(Math.random() * 5);
    const b = 1 + Math.floor(Math.random() * 4);
    return { a, b };
  });
  const correct = q.a > q.b ? q.a : q.b;
  const choices = [q.a, q.b].sort(() => Math.random() - 0.5);

  return (
    <div className="mx-auto mt-12 max-w-md rounded-3xl bg-card p-8 text-center shadow ring-1 ring-border">
      <h2 className="text-xl font-semibold text-foreground">Parent check</h2>
      <p className="mt-2 text-muted-foreground">Tap the bigger number:</p>
      <div className="mt-6 flex justify-center gap-4">
        {choices.map((n) => (
          <button
            key={n}
            onClick={() => n === correct && onPass()}
            className="h-24 w-24 rounded-3xl bg-[var(--math)] text-4xl font-bold text-[var(--math-foreground)] shadow"
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const { settings, update, reset: resetSettings } = useSettings();
  const { reset: resetProgress } = useProgress();
  const { profiles, active, setActive, removeProfile } = useProfiles();

  const sections: { title: string; lessons: { id: string; label: string }[] }[] = [
    {
      title: "Math",
      lessons: [
        { id: "math.numbers", label: "Numbers 1–100" },
        { id: "math.counting", label: "Counting" },
        { id: "math.addsub", label: "Add & Subtract" },
        { id: "math.shapes", label: "Shapes" },
        { id: "math.compare", label: "Compare > < =" },
      ],
    },
    {
      title: "English",
      lessons: [
        { id: "en.alphabet", label: "Alphabet" },
        { id: "en.phonics", label: "Phonics" },
        { id: "en.tracing", label: "Tracing" },
        { id: "en.sight", label: "Sight Words" },
        { id: "en.sentences", label: "Picture Words" },
      ],
    },
    {
      title: "World",
      lessons: [
        { id: "evs.animals", label: "Animals" },
        { id: "evs.food", label: "Food" },
        { id: "evs.family", label: "Family" },
        { id: "evs.emotions", label: "Feelings" },
        { id: "evs.routines", label: "My Day" },
        { id: "evs.body", label: "My Body" },
      ],
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card title="Subjects">
        {(["math", "english", "evs"] as const).map((k) => (
          <Toggle
            key={k}
            label={k === "math" ? "Numbers" : k === "english" ? "Letters" : "World"}
            value={settings.subjectsEnabled[k]}
            onChange={(v) => update({ subjectsEnabled: { ...settings.subjectsEnabled, [k]: v } })}
          />
        ))}
      </Card>

      <Card title="Sound & Voice">
        <Toggle label="Sound on" value={settings.soundOn} onChange={(v) => update({ soundOn: v })} />
        <div className="mt-3">
          <label className="text-sm text-muted-foreground">Voice speed: {settings.voiceRate.toFixed(2)}</label>
          <input
            type="range"
            min={0.6}
            max={1.2}
            step={0.05}
            value={settings.voiceRate}
            onChange={(e) => update({ voiceRate: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      </Card>

      <Card title="Display">
        <Toggle label="Large text" value={settings.largeFont} onChange={(v) => update({ largeFont: v })} />
        <Toggle label="Dyslexia-friendly font" value={settings.dyslexicFont} onChange={(v) => update({ dyslexicFont: v })} />
        <Toggle label="High contrast" value={settings.highContrast} onChange={(v) => update({ highContrast: v })} />
      </Card>

      <Card title="Daily limit">
        <div className="flex flex-wrap gap-2">
          {[0, 15, 30, 45, 60].map((m) => (
            <button
              key={m}
              onClick={() => update({ dailyLimitMin: m as 0 | 15 | 30 | 45 | 60 })}
              className="rounded-xl px-4 py-2 ring-1 ring-border"
              style={{
                backgroundColor: settings.dailyLimitMin === m ? "var(--primary)" : "var(--card)",
                color: settings.dailyLimitMin === m ? "var(--primary-foreground)" : "var(--foreground)",
              }}
            >
              {m === 0 ? "Off" : `${m}m`}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Difficulty">
        <div className="flex gap-2">
          {(["gentle", "standard"] as const).map((d) => (
            <button
              key={d}
              onClick={() => update({ difficulty: d })}
              className="rounded-xl px-4 py-2 ring-1 ring-border capitalize"
              style={{
                backgroundColor: settings.difficulty === d ? "var(--primary)" : "var(--card)",
                color: settings.difficulty === d ? "var(--primary-foreground)" : "var(--foreground)",
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Reset">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { if (confirm(`Reset progress for ${active?.name ?? "this kid"}?`)) resetProgress(); }}
            className="rounded-xl bg-card px-4 py-2 text-foreground ring-1 ring-border"
          >
            Reset {active?.name ?? "kid"}'s progress
          </button>
          <button
            onClick={() => { if (confirm("Reset all settings?")) resetSettings(); }}
            className="rounded-xl bg-card px-4 py-2 text-foreground ring-1 ring-border"
          >
            Reset settings
          </button>
        </div>
      </Card>

      <Card title="Kids">
        {profiles.length === 0 ? (
          <p className="text-sm text-muted-foreground">No kid profiles yet.</p>
        ) : (
          <ul className="space-y-2">
            {profiles.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-background p-2 ring-1 ring-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xl" style={{ backgroundColor: p.color }}>
                  {p.emoji}
                </div>
                <span className="font-medium text-foreground">{p.name}</span>
                {active?.id === p.id && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">active</span>
                )}
                <div className="ml-auto flex gap-2">
                  {active?.id !== p.id && (
                    <button onClick={() => setActive(p.id)} className="rounded-xl px-3 py-1 text-sm ring-1 ring-border">
                      Switch
                    </button>
                  )}
                  <button
                    onClick={() => { if (confirm(`Remove ${p.name}? Their progress will be deleted.`)) removeProfile(p.id); }}
                    className="rounded-xl px-3 py-1 text-sm text-destructive ring-1 ring-border"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="md:col-span-2">
        <Card title="Progress by kid">
          {profiles.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add a kid profile to track progress.</p>
          ) : (
            <div className="space-y-6">
              {profiles.map((p) => {
                const kidProgress = getProgressFor(p.id);
                return (
                  <div key={p.id}>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg text-base" style={{ backgroundColor: p.color }}>
                        {p.emoji}
                      </div>
                      <h4 className="text-base font-semibold text-foreground">{p.name}</h4>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      {sections.map((sec) => (
                        <div key={sec.title}>
                          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{sec.title}</h5>
                          <ul className="space-y-1.5">
                            {sec.lessons.map((l) => {
                              const status = kidProgress.lessons[l.id];
                              const color =
                                status === "mastered"
                                  ? "var(--star)"
                                  : status === "practiced"
                                    ? "var(--evs)"
                                    : status === "visited"
                                      ? "var(--primary)"
                                      : "var(--border)";
                              return (
                                <li key={l.id} className="flex items-center gap-2">
                                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                                  <span className="text-sm text-foreground">{l.label}</span>
                                  <span className="ml-auto text-xs capitalize text-muted-foreground">{status ?? "—"}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Dots show exposure, not scores. Blue = visited · Green = practiced · Gold = mastered.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-2">
      <span className="text-foreground">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className="relative h-7 w-12 rounded-full transition-colors"
        style={{ backgroundColor: value ? "var(--primary)" : "var(--border)" }}
        aria-pressed={value}
      >
        <span
          className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all"
          style={{ left: value ? "1.5rem" : "0.125rem" }}
        />
      </button>
    </label>
  );
}
