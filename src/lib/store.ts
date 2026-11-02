import { useSyncExternalStore } from "react";
import type {
  AppData,
  Baby,
  CollectionKey,
  TaskEntry,
  CheckIn,
} from "./types";

const STORAGE_KEY = "bhb.data.v1";

export function emptyData(): AppData {
  return {
    version: 1,
    babies: [],
    activeBabyId: null,
    feedings: [],
    sleeps: [],
    careLogs: [],
    growth: [],
    milestones: [],
    memories: [],
    checkIns: [],
    tasks: [],
  };
}

function sanitize(input: unknown): AppData {
  const base = emptyData();
  if (!input || typeof input !== "object") return base;
  const d = input as Partial<AppData>;
  const out: AppData = {
    ...base,
    ...(d as AppData),
    babies: Array.isArray(d.babies) ? d.babies : [],
    feedings: Array.isArray(d.feedings) ? d.feedings : [],
    sleeps: Array.isArray(d.sleeps) ? d.sleeps : [],
    careLogs: Array.isArray(d.careLogs) ? d.careLogs : [],
    growth: Array.isArray(d.growth) ? d.growth : [],
    milestones: Array.isArray(d.milestones) ? d.milestones : [],
    memories: Array.isArray(d.memories) ? d.memories : [],
    checkIns: Array.isArray(d.checkIns) ? d.checkIns : [],
    tasks: Array.isArray(d.tasks) ? d.tasks : [],
  };
  if (out.activeBabyId && !out.babies.some((b) => b.id === out.activeBabyId)) {
    out.activeBabyId = out.babies[0]?.id ?? null;
  }
  return out;
}

let data: AppData = emptyData();
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage may be full or unavailable; keep the in-memory state working.
  }
}

/** Load persisted data on the client. Scheduled so the first render (and SSR)
 * still sees empty state, avoiding hydration mismatches. */
export function hydrateStore() {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    data = sanitize(raw ? JSON.parse(raw) : null);
  } catch {
    data = emptyData();
  }
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  setTimeout(hydrateStore, 0);
}

function emit() {
  listeners.forEach((l) => l());
}

export function getData(): AppData {
  return data;
}

export function getServerData(): AppData {
  return emptyData();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, getData, getServerData);
}

export function update(mutate: (draft: AppData) => void) {
  const next: AppData = sanitize(JSON.parse(JSON.stringify(data)));
  mutate(next);
  data = next;
  persist();
  emit();
}

export function replaceAll(next: AppData) {
  data = sanitize(next);
  persist();
  emit();
}

// ---------- babies ----------

export function addBaby(baby: Omit<Baby, "id" | "createdAt">): Baby {
  const full: Baby = {
    ...baby,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  update((d) => {
    d.babies.push(full);
    d.activeBabyId = full.id;
  });
  return full;
}

export function updateBaby(id: string, patch: Partial<Baby>) {
  update((d) => {
    const b = d.babies.find((x) => x.id === id);
    if (b) Object.assign(b, patch);
  });
}

/** Deletes a baby plus every record that belongs to them. */
export function removeBaby(id: string) {
  update((d) => {
    d.babies = d.babies.filter((b) => b.id !== id);
    d.feedings = d.feedings.filter((r) => r.babyId !== id);
    d.sleeps = d.sleeps.filter((r) => r.babyId !== id);
    d.careLogs = d.careLogs.filter((r) => r.babyId !== id);
    d.growth = d.growth.filter((r) => r.babyId !== id);
    d.milestones = d.milestones.filter((r) => r.babyId !== id);
    d.memories = d.memories.filter((r) => r.babyId !== id);
    d.tasks = d.tasks.filter((r) => r.babyId !== id);
    if (d.activeBabyId === id) d.activeBabyId = d.babies[0]?.id ?? null;
  });
}

export function setActiveBaby(id: string | null) {
  update((d) => {
    d.activeBabyId = id;
  });
}

// ---------- generic record collections ----------

export function addItem<K extends CollectionKey>(
  key: K,
  item: AppData[K][number],
) {
  update((d) => {
    (d[key] as unknown as AppData[K]).unshift(item as never);
  });
}

export function updateItem<K extends CollectionKey>(
  key: K,
  id: string,
  patch: Partial<AppData[K][number]>,
) {
  update((d) => {
    const list = d[key] as { id: string }[];
    const idx = list.findIndex((r) => r.id === id);
    if (idx >= 0) Object.assign(list[idx], patch);
  });
}

export function removeItem<K extends CollectionKey>(key: K, id: string) {
  update((d) => {
    const list = d[key] as { id: string }[];
    const idx = list.findIndex((r) => r.id === id);
    if (idx >= 0) list.splice(idx, 1);
  });
}

// ---------- convenience ----------

export function addTask(
  task: Omit<TaskEntry, "id" | "createdAt" | "done"> & { done?: boolean },
) {
  addItem("tasks", {
    done: false,
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  } as TaskEntry);
}

export function saveCheckIn(
  entry: Omit<CheckIn, "id" | "createdAt">,
  existingId?: string,
) {
  if (existingId) {
    updateItem("checkIns", existingId, entry);
  } else {
    addItem("checkIns", {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
  }
}
