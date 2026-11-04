import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Award,
  ChevronRight,
  Heart,
  NotebookPen,
  Ruler,
  Settings,
  ShoppingCart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "More · Baby Help Buddy" },
      {
        name: "description",
        content: "Growth, milestones, memories, tasks, journal and settings.",
      },
      { property: "og:title", content: "More · Baby Help Buddy" },
      {
        property: "og:description",
        content: "Growth, milestones, memories, tasks, journal and settings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MorePage,
});

const ITEMS: {
  to: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  tint: string;
}[] = [
  { to: "/growth", label: "Growth", desc: "Weight, height and head curve", icon: Ruler, tint: "bg-peach" },
  { to: "/care", label: "Care log", desc: "Diapers, baths and play", icon: Sparkles, tint: "bg-sage" },
  { to: "/milestones", label: "Milestones", desc: "First smiles and first steps", icon: Award, tint: "bg-sky" },
  { to: "/memories", label: "Memories", desc: "Little moments worth keeping", icon: Heart, tint: "bg-peach" },
  { to: "/tasks", label: "Tasks & shopping", desc: "To-dos and what to buy", icon: ShoppingCart, tint: "bg-sage" },
  { to: "/journal", label: "Daily journal", desc: "Mood, notes and gratitude", icon: NotebookPen, tint: "bg-sky" },
  { to: "/settings", label: "Settings", desc: "Backup, reminders and babies", icon: Settings, tint: "bg-muted" },
];

function MorePage() {
  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">More</h1>
        <p className="text-sm text-muted-foreground">
          Everything else, one tap away.
        </p>
      </div>
      <div className="grid gap-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} className="group">
              <Card className="py-3 transition-colors group-hover:bg-accent">
                <CardContent className="flex items-center gap-3 px-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.tint}`}
                  >
                    <Icon className="h-5 w-5 text-accent-foreground" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold leading-tight">
                      {item.label}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {item.desc}
                    </span>
                  </span>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
