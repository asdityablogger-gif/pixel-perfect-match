import type { AppData, Baby } from "./types";

export function activeBaby(d: AppData): Baby | undefined {
  return d.babies.find((b) => b.id === d.activeBabyId) ?? d.babies[0];
}

export function forBaby<T extends { babyId: string }>(
  list: T[],
  babyId: string,
): T[] {
  return list.filter((r) => r.babyId === babyId);
}

/** Group items by calendar day (from an ISO string), newest day first. */
export function groupByDay<T>(items: T[], isoOf: (t: T) => string): [string, T[]][] {
  const map = new Map<string, T[]>();
  for (const it of items) {
    const day = isoOf(it).slice(0, 10);
    const arr = map.get(day);
    if (arr) arr.push(it);
    else map.set(day, [it]);
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

export function todayBabies(babies: Baby[]) {
  return babies;
}
