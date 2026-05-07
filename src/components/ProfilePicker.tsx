import { useState } from "react";
import { useProfiles, PROFILE_COLORS, PROFILE_EMOJIS } from "@/hooks/use-profiles";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

/**
 * Full-screen kid profile picker shown on Home when no profile is active,
 * and reusable on /profiles for switching.
 */
export function ProfilePicker({ allowBack = false }: { allowBack?: boolean }) {
  const { profiles, setActive, addProfile, removeProfile } = useProfiles();
  const [creating, setCreating] = useState(profiles.length === 0);

  return (
    <div className="relative flex min-h-screen flex-col bg-background px-4 py-6 md:px-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {allowBack && (
            <Link
              to="/"
              aria-label="Back"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Who's learning?</h1>
            <p className="text-sm text-muted-foreground">Tap your picture to start.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 grid w-full max-w-5xl grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {profiles.map((p) => (
          <div key={p.id} className="relative">
            <button
              onClick={() => setActive(p.id)}
              className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-[2rem] p-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5 transition-transform active:scale-[0.96]"
              style={{ backgroundColor: p.color }}
            >
              <div className="text-[5rem] leading-none">{p.emoji}</div>
              <div className="text-xl font-semibold text-foreground">{p.name}</div>
            </button>
            <button
              onClick={() => {
                if (confirm(`Remove ${p.name}? Their progress will be deleted.`)) removeProfile(p.id);
              }}
              aria-label={`Remove ${p.name}`}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-sm ring-1 ring-border opacity-0 transition-opacity hover:opacity-100 focus:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          onClick={() => setCreating(true)}
          className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-[2rem] border-2 border-dashed border-border bg-card/50 p-4 text-muted-foreground transition-colors hover:bg-card"
        >
          <Plus className="h-12 w-12" />
          <div className="text-lg font-semibold">Add kid</div>
        </button>
      </div>

      {creating && (
        <NewProfileDialog
          onCancel={() => setCreating(false)}
          onCreate={(p) => {
            const created = addProfile(p);
            setActive(created.id);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function NewProfileDialog({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (p: { name: string; emoji: string; color: string }) => void;
}) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(PROFILE_EMOJIS[Math.floor(Math.random() * PROFILE_EMOJIS.length)]);
  const [color, setColor] = useState(PROFILE_COLORS[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl ring-1 ring-border">
        <h2 className="text-xl font-semibold text-foreground">New kid</h2>

        <div className="mt-4">
          <label className="text-sm text-muted-foreground">Name</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 20))}
            placeholder="e.g. Mia"
            className="mt-1 w-full rounded-2xl bg-background px-4 py-3 text-lg text-foreground ring-1 ring-border outline-none focus:ring-primary"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm text-muted-foreground">Pick a buddy</label>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {PROFILE_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ring-1 ring-border"
                style={{ backgroundColor: emoji === e ? color : "var(--background)" }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-muted-foreground">Pick a color</label>
          <div className="mt-2 flex gap-2">
            {PROFILE_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
                className="h-10 w-10 rounded-full ring-2"
                style={{ backgroundColor: c, borderColor: "var(--border)", outline: color === c ? "3px solid var(--foreground)" : "none", outlineOffset: 2 }}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-2xl bg-background px-5 py-3 text-foreground ring-1 ring-border"
          >
            Cancel
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => onCreate({ name: name.trim(), emoji, color })}
            className="rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
