// Sync engine: kirim antrean outbox ke endpoint server saat online.
// Server adalah sumber kebenaran (SQLite). Pola: kelompokkan per entity,
// kirim batch, hapus dari outbox bila server konfirmasi sukses.
"use client";

import { pending, removeItem, type OutboxItem } from "./outbox";

// Peta entity → endpoint sync. Tambah baris baru saat modul lain ikut offline.
const ENDPOINTS: Record<string, string> = {
  checklistEntry: "/api/checklist/sync",
};

export interface SyncResult {
  synced: number;
  failed: number;
  skipped: number;
}

export async function syncOutbox(): Promise<SyncResult> {
  const result: SyncResult = { synced: 0, failed: 0, skipped: 0 };
  if (typeof navigator !== "undefined" && !navigator.onLine) return result;

  const items = await pending();
  if (!items.length) return result;

  const byEntity = items.reduce<Record<string, OutboxItem[]>>((acc, it) => {
    (acc[it.entity] ??= []).push(it);
    return acc;
  }, {});

  for (const [entity, list] of Object.entries(byEntity)) {
    const url = ENDPOINTS[entity];
    if (!url) {
      result.skipped += list.length;
      continue;
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: list.map((i) => ({ _localId: i.id, ...i.payload })) }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      for (const it of list) {
        await removeItem(it.id);
        result.synced++;
      }
    } catch {
      // Biarkan di outbox; dicoba lagi pada kesempatan online berikutnya.
      result.failed += list.length;
    }
  }
  return result;
}
