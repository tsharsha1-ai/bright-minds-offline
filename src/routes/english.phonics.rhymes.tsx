import { createFileRoute } from "@tanstack/react-router";
import { GalleryLesson } from "@/components/GalleryLesson";

export const Route = createFileRoute("/english/phonics/rhymes")({
  component: () => (
    <GalleryLesson
      lessonId="en.phonics.rhymes"
      title="Rhyming Words"
      items={[
        { name: "cat • bat • hat", emoji: "🐱" },
        { name: "dog • log • frog", emoji: "🐶" },
        { name: "sun • run • bun", emoji: "☀️" },
        { name: "star • car • jar", emoji: "⭐" },
        { name: "bee • tree • knee", emoji: "🐝" },
        { name: "moon • spoon • balloon", emoji: "🌙" },
        { name: "cake • lake • snake", emoji: "🍰" },
        { name: "boat • coat • goat", emoji: "⛵" },
      ]}
      speakHint={(it) => it.name.replace(/•/g, ",")}
    />
  ),
});
