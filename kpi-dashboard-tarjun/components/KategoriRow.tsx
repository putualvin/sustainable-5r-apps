import {
  categoryScore,
  fmtPct,
  statusOf,
  topLevelKpis,
  type KPI,
  type Kategori,
} from '@/lib/kpi'
import { CATEGORY_ICON } from '@/lib/icons'
import { STATUS_STYLE } from '@/lib/status-style'
import KpiTile from './KpiTile'

/**
 * Satu baris kategori: header (icon + nama + skor rollup) di kiri, lalu KPI
 * level-1 sebagai tile berderet horizontal (wrap di layar sempit).
 */
export default function KategoriRow({
  kpis,
  kategori,
  monthIndex,
}: {
  kpis: KPI[]
  kategori: Kategori
  monthIndex: number
}) {
  const tiles = topLevelKpis(kpis, kategori)
  const score = categoryScore(kpis, kategori, monthIndex)
  const status = statusOf(score)
  const s = STATUS_STYLE[status]
  const Icon = CATEGORY_ICON[kategori]

  return (
    <section className="flex flex-col gap-3 border-t border-slate-200 py-4 first:border-t-0 lg:flex-row lg:items-stretch">
      {/* Header kategori */}
      <div className="flex w-full items-center gap-3 lg:w-52 lg:flex-none lg:flex-col lg:items-start lg:justify-center">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand text-brand-fg">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-slate-800">
            {kategori}
          </h2>
          <p className={`tabular text-xl font-bold ${s.text}`}>
            {fmtPct(score)}
          </p>
        </div>
      </div>

      {/* Tile KPI */}
      <div className="flex flex-1 flex-wrap gap-2.5 lg:pl-4">
        {tiles.map((k) => (
          <KpiTile key={k.id} kpi={k} monthIndex={monthIndex} />
        ))}
      </div>
    </section>
  )
}
