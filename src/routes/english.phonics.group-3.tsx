import { createFileRoute } from "@tanstack/react-router";
import { JollyGroup } from "@/components/JollyGroup";

export const Route = createFileRoute("/english/phonics/group-3")({
  component: () => (
    <JollyGroup
      lessonId="en.phonics.g3"
      groupNumber={3}
      sounds={[
        { letter: "g", word: "water", emoji: "💧", action: "Spiral hand down like water down the drain, saying g, g, g." },
        { letter: "o", word: "light", emoji: "💡", action: "Pretend to turn a light on and off, saying o, o, o." },
        { letter: "u", word: "umbrella", emoji: "☂️", action: "Pretend to put up an umbrella, saying u, u, u." },
        { letter: "l", word: "lollipop", emoji: "🍭", action: "Pretend to lick a lollipop, saying llllll." },
        { letter: "f", word: "fish", emoji: "🐠", action: "Put hands together like a fish, saying ffffff." },
        { letter: "b", word: "ball", emoji: "⚾", action: "Pretend to bounce a ball, saying b, b, b." },
      ]}
    />
  ),
});
