/**
 * Seed data dummy realistis — Sustainable 5R Refinery 2 (demo).
 * Acuan: CLAUDE.md §5, §8. Scoring baseline divalidasi via src/lib/scoring.ts.
 *
 * Jalankan: npm run db:seed  (atau npm run db:reset untuk reset penuh)
 */
import { PrismaClient } from "@prisma/client";
import { hitungScore, type FindingStatus } from "../src/lib/scoring";

const prisma = new PrismaClient();

// ---------- 12 Area Refinery 2 ----------
const AREAS: { nama: string; grup: string }[] = [
  { nama: "Bleaching Area", grup: "Refinery" },
  { nama: "Deodorizing Area", grup: "Refinery" },
  { nama: "Process Area (RBD)", grup: "Refinery" },
  { nama: "Control Room Refinery", grup: "Refinery" },
  { nama: "Tank Farm", grup: "Refinery" },
  { nama: "Pump House", grup: "Refinery" },
  { nama: "Crystallization Area", grup: "Fractionation" },
  { nama: "Filtration Area", grup: "Fractionation" },
  { nama: "Control Room Fractionation", grup: "Fractionation" },
  { nama: "Workshop", grup: "Utilitas" },
  { nama: "Gudang Sparepart", grup: "Utilitas" },
  { nama: "Boiler & Utility", grup: "Utilitas" },
];

// ---------- 20 Guiding Question (5R × 4) ----------
const GUIDING: { prinsipR: string; teks: string }[] = [
  // RINGKAS (Seiri)
  { prinsipR: "RINGKAS", teks: "Barang tidak terpakai sudah disingkirkan dari area kerja" },
  { prinsipR: "RINGKAS", teks: "Tidak ada material berlebih menumpuk di lantai produksi" },
  { prinsipR: "RINGKAS", teks: "Barang diklasifikasikan berdasarkan frekuensi pemakaian" },
  { prinsipR: "RINGKAS", teks: "Tidak ada peralatan rusak yang dibiarkan di area" },
  // RAPI (Seiton)
  { prinsipR: "RAPI", teks: "Setiap barang memiliki tempat penyimpanan yang jelas" },
  { prinsipR: "RAPI", teks: "Label dan marking jelas pada rak, pipa, dan tangki" },
  { prinsipR: "RAPI", teks: "Jalur evakuasi & APAR tidak terhalang barang" },
  { prinsipR: "RAPI", teks: "Peralatan mudah ditemukan saat dibutuhkan (visual control)" },
  // RESIK (Seiso)
  { prinsipR: "RESIK", teks: "Area kerja bersih dari debu, ceceran, dan sampah" },
  { prinsipR: "RESIK", teks: "Mesin & peralatan dalam kondisi bersih terawat" },
  { prinsipR: "RESIK", teks: "Tidak ada ceceran oli/minyak di lantai" },
  { prinsipR: "RESIK", teks: "Saluran drainase bersih dan berfungsi baik" },
  // RAWAT (Seiketsu)
  { prinsipR: "RAWAT", teks: "Standar 5R terpampang dan dipahami pekerja area" },
  { prinsipR: "RAWAT", teks: "Jadwal pembersihan rutin dijalankan & terdokumentasi" },
  { prinsipR: "RAWAT", teks: "Kondisi 3R sebelumnya dipertahankan konsisten" },
  { prinsipR: "RAWAT", teks: "APD digunakan sesuai standar di area kerja" },
  // RAJIN (Shitsuke)
  { prinsipR: "RAJIN", teks: "Pekerja disiplin menjalankan checklist harian" },
  { prinsipR: "RAJIN", teks: "Temuan audit sebelumnya sudah ditindaklanjuti" },
  { prinsipR: "RAJIN", teks: "Budaya 5R menjadi kebiasaan, bukan paksaan" },
  { prinsipR: "RAJIN", teks: "Briefing 5R dilakukan rutin oleh PIC area" },
];

// ---------- Checklist item per grup (§5.6) ----------
const CHECKLIST_REFINERY = [
  "Lantai area bebas ceceran minyak",
  "APAR pada posisi & tekanan normal",
  "Label pipa terbaca jelas",
  "Tidak ada kebocoran pada flange/valve",
  "Area sekitar pompa bersih",
  "Tangga & railing bersih dan aman",
  "Sampah dibuang pada tempatnya",
  "Tools dikembalikan ke shadow board",
  "Penerangan area berfungsi normal",
  "Drainase tidak tersumbat",
  "Rambu K3 terpasang & terbaca",
  "Eyewash/safety shower berfungsi",
  "Logsheet operasi terisi lengkap",
  "Area bebas barang tidak terpakai",
];
const CHECKLIST_FRACTIONATION = [
  "Lantai filter press bersih",
  "Tidak ada ceceran stearin/olein",
  "Label tangki crystallizer jelas",
  "APAR tersedia & valid",
  "Tools tertata pada tempatnya",
  "Drainase area bersih",
  "Rambu K3 terpasang",
  "Logsheet terisi lengkap",
  "Penerangan berfungsi",
  "Area bebas sampah",
];

const RECURRING_TEXT = "Temuan berulang: ceceran oli di sekitar pompa belum tertangani (PIC area sama)";

async function main() {
  console.log("🌱 Mulai seed Sustainable 5R...");

  // Reset urutan agar idempoten
  await prisma.score.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.finding.deleteMany();
  await prisma.auditAssignment.deleteMany();
  await prisma.checklistEntry.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.redTagItem.deleteMany();
  await prisma.auditCycle.deleteMany();
  await prisma.guidingQuestion.deleteMany();
  await prisma.user.deleteMany();
  await prisma.area.deleteMany();

  // ----- Area -----
  const areas = [];
  for (const a of AREAS) {
    areas.push(await prisma.area.create({ data: a }));
  }
  const areaByName = Object.fromEntries(areas.map((a) => [a.nama, a]));
  console.log(`  ✓ ${areas.length} area dibuat`);

  // ----- Guiding Questions -----
  for (let i = 0; i < GUIDING.length; i++) {
    await prisma.guidingQuestion.create({
      data: { prinsipR: GUIDING[i].prinsipR, teks: GUIDING[i].teks, urutan: i + 1 },
    });
  }
  const gqs = await prisma.guidingQuestion.findMany({ orderBy: { urutan: "asc" } });
  console.log(`  ✓ ${gqs.length} guiding question dibuat`);

  // ----- Users (6 role) -----
  await prisma.user.create({ data: { nama: "Andi Setiawan", role: "ADMIN", email: "admin@sinarmas.co.id" } });
  const komite = await prisma.user.create({
    data: { nama: "Hendra Gunawan", role: "KOMITE", email: "komite@sinarmas.co.id" },
  });
  const auditor1 = await prisma.user.create({
    data: { nama: "Budi Santoso", role: "AUDITOR", email: "auditor1@sinarmas.co.id", areaId: areaByName["Workshop"].id },
  });
  const auditor2 = await prisma.user.create({
    data: { nama: "Sri Wahyuni", role: "AUDITOR", email: "auditor2@sinarmas.co.id", areaId: areaByName["Tank Farm"].id },
  });
  // Auditee / PIC area — beberapa area
  const piParaArea = ["Bleaching Area", "Deodorizing Area", "Process Area (RBD)", "Tank Farm", "Workshop"];
  const piNames = ["Ahmad Wijaya", "Siti Nurhaliza", "Dedi Pratama", "Rina Kartika", "Joko Susilo"];
  for (let i = 0; i < piParaArea.length; i++) {
    await prisma.user.create({
      data: {
        nama: piNames[i],
        role: "AUDITEE",
        email: `auditee${i + 1}@sinarmas.co.id`,
        areaId: areaByName[piParaArea[i]].id,
      },
    });
  }
  await prisma.user.create({ data: { nama: "Putri Lestari", role: "REDTAG", email: "redtag@sinarmas.co.id" } });
  await prisma.user.create({ data: { nama: "Bambang Sutejo", role: "MANAGEMENT", email: "management@sinarmas.co.id" } });
  console.log(`  ✓ ${await prisma.user.count()} user (6 role) dibuat`);

  // ----- Checklist items per area (sebagian sengaja kosong → empty state §5.6) -----
  // Beri item ke 2 area Refinery & 1 area Fractionation; sisanya kosong.
  const withChecklist: { area: string; items: string[] }[] = [
    { area: "Bleaching Area", items: CHECKLIST_REFINERY },
    { area: "Process Area (RBD)", items: CHECKLIST_REFINERY },
    { area: "Crystallization Area", items: CHECKLIST_FRACTIONATION },
  ];
  for (const wc of withChecklist) {
    for (let i = 0; i < wc.items.length; i++) {
      await prisma.checklistItem.create({
        data: { areaId: areaByName[wc.area].id, teks: wc.items[i], urutan: i + 1 },
      });
    }
  }
  console.log(`  ✓ ${await prisma.checklistItem.count()} checklist item (3 area; sisanya empty state)`);

  // ----- Red Tag items (deadline 30/90, lifecycle) -----
  const today = new Date("2026-06-23");
  const addDays = (base: Date, d: number) => new Date(base.getTime() + d * 86400000);
  const redtags = [
    { deskripsi: "Drum bekas oli", lokasi: "Workshop", tenggat: 30, daysAgo: 8, status: "REGISTERED" },
    { deskripsi: "Pipa besi rusak", lokasi: "Tank Farm", tenggat: 30, daysAgo: 26, status: "REGISTERED" },
    { deskripsi: "Komputer lama", lokasi: "Control Room Refinery", tenggat: 90, daysAgo: 12, status: "REGISTERED" },
    { deskripsi: "Kabel listrik bekas", lokasi: "Workshop", tenggat: 30, daysAgo: 35, status: "DISPOSED" },
    { deskripsi: "Pompa cadangan obsolete", lokasi: "Pump House", tenggat: 90, daysAgo: 40, status: "RELOCATED" },
    { deskripsi: "Palet kayu rusak", lokasi: "Gudang Sparepart", tenggat: 30, daysAgo: 3, status: "REGISTERED" },
  ];
  for (let i = 0; i < redtags.length; i++) {
    const r = redtags[i];
    const tglMasuk = addDays(today, -r.daysAgo);
    await prisma.redTagItem.create({
      data: {
        deskripsi: r.deskripsi,
        lokasi: r.lokasi,
        tglMasuk,
        deadline: addDays(tglMasuk, r.tenggat),
        tenggat: r.tenggat,
        qrCode: `RT-2026-${String(i + 1).padStart(4, "0")}`,
        status: r.status,
      },
    });
  }
  console.log(`  ✓ ${await prisma.redTagItem.count()} red tag item dibuat`);

  // ===== Siklus BASELINE April 2026 (CLOSED) — validasi scoring =====
  const cycleApr = await prisma.auditCycle.create({
    data: { periode: "2026-04", status: "CLOSED" },
  });

  // Tiap area: semua temuan Done (nilai utama 100), recurring berbeda untuk validasi baseline.
  // Bleaching 5 berulang→95, Deodorizing 1→99, sisanya 0→100.
  const recurringMap: Record<string, number> = {
    "Bleaching Area": 5,
    "Deodorizing Area": 1,
  };

  for (const area of areas) {
    const assignment = await prisma.auditAssignment.create({
      data: {
        cycleId: cycleApr.id,
        areaId: area.id,
        auditorId: area.nama === "Workshop" ? auditor2.id : auditor1.id, // cross-area
        status: "TERKIRIM",
        submittedAt: new Date("2026-04-08"),
      },
    });

    const recurringCount = recurringMap[area.nama] ?? 0;
    const statuses: FindingStatus[] = [];

    // 21 temuan = 20 guiding + 1 berulang (§5.1), semua dinilai Done oleh komite (baseline).
    for (let i = 0; i < 20; i++) {
      statuses.push("DONE");
      await prisma.finding.create({
        data: {
          assignmentId: assignment.id,
          areaId: area.id,
          guidingQuestionId: gqs[i].id,
          deskripsi: `Temuan ${gqs[i].prinsipR}: ${gqs[i].teks}`,
          kategori: i % 4 === 0 ? "HIGH" : "LOW",
          isRecurring: false,
          status: "DONE",
          statusSetByKomite: true,
        },
      });
    }
    // 1 temuan berulang
    statuses.push("DONE");
    await prisma.finding.create({
      data: {
        assignmentId: assignment.id,
        areaId: area.id,
        deskripsi: RECURRING_TEXT,
        kategori: "HIGH",
        isRecurring: true,
        status: "DONE",
        statusSetByKomite: true,
      },
    });

    // Hitung score dari data (bukan hardcode) & simpan
    const score = hitungScore({ statuses, recurringCount });
    await prisma.score.create({
      data: {
        cycleId: cycleApr.id,
        areaId: area.id,
        nilaiUtama: score.nilaiUtama,
        temuanBerulang: score.temuanBerulang,
        parkingLot: score.parkingLot,
        scoreAkhir: score.scoreAkhir,
      },
    });
  }
  console.log("  ✓ Siklus baseline 2026-04 (CLOSED) + score terhitung");

  // ===== Siklus AKTIF Juni 2026 — untuk demo Modul 2–4 =====
  const cycleJun = await prisma.auditCycle.create({
    data: { periode: "2026-06", status: "AKTIF" },
  });

  // Contoh: 3 area dengan temuan dalam berbagai state untuk demo alur.
  const demoAreas = ["Bleaching Area", "Tank Farm", "Process Area (RBD)"];
  for (const an of demoAreas) {
    const area = areaByName[an];
    const assignment = await prisma.auditAssignment.create({
      data: {
        cycleId: cycleJun.id,
        areaId: area.id,
        auditorId: an === "Workshop" ? auditor2.id : auditor1.id,
        status: an === "Bleaching Area" ? "TERKIRIM" : "DRAFT",
        submittedAt: an === "Bleaching Area" ? new Date("2026-06-09") : null,
      },
    });

    // Beberapa temuan: sebagian belum dinilai (status null), sebagian dengan follow-up.
    const f1 = await prisma.finding.create({
      data: {
        assignmentId: assignment.id,
        areaId: area.id,
        guidingQuestionId: gqs[10].id,
        deskripsi: "Ceceran oli di sekitar pompa P-102 belum dibersihkan",
        kategori: "HIGH",
        status: null, // menunggu penilaian komite (§5.3)
        statusSetByKomite: false,
      },
    });
    await prisma.followUp.create({
      data: {
        findingId: f1.id,
        rootCause: "Seal pompa bocor & jadwal pembersihan belum berjalan",
        corrective: "Ganti seal pompa dan bersihkan ceceran",
        preventive: "Tambah jadwal inspeksi seal mingguan",
        woScPoNumber: "WO-2026-0612",
      },
    });

    await prisma.finding.create({
      data: {
        assignmentId: assignment.id,
        areaId: area.id,
        guidingQuestionId: gqs[5].id,
        deskripsi: "Label pipa steam pudar dan sulit terbaca",
        kategori: "LOW",
        status: null,
        statusSetByKomite: false,
      },
    });
  }
  console.log("  ✓ Siklus aktif 2026-06 + contoh temuan & follow-up");

  // ----- Validasi baseline langsung di seed -----
  const cek = await prisma.score.findMany({
    where: { cycleId: cycleApr.id },
    include: { area: true },
  });
  const bleaching = cek.find((s) => s.area.nama === "Bleaching Area");
  const deod = cek.find((s) => s.area.nama === "Deodorizing Area");
  const pump = cek.find((s) => s.area.nama === "Pump House");
  console.log("\n  📊 Validasi baseline April 2026:");
  console.log(`     Bleaching (5 berulang) = ${bleaching?.scoreAkhir} (target 95.0)`);
  console.log(`     Deodorizing (1 berulang) = ${deod?.scoreAkhir} (target 99.0)`);
  console.log(`     Pump House (0 berulang) = ${pump?.scoreAkhir} (target 100.0)`);

  console.log("\n✅ Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
