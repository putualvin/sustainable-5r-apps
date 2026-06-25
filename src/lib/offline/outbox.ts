// Outbox: antrean perubahan lokal yang menunggu sync ke server.
// Setiap aksi input saat offline disimpan di sini, lalu di-flush saat online.
"use client";

import { STORE_OUTBOX, idbPut, idbGetAll, idbDelete } from "./db";

export interface OutboxItem {
  id: string; // id lokal unik
  entity: string; // jenis data, mis. "checklistEntry"
  dedupeKey?: string; // bila diisi, item lama dengan key sama akan diganti
  payload: Record<string, unknown>;
  createdAt: number;
}

export function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.floor(Math.random() * 1e9).toString(16)}`;
}

/** Tambah perubahan ke antrean. dedupeKey mencegah duplikat (mis. toggle bolak-balik). */
export async function enqueue(
  entity: string,
  payload: Record<string, unknown>,
  dedupeKey?: string,
): Promise<void> {
  if (dedupeKey) {
    const all = await idbGetAll<OutboxItem>(STORE_OUTBOX);
    for (const it of all) {
      if (it.entity === entity && it.dedupeKey === dedupeKey) {
        await idbDelete(STORE_OUTBOX, it.id);
      }
    }
  }
  const item: OutboxItem = { id: uid(), entity, dedupeKey, payload, createdAt: Date.now() };
  await idbPut(STORE_OUTBOX, item);
}

export async function pending(): Promise<OutboxItem[]> {
  const all = await idbGetAll<OutboxItem>(STORE_OUTBOX);
  return all.sort((a, b) => a.createdAt - b.createdAt);
}

export async function removeItem(id: string): Promise<void> {
  await idbDelete(STORE_OUTBOX, id);
}

export async function pendingCount(): Promise<number> {
  return (await idbGetAll<OutboxItem>(STORE_OUTBOX)).length;
}
