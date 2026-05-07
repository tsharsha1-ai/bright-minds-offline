import { createFileRoute } from "@tanstack/react-router";
import { GalleryLesson } from "@/components/GalleryLesson";

export const Route = createFileRoute("/evs/family")({
  component: () => (
    <GalleryLesson
      lessonId="evs.family"
      title="Family"
      items={[
        { name: "Mother", emoji: "👩" },
        { name: "Father", emoji: "👨" },
        { name: "Sister", emoji: "👧" },
        { name: "Brother", emoji: "👦" },
        { name: "Grandma", emoji: "👵" },
        { name: "Grandpa", emoji: "👴" },
        { name: "Baby", emoji: "👶" },
      ]}
    />
  ),
});
