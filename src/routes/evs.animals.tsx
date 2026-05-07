import { createFileRoute } from "@tanstack/react-router";
import { GalleryLesson } from "@/components/GalleryLesson";

export const Route = createFileRoute("/evs/animals")({
  component: () => (
    <GalleryLesson
      lessonId="evs.animals"
      title="Animals"
      items={[
        { name: "Dog", emoji: "🐶", sound: "Woof woof." },
        { name: "Cat", emoji: "🐱", sound: "Meow." },
        { name: "Cow", emoji: "🐮", sound: "Moo." },
        { name: "Horse", emoji: "🐴", sound: "Neigh." },
        { name: "Lion", emoji: "🦁", sound: "Roar." },
        { name: "Elephant", emoji: "🐘" },
        { name: "Rabbit", emoji: "🐰" },
        { name: "Bird", emoji: "🐦", sound: "Tweet." },
        { name: "Fish", emoji: "🐟" },
        { name: "Frog", emoji: "🐸", sound: "Ribbit." },
      ]}
    />
  ),
});
