
# Little Learners — Calm Offline Learning PWA

A tablet-first, ad-free, offline-installable web app for Grade 1 children (5–7), designed with extra care for visual learners . Installed once on the Lenovo Tab M11 via Chrome ("Add to Home Screen"); after that it runs fullscreen and works with Wi‑Fi off.

> Important: Lovable builds web apps. We will ship this as an installable PWA (offline via service worker, fullscreen, no ads, no accounts). A real Android APK can later be produced outside Lovable by wrapping this PWA with Capacitor or a Trusted Web Activity — the codebase here is structured to support that.

---

## 1. Experience Principles (baked into every screen)

- One concept per screen. No clutter, no scroll traps.
- Calm palette: soft sky blue, sage green, warm sand, cream background. No reds for "wrong".
- Large touch targets (min 88px), generous spacing, rounded corners.
- Predictable chrome: a fixed top bar with **Home** (left) and **Back** (right). Nothing else moves.
- Slow, gentle animations (200–400ms ease-out). No flashing, no shake, no autoplay sounds.
- Encouragement only: "Nice try!", "You did it!", a soft star — never a buzzer, never a score.
- No timers, no streaks, no penalties.
- Dyslexia-friendly font (Lexend or OpenDyslexic) and high contrast.

---

## 2. Navigation Structure

```text
Home (3 big subject tiles + small Parent gear)
├── Mathematics
│   ├── Numbers 1–100
│   ├── Counting with Objects
│   ├── Add & Subtract (visual)
│   ├── Shapes & Patterns
│   └── Compare:  >   <   ==
├── English
│   ├── Alphabet A–Z
│   ├── Phonics
│   ├── Letter Tracing
│   ├── Sight Words
│   └── Picture Sentences
├── EVS / GK
│   ├── Animals
│   ├── Food
│   ├── Family
│   ├── Emotions
│   ├── Daily Routines
│   └── Human Body
└── Parent Mode (gated)
    ├── Progress (by concept, no scores)
    ├── Subjects on/off
    ├── Daily time limit
    ├── Difficulty level
    └── Sound on/off, Voice rate
```

Routes (TanStack Start, file-based):
`/`, `/math`, `/math/compare`, `/math/numbers`, `/math/counting`, `/math/addsub`, `/math/shapes`, `/english`, `/english/alphabet`, `/english/phonics`, `/english/tracing`, `/english/sight-words`, `/english/sentences`, `/evs`, `/evs/animals`, `/evs/food`, `/evs/family`, `/evs/emotions`, `/evs/routines`, `/evs/body`, `/parent`.

---

## 3. Screen-by-Screen UX (key layouts)

**Home** — Cream background. Three large rounded tiles in a landscape row (Math 🔢 / English 🔤 / World 🌿), each ~320×320px with a soft illustration. Tiny gear icon top-right opens Parent Mode.

**Subject Hub** — Same shape: friendly title, 4–6 big lesson cards as a grid. Greyed lock only if parent disabled.

**Lesson Screen template** — Top bar: Home | concept name | Back. Center: visual stage. Bottom: one primary action (e.g., "Next" star button). No side panels.

**Reward** — A single calm star bloom + soft chime (only if sound on) + "You did it!" — 1.5s, then auto-advance.

---

## 4. Flagship Flow A — Math: Greater / Less / Equal

Visual-first, symbols introduced last. 6 steps:

1. **See more / less** — Two ponds. Left: 3 ducks. Right: 6 ducks. Friendly fox points to the bigger group. Audio: "This pond has more ducks." Tap to continue.
2. **Tap which has more** — Two trays of apples. Tap the tray with more. Correct → star. "Wrong" → the smaller tray gently pulses and TTS says "Look again, which one has more?" — never marked wrong.
3. **Equal groups** — Two plates with the same cookies. "They are the same. Equal." Hands clap softly.
4. **Meet the hungry crocodile** — A friendly crocodile mouth opens toward the bigger group. Drag the crocodile to face the larger side.
5. **Symbol reveal** — Crocodile fades, the symbol `>` appears in the same orientation. "The mouth is the sign. Bigger side, open mouth."
6. **Practice** — 5 calm rounds mixing `>`, `<`, `==` with objects + symbols. Always finish with a star, regardless of attempts.

Interactions: tap-to-choose and drag-to-place. Drag uses big snap targets, no fail state.

---

## 5. Flagship Flow B — EVS: Human Body

A friendly cartoon child stands center stage. Soft outlines, no anatomy, no medical visuals.

- **Tap to learn** — Tap an external part (head, eyes, ears, nose, mouth, hands, legs, feet). It gently highlights, label appears, TTS says the name.
- **Five senses** — One sense per screen, paired with its body part and one example image (eye + flower, ear + bell, etc.).
- **Inside me (gentle)** — Only heart ❤️ and breathing 🫁. A soft pulsing heart you can tap; a chest that rises and falls. Words: "Your heart beats. You breathe in, you breathe out." No diagrams, no organs.
- **Match game** — Drag part labels to the figure. Mismatches just float back, never red.

---

## 6. Content & Asset Strategy (offline-first)

- All lesson data lives in typed TS modules under `src/content/{math,english,evs}/*.ts`. No fetch, no DB.
- Illustrations: a consistent set of soft flat SVG/PNG generated up front (rounded shapes, muted blue/green/sand). Bundled in `src/assets/`.
- Audio: **Web Speech API (browser TTS)** for all narration — zero asset weight, fully offline on Android Chrome. Voice rate is slow (~0.85), pitch warm. Configurable in Parent Mode. Falls back silently if TTS unavailable.
- Optional chime/clap as tiny local OGG (<10KB each) bundled in `src/assets/audio/`.
- Total install footprint target: under ~8 MB.
- Service worker (Workbox via `vite-plugin-pwa`) precaches the full app shell + every asset on first load → app then runs with airplane mode.
- Persistence: progress, settings, and parent prefs in **localStorage** (no server). Schema: `{ completedLessons: string[], settings: {...}, parent: {...} }`.

---

## 7. Accessibility & Calm Mode

- Sound on/off toggle (Parent Mode + quick toggle on Home).
- Font scale: Normal / Large.
- Dyslexia font toggle (Lexend ⇄ OpenDyslexic).
- Reduced motion respected (`prefers-reduced-motion`); animations shorten further.
- High-contrast theme variant.
- All flows playable without reading: every instruction has a TTS button.
- Locks landscape orientation via manifest where possible.

---

## 8. Parent Mode

- Gate: **long-press the gear (1.5s)** then a simple logic question ("Tap the bigger number: 7 or 3"). No PIN to forget.
- Dashboard:
  - Progress shown as colored dots per concept (visited / practiced / mastered) — no scores, no percentages framed as judgment.
  - Toggle subjects on/off (locked tiles on Home).
  - Daily time limit (15/30/45/60 min) — when reached, a calm "Time to rest" screen with Home only.
  - Difficulty: Gentle / Standard.
  - Sound on/off, voice rate slider, font size, dyslexia font, high contrast.
  - "Reset progress" with confirmation.

---

## 9. First Build Scope (everything, polished)

Build all three subjects end-to-end with Math `> < ==` and EVS Human Body as the showcase flows; other lessons get the same template with 1 starter activity each, ready to expand.

Delivered in one pass:
1. Design system (tokens, fonts, calm palette) in `src/styles.css`.
2. Layout shell with persistent Home/Back top bar.
3. Home + 3 subject hubs + Parent Mode.
4. Math: Numbers 1–100 grid, Counting (tap objects), Add/Subtract (visual ten-frame), Shapes & Patterns, full 6-step Compare flow.
5. English: A–Z board, Phonics (tap letter → sound + word + picture), Tracing (SVG path with finger guide), Sight Words flipcards, Picture Sentences (drag word chips under image).
6. EVS: Animals, Food, Family, Emotions, Daily Routines (tap-to-learn galleries), Human Body deep flow.
7. Reward component, TTS helper, progress store.
8. PWA install: manifest (fullscreen, landscape, calm icon), service worker precache, offline fallback page.
9. Accessibility settings wired throughout.

---

## 10. Technical Notes (for the implementation pass)

- Stack: TanStack Start + React 19 + Tailwind v4 (already in this template). File-based routes under `src/routes/` — separate route per subject and per lesson (good for SSR-free PWA caching too).
- State: a tiny `useSettings()` + `useProgress()` hook backed by `localStorage`; no server functions, no Lovable Cloud (keeps it 100% offline + free).
- TTS helper: `speak(text, { rate: settings.voiceRate })` using `window.speechSynthesis`; guarded for SSR.
- Drag & drop: `@dnd-kit/core` (touch-friendly, accessible).
- Animations: Framer Motion with global `transition={{ duration: 0.3, ease: "easeOut" }}`; respects reduced motion.
- PWA: `vite-plugin-pwa` with Workbox `precacheAndRoute` of all built assets + lesson images; `registerType: "autoUpdate"`. Service worker registration **guarded against Lovable preview iframes** so the editor preview keeps working — install/offline behavior will only be active on the published deploy.
- Future APK path: project stays a static SPA build → drop into Capacitor or PWABuilder/TWA later to ship to Play Store, no rewrite.

---

## 11. Out of Scope (for now)

- Real Android APK packaging (done outside Lovable later).
- Cloud sync, accounts, leaderboards.
- Speech recognition / mic input.
- Multi-child profiles (single profile in v1; structure leaves room).

---

After you approve, I'll generate the illustration set, build the design system, and implement the full structure with Math Compare and EVS Human Body fully fleshed out.
