import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  KOMITE: "Komite Unit",
  AUDITOR: "Auditor",
  AUDITEE: "Auditee / PIC Area",
  REDTAG: "Koordinator Red Tag",
  MANAGEMENT: "Management",
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="text-2xl font-bold text-brand-black">{value}</div>
      <div className="text-sm font-medium text-zinc-700">{label}</div>
      {sub && <div className="mt-0.5 text-xs text-zinc-400">{sub}</div>}
    </div>
  );
}

export default async function Home() {
  const [areas, users, gq, findings, redtags, checklistItems, cycles, scores] =
    await Promise.all([
      prisma.area.count(),
      prisma.user.findMany({ orderBy: { role: "asc" } }),
      prisma.guidingQuestion.count(),
      prisma.finding.count(),
      prisma.redTagItem.count(),
      prisma.checklistItem.count(),
      prisma.auditCycle.findMany({ orderBy: { periode: "asc" } }),
      prisma.score.findMany({ include: { area: true }, orderBy: { scoreAkhir: "desc" } }),
    ]);

  const roleCounts = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {});

  // Semua score yang ter-seed berasal dari siklus baseline April 2026.
  const baseline = scores;

  return (
    <main className="min-h-screen pb-12">
      {/* Header brand */}
      <header className="bg-brand-red px-5 pb-6 pt-8 text-white">
        <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
          Sinar Mas Agribusiness and Food
        </div>
        <h1 className="mt-1 text-2xl font-bold leading-tight">Sustainable 5R</h1>
        <p className="mt-1 text-sm opacity-90">
          Refinery 2 · Ringkas · Rapi · Resik · Rawat · Rajin
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-brand-green" />
          Modul 0 — Setup &amp; Seed selesai
        </div>
      </header>

      <div className="space-y-6 p-5">
        {/* Ringkasan data */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Status Setup
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Area Refinery 2" value={areas} sub="12 area pilot" />
            <StatCard label="Guiding Question" value={gq} sub="5R × 4" />
            <StatCard label="Temuan (seed)" value={findings} sub="lintas siklus" />
            <StatCard label="Red Tag" value={redtags} sub="deadline 30/90 hari" />
            <StatCard label="Checklist Item" value={checklistItems} sub="3 area terisi" />
            <StatCard label="Siklus Audit" value={cycles.length} sub="2026-04, 2026-06" />
          </div>
        </section>

        {/* Role */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Pengguna per Role (6 role)
          </h2>
          <div className="overflow-hidden rounded-xl border border-zinc-200">
            {Object.keys(ROLE_LABEL).map((role, i) => (
              <div
                key={role}
                className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                  i % 2 ? "bg-zinc-50" : "bg-white"
                }`}
              >
                <span className="text-zinc-700">{ROLE_LABEL[role]}</span>
                <span className="font-semibold text-brand-black">
                  {roleCounts[role] ?? 0} user
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Validasi scoring baseline */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Validasi Score Akhir — Baseline April 2026
          </h2>
          <div className="space-y-2">
            {baseline.map((s) => {
              const color =
                s.scoreAkhir >= 100
                  ? "text-status-done"
                  : s.scoreAkhir >= 97
                  ? "text-brand-orange"
                  : "text-status-noprogress";
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-2.5"
                >
                  <div>
                    <div className="text-sm font-medium text-brand-black">{s.area.nama}</div>
                    <div className="text-xs text-zinc-400">
                      {s.temuanBerulang} berulang · parking lot {s.parkingLot}
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${color}`}>
                    {s.scoreAkhir.toFixed(1)}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-zinc-400">
            Acuan §5.4: 5 berulang → 95.0 · 1 berulang → 99.0 · 0 → 100.0. Score dihitung
            dari data temuan (bukan hardcode).
          </p>
        </section>

        <section className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
          <strong className="text-brand-black">Berikutnya:</strong> Modul 1 — Auth &amp; Role
          Shell (login sederhana + role switcher demo, layout & beranda per role). Menunggu
          konfirmasi sebelum lanjut.
        </section>
      </div>
    </main>
  );
}
