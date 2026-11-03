import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Baby,
  Bath,
  Blocks,
  CircleDot,
  MoreHorizontal,
  Plus,
  Sparkles,
  Sun,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { addItem, removeItem, updateItem, useAppData } from "@/lib/store";
import { activeBaby, forBaby, groupByDay } from "@/lib/selectors";
import { fmtTime, nowLocalISO, todayISO } from "@/lib/date-utils";
import type { CareEntry, CareKind } from "@/lib/types";
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

export const Route = createFileRoute("/care")({
  head: () => ({
    meta: [
      { title: "Care log · Baby Help Buddy" },
      {
        name: "description",
        content: "Diaper changes, baths, tummy time, outdoor time and more — your daily care journal.",
      },
      { property: "og:title", content: "Care log · Baby Help Buddy" },
      {
        property: "og:description",
        content: "Diaper changes, baths, tummy time, outdoor time and more — your daily care journal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CarePage,
});

const KINDS: { value: CareKind; label: string; icon: LucideIcon; tint: string }[] = [
  { value: "diaper", label: "Diaper", icon: CircleDot, tint: "bg-sage" },
  { value: "bath", label: "Bath", icon: Bath, tint: "bg-sky" },
  { value: "hygiene", label: "Hygiene", icon: Sparkles, tint: "bg-peach" },
  { value: "tummy", label: "Tummy time", icon: Baby, tint: "bg-sage" },
  { value: "outdoor", label: "Outdoors", icon: Sun, tint: "bg-peach" },
  { value: "activity", label: "Play", icon: Blocks, tint: "bg-sky" },
  { value: "other", label: "Other", icon: MoreHorizontal, tint: "bg-muted" },
];

function kindInfo(kind: CareKind) {
  return KINDS.find((k) => k.value === kind) ?? KINDS[KINDS.length - 1]!;
}

function CareFormDialog({
  open,
  onOpenChange,
  entry,
  presetKind,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: CareEntry | undefined;
  presetKind?: CareKind | undefined;
}) {
  const data = useAppData();
  const baby = activeBaby(data);
  const [kind, setKind] = useState<CareKind>("diaper");
  const [detail, setDetail] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [at, setAt] = useState(nowLocalISO());
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setKind(entry?.kind ?? presetKind ?? "diaper");
    setDetail(entry?.detail ?? "");
    setDurationMin(entry?.durationMin ? String(entry.durationMin) : "");
    setAt(entry?.at ?? nowLocalISO());
    setNote(entry?.note ?? "");
  }, [open, entry, presetKind]);

  function save() {
    if (!baby) return;
    const fields = {
      kind,
      ...(detail ? { detail } : {}),
      ...(durationMin ? { durationMin: Number(durationMin) } : {}),
      at,
      ...(note.trim() ? { note: note.trim() } : {}),
    };
    if (entry) {
      updateItem("careLogs", entry.id, fields);
      toast.success("Entry updated");
    } else {
      addItem("careLogs", { id: crypto.randomUUID(), babyId: baby.id, ...fields });
      toast.success("Logged");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{entry ? "Edit entry" : "Log care"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Type</Label>
            <Select value={kind} onValueChange={(v) => setKind(v as CareKind)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KINDS.map((k) => (
                  <SelectItem key={k.value} value={k.value}>
                    {k.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {kind === "diaper" ? (
            <div className="grid gap-2">
              <Label>What's in the diaper?</Label>
              <Select value={detail || "wet"} onValueChange={setDetail}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wet">Wet</SelectItem>
                  <SelectItem value="dirty">Dirty</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                  <SelectItem value="dry">Just checked — dry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="care-detail">Detail</Label>
                <Input
                  id="care-detail"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="optional"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="care-dur">Minutes</Label>
                <Input
                  id="care-dur"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={durationMin}
                  onChange={(e) => setDurationMin(e.target.value)}
                  placeholder="optional"
                />
              </div>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="care-time">When</Label>
            <Input
              id="care-time"
              type="datetime-local"
              value={at}
              onChange={(e) => setAt(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="care-note">Note (optional)</Label>
            <Textarea
              id="care-note"
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
          <Button onClick={save}>{entry ? "Save" : "Log it"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CarePage() {
  const data = useAppData();
  const baby = activeBaby(data);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CareEntry | undefined>();
  const [presetKind, setPresetKind] = useState<CareKind | undefined>();

  const records = useMemo(
    () => (baby ? forBaby(data.careLogs, baby.id) : []),
    [data.careLogs, baby],
  );
  const days = useMemo(() => groupByDay(records, (c) => c.at), [records]);

  if (!baby) return <NoBabyNotice feature="care log" />;

  const today = records.filter((c) => c.at.slice(0, 10) === todayISO());
  const diapers = today.filter((c) => c.kind === "diaper");

  function openNew(kind: CareKind) {
    setEditing(undefined);
    setPresetKind(kind);
    setDialogOpen(true);
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Care log</h1>
          <p className="text-sm text-muted-foreground">
            {diapers.length > 0
              ? `${diapers.length} diaper change${diapers.length > 1 ? "s" : ""} today`
              : "The little things, remembered."}
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => openNew("diaper")}
        >
          <Plus className="h-4 w-4" aria-hidden /> Log
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {KINDS.map((k) => {
          const Icon = k.icon;
          return (
            <button
              key={k.value}
              type="button"
              onClick={() => openNew(k.value)}
              className="flex flex-col items-center gap-1.5 rounded-2xl border bg-card p-3 transition-colors hover:bg-accent"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full ${k.tint}`}
              >
                <Icon className="h-5 w-5 text-accent-foreground" aria-hidden />
              </span>
              <span className="text-xs font-semibold">{k.label}</span>
            </button>
          );
        })}
      </div>

      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 font-semibold">Nothing logged yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap a type above for a one-tap entry.
          </p>
        </div>
      ) : (
        days.map(([day, items]) => (
          <section key={day} className="grid gap-2">
            <h2 className="text-sm font-bold text-muted-foreground">
              {day === todayISO()
                ? "Today"
                : new Date(day + "T12:00").toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
            </h2>
            <div className="grid gap-2">
              {items.map((c) => {
                const info = kindInfo(c.kind);
                const Icon = info.icon;
                return (
                  <Card key={c.id} className="py-3">
                    <CardContent className="flex items-center gap-3 px-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${info.tint}`}
                      >
                        <Icon className="h-4 w-4 text-accent-foreground" aria-hidden />
                      </span>
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => {
                          setEditing(c);
                          setDialogOpen(true);
                        }}
                      >
                        <p className="font-semibold">{info.label}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {[c.detail, c.durationMin ? `${c.durationMin} min` : "", c.note]
                            .filter(Boolean)
                            .join(" · ") || "Logged"}
                        </p>
                      </button>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {fmtTime(c.at)}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Delete entry"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          removeItem("careLogs", c.id);
                          toast.success("Entry removed");
                        }}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))
      )}

      <CareFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editing}
        presetKind={presetKind}
      />
    </div>
  );
}
