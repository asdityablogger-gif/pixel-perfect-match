/** Local notifications for reminders. Fully offline: uses the browser's
 * Notification API while the app is open. In a Capacitor Android shell this
 * maps to the native local-notification behaviour via the web bridge. */

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notificationPermission(): NotificationPermission | "unsupported" {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<
  NotificationPermission | "unsupported"
> {
  if (!notificationsSupported()) return "unsupported";
  if (Notification.permission === "default") {
    try {
      return await Notification.requestPermission();
    } catch {
      return "denied";
    }
  }
  return Notification.permission;
}

export function showNotification(title: string, body: string) {
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/icon-192.png" });
  } catch {
    // Some browsers require a service worker; ignore silently.
  }
}

type Pending = { at: number; title: string; body: string; timer: number };

const pending = new Map<string, Pending>();

/** Schedule an in-app local notification. Returns false if the time is past. */
export function scheduleReminder(
  id: string,
  whenISO: string,
  title: string,
  body: string,
): boolean {
  cancelReminder(id);
  const at = new Date(whenISO).getTime();
  const delay = at - Date.now();
  if (!Number.isFinite(delay) || delay <= 0) return false;
  const timer = window.setTimeout(() => {
    pending.delete(id);
    showNotification(title, body);
  }, Math.min(delay, 2_147_000_000));
  pending.set(id, { at, title, body, timer });
  return true;
}

export function cancelReminder(id: string) {
  const p = pending.get(id);
  if (p) {
    window.clearTimeout(p.timer);
    pending.delete(id);
  }
}

/** Re-schedule every stored reminder (called once when the app opens). */
export function rescheduleAll(
  tasks: { id: string; reminderAt?: string; title: string }[],
) {
  for (const t of tasks) {
    if (t.reminderAt) {
      scheduleReminder(t.id, t.reminderAt, "Baby Help Buddy", t.title);
    }
  }
}
