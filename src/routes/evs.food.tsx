import { createFileRoute } from "@tanstack/react-router";
import { GalleryLesson } from "@/components/GalleryLesson";

export const Route = createFileRoute("/evs/food")({
  component: () => (
    <GalleryLesson
      lessonId="evs.food"
      title="Food"
      items={[
        { name: "Apple", emoji: "🍎" },
        { name: "Banana", emoji: "🍌" },
        { name: "Bread", emoji: "🍞" },
        { name: "Rice", emoji: "🍚" },
        { name: "Milk", emoji: "🥛" },
        { name: "Egg", emoji: "🥚" },
        { name: "Carrot", emoji: "🥕" },
        { name: "Grapes", emoji: "🍇" },
      ]}
    />
  ),
});
