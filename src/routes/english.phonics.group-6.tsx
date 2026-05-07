import { createFileRoute } from "@tanstack/react-router";
import { JollyGroup } from "@/components/JollyGroup";

export const Route = createFileRoute("/english/phonics/group-6")({
  component: () => (
    <JollyGroup
      lessonId="en.phonics.g6"
      groupNumber={6}
      sounds={[
        { letter: "y", word: "yogurt", emoji: "🥣", action: "Pretend to eat a spoon of yogurt, saying y, y, y." },
        { letter: "x", word: "x-ray", emoji: "🩻", action: "Pretend to take an x-ray with a camera, saying ks, ks, ks." },
        { letter: "ch", word: "train", emoji: "🚂", sound: "ch. train.", action: "Move arms at sides like a train, saying ch, ch, ch." },
        { letter: "sh", word: "quiet", emoji: "🤫", sound: "sh. shh.", action: "Finger to lips, saying shhhh." },
        { letter: "th", word: "rude", emoji: "👅", sound: "soft th. this.", action: "Stick tongue out a little for soft th." },
        { letter: "TH", word: "thumb", emoji: "👍", sound: "loud th. thumb.", action: "Stick tongue out a little for loud th." },
      ]}
    />
  ),
});
