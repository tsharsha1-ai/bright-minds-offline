import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/learning";
import { SpeakButton } from "@/components/SpeakButton";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/english/speech/$type")({
  component: SpeechType,
});

type QA = { q: string; a: string; emoji: string };

const DATA: Record<string, { title: string; emoji: string; color: string; items: QA[] }> = {
  what: {
    title: "What questions",
    emoji: "❓",
    color: "var(--english)",
    items: [
      { q: "What is your name?", a: "My name is ___.", emoji: "🙋" },
      { q: "What color is the sky?", a: "The sky is blue.", emoji: "🌤️" },
      { q: "What do you eat for breakfast?", a: "I eat ___ for breakfast.", emoji: "🥣" },
      { q: "What is your favorite toy?", a: "My favorite toy is ___.", emoji: "🧸" },
      { q: "What sound does a cat make?", a: "A cat says meow.", emoji: "🐱" },
      { q: "What day is it today?", a: "Today is ___.", emoji: "📅" },
      { q: "What is in your bag?", a: "There is a ___ in my bag.", emoji: "🎒" },
      { q: "What do you wear when it rains?", a: "I wear a raincoat.", emoji: "🧥" },
      { q: "What do you read?", a: "I read a book.", emoji: "📖" },
      { q: "What is two plus two?", a: "Two plus two is four.", emoji: "➕" },
    ],
  },
  why: {
    title: "Why questions",
    emoji: "🤔",
    color: "var(--math)",
    items: [
      { q: "Why do we sleep?", a: "We sleep to rest our body.", emoji: "😴" },
      { q: "Why do we eat food?", a: "We eat to grow strong.", emoji: "🍎" },
      { q: "Why do we brush our teeth?", a: "To keep teeth clean and healthy.", emoji: "🪥" },
      { q: "Why do birds fly?", a: "Birds fly because they have wings.", emoji: "🐦" },
      { q: "Why do we wear shoes?", a: "To protect our feet.", emoji: "👟" },
      { q: "Why is the sun hot?", a: "Because it gives us heat and light.", emoji: "☀️" },
      { q: "Why do plants need water?", a: "So they can grow.", emoji: "🌱" },
      { q: "Why do we say please?", a: "To be polite.", emoji: "🙏" },
      { q: "Why do we wash hands?", a: "To stay clean and healthy.", emoji: "🧼" },
      { q: "Why do we go to school?", a: "To learn new things.", emoji: "🏫" },
    ],
  },
  who: {
    title: "Who questions",
    emoji: "🙋",
    color: "var(--evs)",
    items: [
      { q: "Who is your mom?", a: "My mom is ___.", emoji: "👩" },
      { q: "Who is your best friend?", a: "My best friend is ___.", emoji: "🤝" },
      { q: "Who teaches you?", a: "My teacher teaches me.", emoji: "👩‍🏫" },
      { q: "Who bakes bread?", a: "A baker bakes bread.", emoji: "🍞" },
      { q: "Who flies a plane?", a: "A pilot flies a plane.", emoji: "✈️" },
      { q: "Who helps when you are sick?", a: "A doctor helps me.", emoji: "👨‍⚕️" },
      { q: "Who delivers letters?", a: "A postman delivers letters.", emoji: "📬" },
      { q: "Who puts out fires?", a: "A firefighter does.", emoji: "🚒" },
      { q: "Who lives at the North Pole?", a: "Santa Claus does.", emoji: "🎅" },
      { q: "Who is the king of the jungle?", a: "The lion is.", emoji: "🦁" },
    ],
  },
  where: {
    title: "Where questions",
    emoji: "📍",
    color: "var(--star)",
    items: [
      { q: "Where do you live?", a: "I live in ___.", emoji: "🏠" },
      { q: "Where do fish live?", a: "Fish live in water.", emoji: "🐟" },
      { q: "Where does the sun rise?", a: "The sun rises in the east.", emoji: "🌅" },
      { q: "Where do we buy food?", a: "At the grocery store.", emoji: "🛒" },
      { q: "Where do birds build nests?", a: "On trees.", emoji: "🪺" },
      { q: "Where do you go to learn?", a: "I go to school.", emoji: "🏫" },
      { q: "Where do you sleep?", a: "I sleep in my bed.", emoji: "🛏️" },
      { q: "Where do cars drive?", a: "On the road.", emoji: "🚗" },
      { q: "Where do clouds float?", a: "In the sky.", emoji: "☁️" },
      { q: "Where do we keep books?", a: "On a shelf.", emoji: "📚" },
    ],
  },
  which: {
    title: "Which questions",
    emoji: "👉",
    color: "var(--english)",
    items: [
      { q: "Which fruit is yellow?", a: "A banana is yellow.", emoji: "🍌" },
      { q: "Which animal says moo?", a: "A cow says moo.", emoji: "🐄" },
      { q: "Which season is hot?", a: "Summer is hot.", emoji: "🌞" },
      { q: "Which is bigger, cat or elephant?", a: "An elephant is bigger.", emoji: "🐘" },
      { q: "Which color do you like?", a: "I like ___.", emoji: "🎨" },
      { q: "Which shape has 3 sides?", a: "A triangle.", emoji: "🔺" },
      { q: "Which is faster, tortoise or hare?", a: "A hare is faster.", emoji: "🐇" },
      { q: "Which day comes after Monday?", a: "Tuesday.", emoji: "📅" },
      { q: "Which fruit is red and round?", a: "An apple.", emoji: "🍎" },
      { q: "Which body part do you see with?", a: "My eyes.", emoji: "👀" },
    ],
  },
  how: {
    title: "How questions",
    emoji: "🛠️",
    color: "var(--math)",
    items: [
      { q: "How are you?", a: "I am fine, thank you.", emoji: "😊" },
      { q: "How old are you?", a: "I am ___ years old.", emoji: "🎂" },
      { q: "How do you go to school?", a: "I go by bus / car / walk.", emoji: "🚌" },
      { q: "How many fingers do you have?", a: "I have ten fingers.", emoji: "🖐️" },
      { q: "How does a bird fly?", a: "It uses its wings.", emoji: "🐦" },
      { q: "How do you brush your teeth?", a: "With a brush and paste.", emoji: "🪥" },
      { q: "How does ice form?", a: "Water freezes when it is cold.", emoji: "🧊" },
      { q: "How do plants drink?", a: "Through their roots.", emoji: "🌱" },
      { q: "How do you say hello?", a: "Hi! Hello!", emoji: "👋" },
      { q: "How do you cross the road?", a: "I look both ways carefully.", emoji: "🚸" },
    ],
  },
  when: {
    title: "When questions",
    emoji: "⏰",
    color: "var(--evs)",
    items: [
      { q: "When do we sleep?", a: "We sleep at night.", emoji: "🌙" },
      { q: "When do we eat breakfast?", a: "In the morning.", emoji: "🍳" },
      { q: "When do we see stars?", a: "At night.", emoji: "⭐" },
      { q: "When is your birthday?", a: "My birthday is in ___.", emoji: "🎂" },
      { q: "When does the sun rise?", a: "In the morning.", emoji: "🌅" },
      { q: "When do flowers bloom?", a: "In spring.", emoji: "🌸" },
      { q: "When do we use an umbrella?", a: "When it rains.", emoji: "☔" },
      { q: "When is it dark?", a: "At night.", emoji: "🌌" },
      { q: "When do we say good night?", a: "Before going to bed.", emoji: "😴" },
      { q: "When do leaves fall?", a: "In autumn.", emoji: "🍂" },
    ],
  },
};

function SpeechType() {
  const { type } = useParams({ from: "/english/speech/$type" });
  const data = DATA[type];
  const { mark } = useProgress();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (data) mark(`en.speech.${type}`, "visited");
  }, [data, mark, type]);

  if (!data) {
    return (
      <>
        <TopBar title="Speech" />
        <PageShell>
          <p className="mt-10 text-center text-muted-foreground">Unknown question type.</p>
          <div className="mt-4 text-center">
            <Link to="/english/speech" className="rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
              Back
            </Link>
          </div>
        </PageShell>
      </>
    );
  }

  const it = data.items[i];

  return (
    <>
      <TopBar title={data.title} />
      <PageShell>
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-4 flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl p-6 shadow ring-1 ring-border sm:p-10"
          style={{ backgroundColor: data.color }}
        >
          <div className="text-7xl sm:text-8xl">{it.emoji}</div>
          <div className="flex items-center gap-3 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{it.q}</h2>
            <SpeakButton text={it.q} />
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-background/70 px-4 py-3 text-center">
            <p className="text-lg font-semibold text-foreground sm:text-xl">{it.a}</p>
            <SpeakButton text={it.a} />
          </div>
        </motion.div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => setI((p) => (p - 1 + data.items.length) % data.items.length)}
            className="rounded-2xl bg-card px-5 py-3 text-lg font-semibold ring-1 ring-border"
          >
            Back
          </button>
          <div className="flex items-center px-3 text-sm font-semibold text-muted-foreground">
            {i + 1} / {data.items.length}
          </div>
          <button
            onClick={() => {
              if (i === data.items.length - 1) mark(`en.speech.${type}`, "practiced");
              setI((p) => (p + 1) % data.items.length);
            }}
            className="rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground"
          >
            Next
          </button>
        </div>

        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
          {data.items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className="h-9 w-9 rounded-full text-sm font-bold ring-1 ring-border"
              style={{ backgroundColor: i === idx ? data.color : "var(--card)" }}
              aria-label={`Question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </PageShell>
    </>
  );
}
