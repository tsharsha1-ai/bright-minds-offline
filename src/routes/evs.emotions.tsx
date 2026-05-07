import { createFileRoute } from "@tanstack/react-router";
import { GalleryLesson } from "@/components/GalleryLesson";

export const Route = createFileRoute("/evs/emotions")({
  component: () => (
    <GalleryLesson
      lessonId="evs.emotions"
      title="Feelings"
      items={[
        { name: "Happy", emoji: "😊" },
        { name: "Sad", emoji: "😢" },
        { name: "Calm", emoji: "🙂" },
        { name: "Tired", emoji: "😴" },
        { name: "Surprised", emoji: "😮" },
        { name: "Angry", emoji: "😠" },
        { name: "Loved", emoji: "🥰" },
      ]}
      speakHint={(it) => `I feel ${it.name.toLowerCase()}.`}
    />
  ),
});
