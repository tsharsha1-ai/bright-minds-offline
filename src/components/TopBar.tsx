import { Link, useRouter } from "@tanstack/react-router";
import { Home, ChevronLeft, Volume2, VolumeX } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { stopSpeaking } from "@/lib/tts";

export function TopBar({ title, hideBack = false }: { title?: string; hideBack?: boolean }) {
  const router = useRouter();
  const { settings, update } = useSettings();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-background/85 px-4 py-3 backdrop-blur md:px-6">
      <Link
        to="/"
        onClick={() => stopSpeaking()}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border transition-transform active:scale-95"
        aria-label="Home"
      >
        <Home className="h-7 w-7 text-primary" strokeWidth={2.4} />
      </Link>

      {title ? (
        <h1 className="truncate text-center text-xl font-semibold text-foreground md:text-2xl">
          {title}
        </h1>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            stopSpeaking();
            update({ soundOn: !settings.soundOn });
          }}
          aria-label={settings.soundOn ? "Turn sound off" : "Turn sound on"}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border transition-transform active:scale-95"
        >
          {settings.soundOn ? (
            <Volume2 className="h-6 w-6 text-foreground" strokeWidth={2.2} />
          ) : (
            <VolumeX className="h-6 w-6 text-muted-foreground" strokeWidth={2.2} />
          )}
        </button>

        {!hideBack && (
          <button
            onClick={() => {
              stopSpeaking();
              router.history.back();
            }}
            aria-label="Back"
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border transition-transform active:scale-95"
          >
            <ChevronLeft className="h-7 w-7 text-foreground" strokeWidth={2.4} />
          </button>
        )}
      </div>
    </header>
  );
}
