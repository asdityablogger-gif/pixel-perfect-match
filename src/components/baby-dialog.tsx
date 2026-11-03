import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { addBaby, updateBaby } from "@/lib/store";
import { savePhoto } from "@/lib/photo-store";
import { todayISO } from "@/lib/date-utils";
import type { Baby } from "@/lib/types";
import { Button } from "@/components/ui/button";
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
import { PhotoImg } from "@/components/photo";

export function BabyDialog({
  open,
  onOpenChange,
  baby,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  baby?: Baby;
}) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(todayISO());
  const [sex, setSex] = useState<"girl" | "boy" | "not yet">("not yet");
  const [note, setNote] = useState("");
  const [photoKey, setPhotoKey] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(baby?.name ?? "");
    setBirthDate(baby?.birthDate ?? todayISO());
    setSex(baby?.sex ?? "not yet");
    setNote(baby?.note ?? "");
    setPhotoKey(baby?.photoKey);
    setBusy(false);
  }, [open, baby]);

  async function onPickPhoto(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      setPhotoKey(await savePhoto(file));
    } finally {
      setBusy(false);
    }
  }

  function save() {
    if (!name.trim()) {
      toast.error("Please give your baby a name.");
      return;
    }
    if (!birthDate) {
      toast.error("Please add a birth date.");
      return;
    }
    const base = {
      name: name.trim(),
      birthDate,
      sex,
      ...(note.trim() ? { note: note.trim() } : {}),
      ...(photoKey ? { photoKey } : {}),
    };
    if (baby) {
      updateBaby(baby.id, base);
      toast.success("Details updated");
    } else {
      addBaby(base);
      toast.success(`${base.name} added — welcome!`);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{baby ? "Edit baby" : "Add a baby"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <label className="relative cursor-pointer">
              <PhotoImg
                photoKey={photoKey}
                alt={name || "Baby photo"}
                className="h-16 w-16 rounded-full"
              />
              <span className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Camera className="h-3.5 w-3.5" aria-hidden />
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onPickPhoto(e.target.files?.[0])}
              />
            </label>
            <p className="text-sm text-muted-foreground">
              Tap the circle to add a photo. Everything stays on this device.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="baby-name">Name</Label>
            <Input
              id="baby-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lina"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="baby-birth">Birth date</Label>
            <Input
              id="baby-birth"
              type="date"
              value={birthDate}
              max={todayISO()}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Sex</Label>
            <Select value={sex} onValueChange={(v) => setSex(v as typeof sex)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="girl">Girl</SelectItem>
                <SelectItem value="boy">Boy</SelectItem>
                <SelectItem value="not yet">Not yet known</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="baby-note">Note (optional)</Label>
            <Textarea
              id="baby-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything you'd like to remember"
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={busy}>
            {baby ? "Save changes" : "Add baby"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
