import Link from 'next/link'
import { achievementAt, fmtPct, statusOf, type KPI } from '@/lib/kpi'
import { iconForKpi } from '@/lib/icons'
import { STATUS_STYLE } from '@/lib/status-style'

/**
 * Tile satu KPI: garis aksen kiri berwarna status, icon, nama, dan Ach%.
 * Klik → halaman detail KPI.
 */
export default function KpiTile({
  kpi,
  monthIndex,
}: {
  kpi: KPI
  monthIndex: number
}) {
  const ach = achievementAt(kpi, monthIndex)
  const status = statusOf(ach)
  const s = STATUS_STYLE[status]
  const Icon = iconForKpi(kpi.nama)

  return (
    <Link
      href={`/kpi/${encodeURIComponent(kpi.id)}`}
      className="group relative flex min-w-[168px] flex-1 items-center gap-3 overflow-hidden rounded-lg bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md hover:ring-slate-300"
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${s.accent}`} />
      <span
        className={`flex h-9 w-9 flex-none items-center justify-center rounded-md ${s.bg} ${s.text}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-slate-700">
          {kpi.nama}
        </span>
        <span className={`tabular block text-lg font-semibold ${s.text}`}>
          {fmtPct(ach)}
        </span>
      </span>
    </Link>
  )
}
