import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, showToast, showLoader } from '../store';
import SubHeader from '../components/SubHeader';

const CATEGORIES = ['Tidak Terpakai', 'Rusak', 'Obsolete', 'Berbahaya', 'Belum Terklasifikasi'];
const ACTIONS = ['Buang / Disposal', 'Pindah ke Gudang', 'Repair / Perbaikan', 'Kembalikan ke Owner', 'Donasi / Transfer'];

export default function RedTagForm() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [location, setLocation] = useState('');
  const [reason, setReason] = useState('');
  const [action, setAction] = useState(ACTIONS[0]);
  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [photos, setPhotos] = useState([]);

  const submit = () => {
    if (!name.trim()) {
      showToast(dispatch, 'Nama item wajib diisi');
      return;
    }
    showLoader(dispatch, true);
    setTimeout(() => {
      dispatch({
        type: 'ADD_REDTAG',
        payload: {
          id: Date.now(),
          name: name.trim(),
          category,
          location: location.trim() || '-',
          reason,
          action,
          deadline,
          daysAge: 0,
          status: 'aktif',
          photos,
        },
      });
      showLoader(dispatch, false);
      showToast(dispatch, '✅ Red Tag berhasil ditambahkan');
      navigate('/redtag');
    }, 700);
  };

  const addPhoto = () => {
    setPhotos((p) => [...p, `RedTag_${Date.now().toString().slice(-4)}.jpg`]);
    showToast(dispatch, '📸 Foto ditambahkan');
  };

  return (
    <div className="screen">
      <SubHeader title="Tambah Red Tag" back="/redtag" />
      <div className="content">
        <div className="form-group">
          <label className="form-label">Nama Item</label>
          <input
            type="text"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Drum bekas kosong"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Kategori</label>
          <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Lokasi Ditemukan</label>
          <input
            type="text"
            className="input-field"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Contoh: Workshop Area A"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Alasan Red Tag</label>
          <textarea
            className="input-field"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Jelaskan kenapa item ini diberi red tag..."
          />
        </div>
        <div className="form-group">
          <label className="form-label">Tindakan yang Diperlukan</label>
          <select className="input-field" value={action} onChange={(e) => setAction(e.target.value)}>
            {ACTIONS.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Deadline Tindakan</label>
          <input
            type="date"
            className="input-field"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Foto Item</label>
          <div className="photo-upload" onClick={addPhoto}>
            <div className="photo-upload-icon">📷</div>
            <div className="photo-upload-text">Tap untuk ambil foto</div>
          </div>
          {photos.map((p, i) => (
            <div className="photo-preview" key={i}>
              <span>📷 {p}</span>
              <button onClick={() => setPhotos((ps) => ps.filter((_, idx) => idx !== i))}>✕</button>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={submit}>Simpan Red Tag</button>
      </div>
    </div>
  );
}
