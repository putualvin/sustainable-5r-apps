import ScorePanel from '@/components/ScorePanel'
import KategoriRow from '@/components/KategoriRow'
import { KPIS, CATEGORIES, CURRENT_MONTH_INDEX, PERIODE_LABEL } from '@/data/kpi'

export default function OverviewPage() {
  const monthIndex = CURRENT_MONTH_INDEX

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="rounded bg-brand px-2 py-0.5 text-xs font-semibold text-brand-fg">
            Sinar Mas Agri
          </span>
          <span className="text-xs text-slate-400">Mockup · untuk diskusi</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard KPI — Unit Tarjun
        </h1>
        <p className="text-sm text-slate-500">
          Ringkasan performa KPI level manajemen · Periode {PERIODE_LABEL}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr]">
        {/* Panel skor */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <ScorePanel
            kpis={KPIS}
            categories={CATEGORIES}
            monthIndex={monthIndex}
            periode={PERIODE_LABEL}
          />
        </div>

        {/* Baris kategori */}
        <div className="rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200 sm:px-6">
          {CATEGORIES.map((c) => (
            <KategoriRow
              key={c.nama}
              kpis={KPIS}
              kategori={c.nama}
              monthIndex={monthIndex}
            />
          ))}
        </div>
      </div>

      {/* Catatan mockup */}
      <footer className="mt-8 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-800 ring-1 ring-amber-200">
        <strong>Catatan mockup:</strong> hanya data <strong>Januari 2025</strong>{' '}
        yang asli (Master Data KPI Tarjun 2025). Angka Feb–Des di grafik tren
        adalah <strong>dummy</strong>. Bobot kategori & KPI masih{' '}
        <strong>asumsi</strong> dan perlu dikonfirmasi ke pemilik KPI. Belum
        terhubung ke database/API.
      </footer>
    </main>
  )
}
