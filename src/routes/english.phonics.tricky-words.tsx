import { createFileRoute } from "@tanstack/react-router";
import { GalleryLesson } from "@/components/GalleryLesson";

export const Route = createFileRoute("/english/phonics/tricky-words")({
  component: () => (
    <GalleryLesson
      lessonId="en.phonics.tricky"
      title="Tricky Words"
      items={[
        { name: "I", emoji: "🙋" },
        { name: "the", emoji: "✨" },
        { name: "he", emoji: "👦" },
        { name: "she", emoji: "👧" },
        { name: "me", emoji: "😊" },
        { name: "we", emoji: "👨‍👩‍👧" },
        { name: "be", emoji: "🐝" },
        { name: "was", emoji: "🌟" },
        { name: "to", emoji: "➡️" },
        { name: "do", emoji: "✅" },
        { name: "of", emoji: "🔗" },
        { name: "are", emoji: "👥" },
        { name: "all", emoji: "🌍" },
        { name: "you", emoji: "👉" },
        { name: "your", emoji: "🎁" },
        { name: "come", emoji: "🤗" },
        { name: "some", emoji: "🍪" },
        { name: "said", emoji: "💬" },
        { name: "here", emoji: "📍" },
        { name: "there", emoji: "🏁" },
        { name: "they", emoji: "👫" },
        { name: "go", emoji: "🟢" },
        { name: "no", emoji: "🛑" },
        { name: "so", emoji: "💡" },
        { name: "my", emoji: "🫳" },
        { name: "one", emoji: "1️⃣" },
        { name: "by", emoji: "👋" },
        { name: "like", emoji: "❤️" },
      ]}
    />
  ),
});
