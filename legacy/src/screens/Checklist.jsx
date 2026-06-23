import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, showToast, showLoader } from '../store';
import { CHECKLIST_ITEMS, CHECKLIST_CATEGORIES, todayKey, formatDate } from '../data';
import SubHeader from '../components/SubHeader';
import ScoreRing from '../components/ScoreRing';

export default function Checklist() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const today = todayKey();
  const [values, setValues] = useState(state.checklist[today] || {});

  const toggle = (catId, idx) => {
    const key = `${catId}_${idx}`;
    setValues((v) => ({ ...v, [key]: !v[key] }));
  };

  const progressForCat = (catId) => {
    const total = CHECKLIST_ITEMS[catId].length;
    let done = 0;
    for (let i = 0; i < total; i++) {
      if (values[`${catId}_${i}`]) done++;
    }
    return { done, total };
  };

  const submit = () => {
    showLoader(dispatch, true);
    setTimeout(() => {
      dispatch({ type: 'SAVE_CHECKLIST', payload: { date: today, values } });
      showLoader(dispatch, false);
      showToast(dispatch, '✅ Checklist hari ini tersimpan');
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="screen">
      <SubHeader
        title="Daily Checklist"
        action="📅"
        onAction={() => showToast(dispatch, 'Kalender bulan ini')}
        back="/dashboard"
      />
      <div className="content">
        <div className="chart-card">
          <div className="chart-title">Progress Bulan Ini</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <ScoreRing value={80} max={100} color="#1976D2" label="12/15 hari" />
            <div style={{ flex: 1, fontSize: 12, color: '#555', lineHeight: 1.6 }}>
              <div>✅ Terisi: <strong>12 hari</strong></div>
              <div>⏳ Tersisa: <strong>3 hari</strong></div>
              <div style={{ color: '#D32F2F' }}>⚠️ Hari ini belum diisi</div>
            </div>
          </div>
        </div>

        <div className="section-title">
          <span>Checklist Hari Ini</span>
          <span className="section-action" style={{ cursor: 'default' }}>
            {formatDate(new Date())}
          </span>
        </div>

        {CHECKLIST_CATEGORIES.map((cat) => {
          const { done, total } = progressForCat(cat.id);
          return (
            <div className="audit-category" key={cat.id}>
              <div className="cat-header">
                <div className="cat-badge" style={{ background: cat.color }}>R{cat.id}</div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-progress">{done}/{total}</div>
              </div>
              {CHECKLIST_ITEMS[cat.id].map((item, idx) => {
                const checked = !!values[`${cat.id}_${idx}`];
                return (
                  <div
                    className="checklist-item"
                    key={idx}
                    onClick={() => toggle(cat.id, idx)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={`checkbox ${checked ? 'checked' : ''}`}></div>
                    <div className="checklist-text">{item}</div>
                  </div>
                );
              })}
            </div>
          );
        })}

        <button className="btn-primary" onClick={submit}>
          Simpan Checklist Hari Ini
        </button>
      </div>
    </div>
  );
}
