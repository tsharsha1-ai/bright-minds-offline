import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Star } from "lucide-react";
import { speak } from "@/lib/tts";
import { useSettings } from "@/hooks/use-settings";

const PHRASES = ["You did it!", "Nice work!", "Wonderful!", "Great job!", "Yay!"];

export function Reward({
  show,
  message,
  onDone,
  duration = 1600,
}: {
  show: boolean;
  message?: string;
  onDone?: () => void;
  duration?: number;
}) {
  const { settings } = useSettings();
  const text = message ?? PHRASES[Math.floor(Math.random() * PHRASES.length)];

  useEffect(() => {
    if (!show) return;
    speak(text, { enabled: settings.soundOn, rate: settings.voiceRate });
    const t = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(t);
  }, [show, text, duration, onDone, settings.soundOn, settings.voiceRate]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.4, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
            className="relative"
          >
            <div className="flex h-44 w-44 items-center justify-center rounded-full bg-[var(--star)]/30 ring-8 ring-[var(--star)]/20">
              <Star className="h-24 w-24 fill-[var(--star)] text-[var(--star)]" strokeWidth={1.5} />
            </div>
          </motion.div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="relative mt-8 text-3xl font-semibold text-foreground"
          >
            {text}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
