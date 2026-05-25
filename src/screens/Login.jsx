import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, showToast, showLoader } from '../store';

export default function Login() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('auditor@sinarmas.co.id');
  const [password, setPassword] = useState('demo1234');
  const [remember, setRemember] = useState(true);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      showToast(dispatch, 'Email dan password wajib diisi');
      return;
    }
    showLoader(dispatch, true);
    setTimeout(() => {
      showLoader(dispatch, false);
      dispatch({ type: 'LOGIN' });
      showToast(dispatch, 'Login berhasil. Selamat datang!');
      navigate('/dashboard');
    }, 900);
  };

  return (
    <div className="screen">
      <div className="login-screen">
        <div className="logo-area">
          <div className="logo-box"><span className="logo-text">5R</span></div>
          <div className="company-name">SINAR MAS<br />AGRIBUSINESS AND FOOD</div>
        </div>
        <h2 className="app-title">Sustainable 5R Apps</h2>
        <p className="app-tagline">Ringkas · Rapi · Resik · Rawat · Rajin</p>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@sinarmas.co.id"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <div className="form-row">
          <div className="checkbox-wrap" onClick={() => setRemember(!remember)}>
            <div className={`checkbox ${remember ? 'checked' : ''}`}></div>
            <span className="checkbox-label">Ingat saya</span>
          </div>
          <a
            className="forgot-link"
            onClick={() => showToast(dispatch, 'Hubungi admin IT untuk reset password')}
          >
            Lupa password?
          </a>
        </div>
        <button className="btn-primary" onClick={handleLogin}>
          <span>🔐</span> Login dengan SSO
        </button>
        <div className="divider"><span>Akses Aman</span></div>
        <p className="security-note">
          Gunakan kredensial korporat Anda.
          <br />
          Single Sign-On terenkripsi · v2.4.1
        </p>
        <div className="login-footer">
          <div className={`status-dot ${state.isOnline ? 'online' : 'offline'}`}></div>
          <span className={state.isOnline ? 'online-text' : 'offline-text'}>
            {state.isOnline ? 'Online · Terhubung ke server' : 'Offline · Data lokal aktif'}
          </span>
        </div>
      </div>
    </div>
  );
}
