import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Camera, Heart, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { addItem, removeItem, updateItem, useAppData } from "@/lib/store";
import { activeBaby, forBaby, groupByDay } from "@/lib/selectors";
import { fmtDateShort, todayISO } from "@/lib/date-utils";
import type { MemoryEntry } from "@/lib/types";
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

export const Route = createFileRoute("/memories")({
  head: () => ({
    meta: [
      { title: "Memories · Baby Help Buddy" },
      {
        name: "description",
        content: "Little moments worth keeping — photos and notes, on your device.",
      },
      { property: "og:title", content: "Memories · Baby Help Buddy" },
      {
        property: "og:description",
        content: "Little moments worth keeping — photos and notes, on your device.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MemoriesPage,
});

function MemoryFormDialog({
  open,
  onOpenChange,
  entry,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: MemoryEntry | undefined;
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
    setTitle(entry?.title ?? "");
    setDate(entry?.date ?? todayISO());
    setNote(entry?.note ?? "");
    setFile(undefined);
    setRemovePhoto(false);
    setSaving(false);
  }, [open, entry]);

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
        updateItem("memories", entry.id, {
          ...patch,
          ...(photoKey !== undefined ? { photoKey } : {}),
        });
        toast.success("Memory updated");
      } else {
        addItem("memories", {
          id: crypto.randomUUID(),
          babyId: baby.id,
          ...patch,
          ...(photoKey ? { photoKey } : {}),
        });
        toast.success("Memory saved 💛");
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
          <DialogTitle>{entry ? "Edit memory" : "Keep a memory"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="mem-title">Title</Label>
            <Input
              id="mem-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. First belly laugh"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mem-date">Date</Label>
            <Input
              id="mem-date"
              type="date"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mem-note">Note (optional)</Label>
            <Textarea
              id="mem-note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="The full story, so you never forget it"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mem-photo">Photo (optional)</Label>
            {(entry?.photoKey || file) && !removePhoto ? (
              <div className="flex items-center gap-3">
                <PhotoImg
                  photoKey={entry?.photoKey}
                  alt="Memory photo"
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
                htmlFor="mem-photo"
                className="flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed p-3 text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                <Camera className="h-4 w-4" aria-hidden /> Choose a photo
              </label>
            )}
            <input
              id="mem-photo"
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

function MemoriesPage() {
  const data = useAppData();
  const baby = activeBaby(data);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MemoryEntry | undefined>();

  const records = useMemo(
    () => (baby ? forBaby(data.memories, baby.id) : []),
    [data.memories, baby],
  );
  const days = useMemo(
    () =>
      groupByDay(
        [...records].sort((a, b) => b.date.localeCompare(a.date)),
        (m) => m.date,
      ),
    [records],
  );

  if (!baby) return <NoBabyNotice feature="memories" />;

  async function remove(entry: MemoryEntry) {
    removeItem("memories", entry.id);
    if (entry.photoKey) await deletePhoto(entry.photoKey);
    toast.success("Memory removed");
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Memories</h1>
          <p className="text-sm text-muted-foreground">
            Little moments worth keeping.
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

      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <Heart className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 font-semibold">No memories yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            A funny face, a first giggle, a sleepy cuddle — add the first one.
          </p>
        </div>
      ) : (
        days.map(([day, items]) => (
          <section key={day} className="grid gap-2">
            <h2 className="text-xs font-semibold text-muted-foreground">
              {day === todayISO() ? "Today" : fmtDateShort(day)}
            </h2>
            {items.map((m) => (
              <Card key={m.id} className="overflow-hidden py-0">
                <CardContent className="flex items-start gap-3 p-3">
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-start gap-3 text-left"
                    onClick={() => {
                      setEditing(m);
                      setDialogOpen(true);
                    }}
                  >
                    <PhotoImg
                      photoKey={m.photoKey}
                      alt={m.title}
                      className="h-14 w-14 shrink-0 rounded-2xl"
                    />
                    <span className="min-w-0">
                      <span className="block font-bold leading-tight">
                        {m.title}
                      </span>
                      {m.note && (
                        <span className="mt-0.5 line-clamp-3 block text-xs text-muted-foreground">
                          {m.note}
                        </span>
                      )}
                    </span>
                  </button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${m.title}`}
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(m)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </section>
        ))
      )}

      <MemoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editing}
      />
    </div>
  );
}
