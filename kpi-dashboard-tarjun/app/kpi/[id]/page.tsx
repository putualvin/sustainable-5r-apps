import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import TrendChart from '@/components/TrendChart'
import StatusBadge from '@/components/StatusBadge'
import {
  achievementAt,
  achievementSeries,
  childrenOf,
  fmtNum,
  fmtPct,
  statusOf,
  toTrendPoints,
} from '@/lib/kpi'
import { iconForKpi } from '@/lib/icons'
import { STATUS_STYLE } from '@/lib/status-style'
import {
  KPIS,
  getKpiById,
  CURRENT_MONTH_INDEX,
  PERIODE_LABEL,
} from '@/data/kpi'

/** Pre-render seluruh halaman detail KPI saat build. */
export function generateStaticParams() {
  return KPIS.map((k) => ({ id: k.id }))
}

export default function KpiDetailPage({ params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id)
  const kpi = getKpiById(id)
  if (!kpi) notFound()

  const monthIndex = CURRENT_MONTH_INDEX
  const month = kpi.monthly[monthIndex]
  const ach = achievementAt(kpi, monthIndex)
  const status = statusOf(ach)
  const s = STATUS_STYLE[status]
  const Icon = iconForKpi(kpi.nama)
  const trend = toTrendPoints(achievementSeries(kpi))
  const kids = childrenOf(KPIS, kpi.id)

  const cards = [
    { label: 'Target', value: fmtNum(month.target) },
    { label: 'Actual', value: fmtNum(month.actual) },
    { label: 'Achievement', value: fmtPct(ach), highlight: true },
    { label: 'UoM', value: kpi.uom },
  ]

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke overview
      </Link>

      {/* Header KPI */}
      <div className="flex flex-wrap items-center gap-4">
        <span
          className={`flex h-14 w-14 flex-none items-center justify-center rounded-xl ${s.bg} ${s.text}`}
        >
          <Icon className="h-7 w-7" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {kpi.kategori}
            {kpi.arah === 'lower' ? ' · target: makin kecil makin baik' : ''}
          </p>
          <h1 className="text-2xl font-bold text-slate-800">{kpi.nama}</h1>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Kartu Target/Actual/Achievement/UoM */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 ${
              c.highlight ? 'ring-2 ' + s.ring : ''
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {c.label}
            </p>
            <p
              className={`tabular mt-1 text-xl font-bold ${
                c.highlight ? s.text : 'text-slate-800'
              }`}
            >
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Grafik tren */}
      <div className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-slate-800">
            Tren Achievement 12 Bulan
          </h2>
          <span className="text-xs text-slate-400">
            {PERIODE_LABEL} asli · sisanya dummy
          </span>
        </div>
        <TrendChart data={trend} />
      </div>

      {/* Sub-KPI / level pabrik (jika ada) */}
      {kids.length > 0 && (
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-3 text-sm font-semibold text-slate-800">
            Rincian ({kids.length})
          </h2>
          <div className="divide-y divide-slate-100">
            {kids.map((c) => {
              const cAch = achievementAt(c, monthIndex)
              const cStatus = statusOf(cAch)
              const cs = STATUS_STYLE[cStatus]
              return (
                <Link
                  key={c.id}
                  href={`/kpi/${encodeURIComponent(c.id)}`}
                  className="flex items-center justify-between gap-3 py-2.5 transition hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${cs.dot}`} />
                    <span className="text-sm text-slate-700">{c.nama}</span>
                  </span>
                  <span className="tabular flex items-center gap-4 text-sm">
                    <span className="text-slate-400">
                      {fmtNum(c.monthly[monthIndex].actual)} / {fmtNum(c.monthly[monthIndex].target)}
                    </span>
                    <span className={`w-16 text-right font-semibold ${cs.text}`}>
                      {fmtPct(cAch)}
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}
