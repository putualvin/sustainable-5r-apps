import {
  fmtPct,
  statusOf,
  statusCounts,
  STATUS_LABEL,
  unitScore,
  type CategoryConfig,
  type KPI,
} from '@/lib/kpi'
import { STATUS_STYLE } from '@/lib/status-style'

/**
 * Panel skor ringkas Unit Tarjun: skor besar + breakdown jumlah KPI per status.
 */
export default function ScorePanel({
  kpis,
  categories,
  monthIndex,
  periode,
}: {
  kpis: KPI[]
  categories: CategoryConfig[]
  monthIndex: number
  periode: string
}) {
  const score = unitScore(kpis, categories, monthIndex)
  const status = statusOf(score)
  const s = STATUS_STYLE[status]
  const counts = statusCounts(kpis, monthIndex)

  const rows = [
    { key: 'on-target' as const, n: counts['on-target'] },
    { key: 'waspada' as const, n: counts.waspada },
    { key: 'under' as const, n: counts.under },
    { key: 'na' as const, n: counts.na },
  ]

  return (
    <div className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Skor Unit
        </p>
        <h1 className="mt-1 text-lg font-semibold text-slate-800">
          Unit Tarjun
        </h1>
        <p className={`tabular mt-2 text-5xl font-bold ${s.text}`}>
          {fmtPct(score)}
        </p>
        <p className="mt-1 text-xs text-slate-400">Periode {periode}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {rows.map((r) => {
          const st = STATUS_STYLE[r.key]
          return (
            <div
              key={r.key}
              className={`flex items-center justify-between rounded-lg px-3 py-2 ring-1 ${st.bg} ${st.ring}`}
            >
              <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                {STATUS_LABEL[r.key]}
              </span>
              <span className={`tabular text-lg font-bold ${st.text}`}>
                {r.n}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
