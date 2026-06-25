// Wrapper IndexedDB minimal (tanpa dependency) untuk offline-first.
// Dipakai oleh outbox (antrean sync) & cache data referensi.
"use client";

const DB_NAME = "s5r-offline";
const DB_VERSION = 1;

export const STORE_OUTBOX = "outbox"; // antrean perubahan menunggu sync ke server
export const STORE_REFDATA = "refdata"; // cache data referensi & draft lokal

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_OUTBOX)) {
        db.createObjectStore(STORE_OUTBOX, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_REFDATA)) {
        db.createObjectStore(STORE_REFDATA, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run<T>(
  store: string,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest,
): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(store, mode);
        const req = fn(tx.objectStore(store));
        req.onsuccess = () => resolve(req.result as T);
        req.onerror = () => reject(req.error);
        tx.oncomplete = () => db.close();
      }),
  );
}

export function idbPut(store: string, value: unknown) {
  return run<IDBValidKey>(store, "readwrite", (s) => s.put(value as never));
}
export function idbGet<T>(store: string, key: IDBValidKey) {
  return run<T | undefined>(store, "readonly", (s) => s.get(key));
}
export function idbGetAll<T>(store: string) {
  return run<T[]>(store, "readonly", (s) => s.getAll());
}
export function idbDelete(store: string, key: IDBValidKey) {
  return run<undefined>(store, "readwrite", (s) => s.delete(key));
}

// Helper cache referensi (key/value sederhana).
export function refSet(key: string, value: unknown) {
  return idbPut(STORE_REFDATA, { key, value });
}
export async function refGet<T>(key: string): Promise<T | undefined> {
  const row = await idbGet<{ key: string; value: T }>(STORE_REFDATA, key);
  return row?.value;
}
