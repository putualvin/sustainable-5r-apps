import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { formatDate } from '../data';
import SubHeader from '../components/SubHeader';

const TABS = ['Jadwal', 'Berlangsung', 'Selesai'];

export default function AuditList() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const filtered = state.audits.filter((a) => {
    if (tab === 0) return a.status === 'scheduled';
    if (tab === 1) return a.status === 'in-progress';
    return a.status === 'completed';
  });

  return (
    <div className="screen">
      <SubHeader
        title="Audit 5R"
        action="Riwayat"
        onAction={() => navigate('/audit/history')}
        back="/dashboard"
      />
      <div className="tab-bar">
        {TABS.map((t, i) => (
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
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">Belum ada audit</div>
            <div className="empty-state-desc">Tap tombol + untuk menambah audit baru</div>
          </div>
        ) : (
          filtered.map((a) => (
            <div
              key={a.id}
              className="list-card"
              onClick={() => navigate(`/audit/form?id=${a.id}`)}
            >
              <div className="list-card-header">
                <div>
                  <div className="list-card-title">{a.area}</div>
                  <div className="list-card-sub">📍 PIC: {a.pic}</div>
                </div>
                <span
                  className={`status-pill ${
                    a.status === 'scheduled'
                      ? 'pill-info'
                      : a.status === 'completed'
                      ? a.score >= 80
                        ? 'pill-success'
                        : 'pill-warn'
                      : 'pill-warn'
                  }`}
                >
                  {a.status === 'scheduled'
                    ? 'Terjadwal'
                    : a.status === 'completed'
                    ? `Skor ${a.score}`
                    : 'Berjalan'}
                </span>
              </div>
              <div className="list-card-body">
                <div className="list-card-meta">
                  <span>📅 {formatDate(a.date)}</span>
                  <span>⏱️ 09:00 WIB</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="floating-btn" onClick={() => navigate('/audit/form')}>+</button>
    </div>
  );
}
