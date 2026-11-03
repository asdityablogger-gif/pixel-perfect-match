/** Date helpers. All functions work in the browser's local timezone. */

export function todayISO(): string {
  const d = new Date();
  return localDateISO(d);
}

export function localDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function dateFromISO(iso: string): Date {
  // "YYYY-MM-DD" parsed as local date, "YYYY-MM-DDTHH:mm" as local time.
  if (iso.length <= 10) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y ?? 2020, (m ?? 1) - 1, d ?? 1);
  }
  if (iso.length <= 16) {
    const [datePart = iso, timePart] = iso.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    const [hh, mm] = (timePart ?? "00:00").split(":").map(Number);
    return new Date(y ?? 2020, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0);
  }
  return new Date(iso);
}

export function nowLocalISO(): string {
  const d = new Date();
  return `${localDateISO(d)}T${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(iso: string): boolean {
  return isSameDay(dateFromISO(iso), new Date());
}

export function fmtTime(iso: string): string {
  const d = dateFromISO(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function fmtDate(iso: string): string {
  const d = dateFromISO(iso);
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function fmtDateShort(iso: string): string {
  const d = dateFromISO(iso);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

/** "2h 15m ago" style relative time, or the time if today. */
export function relTime(iso: string): string {
  const then = dateFromISO(iso).getTime();
  const diff = Date.now() - then;
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24 && isToday(iso)) return `${h}h ${min % 60}m ago`;
  if (isToday(iso)) return fmtTime(iso);
  return fmtDateShort(iso);
}

export function durationStr(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
}

/** Human age from a birth date: "2 months, 1 week" / "1 year, 2 months". */
export function formatAge(birthDate: string): string {
  const birth = dateFromISO(birthDate);
  const now = new Date();
  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  // Subtract one month if the day-of-month hasn't been reached yet.
  if (now.getDate() < birth.getDate()) months -= 1;
  if (months < 0) {
    const days = Math.max(
      0,
      Math.floor((now.getTime() - birth.getTime()) / 86400000),
    );
    if (days <= 1) return "newborn";
    const weeks = Math.floor(days / 7);
    return weeks <= 1 ? `${days} days old` : `${weeks} weeks old`;
  }
  if (months === 0) {
    const days = Math.floor((now.getTime() - birth.getTime()) / 86400000);
    const weeks = Math.floor(days / 7);
    return weeks < 1 ? `${days} days old` : `${weeks} weeks old`;
  }
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return rest === 0 ? `${months} months old` : `${months} months old`;
  return rest === 0
    ? `${years} ${years === 1 ? "year" : "years"} old`
    : `${years} ${years === 1 ? "year" : "years"}, ${rest} ${
        rest === 1 ? "month" : "months"
      } old`;
}

export function ageInMonths(birthDate: string, ref?: Date): number {
  const birth = dateFromISO(birthDate);
  const now = ref ?? new Date();
  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  return Math.max(0, months);
}

export function minutesBetween(a: string, b: string): number {
  return (dateFromISO(b).getTime() - dateFromISO(a).getTime()) / 60000;
}

/** ISO datetime for a local date + "HH:mm" time today (or that date). */
export function combineDateTime(dateISO: string, time: string): string {
  return `${dateISO}T${time}`;
}

export function splitISO(iso: string): { date: string; time: string } {
  const [date = iso, time = ""] = iso.split("T");
  return { date, time: time.slice(0, 5) };
}

export function lastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(localDateISO(d));
  }
  return out;
}
