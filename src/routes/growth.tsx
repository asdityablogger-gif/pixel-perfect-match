import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Ruler, Trash2, Weight } from "lucide-react";
import { toast } from "sonner";
import { addItem, removeItem, updateItem, useAppData } from "@/lib/store";
import { activeBaby, forBaby } from "@/lib/selectors";
import { fmtDate, todayISO } from "@/lib/date-utils";
import type { GrowthEntry } from "@/lib/types";
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
import { Textarea } from "@/components/ui/textarea";
import { NoBabyNotice } from "@/components/no-baby-notice";

export const Route = createFileRoute("/growth")({
  head: () => ({
    meta: [
      { title: "Growth · Baby Help Buddy" },
      {
        name: "description",
        content: "Record weight, height and head circumference and watch your baby grow.",
      },
      { property: "og:title", content: "Growth · Baby Help Buddy" },
      {
        property: "og:description",
        content: "Record weight, height and head circumference and watch your baby grow.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GrowthPage,
});

function num(value: string): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) && value !== "" ? n : undefined;
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map(
      (v, i) =>
        `${(i / (values.length - 1)) * 100},${28 - ((v - min) / range) * 24}`,
    )
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" className="h-8 w-full text-primary" aria-hidden>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GrowthFormDialog({
  open,
  onOpenChange,
  entry,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: GrowthEntry | undefined;
}) {
  const data = useAppData();
  const baby = activeBaby(data);
  const [date, setDate] = useState(todayISO());
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [head, setHead] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setDate(entry?.date ?? todayISO());
    setWeight(entry?.weightKg ? String(entry.weightKg) : "");
    setHeight(entry?.heightCm ? String(entry.heightCm) : "");
    setHead(entry?.headCm ? String(entry.headCm) : "");
    setNote(entry?.note ?? "");
  }, [open, entry]);

  function save() {
    if (!baby) return;
    if (!date) {
      toast.error("Please pick a date.");
      return;
    }
    const w = num(weight);
    const h = num(height);
    const hd = num(head);
    const fields: Partial<GrowthEntry> = {
      date,
      ...(note.trim() ? { note: note.trim() } : {}),
    };
    if (w !== undefined) fields.weightKg = w;
    if (h !== undefined) fields.heightCm = h;
    if (hd !== undefined) fields.headCm = hd;
    if (
      fields.weightKg === undefined &&
      fields.heightCm === undefined &&
      fields.headCm === undefined
    ) {
      toast.error("Add at least one measurement.");
      return;
    }
    if (entry) {
      updateItem("growth", entry.id, fields);
      toast.success("Measurement updated");
    } else {
      const full: GrowthEntry = {
        id: crypto.randomUUID(),
        babyId: baby.id,
        date,
      };
      if (fields.weightKg !== undefined) full.weightKg = fields.weightKg;
      if (fields.heightCm !== undefined) full.heightCm = fields.heightCm;
      if (fields.headCm !== undefined) full.headCm = fields.headCm;
      if (fields.note !== undefined) full.note = fields.note;
      addItem("growth", full);
      toast.success("Measurement saved");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{entry ? "Edit measurement" : "Add measurement"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="growth-date">Date</Label>
            <Input
              id="growth-date"
              type="date"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="growth-w">Weight (kg)</Label>
              <Input
                id="growth-w"
                type="number"
                step="0.01"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="5.4"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="growth-h">Height (cm)</Label>
              <Input
                id="growth-h"
                type="number"
                step="0.1"
                inputMode="decimal"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="58"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="growth-head">Head (cm)</Label>
              <Input
                id="growth-head"
                type="number"
                step="0.1"
                inputMode="decimal"
                value={head}
                onChange={(e) => setHead(e.target.value)}
                placeholder="39"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="growth-note">Note (optional)</Label>
            <Textarea
              id="growth-note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. measured at the clinic"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>{entry ? "Save" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GrowthPage() {
  const data = useAppData();
  const baby = activeBaby(data);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GrowthEntry | undefined>();

  const records = useMemo(
    () => (baby ? forBaby(data.growth, baby.id) : []),
    [data.growth, baby],
  );
  const chrono = useMemo(() => [...records].reverse(), [records]);

  if (!baby) return <NoBabyNotice feature="growth chart" />;

  const latest = records[0];
  const prev = records[1];
  const weights = chrono.map((r) => r.weightKg).filter((w): w is number => !!w);

  function delta(label: string, now?: number, before?: number) {
    if (!now) return null;
    const diff = now && before ? now - before : undefined;
    return (
      <div key={label} className="rounded-xl bg-muted p-3 text-center">
        <p className="text-lg font-extrabold">
          {now}
          <span className="text-xs font-semibold text-muted-foreground">
            {label}
          </span>
        </p>
        {diff !== undefined && (
          <p className="text-xs text-muted-foreground">
            {diff > 0 ? "+" : ""}
            {Math.round(diff * 10) / 10} since last
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Growth</h1>
          <p className="text-sm text-muted-foreground">
            Measurements from home or the clinic.
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => {
            setEditing(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" aria-hidden /> Add
        </Button>
      </div>

      {latest && (
        <Card className="py-4">
          <CardContent className="grid gap-3 px-4">
            <div className="grid grid-cols-3 gap-2">
              {delta("kg", latest.weightKg, prev?.weightKg)}
              {delta("cm", latest.heightCm, prev?.heightCm)}
              {delta("cm head", latest.headCm, prev?.headCm)}
            </div>
            <Sparkline values={weights} />
            <p className="text-xs text-muted-foreground">
              Latest: {fmtDate(latest.date)}
            </p>
          </CardContent>
        </Card>
      )}

      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <Weight className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 font-semibold">No measurements yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Weigh-ins make a lovely curve over time.
          </p>
          <Ruler className="mt-2 h-4 w-4 mx-auto text-muted-foreground" aria-hidden />
        </div>
      ) : (
        <div className="grid gap-2">
          {records.map((r) => (
            <Card key={r.id} className="py-3">
              <CardContent className="flex items-center gap-3 px-3">
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => {
                    setEditing(r);
                    setDialogOpen(true);
                  }}
                >
                  <p className="font-semibold">{fmtDate(r.date)}</p>
                  <p className="text-sm text-muted-foreground">
                    {[
                      r.weightKg ? `${r.weightKg} kg` : "",
                      r.heightCm ? `${r.heightCm} cm` : "",
                      r.headCm ? `${r.headCm} cm head` : "",
                      r.note,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Delete measurement"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    removeItem("growth", r.id);
                    toast.success("Measurement removed");
                  }}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <GrowthFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editing}
      />
    </div>
  );
}
