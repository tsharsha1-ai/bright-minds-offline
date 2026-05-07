import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { useSettings } from "@/hooks/use-settings";
import { useProgress } from "@/hooks/use-progress";

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
  const { progress, reset: resetProgress } = useProgress();

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
            onClick={() => { if (confirm("Reset progress?")) resetProgress(); }}
            className="rounded-xl bg-card px-4 py-2 text-foreground ring-1 ring-border"
          >
            Reset progress
          </button>
          <button
            onClick={() => { if (confirm("Reset all settings?")) resetSettings(); }}
            className="rounded-xl bg-card px-4 py-2 text-foreground ring-1 ring-border"
          >
            Reset settings
          </button>
        </div>
      </Card>

      <div className="md:col-span-2">
        <Card title="Progress">
          <div className="grid gap-4 md:grid-cols-3">
            {sections.map((sec) => (
              <div key={sec.title}>
                <h4 className="mb-2 text-sm font-semibold text-muted-foreground">{sec.title}</h4>
                <ul className="space-y-2">
                  {sec.lessons.map((l) => {
                    const status = progress.lessons[l.id];
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
