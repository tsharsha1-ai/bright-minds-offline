import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function getAdmin() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Universal item schema — every online module returns items in this shape.
// Renderer picks UI based on `kind`.
//   - "mcq"      : prompt + options (one with correct: true)
//   - "flashcard": prompt + answer (tap to reveal)
//   - "speak"    : question + sample answer (speech practice)
const ItemSchema = z.object({
  kind: z.enum(["mcq", "flashcard", "speak"]),
  prompt: z.string(),
  speak: z.string().optional(),
  emoji: z.string().optional(),
  answer: z.string().optional(),
  options: z
    .array(z.object({ label: z.string(), correct: z.boolean().optional() }))
    .optional(),
});

const PayloadSchema = z.object({
  title: z.string(),
  items: z.array(ItemSchema).min(3).max(20),
});

export type ContentItem = z.infer<typeof ItemSchema>;
export type ContentPayload = z.infer<typeof PayloadSchema>;

// Module catalog — describes how to ask the AI for each kind of lesson.
const MODULES: Record<
  string,
  { title: string; defaultKind: "mcq" | "flashcard" | "speak"; topic: string }
> = {
  // Math
  "math.counting": { title: "Counting", defaultKind: "mcq", topic: "counting objects 1-20 with emoji visuals" },
  "math.numbers": { title: "Numbers", defaultKind: "flashcard", topic: "recognising number names 1-50" },
  "math.addsub": { title: "Add & Subtract", defaultKind: "mcq", topic: "single digit addition and subtraction" },
  "math.compare": { title: "Bigger / Smaller", defaultKind: "mcq", topic: "comparing two numbers up to 20" },
  "math.shapes": { title: "Shapes", defaultKind: "mcq", topic: "naming basic 2D shapes (circle, square, triangle, rectangle, star, oval)" },
  "math.place-value": { title: "Tens & Ones", defaultKind: "mcq", topic: "place value of two digit numbers" },
  "math.times-tables": { title: "Times Tables", defaultKind: "mcq", topic: "easy multiplication facts up to 5x5" },
  // English
  "english.alphabet": { title: "A to Z", defaultKind: "flashcard", topic: "uppercase letter and a word that begins with it" },
  "english.phonics": { title: "Phonics", defaultKind: "mcq", topic: "Jolly Phonics letter sounds — choose the word that starts with the given sound" },
  "english.sight-words": { title: "Sight Words", defaultKind: "flashcard", topic: "common Dolch sight words for grade 1" },
  "english.digraphs": { title: "Digraphs", defaultKind: "mcq", topic: "digraphs sh, ch, th, ph — choose the word containing the digraph" },
  "english.spelling": { title: "Spelling", defaultKind: "mcq", topic: "simple CVC and short word spelling — pick the correct spelling" },
  "english.speech": { title: "WH Questions", defaultKind: "speak", topic: "what / why / who / where / when / how questions for kids" },
  // World
  "evs.animals": { title: "Animals", defaultKind: "flashcard", topic: "common animals with the sound they make" },
  "evs.food": { title: "Food", defaultKind: "mcq", topic: "healthy food vs junk food, fruits, vegetables" },
  "evs.body": { title: "My Body", defaultKind: "flashcard", topic: "body parts and their function" },
  "evs.family": { title: "Family", defaultKind: "flashcard", topic: "family members (mom, dad, brother, sister, grandparents)" },
  "evs.plants": { title: "Plants", defaultKind: "mcq", topic: "parts of a plant and what plants need" },
  "evs.weather": { title: "Weather", defaultKind: "mcq", topic: "weather types and what to wear" },
};

export const listModules = createServerFn({ method: "GET" }).handler(async () => {
  return Object.entries(MODULES).map(([id, m]) => ({
    id,
    title: m.title,
    subject: id.split(".")[0] as "math" | "english" | "evs",
  }));
});

const FetchInput = z.object({
  module: z.string().min(1).max(64),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  fresh: z.boolean().optional().default(false),
});

export const fetchContent = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => FetchInput.parse(d))
  .handler(async ({ data }) => {
    const cfg = MODULES[data.module];
    if (!cfg) throw new Error(`Unknown module: ${data.module}`);

    // 1. Try cache — pick a random recent variant for variety
    const supabaseAdmin = getAdmin();
    if (!data.fresh) {
      const { data: rows } = await supabaseAdmin
        .from("content_cache")
        .select("payload")
        .eq("module", data.module)
        .eq("level", data.level)
        .order("created_at", { ascending: false })
        .limit(8);

      if (rows && rows.length > 0) {
        const pick = rows[Math.floor(Math.random() * rows.length)];
        return PayloadSchema.parse(pick.payload);
      }
    }

    // 2. Generate via Lovable AI
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const sys = `You generate playful, age-appropriate learning content for Grade 1 children (5-7 years old).
Output STRICT JSON only, no markdown, no comments. Schema:
{ "title": string, "items": Array<{
  "kind": "mcq" | "flashcard" | "speak",
  "prompt": string,        // the question or front of card
  "answer"?: string,       // for flashcard / speak: the back / sample answer
  "options"?: [{ "label": string, "correct"?: boolean }],  // for mcq, 3-4 options, exactly one correct
  "emoji"?: string,        // ONE relevant emoji
  "speak"?: string         // optional spoken version of prompt for TTS
}> }
Rules:
- 8 items per response.
- Use simple kindergarten vocabulary.
- Always include one relevant emoji per item.
- For mcq: shuffle options, exactly one correct.
- Keep prompts under 60 chars.`;

    const user = `Module: ${cfg.title}
Topic: ${cfg.topic}
Level: ${data.level}
Default item kind: ${cfg.defaultKind}
Make 8 fresh items.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error("AI gateway error", resp.status, txt);
      throw new Error(`AI generation failed (${resp.status})`);
    }

    const json = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = json.choices?.[0]?.message?.content ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("AI returned invalid JSON");
    }
    const payload = PayloadSchema.parse(parsed);

    // 3. Cache it (fire and forget)
    await supabaseAdmin.from("content_cache").insert({
      module: data.module,
      level: data.level,
      variant: "ai",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: payload as any,
    });

    return payload;
  });
