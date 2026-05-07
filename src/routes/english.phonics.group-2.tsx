import { createFileRoute } from "@tanstack/react-router";
import { JollyGroup } from "@/components/JollyGroup";

export const Route = createFileRoute("/english/phonics/group-2")({
  component: () => (
    <JollyGroup
      lessonId="en.phonics.g2"
      groupNumber={2}
      sounds={[
        { letter: "ck", word: "castanets", emoji: "🥁", action: "Raise hands and snap fingers like castanets, saying ck, ck, ck." },
        { letter: "e", word: "egg", emoji: "🥚", action: "Pretend to crack an egg, saying e, e, e." },
        { letter: "h", word: "hop", emoji: "🐇", action: "Hold hand in front of mouth, panting, saying h, h, h." },
        { letter: "r", word: "puppy", emoji: "🐶", action: "Pretend to be a puppy holding a rag, shaking head and saying rrrrr." },
        { letter: "m", word: "yummy", emoji: "🍰", action: "Rub tummy, saying mmmmm." },
        { letter: "d", word: "drum", emoji: "🥁", action: "Beat hands up and down like a drum, saying d, d, d." },
      ]}
    />
  ),
});
