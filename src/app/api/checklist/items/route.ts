// Data referensi checklist untuk area user (di-cache di HP saat online).
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!user.areaId || !user.area) {
    return NextResponse.json({ area: null, items: [] });
  }
  const items = await prisma.checklistItem.findMany({
    where: { areaId: user.areaId },
    orderBy: { urutan: "asc" },
  });
  return NextResponse.json({
    area: { id: user.area.id, nama: user.area.nama },
    items: items.map((i) => ({ id: i.id, teks: i.teks, urutan: i.urutan })),
  });
}
