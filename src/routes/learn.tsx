import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/learn")({
  component: LearnLayout,
});

// Layout only — the hub and detail pages render through the outlet.
function LearnLayout() {
  return <Outlet />;
}
