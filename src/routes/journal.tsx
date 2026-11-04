import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NotebookPen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { removeItem, saveCheckIn, useAppData } from "@/lib/store";
import { groupByDay } from "@/lib/selectors";
import { fmtDate, todayISO } from "@/lib/date-utils";
import type { CheckIn } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Daily journal · Baby Help Buddy" },
      {
        name: "description",
        content: "A one-minute daily check-in: mood, a note and one good thing.",
      },
      { property: "og:title", content: "Daily journal · Baby Help Buddy" },
      {
        property: "og:description",
        content: "A one-minute daily check-in: mood, a note and one good thing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JournalPage,
});

const MOODS: { value: CheckIn["mood"]; emoji: string; label: string }[] = [
  { value: 1, emoji: "😞", label: "Rough day" },
  { value: 2, emoji: "😕", label: "Struggling" },
  { value: 3, emoji: "😐", label: "Getting by" },
  { value: 4, emoji: "🙂", label: "Good day" },
  { value: 5, emoji: "😄", label: "Great day" },
];

function JournalPage() {
  const data = useAppData();
  const [mood, setMood] = useState<CheckIn["mood"]>(4);
  const [note, setNote] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [editingId, setEditingId] = useState<string | undefined>();

  const todays = data.checkIns.filter((c) => c.date === todayISO());
  const todayEntry = todays[0];
  const days = groupByDay(
    [...data.checkIns].sort((a, b) => b.date.localeCompare(a.date)),
    (c) => c.date,
  );

  useEffect(() => {
    if (todayEntry) {
      setEditingId(todayEntry.id);
      setMood(todayEntry.mood);
      setNote(todayEntry.note ?? "");
      setGratitude(todayEntry.gratitude ?? "");
    }
    // Prefill only once on mount; typing afterwards must not be reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function save() {
    saveCheckIn(
      {
        date: todayISO(),
        mood,
        ...(note.trim() ? { note: note.trim() } : {}),
        ...(gratitude.trim() ? { gratitude: gratitude.trim() } : {}),
      },
      editingId,
    );
    toast.success(editingId ? "Check-in updated" : "Check-in saved 💛");
    setEditingId(todayEntry?.id);
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Daily journal</h1>
        <p className="text-sm text-muted-foreground">
          One minute for you — how is today treating you?
        </p>
      </div>

      <Card className="py-4">
        <CardContent className="grid gap-4 px-4">
          <div className="grid gap-2">
            <Label>Mood today</Label>
            <div className="flex justify-between gap-1">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  aria-label={m.label}
                  aria-pressed={mood === m.value}
                  onClick={() => setMood(m.value)}
                  className={
                    "flex flex-1 flex-col items-center gap-0.5 rounded-xl border py-2 text-2xl transition-colors " +
                    (mood === m.value
                      ? "border-primary bg-accent"
                      : "hover:bg-accent/60")
                  }
                >
                  <span>{m.emoji}</span>
                  <span className="text-[9px] leading-none font-semibold text-muted-foreground">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="journal-note">How did it go? (optional)</Label>
            <Textarea
              id="journal-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Wins, worries, funny moments…"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="journal-gratitude">One good thing (optional)</Label>
            <Textarea
              id="journal-gratitude"
              rows={2}
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="e.g. first proper belly laugh"
            />
          </div>
          <Button className="rounded-full" onClick={save}>
            {editingId ? "Update today's check-in" : "Save check-in"}
          </Button>
        </CardContent>
      </Card>

      {days.length > 0 && (
        <section className="grid gap-2">
          <h2 className="text-sm font-bold text-muted-foreground">
            Past check-ins
          </h2>
          {days.map(([day, items]) => (
            <section key={day} className="grid gap-2">
              <h3 className="text-xs font-semibold text-muted-foreground">
                {day === todayISO() ? "Today" : fmtDate(day)}
              </h3>
              {items.map((c) => {
                const m = MOODS.find((x) => x.value === c.mood) ?? MOODS[3]!;
                return (
                  <Card key={c.id} className="py-3">
                    <CardContent className="flex items-start gap-3 px-3">
                      <span className="text-2xl" aria-hidden>
                        {m.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        {c.note && (
                          <p className="text-sm whitespace-pre-wrap">{c.note}</p>
                        )}
                        {c.gratitude && (
                          <p className="mt-1 text-sm text-primary">
                            💛 {c.gratitude}
                          </p>
                        )}
                        {!c.note && !c.gratitude && (
                          <p className="text-sm text-muted-foreground">{m.label}</p>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Delete check-in"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          removeItem("checkIns", c.id);
                          if (c.id === editingId) setEditingId(undefined);
                          toast.success("Check-in removed");
                        }}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </section>
          ))}
        </section>
      )}

      {days.length === 0 && (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <NotebookPen
            className="mx-auto h-8 w-8 text-muted-foreground"
            aria-hidden
          />
          <p className="mt-3 font-semibold">No check-ins yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Parenting is a marathon — checking in daily helps you see how far
            you've come.
          </p>
        </div>
      )}
    </div>
  );
}
