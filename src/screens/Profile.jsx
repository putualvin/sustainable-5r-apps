import { useNavigate } from 'react-router-dom';
import { useApp, showToast, showLoader } from '../store';

export default function Profile() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const u = state.user;
  const lastSync = new Date(state.lastSync);

  const syncData = () => {
    if (!state.isOnline) {
      showToast(dispatch, '⚠️ Tidak dapat sync saat offline');
      return;
    }
    showLoader(dispatch, true);
    setTimeout(() => {
      dispatch({ type: 'SYNC' });
      showLoader(dispatch, false);
      showToast(dispatch, '🔄 Sinkronisasi berhasil');
    }, 1000);
  };

  const toggleOffline = () => {
    dispatch({ type: 'TOGGLE_OFFLINE' });
    showToast(dispatch, !state.isOnline ? '🌐 Mode Online aktif' : '📴 Mode Offline aktif');
  };

  const logout = () => {
    dispatch({
      type: 'SHOW_MODAL',
      payload: {
        centered: true,
        title: 'Konfirmasi Logout',
        body: <p>Apakah Anda yakin ingin keluar dari aplikasi?</p>,
        actions: [
          { label: 'Batal', variant: 'secondary' },
          {
            label: 'Ya, Logout',
            variant: 'primary',
            onClick: () => {
              showLoader(dispatch, true);
              setTimeout(() => {
                dispatch({ type: 'LOGOUT' });
                showLoader(dispatch, false);
                showToast(dispatch, 'Anda telah keluar');
                navigate('/login');
              }, 500);
            },
          },
        ],
      },
    });
  };

  const showAbout = () => {
    dispatch({
      type: 'SHOW_MODAL',
      payload: {
        centered: true,
        title: 'Tentang Aplikasi',
        body: (
          <div style={{ textAlign: 'center', fontSize: 12, lineHeight: 1.7 }}>
            <div
              style={{
                width: 60, height: 60,
                background: 'linear-gradient(135deg,#D32F2F,#b71c1c)',
                borderRadius: 14, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
                color: '#fff', fontWeight: 800, fontSize: 20,
              }}
            >
              5R
            </div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Sustainable 5R Apps</div>
            <div style={{ color: '#666' }}>Version 2.4.1 (Build 2026.05)</div>
            <div
              style={{
                marginTop: 10, padding: 10,
                background: '#f5f5f5', borderRadius: 8,
                fontSize: 11, color: '#555',
              }}
            >
              Aplikasi digitalisasi program 5R untuk Sinar Mas Agribusiness and Food.<br />
              © 2026 PT Sinar Mas Agro Resources and Technology Tbk
            </div>
          </div>
        ),
        actions: [{ label: 'Tutup', variant: 'primary' }],
      },
    });
  };

  return (
    <div className="screen">
      <div className="profile-header">
        <div className="profile-avatar">{u.initials}</div>
        <div className="profile-name">{u.name}</div>
        <div className="profile-role">{u.role} · {u.unit}</div>
      </div>
      <div className="content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          <StatCard value="24"  label="Audit"     color="#D32F2F" />
          <StatCard value="156" label="Checklist" color="#1976D2" />
          <StatCard value="A+"  label="Rating"    color="#2e7d32" />
        </div>

        <div className="section-title"><span>Akun</span></div>
        <div className="menu-list">
          <MenuItem icon="👤" cls="icon-blue"   title="Edit Profile"           sub="Nama, foto, kontak"     onClick={() => showToast(dispatch, 'Edit Profile')} />
          <MenuItem icon="🔒" cls="icon-red"    title="Ubah Password"          sub="Keamanan akun"          onClick={() => showToast(dispatch, 'Ubah Password')} />
          <MenuItem icon="🔔" cls="icon-yellow" title="Pengaturan Notifikasi"  sub="Email, push notification" onClick={() => showToast(dispatch, 'Notifikasi')} />
        </div>

        <div className="section-title"><span>Aplikasi</span></div>
        <div className="menu-list">
          <MenuItem
            icon="🔄" cls="icon-green"
            title="Sinkronisasi Data"
            sub={`Terakhir: ${lastSync.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}`}
            onClick={syncData}
          />
          <MenuItem
            icon="📡" cls="icon-purple"
            title="Mode Offline"
            sub={state.isOnline ? 'Aktif jika tanpa jaringan' : 'Mode offline aktif'}
            onClick={toggleOffline}
          />
          <MenuItem icon="🌐" cls="icon-blue"   title="Bahasa"           sub="Indonesia" onClick={() => showToast(dispatch, 'Bahasa Indonesia')} />
          <MenuItem icon="ℹ️" cls="icon-green"  title="Tentang Aplikasi" sub="v2.4.1"    onClick={showAbout} />
        </div>

        <button className="btn-secondary" style={{ marginTop: 12 }} onClick={logout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

function StatCard({ value, label, color }) {
  return (
    <div
      style={{
        textAlign: 'center', padding: 10,
        background: '#fff', borderRadius: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 10, color: '#666' }}>{label}</div>
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
