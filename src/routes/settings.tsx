import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import {
  Bell,
  BellOff,
  Download,
  Info,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useAppData, removeBaby } from "@/lib/store";
import { downloadBackup, restoreBackup } from "@/lib/export-import";
import {
  notificationPermission,
  requestNotificationPermission,
} from "@/lib/notify";
import { formatAge } from "@/lib/date-utils";
import type { Baby } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BabyDialog } from "@/components/baby-dialog";
import { PhotoImg } from "@/components/photo";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Baby Help Buddy" },
      {
        name: "description",
        content: "Manage babies, back up your data, and set up reminders.",
      },
      { property: "og:title", content: "Settings · Baby Help Buddy" },
      {
        property: "og:description",
        content: "Manage babies, back up your data, and set up reminders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-2">
      <h2 className="text-sm font-bold text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

function SettingsPage() {
  const data = useAppData();
  const [editing, setEditing] = useState<Baby | undefined>();
  const [babyDialogOpen, setBabyDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<Baby | undefined>();
  const [permission, setPermission] = useState(notificationPermission());
  const fileRef = useRef<HTMLInputElement>(null);

  async function onImport(file: File | undefined) {
    if (!file) return;
    const res = await restoreBackup(file);
    if (res.ok) {
      toast.success("Backup restored — welcome back!");
    } else {
      toast.error(res.error ?? "Restore failed.");
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Babies, backups and reminders.
        </p>
      </div>

      <Section title="Babies">
        <div className="grid gap-2">
          {data.babies.map((b) => (
            <Card key={b.id} className="py-3">
              <CardContent className="flex items-center gap-3 px-3">
                <PhotoImg
                  photoKey={b.photoKey}
                  alt={b.name}
                  className="h-10 w-10 rounded-full"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{b.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatAge(b.birthDate)}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Edit ${b.name}`}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setEditing(b);
                    setBabyDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Delete ${b.name}`}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setDeleting(b)}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </Button>
              </CardContent>
            </Card>
          ))}
          {data.babies.length === 0 && (
            <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              No babies added yet — use the button at the top of the screen.
            </p>
          )}
          <BabyDialog
            open={babyDialogOpen}
            onOpenChange={setBabyDialogOpen}
            baby={editing}
          />
          <AlertDialog
            open={!!deleting}
            onOpenChange={(open) => !open && setDeleting(undefined)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove {deleting?.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes {deleting?.name} and every record for
                  them — feeds, sleeps, growth, photos, everything. Consider
                  exporting a backup first.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={() => {
                    if (deleting) {
                      removeBaby(deleting.id);
                      toast.success(`${deleting.name} removed`);
                    }
                    setDeleting(undefined);
                  }}
                >
                  Remove everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Section>

      <Section title="Backup & restore">
        <Card className="py-4">
          <CardContent className="grid gap-3 px-4">
            <p className="text-sm text-muted-foreground">
              Everything lives only on this device, so backups are how you move
              your data to a new phone or keep it safe. A backup is a single
              file with all records and photos.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                className="rounded-full"
                onClick={async () => {
                  await downloadBackup();
                  toast.success("Backup file downloaded");
                }}
              >
                <Download className="h-4 w-4" aria-hidden /> Export backup
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-4 w-4" aria-hidden /> Restore backup
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="sr-only"
                aria-label="Restore from backup file"
                onChange={(e) => onImport(e.target.files?.[0])}
              />
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Reminders">
        <Card className="py-4">
          <CardContent className="grid gap-3 px-4">
            <p className="text-sm text-muted-foreground">
              Get a gentle nudge when a task reminder you set comes due. Works
              while the app is open — no account, no internet needed.
            </p>
            {permission === "granted" ? (
              <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Bell className="h-4 w-4" aria-hidden /> Notifications are on
              </p>
            ) : permission === "denied" ? (
              <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
                <BellOff className="h-4 w-4" aria-hidden /> Notifications are
                blocked — enable them in your browser settings.
              </p>
            ) : (
              <Button
                className="w-fit rounded-full"
                onClick={async () => {
                  const p = await requestNotificationPermission();
                  setPermission(p);
                  if (p === "granted") toast.success("Reminders enabled");
                }}
              >
                <Bell className="h-4 w-4" aria-hidden /> Enable notifications
              </Button>
            )}
          </CardContent>
        </Card>
      </Section>

      <Section title="About">
        <Card className="py-4">
          <CardContent className="grid gap-2 px-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2 font-semibold text-foreground">
              <Info className="h-4 w-4" aria-hidden /> Baby Help Buddy
            </p>
            <p>
              An offline-first companion for the early days: trackers, guides
              and a place for the little moments. No account, no cloud, no
              tracking — your data never leaves your device unless you export
              it.
            </p>
            <p className="text-xs">
              The guides and articles are general information, not medical
              advice. When something feels wrong, contact your midwife, doctor
              or health line.
            </p>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
