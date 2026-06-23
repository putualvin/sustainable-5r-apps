import { useMemo, useState } from 'react';
import { useApp, showToast } from '../store';
import SubHeader from '../components/SubHeader';

const TYPE_META = {
  pdf:  { icon: '📕', cls: 'icon-red' },
  xlsx: { icon: '📗', cls: 'icon-green' },
  pptx: { icon: '📙', cls: 'icon-yellow' },
  docx: { icon: '📘', cls: 'icon-blue' },
};

const CATEGORY_CARDS = [
  { icon: '📋', cls: 'icon-red',    name: 'SOP 5R',  count: 12 },
  { icon: '📘', cls: 'icon-blue',   name: 'Panduan', count: 8 },
  { icon: '📊', cls: 'icon-green',  name: 'Template', count: 6 },
  { icon: '🎓', cls: 'icon-yellow', name: 'Training', count: 4 },
];

export default function Documents() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');

  const docs = useMemo(() => {
    if (!search) return state.documents;
    return state.documents.filter((d) =>
      d.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, state.documents]);

  const openDoc = (doc) => {
    dispatch({
      type: 'SHOW_MODAL',
      payload: {
        title: doc.title,
        body: (
          <div style={{ fontSize: 12, lineHeight: 1.7 }}>
            <div><strong>Tipe:</strong> {doc.type.toUpperCase()}</div>
            <div><strong>Ukuran:</strong> {doc.size}</div>
            <div><strong>Tanggal:</strong> {doc.date}</div>
            <div
              style={{
                marginTop: 10, padding: 10,
                background: '#f5f5f5', borderRadius: 8, color: '#666',
              }}
            >
              Preview dokumen tidak tersedia di demo. Pada aplikasi production, dokumen akan dibuka di viewer.
            </div>
          </div>
        ),
        actions: [
          { label: 'Tutup', variant: 'secondary' },
          {
            label: '⬇️ Download',
            variant: 'primary',
            onClick: () => showToast(dispatch, '📥 Dokumen sedang diunduh...'),
          },
        ],
      },
    });
  };

  return (
    <div className="screen">
      <SubHeader
        title="Dokumen 5R"
        action="🔍"
        onAction={() => showToast(dispatch, 'Pencarian dokumen')}
        back="/dashboard"
      />
      <div className="content">
        <div className="form-group">
          <input
            type="text"
            className="input-field"
            placeholder="🔍 Cari dokumen, SOP, panduan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="section-title"><span>Kategori</span></div>
        <div
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 10, marginBottom: 14,
          }}
        >
          {CATEGORY_CARDS.map((c) => (
            <div className="widget-card" key={c.name} style={{ textAlign: 'center' }}>
              <div className={`widget-icon ${c.cls}`} style={{ margin: '0 auto 6px' }}>{c.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 10, color: '#888' }}>{c.count} dokumen</div>
            </div>
          ))}
        </div>

        <div className="section-title"><span>Dokumen Terbaru</span></div>
        {docs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📂</div>
            <div className="empty-state-title">Dokumen tidak ditemukan</div>
          </div>
        ) : (
          docs.map((d) => {
            const t = TYPE_META[d.type] || TYPE_META.pdf;
            return (
              <div className="doc-item" key={d.id} onClick={() => openDoc(d)}>
                <div className={`doc-icon ${t.cls}`}>{t.icon}</div>
                <div className="doc-info">
                  <div className="doc-title">{d.title}</div>
                  <div className="doc-meta">
                    {d.type.toUpperCase()} · {d.size} · {d.date}
                  </div>
                </div>
                <span className="menu-arrow">›</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
