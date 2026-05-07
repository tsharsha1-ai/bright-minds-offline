import { createFileRoute } from "@tanstack/react-router";
import { GalleryLesson } from "@/components/GalleryLesson";

export const Route = createFileRoute("/evs/routines")({
  component: () => (
    <GalleryLesson
      lessonId="evs.routines"
      title="My Day"
      items={[
        { name: "Wake up", emoji: "🌞" },
        { name: "Brush teeth", emoji: "🪥" },
        { name: "Eat breakfast", emoji: "🥣" },
        { name: "Go to school", emoji: "🎒" },
        { name: "Play", emoji: "🧸" },
        { name: "Eat dinner", emoji: "🍽️" },
        { name: "Bath time", emoji: "🛁" },
        { name: "Sleep", emoji: "🛏️" },
      ]}
      speakHint={(it) => `Time to ${it.name.toLowerCase()}.`}
    />
  ),
});
