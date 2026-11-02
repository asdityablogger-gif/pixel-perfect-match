/** Photo storage in IndexedDB. Keys are UUIDs; values are image Blobs. */

const DB_NAME = "bhb-photos";
const STORE = "photos";
let dbPromise: Promise<IDBDatabase> | null = null;
const urlCache = new Map<string, string>();

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

export async function savePhoto(file: Blob | File): Promise<string> {
  const key = crypto.randomUUID();
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(file, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  return key;
}

export async function getPhotoBlob(key: string): Promise<Blob | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result as Blob | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function deletePhoto(key: string): Promise<void> {
  urlCache.delete(key);
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function listPhotoKeys(): Promise<string[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAllKeys();
    req.onsuccess = () => resolve(req.result as string[]);
    req.onerror = () => reject(req.error);
  });
}

/** Object URL for a stored photo (cached per session). */
export async function getPhotoUrl(key: string): Promise<string | undefined> {
  const cached = urlCache.get(key);
  if (cached) return cached;
  const blob = await getPhotoBlob(key);
  if (!blob) return undefined;
  const url = URL.createObjectURL(blob);
  urlCache.set(key, url);
  return url;
}

// ---------- export / import support ----------

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function exportPhotos(): Promise<Record<string, string>> {
  const keys = await listPhotoKeys();
  const out: Record<string, string> = {};
  for (const key of keys) {
    const blob = await getPhotoBlob(key);
    if (blob) out[key] = await blobToDataUrl(blob);
  }
  return out;
}

export async function importPhotos(photos: Record<string, string>) {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    for (const [key, dataUrl] of Object.entries(photos)) {
      fetch(dataUrl)
        .then((r) => r.blob())
        .then((blob) => store.put(blob, key));
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  urlCache.clear();
}
