import { createFileRoute } from "@tanstack/react-router";
import { JollyGroup } from "@/components/JollyGroup";

export const Route = createFileRoute("/english/phonics/group-7")({
  component: () => (
    <JollyGroup
      lessonId="en.phonics.g7"
      groupNumber={7}
      sounds={[
        { letter: "qu", word: "duck", emoji: "🦆", sound: "qu. duck.", action: "Make a duck beak with hands, saying qu, qu, qu." },
        { letter: "ou", word: "ouch", emoji: "🤕", sound: "ou. ouch.", action: "Pretend a finger hurts, shaking it and saying ou, ou, ou!" },
        { letter: "oi", word: "boy", emoji: "👦", sound: "oi. boy.", action: "Cup hands to mouth and shout oi! to get attention." },
        { letter: "ue", word: "cue", emoji: "🎱", sound: "ue. cue.", action: "Point to people with thumbs up, saying you, you, you." },
        { letter: "er", word: "mixer", emoji: "🍳", sound: "er. mixer.", action: "Roll hands like a mixer, saying erererer." },
        { letter: "ar", word: "pirate", emoji: "🏴‍☠️", sound: "ar. arr.", action: "Open mouth wide for the doctor, saying aaah… ar!" },
      ]}
    />
  ),
});
