import { createFileRoute } from "@tanstack/react-router";
import { GalleryLesson } from "@/components/GalleryLesson";

export const Route = createFileRoute("/evs/plants")({
  component: () => (
    <GalleryLesson
      lessonId="evs.plants"
      title="Plants"
      items={[
        { name: "Tree", emoji: "🌳" },
        { name: "Flower", emoji: "🌸" },
        { name: "Leaf", emoji: "🍃" },
        { name: "Cactus", emoji: "🌵" },
        { name: "Sunflower", emoji: "🌻" },
        { name: "Mushroom", emoji: "🍄" },
        { name: "Sapling", emoji: "🌱" },
        { name: "Palm", emoji: "🌴" },
      ]}
    />
  ),
});
