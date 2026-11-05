import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Award, Camera, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { addItem, removeItem, updateItem, useAppData } from "@/lib/store";
import { activeBaby, forBaby } from "@/lib/selectors";
import { ageInMonths, fmtDate, todayISO } from "@/lib/date-utils";
import { MILESTONE_SUGGESTIONS } from "@/data/milestones";
import type { MilestoneEntry } from "@/lib/types";
import { deletePhoto, savePhoto } from "@/lib/photo-store";
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
import { PhotoImg } from "@/components/photo";

export const Route = createFileRoute("/milestones")({
  head: () => ({
    meta: [
      { title: "Milestones · Baby Help Buddy" },
      {
        name: "description",
        content: "First smiles, first teeth, first steps — keep them all.",
      },
      { property: "og:title", content: "Milestones · Baby Help Buddy" },
      {
        property: "og:description",
        content: "First smiles, first teeth, first steps — keep them all.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MilestonesPage,
});

function MilestoneFormDialog({
  open,
  onOpenChange,
  entry,
  prefillTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: MilestoneEntry | undefined;
  prefillTitle?: string | undefined;
}) {
  const data = useAppData();
  const baby = activeBaby(data);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [removePhoto, setRemovePhoto] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(entry?.title ?? prefillTitle ?? "");
    setDate(entry?.date ?? todayISO());
    setNote(entry?.note ?? "");
    setFile(undefined);
    setRemovePhoto(false);
    setSaving(false);
  }, [open, entry, prefillTitle]);

  async function save() {
    if (!baby) return;
    const clean = title.trim();
    if (!clean) {
      toast.error("Give this moment a title.");
      return;
    }
    setSaving(true);
    try {
      let photoKey = entry?.photoKey;
      if (removePhoto && photoKey) {
        await deletePhoto(photoKey);
        photoKey = undefined;
      }
      if (file) {
        if (photoKey) await deletePhoto(photoKey);
        photoKey = await savePhoto(file);
      }
      const patch = {
        title: clean,
        date,
        ...(note.trim() ? { note: note.trim() } : {}),
      };
      if (entry) {
        updateItem("milestones", entry.id, {
          ...patch,
          ...(photoKey !== undefined ? { photoKey } : {}),
        });
        toast.success("Milestone updated");
      } else {
        addItem("milestones", {
          id: crypto.randomUUID(),
          babyId: baby.id,
          ...patch,
          ...(photoKey ? { photoKey } : {}),
        });
        toast.success("Milestone saved 🎉");
      }
      onOpenChange(false);
    } catch {
      toast.error("Couldn't save — please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {entry ? "Edit milestone" : "Add a milestone"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="ms-title">What happened?</Label>
            <Input
              id="ms-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. First social smile"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ms-date">Date</Label>
            <Input
              id="ms-date"
              type="date"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ms-note">Note (optional)</Label>
            <Textarea
              id="ms-note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. right at grandma, mid-cuddle"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ms-photo">Photo (optional)</Label>
            {(entry?.photoKey || file) && !removePhoto ? (
              <div className="flex items-center gap-3">
                <PhotoImg
                  photoKey={entry?.photoKey}
                  alt="Milestone photo"
                  className="h-16 w-16 rounded-2xl"
                />
                {file && (
                  <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                    {file.name}
                  </span>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Remove photo"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    setFile(undefined);
                    setRemovePhoto(true);
                  }}
                >
                  <X className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="ms-photo"
                className="flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed p-3 text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                <Camera className="h-4 w-4" aria-hidden /> Choose a photo
              </label>
            )}
            <input
              id="ms-photo"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                setFile(e.target.files?.[0]);
                setRemovePhoto(false);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {entry ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MilestonesPage() {
  const data = useAppData();
  const baby = activeBaby(data);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MilestoneEntry | undefined>();
  const [prefill, setPrefill] = useState<string | undefined>();

  const records = useMemo(
    () =>
      baby
        ? [...forBaby(data.milestones, baby.id)].sort((a, b) =>
            b.date.localeCompare(a.date),
          )
        : [],
    [data.milestones, baby],
  );

  const suggestions = useMemo(() => {
    if (!baby) return [];
    const age = ageInMonths(baby.birthDate);
    const recorded = new Set(records.map((r) => r.title.toLowerCase()));
    return MILESTONE_SUGGESTIONS.filter(
      (s) => s.months <= age + 1 && !recorded.has(s.title.toLowerCase()),
    ).slice(0, 6);
  }, [baby, records]);

  if (!baby) return <NoBabyNotice feature="milestones" />;

  function openNew(title?: string) {
    setEditing(undefined);
    setPrefill(title);
    setDialogOpen(true);
  }

  async function remove(entry: MilestoneEntry) {
    removeItem("milestones", entry.id);
    if (entry.photoKey) await deletePhoto(entry.photoKey);
    toast.success("Milestone removed");
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Milestones</h1>
          <p className="text-sm text-muted-foreground">
            {baby.name}'s firsts, all in one place.
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => openNew()}
        >
          <Plus className="h-4 w-4" aria-hidden /> Add
        </Button>
      </div>

      {suggestions.length > 0 && (
        <section className="grid gap-2">
          <h2 className="text-sm font-bold text-muted-foreground">
            Coming up around this age
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s.title}
                type="button"
                onClick={() => openNew(s.title)}
                className="rounded-full border bg-card px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-accent"
              >
                <Plus className="mr-1 inline h-3 w-3" aria-hidden />
                {s.title}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Tap one to record it — every baby has their own timeline.
          </p>
        </section>
      )}

      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <Award className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 font-semibold">No milestones yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The first smile is coming — you'll want to remember the date.
          </p>
        </div>
      ) : (
        <div className="grid gap-2">
          {records.map((r) => (
            <Card key={r.id} className="overflow-hidden py-0">
              <CardContent className="flex items-center gap-3 p-3">
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  onClick={() => {
                    setEditing(r);
                    setPrefill(undefined);
                    setDialogOpen(true);
                  }}
                >
                  <PhotoImg
                    photoKey={r.photoKey}
                    alt={r.title}
                    className="h-14 w-14 shrink-0 rounded-2xl"
                  />
                  <span className="min-w-0">
                    <span className="block font-bold leading-tight">
                      {r.title}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {fmtDate(r.date)}
                    </span>
                    {r.note && (
                      <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                        {r.note}
                      </span>
                    )}
                  </span>
                </button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Delete ${r.title}`}
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(r)}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <MilestoneFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editing}
        prefillTitle={prefill}
      />
    </div>
  );
}
