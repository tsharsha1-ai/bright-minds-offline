import { createFileRoute } from "@tanstack/react-router";
import { GalleryLesson } from "@/components/GalleryLesson";

export const Route = createFileRoute("/english/phonics/long-vowels")({
  component: () => (
    <GalleryLesson
      lessonId="en.phonics.long"
      title="Long Vowels"
      items={[
        { name: "long a — cake", emoji: "🍰" },
        { name: "long a — rain", emoji: "🌧️" },
        { name: "long e — bee", emoji: "🐝" },
        { name: "long e — leaf", emoji: "🍃" },
        { name: "long i — kite", emoji: "🪁" },
        { name: "long i — bike", emoji: "🚲" },
        { name: "long o — boat", emoji: "⛵" },
        { name: "long o — rose", emoji: "🌹" },
        { name: "long u — cube", emoji: "🧊" },
        { name: "long u — flute", emoji: "🪈" },
      ]}
      speakHint={(it) => it.name.replace("—", "as in")}
    />
  ),
});
