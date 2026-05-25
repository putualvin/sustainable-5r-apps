import { useApp } from '../store';
import { formatDate } from '../data';
import SubHeader from '../components/SubHeader';

export default function AuditHistory() {
  const { state } = useApp();
  const completed = state.audits.filter((a) => a.status === 'completed');

  return (
    <div className="screen">
      <SubHeader title="Riwayat Audit" back="/audit" />
      <div className="content">
        {completed.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">Belum ada riwayat</div>
          </div>
        ) : (
          completed.map((a) => (
            <div key={a.id} className="list-card">
              <div className="list-card-header">
                <div>
                  <div className="list-card-title">{a.area}</div>
                  <div className="list-card-sub">
                    PIC: {a.pic} · {formatDate(a.date)}
                  </div>
                </div>
                <span
                  className={`status-pill ${
                    a.score >= 80 ? 'pill-success' : a.score >= 60 ? 'pill-warn' : 'pill-danger'
                  }`}
                >
                  Skor {a.score}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
