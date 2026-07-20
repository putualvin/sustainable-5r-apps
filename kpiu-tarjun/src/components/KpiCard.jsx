import Sparkline from './Sparkline.jsx'
import { MONTHS } from '../data.js'

const fmt = (v) =>
  v >= 1000 ? v.toLocaleString('id-ID') : (Number.isInteger(v) ? v.toString() : v.toFixed(2).replace(/0$/, ''))

// Menentukan apakah KPI sudah mencapai target, dengan arah yang benar.
export function meetsTarget(kpi) {
  return kpi.direction === 'down' ? kpi.value <= kpi.target : kpi.value >= kpi.target
}

export default function KpiCard({ kpi }) {
  const ok = meetsTarget(kpi)
  const color = ok ? '#2e7d32' : '#D32F2F'
  const prev = kpi.trend[kpi.trend.length - 2]
  const delta = kpi.value - prev
  const deltaPct = prev ? (delta / prev) * 100 : 0
  const improving = kpi.direction === 'down' ? delta < 0 : delta > 0
  const arrow = delta === 0 ? '→' : delta > 0 ? '▲' : '▼'

  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <span className="kpi-icon" aria-hidden="true">{kpi.icon}</span>
        <span className={`kpi-badge ${ok ? 'ok' : 'off'}`}>{ok ? 'On Target' : 'Below'}</span>
      </div>
      <div className="kpi-label">{kpi.label}</div>
      <div className="kpi-value-row">
        <div className="kpi-value">
          {fmt(kpi.value)}<span className="kpi-unit">{kpi.unit}</span>
        </div>
        <Sparkline data={kpi.trend} color={color} />
      </div>
      <div className="kpi-foot">
        <span className="kpi-target">Target {fmt(kpi.target)}{kpi.unit}</span>
        <span className="kpi-delta" style={{ color: improving ? '#2e7d32' : '#c62828' }}>
          {arrow} {Math.abs(deltaPct).toFixed(1)}% <span className="kpi-mom">MoM</span>
        </span>
      </div>
      <div className="kpi-since">vs {MONTHS[MONTHS.length - 2]}</div>
    </div>
  )
}
