import { useApp, showToast } from '../store';
import SubHeader from '../components/SubHeader';

const COLOR_CLASS = {
  red: 'icon-red',
  yellow: 'icon-yellow',
  blue: 'icon-blue',
  green: 'icon-green',
};

export default function Notifications() {
  const { state, dispatch } = useApp();

  const markRead = (id) => dispatch({ type: 'MARK_NOTIF_READ', payload: id });

  const markAllRead = () => {
    dispatch({ type: 'MARK_ALL_READ' });
    showToast(dispatch, '✅ Semua notifikasi ditandai dibaca');
  };

  return (
    <div className="screen">
      <SubHeader
        title="Notifikasi"
        action="Tandai dibaca"
        onAction={markAllRead}
        back="/dashboard"
      />
      <div className="content">
        {state.notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔔</div>
            <div className="empty-state-title">Belum ada notifikasi</div>
          </div>
        ) : (
          state.notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-item ${n.read ? 'read' : ''}`}
              onClick={() => markRead(n.id)}
            >
              <div className={`notif-icon ${COLOR_CLASS[n.color] || 'icon-red'}`}>{n.icon}</div>
              <div className="notif-content">
                <div className="notif-title">{n.title}</div>
                <div className="notif-desc">{n.desc}</div>
                <div className="notif-time">{n.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
