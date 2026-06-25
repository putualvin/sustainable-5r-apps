import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { ROLE_FOKUS, ROLE_LABEL, isRole, type Role } from "@/lib/roles";
import { PageTitle, SectionTitle, StatCard, EmptyState, Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function BerandaPage() {
  const user = await getCurrentUser();
  if (!user || !isRole(user.role)) redirect("/login");
  const role = user.role as Role;

  return (
    <div className="p-5">
      <PageTitle
        title={`Halo, ${user.nama.split(" ")[0]}`}
        sub={`${ROLE_LABEL[role]} · ${ROLE_FOKUS[role]}`}
      />
      {role === "ADMIN" && <BerandaAdmin />}
      {role === "KOMITE" && <BerandaKomite />}
      {role === "AUDITOR" && <BerandaAuditor userId={user.id} />}
      {role === "AUDITEE" && <BerandaAuditee areaId={user.areaId} />}
      {role === "REDTAG" && <BerandaRedTag />}
      {role === "MANAGEMENT" && <BerandaManagement />}
    </div>
  );
}

async function activeCycle() {
  return prisma.auditCycle.findFirst({
    where: { status: "AKTIF" },
    orderBy: { periode: "desc" },
  });
}

function periodeLabel(periode?: string) {
  if (!periode) return "—";
  const [y, m] = periode.split("-");
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${bulan[Number(m) - 1]} ${y}`;
}

// ---------- ADMIN: status setup ----------
async function BerandaAdmin() {
  const [areas, users, gq, findings, redtags, checklistItems, cycles] =
    await Promise.all([
      prisma.area.count(),
      prisma.user.count(),
      prisma.guidingQuestion.count(),
      prisma.finding.count(),
      prisma.redTagItem.count(),
      prisma.checklistItem.count(),
      prisma.auditCycle.count(),
    ]);
  return (
    <div className="space-y-6">
      <section>
        <SectionTitle>Status Setup Master Data</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Area Refinery 2" value={areas} sub="12 area pilot" />
          <StatCard label="Pengguna" value={users} sub="6 role" />
          <StatCard label="Guiding Question" value={gq} sub="5R" />
          <StatCard label="Checklist Item" value={checklistItems} sub="3 area terisi" />
          <StatCard label="Temuan (seed)" value={findings} sub="lintas siklus" />
          <StatCard label="Siklus Audit" value={cycles} />
        </div>
      </section>
      <NavHint href="/master" label="Buka Master Data" />
    </div>
  );
}

// ---------- KOMITE: ringkasan siklus + antrean penilaian ----------
async function BerandaKomite() {
  const cycle = await activeCycle();
  const [terkirim, draft, antrean] = cycle
    ? await Promise.all([
        prisma.auditAssignment.count({ where: { cycleId: cycle.id, status: "TERKIRIM" } }),
        prisma.auditAssignment.count({ where: { cycleId: cycle.id, status: "DRAFT" } }),
        // Antrean penilaian = temuan terkirim yang belum dinilai komite (§5.3).
        prisma.finding.count({
          where: {
            statusSetByKomite: false,
            assignment: { cycleId: cycle.id, status: "TERKIRIM" },
          },
        }),
      ])
    : [0, 0, 0];

  return (
    <div className="space-y-6">
      <section>
        <SectionTitle>Siklus Aktif</SectionTitle>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-brand-black">
              {periodeLabel(cycle?.periode)}
            </div>
            <Badge tone="amber">{cycle?.status ?? "—"}</Badge>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatCard label="Audit terkirim" value={terkirim} />
            <StatCard label="Masih draft" value={draft} />
          </div>
        </div>
      </section>
      <section>
        <SectionTitle>Antrean Penilaian</SectionTitle>
        {antrean > 0 ? (
          <StatCard
            label="Temuan menunggu dinilai"
            value={antrean}
            sub="Tetapkan Done / Progress / No Progress"
            tone="amber"
          />
        ) : (
          <EmptyState title="Tidak ada antrean" desc="Semua temuan terkirim sudah dinilai." />
        )}
      </section>
      <NavHint href="/penilaian" label="Mulai Penilaian" />
    </div>
  );
}

// ---------- AUDITOR: penugasan audit aktif ----------
async function BerandaAuditor({ userId }: { userId: string }) {
  const cycle = await activeCycle();
  const assignments = cycle
    ? await prisma.auditAssignment.findMany({
        where: { cycleId: cycle.id, auditorId: userId },
        include: { area: true, _count: { select: { findings: true } } },
        orderBy: { area: { nama: "asc" } },
      })
    : [];

  const statusTone: Record<string, "green" | "amber" | "grey"> = {
    TERKIRIM: "green",
    DRAFT: "amber",
    BELUM_MULAI: "grey",
  };

  return (
    <div className="space-y-6">
      <SectionTitle>Penugasan Audit — {periodeLabel(cycle?.periode)}</SectionTitle>
      {assignments.length ? (
        <div className="space-y-2">
          {assignments.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3"
            >
              <div>
                <div className="text-sm font-medium text-brand-black">{a.area.nama}</div>
                <div className="text-xs text-zinc-400">
                  {a._count.findings} temuan dicatat · target 21
                </div>
              </div>
              <Badge tone={statusTone[a.status] ?? "grey"}>{a.status}</Badge>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Belum ada penugasan"
          desc="Komite belum menugaskan area untuk siklus ini."
        />
      )}
      <NavHint href="/audit" label="Buka Modul Audit" />
    </div>
  );
}

// ---------- AUDITEE: temuan perlu tindakan + checklist hari ini ----------
async function BerandaAuditee({ areaId }: { areaId: string | null }) {
  if (!areaId) {
    return (
      <EmptyState
        title="Belum terhubung ke area"
        desc="Akun auditee ini belum memiliki area PIC. Hubungi Admin."
      />
    );
  }
  const cycle = await activeCycle();
  const today = new Date().toISOString().slice(0, 10);

  const [perluTindakan, checklistItems, entriesHariIni] = await Promise.all([
    // Temuan di area ini (siklus aktif) yang belum punya follow-up.
    prisma.finding.count({
      where: {
        areaId,
        followUp: null,
        ...(cycle ? { assignment: { cycleId: cycle.id } } : {}),
      },
    }),
    prisma.checklistItem.count({ where: { areaId } }),
    prisma.checklistEntry.count({
      where: { tanggal: today, item: { areaId } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <section>
        <SectionTitle>Temuan Perlu Tindakan</SectionTitle>
        {perluTindakan > 0 ? (
          <StatCard
            label="Temuan belum ditindaklanjuti"
            value={perluTindakan}
            sub="Isi root cause, corrective & preventive"
            tone="red"
          />
        ) : (
          <EmptyState title="Tidak ada temuan tertunda" desc="Semua temuan sudah ditindaklanjuti." />
        )}
      </section>
      <section>
        <SectionTitle>Checklist Hari Ini</SectionTitle>
        {checklistItems > 0 ? (
          <StatCard
            label="Item checklist harian"
            value={`${entriesHariIni}/${checklistItems}`}
            sub={entriesHariIni >= checklistItems ? "Lengkap hari ini" : "Belum lengkap"}
            tone={entriesHariIni >= checklistItems ? "green" : "amber"}
          />
        ) : (
          <EmptyState
            title="Belum ada item checklist"
            desc="Area ini belum dikonfigurasi item checklist harian."
          />
        )}
      </section>
      <NavHint href="/temuan" label="Buka Tindak Lanjut" />
    </div>
  );
}

// ---------- REDTAG: item mendekati/lewat batas ----------
async function BerandaRedTag() {
  const items = await prisma.redTagItem.findMany({
    where: { status: "REGISTERED" },
    orderBy: { deadline: "asc" },
  });
  const now = Date.now();
  const day = 86400000;
  const withSisa = items.map((it) => ({
    ...it,
    sisaHari: Math.ceil((it.deadline.getTime() - now) / day),
  }));
  const lewat = withSisa.filter((i) => i.sisaHari < 0).length;
  const dekat = withSisa.filter((i) => i.sisaHari >= 0 && i.sisaHari <= 7).length;

  return (
    <div className="space-y-6">
      <section>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Lewat batas" value={lewat} tone="red" />
          <StatCard label="Mendekati (≤7 hari)" value={dekat} tone="amber" />
        </div>
      </section>
      <section>
        <SectionTitle>Item Aktif (Registered)</SectionTitle>
        {withSisa.length ? (
          <div className="space-y-2">
            {withSisa.map((it) => {
              const tone = it.sisaHari < 0 ? "red" : it.sisaHari <= 7 ? "amber" : "green";
              const ket =
                it.sisaHari < 0
                  ? `Lewat ${Math.abs(it.sisaHari)} hari`
                  : `${it.sisaHari} hari lagi`;
              return (
                <div
                  key={it.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-medium text-brand-black">{it.deskripsi}</div>
                    <div className="text-xs text-zinc-400">
                      {it.lokasi} · tenggat {it.tenggat} hari · {it.qrCode}
                    </div>
                  </div>
                  <Badge tone={tone}>{ket}</Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState title="Tidak ada item aktif" />
        )}
      </section>
      <NavHint href="/redtag" label="Buka Modul Red Tag" />
    </div>
  );
}

// ---------- MANAGEMENT: skor & tren (read-only) ----------
async function BerandaManagement() {
  const scores = await prisma.score.findMany({
    include: { area: true, cycle: true },
    orderBy: { scoreAkhir: "desc" },
  });
  const avg =
    scores.length > 0
      ? scores.reduce((s, x) => s + x.scoreAkhir, 0) / scores.length
      : 0;

  return (
    <div className="space-y-6">
      <section>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Rata-rata Score Akhir" value={avg.toFixed(1)} tone="green" />
          <StatCard label="Area dinilai" value={scores.length} />
        </div>
      </section>
      <section>
        <SectionTitle>Score Akhir per Area</SectionTitle>
        {scores.length ? (
          <div className="space-y-2">
            {scores.map((s) => {
              const tone =
                s.scoreAkhir >= 100 ? "green" : s.scoreAkhir >= 97 ? "amber" : "red";
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-2.5"
                >
                  <div>
                    <div className="text-sm font-medium text-brand-black">{s.area.nama}</div>
                    <div className="text-xs text-zinc-400">
                      {periodeLabel(s.cycle.periode)} · {s.temuanBerulang} berulang
                    </div>
                  </div>
                  <Badge tone={tone}>{s.scoreAkhir.toFixed(1)}</Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState title="Belum ada skor" />
        )}
      </section>
      <NavHint href="/dashboard" label="Buka Dashboard" />
    </div>
  );
}

function NavHint({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-xl bg-brand-black px-4 py-3 text-center text-sm font-semibold text-white"
    >
      {label} →
    </Link>
  );
}
