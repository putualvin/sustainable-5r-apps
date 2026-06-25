import { useState } from 'react';
import { useApp, showToast } from '../store';
import SubHeader from '../components/SubHeader';
import ScoreRing from '../components/ScoreRing';

const TIME_TABS = ['Bulan Ini', '3 Bulan', '1 Tahun'];

const TREND = [
  { month: 'Des', score: 72 },
  { month: 'Jan', score: 75 },
  { month: 'Feb', score: 78 },
  { month: 'Mar', score: 80 },
  { month: 'Apr', score: 82 },
  { month: 'Mei', score: 85, current: true },
];

const BREAKDOWN = [
  { name: 'Ringkas', score: 88 },
  { name: 'Rapi',    score: 82 },
  { name: 'Resik',   score: 90 },
  { name: 'Rawat',   score: 78 },
  { name: 'Rajin',   score: 87 },
];

const STATS = [
  { value: 24,  label: 'Total Audit',  color: '#D32F2F', bg: '#fff5f5' },
  { value: 156, label: 'Checklist',    color: '#1976D2', bg: '#e3f2fd' },
  { value: 18,  label: 'Red Tag',      color: '#f57c00', bg: '#fff8e1' },
  { value: 15,  label: 'CAPA Closed',  color: '#2e7d32', bg: '#e8f5e9' },
];

export default function Reports() {
  const { dispatch } = useApp();
  const [tab, setTab] = useState(0);

  return (
    <div className="screen">
      <SubHeader
        title="Laporan & Skor"
        action="⬇️"
        onAction={() => showToast(dispatch, '📥 Mengexport laporan...')}
        back="/dashboard"
      />
      <div className="tab-bar">
        {TIME_TABS.map((t, i) => (
          <button
            key={t}
            className={`tab-item ${tab === i ? 'active' : ''}`}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="content">
        <div className="chart-card">
          <div className="chart-title">Skor 5R Refinery 2</div>
          <div className="score-ring-wrap">
            <ScoreRing value={85} label="/ 100" />
            <div className="score-breakdown">
              {BREAKDOWN.map((b) => (
                <div className="breakdown-item" key={b.name}>
                  <span>{b.name}</span>
                  <div className="breakdown-bar">
                    <div className="breakdown-fill" style={{ width: `${b.score}%` }}></div>
                  </div>
                  <span>{b.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Tren Skor 6 Bulan Terakhir</div>
          <div className="bar-chart">
            {TREND.map((t) => (
              <div className="bar-item" key={t.month}>
                <div
                  className={`bar ${t.current ? 'bar-current' : ''}`}
                  style={{ height: `${t.score}%` }}
                >
                  <span className="bar-value">{t.score}</span>
                </div>
                <span className="bar-label">{t.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Ringkasan Aktivitas</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  textAlign: 'center', padding: 10,
                  background: s.bg, borderRadius: 8,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#666' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn-secondary"
          onClick={() => showToast(dispatch, '📥 Export laporan PDF berhasil')}
        >
          ⬇️ Export Laporan PDF
        </button>
      </div>
    </div>
  );
}
