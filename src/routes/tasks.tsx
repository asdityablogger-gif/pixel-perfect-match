import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addTask, removeItem, updateItem, useAppData } from "@/lib/store";
import { todayISO } from "@/lib/date-utils";
import { scheduleReminder } from "@/lib/notify";
import type { TaskEntry } from "@/lib/types";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoBabyNotice } from "@/components/no-baby-notice";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks & shopping · Baby Help Buddy" },
      {
        name: "description",
        content: "To-dos, reminders and the shopping list for baby supplies.",
      },
      { property: "og:title", content: "Tasks & shopping · Baby Help Buddy" },
      {
        property: "og:description",
        content: "To-dos, reminders and the shopping list for baby supplies.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TasksPage,
});

type Tab = "task" | "shopping";

function TasksPage() {
  const data = useAppData();
  const [tab, setTab] = useState<Tab>("task");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [assignee, setAssignee] = useState("");
  const [reminderAt, setReminderAt] = useState("");

  // Re-arm any task reminders each time the app opens this page.
  useEffect(() => {
    for (const t of data.tasks) {
      if (t.reminderAt && !t.done) {
        scheduleReminder(t.id, t.reminderAt, "Baby Help Buddy", t.title);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = useMemo(
    () =>
      data.tasks.filter(
        (t) => t.category === tab && !t.done && t.babyId !== "archived",
      ),
    [data.tasks, tab],
  );
  const done = useMemo(
    () => data.tasks.filter((t) => t.category === tab && t.done),
    [data.tasks, tab],
  );
  const sorted = useMemo(
    () =>
      [...open].sort((a, b) => (a.due ?? "9999").localeCompare(b.due ?? "9999")),
    [open],
  );

  function save() {
    if (!title.trim()) {
      toast.error("Give it a name first.");
      return;
    }
    const baby = data.babies.find((b) => b.id === data.activeBabyId);
    addTask({
      title: title.trim(),
      category: tab,
      ...(baby ? { babyId: baby.id } : {}),
      ...(due ? { due } : {}),
      ...(assignee.trim() ? { assignee: assignee.trim() } : {}),
      ...(reminderAt ? { reminderAt } : {}),
    });
    if (reminderAt) {
      scheduleReminder(
        `${tab}:${title.trim()}`,
        reminderAt,
        "Baby Help Buddy",
        title.trim(),
      );
    }
    toast.success(tab === "task" ? "Task added" : "Added to the list");
    setTitle("");
    setDue("");
    setAssignee("");
    setReminderAt("");
    setDialogOpen(false);
  }

  function toggle(t: TaskEntry) {
    const patch: Partial<TaskEntry> = { done: !t.done };
    if (!t.done) patch.doneAt = new Date().toISOString();
    updateItem("tasks", t.id, patch);
  }

  function row(t: TaskEntry) {
    const overdue = !!t.due && t.due < todayISO();
    return (
      <Card key={t.id} className="py-2.5">
        <CardContent className="flex items-center gap-2.5 px-3">
          <button
            type="button"
            aria-label={t.done ? "Mark as not done" : "Mark as done"}
            onClick={() => toggle(t)}
            className="shrink-0"
          >
            {t.done ? (
              <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />
            ) : (
              <Circle
                className="h-5 w-5 text-muted-foreground"
                aria-hidden
              />
            )}
          </button>
          <div className="min-w-0 flex-1">
            <p
              className={
                "truncate text-sm font-semibold " +
                (t.done ? "text-muted-foreground line-through" : "")
              }
            >
              {t.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {[
                t.due
                  ? overdue && !t.done
                    ? `overdue — ${t.due}`
                    : t.due === todayISO()
                      ? "today"
                      : t.due
                  : "",
                t.assignee ? `for ${t.assignee}` : "",
                t.reminderAt ? "⏰ reminder set" : "",
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Delete"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => {
              removeItem("tasks", t.id);
              toast.success("Deleted");
            }}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (data.babies.length === 0) {
    // Tasks work without a baby too, but the notice keeps onboarding clear.
    return (
      <div className="grid gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Tasks & shopping
          </h1>
          <p className="text-sm text-muted-foreground">
            You can add tasks without a baby, too.
          </p>
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList className="w-full">
            <TabsTrigger value="task" className="flex-1">
              To-dos
            </TabsTrigger>
            <TabsTrigger value="shopping" className="flex-1">
              Shopping
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <TaskList
          tab={tab}
          sorted={sorted}
          done={done}
          row={row}
          openDialog={() => setDialogOpen(true)}
        />
        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={title}
          setTitle={setTitle}
          due={due}
          setDue={setDue}
          assignee={assignee}
          setAssignee={setAssignee}
          reminderAt={reminderAt}
          setReminderAt={setReminderAt}
          onSave={save}
          tab={tab}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Tasks & shopping
          </h1>
          <p className="text-sm text-muted-foreground">
            {tab === "task"
              ? "Little to-dos, with reminders if you want them."
              : "Diapers, wipes, that thing you keep forgetting."}
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" aria-hidden /> Add
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList className="w-full">
          <TabsTrigger value="task" className="flex-1">
            To-dos
          </TabsTrigger>
          <TabsTrigger value="shopping" className="flex-1">
            Shopping
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <TaskList
        tab={tab}
        sorted={sorted}
        done={done}
        row={row}
        openDialog={() => setDialogOpen(true)}
      />

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={title}
        setTitle={setTitle}
        due={due}
        setDue={setDue}
        assignee={assignee}
        setAssignee={setAssignee}
        reminderAt={reminderAt}
        setReminderAt={setReminderAt}
        onSave={save}
        tab={tab}
      />
    </div>
  );
}

function TaskList({
  tab,
  sorted,
  done,
  row,
  openDialog,
}: {
  tab: Tab;
  sorted: TaskEntry[];
  done: TaskEntry[];
  row: (t: TaskEntry) => React.ReactNode;
  openDialog: () => void;
}) {
  return (
    <div className="grid gap-2">
      {sorted.length === 0 && done.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <ShoppingCart
            className="mx-auto h-8 w-8 text-muted-foreground"
            aria-hidden
          />
          <p className="mt-3 font-semibold">
            {tab === "task" ? "Nothing to do" : "The list is empty"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {tab === "task"
              ? "Add a task, or enjoy the quiet."
              : "Add what you need before the next outing."}
          </p>
          <Button
            variant="outline"
            className="mt-4 rounded-full"
            onClick={openDialog}
          >
            <Plus className="h-4 w-4" aria-hidden /> Add
          </Button>
        </div>
      ) : (
        <>
          {sorted.map(row)}
          {done.length > 0 && (
            <div className="mt-2 grid gap-2">
              <h3 className="text-xs font-semibold text-muted-foreground">
                Done
              </h3>
              {done.map(row)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TaskDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  setTitle: (v: string) => void;
  due: string;
  setDue: (v: string) => void;
  assignee: string;
  setAssignee: (v: string) => void;
  reminderAt: string;
  setReminderAt: (v: string) => void;
  onSave: () => void;
  tab: Tab;
}) {
  const p = props;
  return (
    <Dialog open={p.open} onOpenChange={p.onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {p.tab === "task" ? "New task" : "Add to shopping list"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">
              {p.tab === "task" ? "What needs doing?" : "What do you need?"}
            </Label>
            <Input
              id="task-title"
              value={p.title}
              onChange={(e) => p.setTitle(e.target.value)}
              placeholder={p.tab === "task" ? "Book 6-week checkup" : "Diapers size 2"}
              onKeyDown={(e) => {
                if (e.key === "Enter") p.onSave();
              }}
            />
          </div>
          {p.tab === "task" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="task-due">Due date</Label>
                <Input
                  id="task-due"
                  type="date"
                  value={p.due}
                  onChange={(e) => p.setDue(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-assignee">For whom</Label>
                <Input
                  id="task-assignee"
                  value={p.assignee}
                  onChange={(e) => p.setAssignee(e.target.value)}
                  placeholder="optional"
                />
              </div>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="task-reminder">Remind me at</Label>
            <Input
              id="task-reminder"
              type="datetime-local"
              value={p.reminderAt}
              onChange={(e) => p.setReminderAt(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => p.onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={p.onSave}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
