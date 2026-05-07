import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { PageShell, LevelTabs, type Level } from "@/components/learning";
import { OnlineLesson } from "@/components/OnlineLesson";

const TITLES: Record<string, string> = {
  "math.counting": "Counting",
  "math.numbers": "Numbers",
  "math.addsub": "Add & Subtract",
  "math.compare": "Bigger / Smaller",
  "math.shapes": "Shapes",
  "math.place-value": "Tens & Ones",
  "math.times-tables": "Times Tables",
  "english.alphabet": "A to Z",
  "english.phonics": "Phonics",
  "english.sight-words": "Sight Words",
  "english.digraphs": "Digraphs",
  "english.spelling": "Spelling",
  "english.speech": "WH Questions",
  "evs.animals": "Animals",
  "evs.food": "Food",
  "evs.body": "My Body",
  "evs.family": "Family",
  "evs.plants": "Plants",
  "evs.weather": "Weather",
};

export const Route = createFileRoute("/online/$module")({
  component: OnlineModule,
});

function OnlineModule() {
  const { module } = useParams({ from: "/online/$module" });
  const [level, setLevel] = useState<Level>("beginner");
  const title = TITLES[module];

  if (!title) {
    return (
      <>
        <TopBar title="Online" />
        <PageShell>
          <p className="mt-10 text-center text-muted-foreground">Unknown module.</p>
          <div className="mt-4 text-center">
            <Link to="/" className="rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
              Home
            </Link>
          </div>
        </PageShell>
      </>
    );
  }

  return (
    <>
      <TopBar title={title} />
      <PageShell>
        <LevelTabs value={level} onChange={setLevel} />
        <OnlineLesson module={module} level={level} title={title} />
      </PageShell>
    </>
  );
}
