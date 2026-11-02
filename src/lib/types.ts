// Central data types for Baby Help Buddy.
// All structured records live in localStorage; photos live in IndexedDB.

export interface Baby {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  sex?: "girl" | "boy" | "not yet";
  photoKey?: string;
  note?: string;
  createdAt: string;
}

export type FeedingType = "breast" | "bottle" | "solid";

export interface FeedingEntry {
  id: string;
  babyId: string;
  type: FeedingType;
  side?: "left" | "right" | "both";
  durationMin?: number;
  amountMl?: number;
  food?: string;
  preference?: "liked" | "rejected" | "neutral";
  note?: string;
  startedAt: string; // ISO datetime
  endedAt?: string;
}

export interface SleepEntry {
  id: string;
  babyId: string;
  kind: "nap" | "night";
  start: string; // ISO datetime
  end?: string; // undefined = still sleeping
  interruptions?: number;
  note?: string;
}

export type CareKind =
  | "diaper"
  | "bath"
  | "hygiene"
  | "tummy"
  | "outdoor"
  | "activity"
  | "other";

export interface CareEntry {
  id: string;
  babyId: string;
  kind: CareKind;
  detail?: string;
  durationMin?: number;
  at: string; // ISO datetime
}

export interface GrowthEntry {
  id: string;
  babyId: string;
  date: string; // YYYY-MM-DD
  weightKg?: number;
  heightCm?: number;
  headCm?: number;
  note?: string;
}

export interface MilestoneEntry {
  id: string;
  babyId: string;
  title: string;
  date: string; // YYYY-MM-DD
  note?: string;
  photoKey?: string;
}

export interface MemoryEntry {
  id: string;
  babyId: string;
  title: string;
  date: string; // YYYY-MM-DD
  note?: string;
  photoKey?: string;
}

export interface CheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  mood: 1 | 2 | 3 | 4 | 5;
  note?: string;
  gratitude?: string;
  createdAt: string;
}

export interface TaskEntry {
  id: string;
  babyId?: string;
  title: string;
  category: "task" | "shopping";
  done: boolean;
  doneAt?: string;
  due?: string; // YYYY-MM-DD
  assignee?: string;
  reminderAt?: string; // ISO datetime
  createdAt: string;
}

export interface AppData {
  version: 1;
  babies: Baby[];
  activeBabyId: string | null;
  feedings: FeedingEntry[];
  sleeps: SleepEntry[];
  careLogs: CareEntry[];
  growth: GrowthEntry[];
  milestones: MilestoneEntry[];
  memories: MemoryEntry[];
  checkIns: CheckIn[];
  tasks: TaskEntry[];
}

export type CollectionKey =
  | "feedings"
  | "sleeps"
  | "careLogs"
  | "growth"
  | "milestones"
  | "memories"
  | "checkIns"
  | "tasks";

export type AppRecord = AppData[CollectionKey][number];
