import { createFileRoute } from "@tanstack/react-router";
import { JollyGroup } from "@/components/JollyGroup";

export const Route = createFileRoute("/english/phonics/group-4")({
  component: () => (
    <JollyGroup
      lessonId="en.phonics.g4"
      groupNumber={4}
      sounds={[
        { letter: "ai", word: "snail", emoji: "🐌", sound: "ai. snail.", action: "Cup hand over ear, saying ai, ai (what did you say?)." },
        { letter: "j", word: "jelly", emoji: "🍮", action: "Pretend to wobble like jelly, saying j, j, j." },
        { letter: "oa", word: "boat", emoji: "⛵", sound: "oa. boat.", action: "Bring hand to mouth as if surprised, saying oh!" },
        { letter: "ie", word: "tie", emoji: "👔", sound: "ie. tie.", action: "Stand to attention and salute, saying ie, ie (yes, sir!)." },
        { letter: "ee", word: "bee", emoji: "🐝", sound: "ee. bee.", action: "Hands on head like donkey ears, saying ee-aw." },
        { letter: "or", word: "horse", emoji: "🐴", sound: "or. horse.", action: "Pretend to lift weights, grunting or, or, or." },
      ]}
    />
  ),
});
