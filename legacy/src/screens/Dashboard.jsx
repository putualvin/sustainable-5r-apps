import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { getGreeting } from '../data';
import OfflineBanner from '../components/OfflineBanner';

const RECENT_ACTIVITIES = [
  { icon: '✅', color: 'icon-green', title: 'Checklist hari ini disimpan', time: 'Baru saja' },
  { icon: '🏷️', color: 'icon-yellow', title: 'Red Tag baru ditambahkan', time: '2 jam lalu' },
  { icon: '📋', color: 'icon-red', title: 'Audit Control Room selesai (Skor 87)', time: 'Kemarin' },
  { icon: '📊', color: 'icon-blue', title: 'Laporan bulan April disubmit', time: '3 hari lalu' },
];

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const u = state.user;
  const unreadCount = state.notifications.filter((n) => !n.read).length;
  const activeRedTags = state.redTags.filter((r) => r.status !== 'selesai').length;
  const openCAPA = state.capa.length;

  return (
    <div className="screen">
      <div className="app-header">
        <div className="header-top">
          <div className="user-info">
            <div className="avatar">{u.initials}</div>
            <div className="user-text">
              <span className="greeting">{getGreeting()}</span>
              <span className="username">{u.name}</span>
              <span className="unit-name">📍 {u.unit}</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => navigate('/notifications')}>
              🔔
              {unreadCount > 0 && <span className="badge"></span>}
            </button>
          </div>
        </div>
      </div>

      <OfflineBanner />

      <div className="content">
        <div className="section-title">
          <span>Ringkasan Performa</span>
          <button className="section-action" onClick={() => navigate('/reports')}>
            Lihat semua →
          </button>
        </div>

        <div className="widget-grid">
          <div className="widget-card" onClick={() => navigate('/reports')}>
            <div className="widget-header">
              <span className="widget-label">Skor 5R<br />Bulan Ini</span>
              <div className="widget-icon icon-green">📈</div>
            </div>
            <div className="widget-value">85%</div>
            <div className="widget-trend trend-up">↑ +5% vs bulan lalu</div>
          </div>

          <div className="widget-card" onClick={() => navigate('/checklist')}>
            <div className="widget-header">
              <span className="widget-label">Daily<br />Checklist</span>
              <div className="widget-icon icon-blue">✅</div>
            </div>
            <div className="widget-value">12/15</div>
            <div className="widget-trend trend-neutral">80% terisi bulan ini</div>
          </div>

          <div className="widget-card" onClick={() => navigate('/capa')}>
            <div className="widget-header">
              <span className="widget-label">Open<br />CAPA</span>
              <div className="widget-icon icon-red">⚠️</div>
            </div>
            <div className="widget-value">{openCAPA}</div>
            <div className="widget-trend trend-warn-red">🔴 3 deadline &lt; 3 hari</div>
          </div>

          <div className="widget-card" onClick={() => navigate('/redtag')}>
            <div className="widget-header">
              <span className="widget-label">Red Tag<br />Aktif</span>
              <div className="widget-icon icon-yellow">🏷️</div>
            </div>
            <div className="widget-value">{activeRedTags}</div>
            <div className="widget-trend trend-warn-yellow">🟡 2 item &gt; 25 hari</div>
          </div>
        </div>

        <div className="section-title"><span>Menu Utama</span></div>
        <div className="menu-list">
          <MenuItem icon="📋" cls="icon-red" title="Audit 5R" sub="Jadwalkan & lakukan audit area" onClick={() => navigate('/audit')} />
          <MenuItem icon="☑️" cls="icon-blue" title="Daily Checklist" sub="Isi checklist harian area" onClick={() => navigate('/checklist')} />
          <MenuItem icon="🏷️" cls="icon-yellow" title="Red Tag Management" sub="Kelola label item tidak sesuai" onClick={() => navigate('/redtag')} />
          <MenuItem icon="📄" cls="icon-green" title="Dokumen 5R" sub="SOP, panduan, & referensi" onClick={() => navigate('/documents')} />
          <MenuItem icon="📊" cls="icon-purple" title="Laporan & Skor" sub="Analitik & tren performa" onClick={() => navigate('/reports')} />
        </div>

        <div className="section-title"><span>Aktivitas Terbaru</span></div>
        <div className="menu-list">
          {RECENT_ACTIVITIES.map((a, i) => (
            <div className="menu-item" key={i}>
              <div className={`menu-icon ${a.color}`}>{a.icon}</div>
              <div className="menu-text">
                {a.title}
                <div className="menu-sub">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, cls, title, sub, onClick }) {
  return (
    <div className="menu-item" onClick={onClick}>
      <div className={`menu-icon ${cls}`}>{icon}</div>
      <div className="menu-text">
        {title}
        <div className="menu-sub">{sub}</div>
      </div>
      <span className="menu-arrow">›</span>
    </div>
  );
}
