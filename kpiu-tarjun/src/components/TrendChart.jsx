import { MONTHS } from '../data.js'

// Bar chart tren untuk satu KPI terpilih.
export default function TrendChart({ kpi }) {
  if (!kpi) return null
  const max = Math.max(...kpi.trend, kpi.target)
  return (
    <div className="trend">
      <div className="trend-head">
        <div>
          <div className="trend-title">{kpi.icon} {kpi.label}</div>
          <div className="trend-sub">Tren 6 bulan · target {kpi.target}{kpi.unit}</div>
        </div>
      </div>
      <div className="trend-bars">
        {kpi.trend.map((v, i) => {
          const h = Math.max(6, (v / max) * 100)
          const isLast = i === kpi.trend.length - 1
          return (
            <div className="trend-col" key={i}>
              <div className="trend-val">{v}</div>
              <div className="trend-bar-track">
                <div
                  className="trend-bar-fill"
                  style={{ height: `${h}%`, opacity: isLast ? 1 : 0.55 }}
                />
              </div>
              <div className="trend-month">{MONTHS[i]}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
