import { createFileRoute } from "@tanstack/react-router";
import { GalleryLesson } from "@/components/GalleryLesson";

export const Route = createFileRoute("/evs/weather")({
  component: () => (
    <GalleryLesson
      lessonId="evs.weather"
      title="Weather"
      items={[
        { name: "Sunny", emoji: "☀️" },
        { name: "Cloudy", emoji: "☁️" },
        { name: "Rainy", emoji: "🌧️" },
        { name: "Stormy", emoji: "⛈️" },
        { name: "Snowy", emoji: "❄️" },
        { name: "Windy", emoji: "🌬️" },
        { name: "Rainbow", emoji: "🌈" },
        { name: "Foggy", emoji: "🌫️" },
      ]}
    />
  ),
});
