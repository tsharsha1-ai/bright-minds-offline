import { createFileRoute } from "@tanstack/react-router";
import { GalleryLesson } from "@/components/GalleryLesson";

export const Route = createFileRoute("/english/digraphs")({
  component: () => (
    <GalleryLesson
      lessonId="en.digraphs"
      title="Digraphs"
      items={[
        { name: "ch — Chair", emoji: "🪑" },
        { name: "sh — Ship", emoji: "🚢" },
        { name: "th — Thumb", emoji: "👍" },
        { name: "wh — Whale", emoji: "🐳" },
        { name: "ph — Phone", emoji: "📞" },
        { name: "ck — Duck", emoji: "🦆" },
        { name: "ng — Ring", emoji: "💍" },
        { name: "qu — Queen", emoji: "👸" },
      ]}
      speakHint={(it) => it.name.replace("—", "as in")}
    />
  ),
});
