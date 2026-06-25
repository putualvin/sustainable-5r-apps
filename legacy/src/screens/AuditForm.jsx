import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp, showToast, showLoader } from '../store';
import { AUDIT_CATEGORIES, todayKey } from '../data';
import SubHeader from '../components/SubHeader';
import ScoreRing from '../components/ScoreRing';

export default function AuditForm() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const auditId = params.get('id');
  const existing = auditId ? state.audits.find((a) => String(a.id) === auditId) : null;

  const [area, setArea] = useState(existing?.area || 'Refinery 2 - Process Area');
  const [pic, setPic] = useState(existing?.pic || 'Ahmad Wijaya');
  const [date, setDate] = useState(existing?.date || todayKey());
  const [notes, setNotes] = useState(existing?.notes || '');
  const [photos, setPhotos] = useState([]);
  const [scores, setScores] = useState({});

  const { overall, breakdown } = useMemo(() => {
    let total = 0;
    let count = 0;
    const breakdown = AUDIT_CATEGORIES.map((cat) => {
      let catTotal = 0;
      let catCount = 0;
      cat.items.forEach((_, idx) => {
        const s = scores[cat.id]?.[idx];
        if (s) {
          catTotal += s;
          catCount++;
          total += s;
          count++;
        }
      });
      return {
        name: cat.name.split(' ')[0],
        score: catCount ? Math.round((catTotal / catCount) * 20) : 0,
      };
    });
    return {
      overall: count ? Math.round((total / count) * 20) : 0,
      breakdown,
    };
  }, [scores]);

  const setScore = (catId, itemIdx, value) => {
    setScores((prev) => ({
      ...prev,
      [catId]: { ...prev[catId], [itemIdx]: value },
    }));
  };

  const addPhoto = () => {
    setPhotos((p) => [...p, `Foto_${Date.now().toString().slice(-4)}.jpg`]);
    showToast(dispatch, '📸 Foto ditambahkan');
  };

  const removePhoto = (idx) => {
    setPhotos((p) => p.filter((_, i) => i !== idx));
  };

  const submit = () => {
    let totalQ = 0;
    let answered = 0;
    AUDIT_CATEGORIES.forEach((cat) => {
      cat.items.forEach((_, idx) => {
        totalQ++;
        if (scores[cat.id]?.[idx]) answered++;
      });
    });
    if (answered < totalQ) {
      showToast(dispatch, `Mohon lengkapi ${totalQ - answered} item lagi`);
      return;
    }

    showLoader(dispatch, true);
    setTimeout(() => {
      const newAudit = {
        id: existing ? existing.id : Date.now(),
        area,
        pic,
        date,
        notes,
        score: overall,
        status: 'completed',
        photos,
      };
      if (existing) {
        dispatch({ type: 'UPDATE_AUDIT', payload: newAudit });
      } else {
        dispatch({ type: 'ADD_AUDIT', payload: newAudit });
      }
      showLoader(dispatch, false);
      showToast(dispatch, `✅ Audit tersimpan! Skor: ${overall}/100`);
      navigate('/audit');
    }, 800);
  };

  const saveDraft = () => {
    showToast(dispatch, '💾 Draft tersimpan');
  };

  return (
    <div className="screen">
      <SubHeader
        title={existing ? 'Lanjutkan Audit' : 'Audit Baru'}
        action="Draft"
        onAction={saveDraft}
        back="/audit"
      />
      <div className="content">
        <div className="form-group">
          <label className="form-label">Area / Lokasi</label>
          <select className="input-field" value={area} onChange={(e) => setArea(e.target.value)}>
            <option>Refinery 2 - Process Area</option>
            <option>Refinery 2 - Tank Farm</option>
            <option>Refinery 2 - Control Room</option>
            <option>Refinery 2 - Workshop</option>
            <option>Refinery 2 - Warehouse</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">PIC Area</label>
          <input
            type="text"
            className="input-field"
            value={pic}
            onChange={(e) => setPic(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tanggal Audit</label>
          <input
            type="date"
            className="input-field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="section-title" style={{ marginTop: 8 }}>
          <span>Checklist Penilaian (Skor 1–5)</span>
        </div>

        {AUDIT_CATEGORIES.map((cat) => (
          <div className="audit-category" key={cat.id}>
            <div className="cat-header">
              <div className="cat-badge" style={{ background: cat.color }}>{cat.id}R</div>
              <div className="cat-name">{cat.name}</div>
            </div>
            {cat.items.map((item, idx) => (
              <div className="checklist-item" key={idx}>
                <div className="checklist-text">{item}</div>
                <div className="score-buttons">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      className={`score-btn score-${s} ${
                        scores[cat.id]?.[idx] === s ? 'active' : ''
                      }`}
                      onClick={() => setScore(cat.id, idx, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="form-group" style={{ marginTop: 14 }}>
          <label className="form-label">Catatan Auditor</label>
          <textarea
            className="input-field"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tuliskan temuan dan rekomendasi..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Foto Bukti</label>
          <div className="photo-upload" onClick={addPhoto}>
            <div className="photo-upload-icon">📷</div>
            <div className="photo-upload-text">Tap untuk ambil foto / upload</div>
          </div>
          {photos.map((p, i) => (
            <div className="photo-preview" key={i}>
              <span>📷 {p}</span>
              <button onClick={() => removePhoto(i)}>✕</button>
            </div>
          ))}
        </div>

        <div className="chart-card">
          <div className="chart-title">Skor Sementara</div>
          <div className="score-ring-wrap">
            <ScoreRing value={overall} label="/ 100" />
            <div className="score-breakdown">
              {breakdown.map((b) => (
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

        <button className="btn-primary" style={{ marginTop: 16 }} onClick={submit}>
          Submit Audit
        </button>
      </div>
    </div>
  );
}
