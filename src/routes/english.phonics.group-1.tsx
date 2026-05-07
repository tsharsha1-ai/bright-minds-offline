import { createFileRoute } from "@tanstack/react-router";
import { JollyGroup } from "@/components/JollyGroup";

export const Route = createFileRoute("/english/phonics/group-1")({
  component: () => (
    <JollyGroup
      lessonId="en.phonics.g1"
      groupNumber={1}
      sounds={[
        { letter: "s", word: "snake", emoji: "🐍", action: "Weave hand like a snake, saying ssssss." },
        { letter: "a", word: "ant", emoji: "🐜", action: "Wiggle fingers above elbow as if ants crawling, saying a, a, a." },
        { letter: "t", word: "tennis", emoji: "🎾", action: "Turn head side to side like watching tennis, saying t, t, t." },
        { letter: "i", word: "insect", emoji: "🦋", action: "Pretend to be an insect with wiggly fingers on nose, saying i, i, i." },
        { letter: "p", word: "puff", emoji: "🌬️", action: "Pretend to puff out candles, saying p, p, p." },
        { letter: "n", word: "plane", emoji: "✈️", action: "Make arms into airplane wings, saying nnnnn." },
      ]}
    />
  ),
});
