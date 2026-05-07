import { createFileRoute } from "@tanstack/react-router";
import { ProfilePicker } from "@/components/ProfilePicker";

export const Route = createFileRoute("/profiles")({
  component: () => <ProfilePicker allowBack />,
});
