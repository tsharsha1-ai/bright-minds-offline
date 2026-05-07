import { createFileRoute } from "@tanstack/react-router";
import { GalleryLesson } from "@/components/GalleryLesson";

export const Route = createFileRoute("/english/phonics/blends")({
  component: () => (
    <GalleryLesson
      lessonId="en.phonics.blends"
      title="Blends"
      items={[
        { name: "bl — block", emoji: "🧱" },
        { name: "cl — clock", emoji: "⏰" },
        { name: "fl — flag", emoji: "🚩" },
        { name: "gl — glass", emoji: "🥛" },
        { name: "pl — plant", emoji: "🪴" },
        { name: "sl — slide", emoji: "🛝" },
        { name: "br — bread", emoji: "🍞" },
        { name: "cr — crab", emoji: "🦀" },
        { name: "dr — drum", emoji: "🥁" },
        { name: "fr — frog", emoji: "🐸" },
        { name: "gr — grapes", emoji: "🍇" },
        { name: "tr — train", emoji: "🚆" },
        { name: "sn — snake", emoji: "🐍" },
        { name: "st — star", emoji: "⭐" },
        { name: "sw — swing", emoji: "🛝" },
      ]}
      speakHint={(it) => it.name.replace("—", "as in")}
    />
  ),
});
