// Terima batch jawaban checklist dari HP (outbox) → upsert ke SQLite.
// Idempoten: unik per (itemId, tanggal), jadi sync ulang aman.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

interface EntryInput {
  itemId: string;
  tanggal: string; // "YYYY-MM-DD"
  jawaban: string; // "YES" | "NO"
  catatan?: string | null;
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!user.areaId) return NextResponse.json({ error: "no-area" }, { status: 400 });

  const body = (await req.json().catch(() => null)) as { items?: EntryInput[] } | null;
  const items = body?.items ?? [];

  // Hanya terima item yang memang milik area user (jaga konsistensi).
  const validIds = new Set(
    (await prisma.checklistItem.findMany({ where: { areaId: user.areaId }, select: { id: true } })).map(
      (i) => i.id,
    ),
  );

  let count = 0;
  for (const it of items) {
    if (!validIds.has(it.itemId)) continue;
    if (it.jawaban !== "YES" && it.jawaban !== "NO") continue;
    await prisma.checklistEntry.upsert({
      where: { itemId_tanggal: { itemId: it.itemId, tanggal: it.tanggal } },
      update: { jawaban: it.jawaban, catatan: it.catatan ?? null },
      create: {
        itemId: it.itemId,
        tanggal: it.tanggal,
        jawaban: it.jawaban,
        catatan: it.catatan ?? null,
      },
    });
    count++;
  }
  return NextResponse.json({ ok: true, count });
}
