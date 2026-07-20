import { useState, useMemo } from 'react'
import { KPIS, GROUPS, SITE } from './data.js'
import KpiCard, { meetsTarget } from './components/KpiCard.jsx'
import TrendChart from './components/TrendChart.jsx'

export default function App() {
  const [group, setGroup] = useState('Semua')
  const [selected, setSelected] = useState(KPIS[1].id) // default: Produksi CPO

  const filtered = useMemo(
    () => (group === 'Semua' ? KPIS : KPIS.filter((k) => k.group === group)),
    [group],
  )
  const onTarget = KPIS.filter(meetsTarget).length
  const pct = Math.round((onTarget / KPIS.length) * 100)
  const selectedKpi = KPIS.find((k) => k.id === selected)

  return (
    <div className="app-frame">
      <div className="phone-shell">
        {/* Header */}
        <header className="hdr">
          <div className="hdr-row">
            <div className="hdr-logo">SM</div>
            <div>
              <div className="hdr-company">Sinar Mas Agribusiness and Food</div>
              <div className="hdr-title">KPI Dashboard · {SITE.name}</div>
            </div>
          </div>
          <div className="hdr-meta">{SITE.fullName} — {SITE.region} · {SITE.period}</div>
        </header>

        <main className="body">
          {/* Ringkasan */}
          <section className="summary">
            <div className="summary-ring">
              <svg viewBox="0 0 80 80" width="72" height="72">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#ffe3e3" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="34" fill="none" stroke="#fff" strokeWidth="8"
                  strokeLinecap="round" strokeDasharray={`${(pct / 100) * 213.6} 213.6`}
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="summary-ring-txt">{pct}%</div>
            </div>
            <div className="summary-info">
              <div className="summary-big">{onTarget}/{KPIS.length}</div>
              <div className="summary-lbl">KPI mencapai target bulan ini</div>
            </div>
          </section>

          {/* Filter grup */}
          <div className="chips">
            {['Semua', ...GROUPS].map((g) => (
              <button
                key={g}
                className={`chip ${group === g ? 'active' : ''}`}
                onClick={() => setGroup(g)}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Detail tren KPI terpilih */}
          <TrendChart kpi={selectedKpi} />

          {/* Grid KPI */}
          <div className="kpi-grid">
            {filtered.map((k) => (
              <button
                key={k.id}
                className={`kpi-wrap ${selected === k.id ? 'sel' : ''}`}
                onClick={() => setSelected(k.id)}
              >
                <KpiCard kpi={k} />
              </button>
            ))}
          </div>

          <footer className="foot">
            Data contoh untuk demo · © 2026 Sinar Mas Agribusiness and Food — Internal
          </footer>
        </main>
      </div>
    </div>
  )
}
