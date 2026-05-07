import { useSettings } from "@/hooks/use-settings";
import { speak } from "@/lib/tts";
import { Volume2 } from "lucide-react";

export function SpeakButton({ text, label }: { text: string; label?: string }) {
  const { settings } = useSettings();
  return (
    <button
      onClick={() => speak(text, { enabled: settings.soundOn, rate: settings.voiceRate })}
      aria-label={label ?? `Hear: ${text}`}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-card shadow ring-1 ring-border active:scale-95"
    >
      <Volume2 className="h-5 w-5 text-primary" />
    </button>
  );
}
