import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, showToast } from '../store';
import { formatDate } from '../data';
import SubHeader from '../components/SubHeader';

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'aktif', label: 'Aktif' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'selesai', label: 'Selesai' },
];

export default function RedTagList() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filtered = state.redTags.filter((r) =>
    filter === 'all' ? true : r.status === filter
  );

  const resolveTag = (id) => {
    dispatch({ type: 'UPDATE_REDTAG', payload: { id, status: 'selesai' } });
    dispatch({ type: 'CLOSE_MODAL' });
    showToast(dispatch, '✅ Red Tag ditandai selesai');
  };

  const viewTag = (tag) => {
    dispatch({
      type: 'SHOW_MODAL',
      payload: {
        title: tag.name,
        body: (
          <div style={{ fontSize: 12, lineHeight: 1.7 }}>
            <div><strong>Kategori:</strong> {tag.category}</div>
            <div><strong>Lokasi:</strong> {tag.location}</div>
            <div><strong>Deadline:</strong> {formatDate(tag.deadline)}</div>
            <div><strong>Usia Tag:</strong> {tag.daysAge} hari</div>
            <div>
              <strong>Status:</strong>{' '}
              <span
                className={`status-pill ${
                  tag.status === 'overdue' ? 'pill-danger' : tag.status === 'selesai' ? 'pill-success' : 'pill-info'
                }`}
              >
                {tag.status}
              </span>
            </div>
          </div>
        ),
        actions: tag.status === 'selesai'
          ? [{ label: 'Tutup', variant: 'primary' }]
          : [
              { label: 'Tutup', variant: 'secondary' },
              { label: 'Tandai Selesai', variant: 'primary', onClick: () => resolveTag(tag.id), closeAfter: false },
            ],
      },
    });
  };

  return (
    <div className="screen">
      <SubHeader
        title="Red Tag Management"
        action="+ Tag"
        onAction={() => navigate('/redtag/form')}
        back="/dashboard"
      />
      <div className="tab-bar">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`tab-item ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="content">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏷️</div>
            <div className="empty-state-title">Tidak ada Red Tag</div>
          </div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="list-card" onClick={() => viewTag(r)}>
              <div className="list-card-header">
                <div>
                  <div className="list-card-title">{r.name}</div>
                  <div className="list-card-sub">📍 {r.location}</div>
                </div>
                <span
                  className={`status-pill ${
                    r.status === 'selesai'
                      ? 'pill-success'
                      : r.status === 'overdue'
                      ? 'pill-danger'
                      : r.daysAge > 20
                      ? 'pill-warn'
                      : 'pill-info'
                  }`}
                >
                  {r.daysAge} hari
                </span>
              </div>
              <div className="list-card-body">
                <div className="list-card-meta">
                  <span>📂 {r.category}</span>
                  <span>📅 {formatDate(r.deadline)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="floating-btn" onClick={() => navigate('/redtag/form')}>+</button>
    </div>
  );
}
