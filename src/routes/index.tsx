import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  ArrowRight,
  Baby,
  BookOpen,
  HandHeart,
  Milk,
  Moon,
  NotebookPen,
  Play,
  Ruler,
  Sparkles,
  Square,
} from "lucide-react";
import { toast } from "sonner";
import { useAppData, updateItem } from "@/lib/store";
import { activeBaby, forBaby } from "@/lib/selectors";
import { formatAge, minutesBetween, nowLocalISO, relTime, todayISO } from "@/lib/date-utils";
import { GUIDES } from "@/data/guides";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BabyDialog } from "@/components/baby-dialog";
import { PhotoImg } from "@/components/photo";
import { NoBabyNotice } from "@/components/no-baby-notice";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home · Baby Help Buddy" },
      {
        name: "description",
        content:
          "Today at a glance: last feed, sleep, care and your daily journal — all offline on your device.",
      },
      { property: "og:title", content: "Home · Baby Help Buddy" },
      {
        property: "og:description",
        content:
          "Today at a glance: last feed, sleep, care and your daily journal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomePage,
});

const FEED_LABEL: Record<string, string> = {
  breast: "Breast feed",
  bottle: "Bottle",
  solid: "Solid food",
};

const QUICK = [
  { to: "/feedings", label: "Log a feed", icon: Milk, tint: "bg-peach" },
  { to: "/sleep", label: "Track sleep", icon: Moon, tint: "bg-sky" },
  { to: "/care", label: "Care log", icon: Sparkles, tint: "bg-sage" },
  { to: "/growth", label: "Growth", icon: Ruler, tint: "bg-peach" },
] as const;

function WelcomeScreen() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-peach">
        <Baby className="h-8 w-8 text-secondary-foreground" aria-hidden />
      </div>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight">
        Welcome to Baby Help Buddy
      </h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Track feeds, sleep, growth and milestones — and get gentle answers when
        something worries you. Everything stays on this device.
      </p>
      <Button className="mt-5 rounded-full" onClick={() => setOpen(true)}>
        <Baby className="h-4 w-4" aria-hidden /> Add your baby
      </Button>
      <Link
        to="/learn"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        <BookOpen className="h-4 w-4" aria-hidden /> Or browse the guides first
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <BabyDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function HomePage() {
  const data = useAppData();
  const baby = activeBaby(data);

  const lastFeed = useMemo(
    () => (baby ? forBaby(data.feedings, baby.id)[0] : undefined),
    [data.feedings, baby],
  );
  const todaySleep = useMemo(() => {
    if (!baby) return { total: 0, count: 0 };
    const today = todayISO();
    let total = 0;
    let count = 0;
    for (const s of forBaby(data.sleeps, baby.id)) {
      if (!s.start.startsWith(today)) continue;
      count += 1;
      total += minutesBetween(s.start, s.end ?? nowLocalISO());
    }
    return { total, count };
  }, [data.sleeps, baby]);
  const diapersToday = useMemo(() => {
    if (!baby) return 0;
    const today = todayISO();
    return forBaby(data.careLogs, baby.id).filter(
      (c) => c.kind === "diaper" && c.at.startsWith(today),
    ).length;
  }, [data.careLogs, baby]);
  const ongoingSleep = useMemo(
    () => (baby ? forBaby(data.sleeps, baby.id).find((s) => !s.end) : undefined),
    [data.sleeps, baby],
  );
  const openTasks = useMemo(
    () =>
      data.tasks
        .filter((t) => !t.done && (!t.babyId || t.babyId === baby?.id))
        .slice(0, 3),
    [data.tasks, baby],
  );
  const checkedInToday = data.checkIns.some((c) => c.date === todayISO());
  const guide = GUIDES[0] ?? null;

  if (data.babies.length === 0) return <WelcomeScreen />;
  if (!baby) return <NoBabyNotice feature="tracking" />;

  function endSleep() {
    if (!ongoingSleep) return;
    updateItem("sleeps", ongoingSleep.id, { end: nowLocalISO() });
    toast.success("Sleep saved 😴");
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Hello, {baby.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          {formatAge(baby.birthDate)} · here's today so far.
        </p>
      </div>

      {ongoingSleep && (
        <Card className="border-primary/40 bg-accent/60 py-3">
          <CardContent className="flex items-center gap-3 px-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky">
              <Moon className="h-5 w-5 text-accent-foreground" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold leading-tight">
                {baby.name} is sleeping
              </p>
              <p className="text-xs text-muted-foreground">
                Started {relTime(ongoingSleep.start)} ·{" "}
                {durationTxt(ongoingSleep.start)}
              </p>
            </div>
            <Button size="sm" className="rounded-full" onClick={endSleep}>
              <Square className="h-3.5 w-3.5" aria-hidden /> Wake up
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-2">
        <Card className="py-3">
          <CardContent className="grid gap-1 px-3 text-center">
            <Milk className="mx-auto h-4 w-4 text-muted-foreground" aria-hidden />
            <p className="text-xs font-semibold text-muted-foreground">
              Last feed
            </p>
            <p className="truncate text-sm font-bold">
              {lastFeed
                ? `${FEED_LABEL[lastFeed.type] ?? "Feed"} · ${relTime(lastFeed.startedAt)}`
                : "—"}
            </p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="grid gap-1 px-3 text-center">
            <Moon className="mx-auto h-4 w-4 text-muted-foreground" aria-hidden />
            <p className="text-xs font-semibold text-muted-foreground">
              Sleep today
            </p>
            <p className="text-sm font-bold">
              {todaySleep.count === 0
                ? "—"
                : `${Math.round(todaySleep.total / 60)}h / ${todaySleep.count}`}
            </p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="grid gap-1 px-3 text-center">
            <Sparkles
              className="mx-auto h-4 w-4 text-muted-foreground"
              aria-hidden
            />
            <p className="text-xs font-semibold text-muted-foreground">
              Diapers
            </p>
            <p className="text-sm font-bold">{diapersToday || "—"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {QUICK.map((q) => {
          const Icon = q.icon;
          return (
            <Link
              key={q.to}
              to={q.to}
              className="group flex flex-col items-center gap-1.5 rounded-2xl border bg-card p-3 transition-colors hover:bg-accent"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${q.tint}`}
              >
                <Icon
                  className="h-4.5 w-4.5 text-accent-foreground"
                  aria-hidden
                />
              </span>
              <span className="text-center text-[10px] font-bold leading-tight">
                {q.label}
              </span>
            </Link>
          );
        })}
      </div>

      <Card className="py-3">
        <CardContent className="flex items-center gap-3 px-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage">
            <NotebookPen
              className="h-5 w-5 text-accent-foreground"
              aria-hidden
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold leading-tight">
              {checkedInToday ? "Journal done today 💛" : "How are you today?"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {checkedInToday
                ? "Your check-in is saved."
                : "One minute: mood, a note, one good thing."}
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/journal">
              {checkedInToday ? "View" : "Check in"}{" "}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {openTasks.length > 0 && (
        <section className="grid gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-muted-foreground">
              Open to-dos
            </h2>
            <Link
              to="/tasks"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              All tasks <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
          {openTasks.map((t) => (
            <Card key={t.id} className="py-2.5">
              <CardContent className="flex items-center gap-2 px-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                <p className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {t.title}
                </p>
                <span className="shrink-0 text-[10px] font-semibold text-muted-foreground">
                  {t.category === "shopping" ? "shopping" : "task"}
                </span>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {guide && (
        <section className="grid gap-2">
          <h2 className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
            <HandHeart className="h-4 w-4" aria-hidden /> Something on your mind?
          </h2>
          <Link to="/learn/guide/$id" params={{ id: guide.id }}>
            <Card className="py-3 transition-colors hover:bg-accent">
              <CardContent className="flex items-center gap-3 px-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach">
                  <Play className="h-5 w-5 text-accent-foreground" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold leading-tight">
                    {guide.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {guide.subtitle}
                  </span>
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </CardContent>
            </Card>
          </Link>
        </section>
      )}

      <Card className="py-3">
        <CardContent className="flex items-center gap-3 px-3">
          <PhotoImg
            photoKey={baby.photoKey}
            alt={baby.name}
            className="h-12 w-12 shrink-0 rounded-2xl"
          />
          <div className="min-w-0 flex-1">
            <p className="font-bold leading-tight">{baby.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatAge(baby.birthDate)}
            </p>
          </div>
          <Link
            to="/more"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            More <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function durationTxt(startIso: string) {
  const min = Math.round(minutesBetween(startIso, nowLocalISO()));
  const h = Math.floor(min / 60);
  return h > 0 ? `${h}h ${min % 60}m so far` : `${min}m so far`;
}
