import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Apple, Milk, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addItem, removeItem, updateItem, useAppData } from "@/lib/store";
import { activeBaby, forBaby, groupByDay } from "@/lib/selectors";
import {
  durationStr,
  fmtTime,
  isToday,
  localDateISO,
  nowLocalISO,
  relTime,
  todayISO,
} from "@/lib/date-utils";
import type { FeedingEntry, FeedingType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { NoBabyNotice } from "@/components/no-baby-notice";

export const Route = createFileRoute("/feedings")({
  head: () => ({
    meta: [
      { title: "Feedings · Baby Help Buddy" },
      {
        name: "description",
        content: "Log breast, bottle and solid feeds, and see the day's feeding rhythm at a glance.",
      },
      { property: "og:title", content: "Feedings · Baby Help Buddy" },
      {
        property: "og:description",
        content: "Log breast, bottle and solid feeds, and see the day's feeding rhythm at a glance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FeedingsPage,
});

const TYPES: { value: FeedingType; label: string; icon: typeof Milk }[] = [
  { value: "breast", label: "Breast", icon: Milk },
  { value: "bottle", label: "Bottle", icon: Milk },
  { value: "solid", label: "Solids", icon: Apple },
];

function describe(f: FeedingEntry): string {
  const parts: string[] = [];
  if (f.type === "breast") {
    if (f.side) parts.push(f.side);
    if (f.durationMin) parts.push(durationStr(f.durationMin));
  } else if (f.type === "bottle") {
    if (f.amountMl) parts.push(`${f.amountMl} ml`);
  } else {
    if (f.food) parts.push(f.food);
    if (f.preference && f.preference !== "neutral") parts.push(f.preference);
    if (f.amountMl) parts.push(`${f.amountMl} ml`);
  }
  return parts.join(" · ") || "Feed";
}

function FeedingFormDialog({
  open,
  onOpenChange,
  entry,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: FeedingEntry;
}) {
  const data = useAppData();
  const baby = activeBaby(data);
  const [type, setType] = useState<FeedingType>("breast");
  const [side, setSide] = useState<"left" | "right" | "both">("left");
  const [durationMin, setDurationMin] = useState("");
  const [amountMl, setAmountMl] = useState("");
  const [food, setFood] = useState("");
  const [preference, setPreference] = useState<"liked" | "rejected" | "neutral">("neutral");
  const [startedAt, setStartedAt] = useState(nowLocalISO());
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    const e = entry;
    setType(e?.type ?? "breast");
    setSide(e?.side ?? "left");
    setDurationMin(e?.durationMin ? String(e.durationMin) : "");
    setAmountMl(e?.amountMl ? String(e.amountMl) : "");
    setFood(e?.food ?? "");
    setPreference(e?.preference ?? "neutral");
    setStartedAt(e?.startedAt ?? nowLocalISO());
    setNote(e?.note ?? "");
  }, [open, entry]);

  function save() {
    if (!baby) return;
    if (type === "solid" && !food.trim()) {
      toast.error("What did they eat?");
      return;
    }
    const fields = {
      type,
      ...(type === "breast"
        ? {
            side,
            ...(durationMin ? { durationMin: Number(durationMin) } : {}),
          }
        : {}),
      ...((type === "bottle" || type === "solid") && amountMl
        ? { amountMl: Number(amountMl) }
        : {}),
      ...(type === "solid"
        ? {
            food: food.trim(),
            preference,
          }
        : {}),
      startedAt,
      ...(note.trim() ? { note: note.trim() } : {}),
    };
    if (entry) {
      updateItem("feedings", entry.id, fields);
      toast.success("Feed updated");
    } else {
      addItem("feedings", {
        id: crypto.randomUUID(),
        babyId: baby.id,
        ...fields,
      });
      toast.success("Feed logged");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{entry ? "Edit feed" : "Log a feed"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map((t) => {
              const Icon = t.icon;
              const active = type === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={
                    "flex flex-col items-center gap-1 rounded-xl border p-3 text-sm font-semibold transition-colors " +
                    (active
                      ? "border-primary bg-sage text-accent-foreground"
                      : "bg-card hover:bg-accent")
                  }
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  {t.label}
                </button>
              );
            })}
          </div>

          {type === "breast" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Side</Label>
                <Select value={side} onValueChange={(v) => setSide(v as typeof side)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="feed-dur">Minutes</Label>
                <Input
                  id="feed-dur"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={durationMin}
                  onChange={(e) => setDurationMin(e.target.value)}
                  placeholder="15"
                />
              </div>
            </div>
          )}

          {type === "bottle" && (
            <div className="grid gap-2">
              <Label htmlFor="feed-ml">Amount (ml)</Label>
              <Input
                id="feed-ml"
                type="number"
                min="1"
                inputMode="numeric"
                value={amountMl}
                onChange={(e) => setAmountMl(e.target.value)}
                placeholder="120"
              />
            </div>
          )}

          {type === "solid" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="feed-food">Food</Label>
                <Input
                  id="feed-food"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  placeholder="e.g. carrot purée"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Reaction</Label>
                  <Select
                    value={preference}
                    onValueChange={(v) => setPreference(v as typeof preference)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="liked">Liked it</SelectItem>
                      <SelectItem value="rejected">Rejected it</SelectItem>
                      <SelectItem value="neutral">So-so</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="feed-ml2">Amount (ml)</Label>
                  <Input
                    id="feed-ml2"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    value={amountMl}
                    onChange={(e) => setAmountMl(e.target.value)}
                    placeholder="optional"
                  />
                </div>
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="feed-time">Started at</Label>
            <Input
              id="feed-time"
              type="datetime-local"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="feed-note">Note (optional)</Label>
            <Textarea
              id="feed-note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything worth remembering"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>{entry ? "Save" : "Log feed"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FeedingsPage() {
  const data = useAppData();
  const baby = activeBaby(data);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FeedingEntry | undefined>();

  const records = useMemo(
    () => (baby ? forBaby(data.feedings, baby.id) : []),
    [data.feedings, baby],
  );
  const days = useMemo(() => groupByDay(records, (f) => f.startedAt), [records]);

  if (!baby) return <NoBabyNotice feature="feedings" />;

  const today = records.filter((f) => isToday(f.startedAt));
  const breastMin = today
    .filter((f) => f.type === "breast")
    .reduce((s, f) => s + (f.durationMin ?? 0), 0);
  const bottleMl = today
    .filter((f) => f.type === "bottle")
    .reduce((s, f) => s + (f.amountMl ?? 0), 0);
  const lastFeed = records[0];

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Feedings</h1>
          <p className="text-sm text-muted-foreground">Every feed tells a story.</p>
        </div>
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => {
            setEditing(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" aria-hidden /> Log feed
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Card className="py-3">
          <CardContent className="px-3 text-center">
            <p className="text-xl font-extrabold">{today.length}</p>
            <p className="text-xs text-muted-foreground">feeds today</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-3 text-center">
            <p className="text-xl font-extrabold">{breastMin || "–"}</p>
            <p className="text-xs text-muted-foreground">breast min</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-3 text-center">
            <p className="text-xl font-extrabold">{bottleMl || "–"}</p>
            <p className="text-xs text-muted-foreground">bottle ml</p>
          </CardContent>
        </Card>
      </div>

      {lastFeed && (
        <p className="text-sm text-muted-foreground">
          Last feed {relTime(lastFeed.startedAt)} — {describe(lastFeed)}
        </p>
      )}

      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <Milk className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 font-semibold">No feeds logged yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap “Log feed” to record the first one.
          </p>
        </div>
      ) : (
        days.map(([day, items]) => {
          const dayBreast = items
            .filter((f) => f.type === "breast")
            .reduce((s, f) => s + (f.durationMin ?? 0), 0);
          const dayMl = items
            .filter((f) => f.type === "bottle")
            .reduce((s, f) => s + (f.amountMl ?? 0), 0);
          return (
            <section key={day} className="grid gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-muted-foreground">
                  {day === todayISO() ? "Today" : day === localDateISO(new Date(Date.now() - 86400000)) ? "Yesterday" : new Date(day + "T12:00").toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
                </h2>
                <div className="flex gap-1.5">
                  {dayBreast > 0 && (
                    <Badge variant="secondary">{dayBreast} min breast</Badge>
                  )}
                  {dayMl > 0 && <Badge variant="secondary">{dayMl} ml</Badge>}
                </div>
              </div>
              <div className="grid gap-2">
                {items.map((f) => (
                  <Card key={f.id} className="py-3">
                    <CardContent className="flex items-center gap-3 px-3">
                      {f.type === "solid" ? (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-peach">
                          <Apple className="h-4.5 w-4.5" aria-hidden />
                        </div>
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage">
                          <Milk className="h-4.5 w-4.5" aria-hidden />
                        </div>
                      )}
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => {
                          setEditing(f);
                          setDialogOpen(true);
                        }}
                      >
                        <p className="truncate font-semibold">
                          {f.type === "breast"
                            ? "Breastfeed"
                            : f.type === "bottle"
                              ? "Bottle"
                              : "Solids"}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {describe(f)}
                          {f.note ? ` · ${f.note}` : ""}
                        </p>
                      </button>
                      <div className="flex shrink-0 items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {fmtTime(f.startedAt)}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Delete feed"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            removeItem("feedings", f.id);
                            toast.success("Feed removed");
                          }}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })
      )}

      <FeedingFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editing}
      />
    </div>
  );
}
