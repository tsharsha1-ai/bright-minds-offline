import { createFileRoute } from "@tanstack/react-router";
import { GalleryLesson } from "@/components/GalleryLesson";

export const Route = createFileRoute("/english/phonics/cvc-words")({
  component: () => (
    <GalleryLesson
      lessonId="en.phonics.cvc"
      title="CVC Words"
      items={[
        { name: "c-a-t — cat", emoji: "🐱" },
        { name: "d-o-g — dog", emoji: "🐶" },
        { name: "p-i-g — pig", emoji: "🐷" },
        { name: "h-e-n — hen", emoji: "🐔" },
        { name: "b-u-s — bus", emoji: "🚌" },
        { name: "s-u-n — sun", emoji: "☀️" },
        { name: "h-a-t — hat", emoji: "👒" },
        { name: "m-a-p — map", emoji: "🗺️" },
        { name: "c-u-p — cup", emoji: "☕" },
        { name: "b-e-d — bed", emoji: "🛏️" },
      ]}
      speakHint={(it) => {
        const [letters, word] = it.name.split(" — ");
        return `${letters.split("-").join(", ")}. ${word}`;
      }}
    />
  ),
});
