// Tiny offline-safe wrapper around the Web Speech API.
// Falls back silently if unavailable.

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Prefer a calm English female voice if available
  const preferred =
    voices.find((v) => /en/i.test(v.lang) && /female|samantha|google.*us/i.test(v.name)) ||
    voices.find((v) => /en-US|en-GB/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0];
  cachedVoice = preferred ?? null;
  return cachedVoice;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  // Voices may load async
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickVoice();
  };
}

export function speak(text: string, opts?: { rate?: number; enabled?: boolean }) {
  if (typeof window === "undefined") return;
  if (opts?.enabled === false) return;
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = opts?.rate ?? 0.85;
    u.pitch = 1.05;
    u.volume = 1;
    const v = pickVoice();
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  } catch {
    // ignore
  }
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}
