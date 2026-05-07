import { createFileRoute } from "@tanstack/react-router";
import { JollyGroup } from "@/components/JollyGroup";

export const Route = createFileRoute("/english/phonics/group-5")({
  component: () => (
    <JollyGroup
      lessonId="en.phonics.g5"
      groupNumber={5}
      sounds={[
        { letter: "z", word: "bee", emoji: "🐝", action: "Put arms out like a bee, saying zzzzzz." },
        { letter: "w", word: "wind", emoji: "💨", action: "Blow onto open hand as if wind, saying wh, wh, wh." },
        { letter: "ng", word: "strong", emoji: "💪", sound: "ng. strong.", action: "Show arm muscles, saying ng… ng… (be strong!)." },
        { letter: "v", word: "van", emoji: "🚐", action: "Pretend to drive a van, saying vvvvvv." },
        { letter: "oo", word: "cuckoo", emoji: "🕰️", sound: "oo. cuckoo.", action: "Move head back and forth like a cuckoo clock, saying u, oo, u, oo." },
        { letter: "OO", word: "moon", emoji: "🌙", sound: "long oo. moon.", action: "Move head back and forth, saying long oo, oo." },
      ]}
    />
  ),
});
