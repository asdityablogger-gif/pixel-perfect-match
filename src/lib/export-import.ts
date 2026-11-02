import { replaceAll, getData } from "./store";
import { exportPhotos, importPhotos } from "./photo-store";
import type { AppData } from "./types";

export interface BackupFile {
  app: "baby-help-buddy";
  version: 1;
  exportedAt: string;
  data: AppData;
  photos: Record<string, string>;
}

export async function buildBackup(): Promise<BackupFile> {
  return {
    app: "baby-help-buddy",
    version: 1,
    exportedAt: new Date().toISOString(),
    data: getData(),
    photos: await exportPhotos(),
  };
}

export async function downloadBackup() {
  const backup = await buildBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `baby-help-buddy-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Restores a backup file. Photos not referenced anywhere are simply kept. */
export async function restoreBackup(file: File): Promise<{ ok: boolean; error?: string }> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    return { ok: false, error: "That file is not valid JSON." };
  }
  const b = parsed as Partial<BackupFile>;
  if (!b || b.app !== "baby-help-buddy" || !b.data) {
    return { ok: false, error: "This file doesn't look like a Baby Help Buddy backup." };
  }
  if (b.photos && typeof b.photos === "object") {
    try {
      await importPhotos(b.photos);
    } catch {
      // Photos are optional; continue with the structured data.
    }
  }
  replaceAll(b.data as AppData);
  return { ok: true };
}
