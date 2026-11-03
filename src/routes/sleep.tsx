import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Moon, MoonStar, Play, Plus, Square, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addItem, removeItem, updateItem, useAppData } from "@/lib/store";
import { activeBaby, forBaby, groupByDay } from "@/lib/selectors";
import {
  durationStr,
  fmtTime,
  minutesBetween,
  nowLocalISO,
  todayISO,
} from "@/lib/date-utils";
import type { SleepEntry } from "@/lib/types";
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

export const Route = createFileRoute("/sleep")({
  head: () => ({
    meta: [
      { title: "Sleep · Baby Help Buddy" },
      {
        name: "description",
        content: "Track naps and night sleep, watch the current nap timer, and spot sleep patterns.",
      },
      { property: "og:title", content: "Sleep · Baby Help Buddy" },
      {
        property: "og:description",
        content: "Track naps and night sleep, watch the current nap timer, and spot sleep patterns.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SleepPage,
});

function kindLabel(kind: "nap" | "night"): string {
  return kind === "nap" ? "Nap" : "Night sleep";
}

function SleepFormDialog({
  open,
  onOpenChange,
  entry,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: SleepEntry | undefined;
}) {
  const data = useAppData();
  const baby = activeBaby(data);
  const [kind, setKind] = useState<"nap" | "night">("nap");
  const [start, setStart] = useState(nowLocalISO());
  const [end, setEnd] = useState("");
  const [interruptions, setInterruptions] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setKind(entry?.kind ?? "nap");
    setStart(entry?.start ?? nowLocalISO());
    setEnd(entry?.end ?? "");
    setInterruptions(entry?.interruptions ? String(entry.interruptions) : "");
    setNote(entry?.note ?? "");
  }, [open, entry]);

  function save() {
    if (!baby) return;
    const fields = {
      kind,
      start,
      ...(end ? { end } : {}),
      ...(interruptions ? { interruptions: Number(interruptions) } : {}),
      ...(note.trim() ? { note: note.trim() } : {}),
    };
    if (entry) {
      updateItem("sleeps", entry.id, fields);
      toast.success("Sleep updated");
    } else {
      addItem("sleeps", { id: crypto.randomUUID(), babyId: baby.id, ...fields });
      toast.success("Sleep logged");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{entry ? "Edit sleep" : "Log sleep"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Type</Label>
            <Select value={kind} onValueChange={(v) => setKind(v as typeof kind)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nap">Nap</SelectItem>
                <SelectItem value="night">Night sleep</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sleep-start">Started</Label>
              <Input
                id="sleep-start"
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sleep-end">Woke up</Label>
              <Input
                id="sleep-end"
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sleep-int">Night wakings (optional)</Label>
            <Input
              id="sleep-int"
              type="number"
              min="0"
              inputMode="numeric"
              value={interruptions}
              onChange={(e) => setInterruptions(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sleep-note">Note (optional)</Label>
            <Textarea
              id="sleep-note"
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
          <Button onClick={save}>{entry ? "Save" : "Log sleep"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SleepPage() {
  const data = useAppData();
  const baby = activeBaby(data);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SleepEntry | undefined>();
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const records = useMemo(
    () => (baby ? forBaby(data.sleeps, baby.id) : []),
    [data.sleeps, baby],
  );
  const days = useMemo(() => groupByDay(records, (s) => s.start), [records]);

  if (!baby) return <NoBabyNotice feature="sleep" />;

  const ongoing = records.filter((s) => !s.end);
  const today = records.filter((s) => s.start.slice(0, 10) === todayISO());
  const todayMin = today.reduce(
    (sum, s) => sum + (s.end ? minutesBetween(s.start, s.end) : 0),
    0,
  );

  function startSleep(kind: "nap" | "night") {
    if (!baby) return;
    addItem("sleeps", {
      id: crypto.randomUUID(),
      babyId: baby.id,
      kind,
      start: nowLocalISO(),
    });
    toast.success(kind === "nap" ? "Nap started — sweet dreams" : "Night sleep started");
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Sleep</h1>
          <p className="text-sm text-muted-foreground">
            {todayMin > 0
              ? `${durationStr(todayMin)} slept today so far`
              : "Naps and nights, gently tracked."}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={() => {
            setEditing(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" aria-hidden /> Add past
        </Button>
      </div>

      {ongoing.map((s) => (
        <Card key={s.id} className="border-primary/40 bg-sage/50 py-4">
          <CardContent className="flex items-center gap-3 px-4">
            <MoonStar className="h-6 w-6 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-bold">{kindLabel(s.kind)} — sleeping now</p>
              <p className="text-sm text-muted-foreground">
                Since {fmtTime(s.start)} · {durationStr(minutesBetween(s.start, nowLocalISO()))}
              </p>
            </div>
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => {
                updateItem("sleeps", s.id, { end: nowLocalISO() });
                toast.success("Woke up — sleep saved");
              }}
            >
              <Square className="h-3.5 w-3.5" aria-hidden /> Wake up
            </Button>
          </CardContent>
        </Card>
      ))}

      {ongoing.length === 0 && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="h-14 rounded-2xl border-dashed justify-start gap-2"
            onClick={() => startSleep("nap")}
          >
            <Play className="h-4 w-4 text-primary" aria-hidden /> Start nap
          </Button>
          <Button
            variant="outline"
            className="h-14 rounded-2xl border-dashed justify-start gap-2"
            onClick={() => startSleep("night")}
          >
            <Moon className="h-4 w-4 text-primary" aria-hidden /> Start night
          </Button>
        </div>
      )}

      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <Moon className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 font-semibold">No sleeps logged yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Start a nap above, or add a sleep from earlier today.
          </p>
        </div>
      ) : (
        days.map(([day, items]) => {
          const total = items.reduce(
            (sum, s) => sum + (s.end ? minutesBetween(s.start, s.end) : 0),
            0,
          );
          return (
            <section key={day} className="grid gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-muted-foreground">
                  {day === todayISO()
                    ? "Today"
                    : new Date(day + "T12:00").toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                </h2>
                {total > 0 && (
                  <span className="text-xs font-semibold text-muted-foreground">
                    {durationStr(total)} total
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                {items.map((s) => (
                  <Card key={s.id} className="py-3">
                    <CardContent className="flex items-center gap-3 px-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky">
                        {s.kind === "nap" ? (
                          <Play className="h-4 w-4" aria-hidden />
                        ) : (
                          <Moon className="h-4 w-4" aria-hidden />
                        )}
                      </div>
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => {
                          setEditing(s);
                          setDialogOpen(true);
                        }}
                      >
                        <p className="font-semibold">
                          {kindLabel(s.kind)}
                          {!s.end && " — in progress"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {fmtTime(s.start)}
                          {s.end ? ` – ${fmtTime(s.end)} · ${durationStr(minutesBetween(s.start, s.end))}` : ""}
                          {s.interruptions ? ` · ${s.interruptions} waking${s.interruptions > 1 ? "s" : ""}` : ""}
                          {s.note ? ` · ${s.note}` : ""}
                        </p>
                      </button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Delete sleep entry"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          removeItem("sleeps", s.id);
                          toast.success("Sleep removed");
                        }}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })
      )}

      <SleepFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editing}
      />
    </div>
  );
}
