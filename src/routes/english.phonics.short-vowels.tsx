import { createFileRoute } from "@tanstack/react-router";
import { GalleryLesson } from "@/components/GalleryLesson";

export const Route = createFileRoute("/english/phonics/short-vowels")({
  component: () => (
    <GalleryLesson
      lessonId="en.phonics.short"
      title="Short Vowels"
      items={[
        { name: "short a — cat", emoji: "🐱" },
        { name: "short a — bat", emoji: "🦇" },
        { name: "short e — bed", emoji: "🛏️" },
        { name: "short e — hen", emoji: "🐔" },
        { name: "short i — pig", emoji: "🐷" },
        { name: "short i — fish", emoji: "🐟" },
        { name: "short o — dog", emoji: "🐶" },
        { name: "short o — pot", emoji: "🍯" },
        { name: "short u — sun", emoji: "☀️" },
        { name: "short u — bug", emoji: "🐛" },
      ]}
      speakHint={(it) => it.name.replace("—", "as in")}
    />
  ),
});
