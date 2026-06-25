import { useApp } from '../store';
import { formatDate } from '../data';
import SubHeader from '../components/SubHeader';

export default function CAPA() {
  const { state } = useApp();

  return (
    <div className="screen">
      <SubHeader title="Open CAPA" back="/dashboard" />
      <div className="content">
        {state.capa.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <div className="empty-state-title">Tidak ada CAPA terbuka</div>
          </div>
        ) : (
          state.capa.map((c) => {
            const priorityClass =
              c.priority === 'high' ? 'pill-danger' : c.priority === 'medium' ? 'pill-warn' : 'pill-info';
            const daysClass =
              c.daysLeft <= 3 ? 'pill-danger' : c.daysLeft <= 7 ? 'pill-warn' : 'pill-neutral';
            return (
              <div key={c.id} className="list-card">
                <div className="list-card-header">
                  <div>
                    <div className="list-card-title">{c.title}</div>
                    <div className="list-card-sub">📍 {c.area}</div>
                  </div>
                  <span className={`status-pill ${priorityClass}`}>
                    {c.priority.toUpperCase()}
                  </span>
                </div>
                <div className="list-card-body">
                  <div className="list-card-meta">
                    <span>📅 {formatDate(c.deadline)}</span>
                    <span className={`status-pill ${daysClass}`} style={{ fontSize: 9 }}>
                      {c.daysLeft} hari lagi
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
