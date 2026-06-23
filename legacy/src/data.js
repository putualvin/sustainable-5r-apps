// ============ SEED DATA & CONSTANTS ============

export const SEED_DATA = {
  user: {
    name: 'Budi Santoso',
    initials: 'BS',
    email: 'auditor@sinarmas.co.id',
    unit: 'Refinery 2',
    role: 'Senior Auditor',
  },
  audits: [
    { id: 1, area: 'Refinery 2 - Process Area', pic: 'Ahmad Wijaya', date: '2026-05-18', status: 'scheduled', score: null },
    { id: 2, area: 'Refinery 2 - Tank Farm', pic: 'Siti Nurhaliza', date: '2026-05-20', status: 'scheduled', score: null },
    { id: 3, area: 'Refinery 2 - Control Room', pic: 'Dedi Pratama', date: '2026-05-15', status: 'completed', score: 87 },
    { id: 4, area: 'Refinery 2 - Workshop', pic: 'Rina Kartika', date: '2026-05-10', status: 'completed', score: 79 },
  ],
  redTags: [
    { id: 1, name: 'Drum bekas oli', category: 'Berbahaya', location: 'Workshop Area B', deadline: '2026-05-25', daysAge: 8, status: 'aktif' },
    { id: 2, name: 'Pipa besi rusak', category: 'Rusak', location: 'Tank Farm', deadline: '2026-05-22', daysAge: 12, status: 'aktif' },
    { id: 3, name: 'Komputer lama', category: 'Obsolete', location: 'Control Room', deadline: '2026-05-30', daysAge: 5, status: 'aktif' },
    { id: 4, name: 'Kabel listrik bekas', category: 'Tidak Terpakai', location: 'Workshop', deadline: '2026-04-20', daysAge: 28, status: 'overdue' },
    { id: 5, name: 'Tools rusak', category: 'Rusak', location: 'Workshop', deadline: '2026-04-15', daysAge: 33, status: 'overdue' },
  ],
  capa: [
    { id: 1, title: 'Kebocoran minor di pompa P-102', area: 'Process Area', priority: 'high', deadline: '2026-05-19', daysLeft: 1 },
    { id: 2, title: 'Label tangki T-205 pudar', area: 'Tank Farm', priority: 'medium', deadline: '2026-05-20', daysLeft: 2 },
    { id: 3, title: 'APD tidak lengkap di area pintu masuk', area: 'Entry Gate', priority: 'high', deadline: '2026-05-20', daysLeft: 2 },
    { id: 4, title: 'Lantai workshop licin saat hujan', area: 'Workshop', priority: 'medium', deadline: '2026-05-28', daysLeft: 10 },
    { id: 5, title: 'Inventory di rak C kurang rapi', area: 'Warehouse', priority: 'low', deadline: '2026-06-02', daysLeft: 15 },
    { id: 6, title: 'Pencahayaan koridor kurang', area: 'Process Area', priority: 'medium', deadline: '2026-06-05', daysLeft: 18 },
    { id: 7, title: 'SOP belum di-update', area: 'Control Room', priority: 'low', deadline: '2026-06-10', daysLeft: 23 },
    { id: 8, title: 'Hydrant cek bulanan belum dilakukan', area: 'All Areas', priority: 'high', deadline: '2026-05-25', daysLeft: 7 },
  ],
  checklist: {},
  notifications: [
    { id: 1, title: 'Audit baru terjadwal', desc: 'Audit Process Area dijadwalkan untuk besok, 09:00 WIB', icon: '📋', color: 'red', time: '5 menit lalu', read: false },
    { id: 2, title: 'CAPA mendekati deadline', desc: '3 temuan CAPA akan jatuh tempo dalam 3 hari', icon: '⚠️', color: 'red', time: '1 jam lalu', read: false },
    { id: 3, title: 'Red Tag overdue', desc: '2 item red tag sudah lebih dari 25 hari', icon: '🏷️', color: 'yellow', time: '3 jam lalu', read: false },
    { id: 4, title: 'Checklist belum diisi', desc: 'Daily checklist hari ini belum diisi', icon: '☑️', color: 'blue', time: '5 jam lalu', read: true },
    { id: 5, title: 'Skor 5R bulanan', desc: 'Skor Refinery 2 naik 5% menjadi 85%', icon: '📈', color: 'green', time: '1 hari lalu', read: true },
  ],
  documents: [
    { id: 1, title: 'SOP-5R-001 Penerapan Ringkas', type: 'pdf', size: '2.4 MB', date: '15 Mei 2026', category: 'sop' },
    { id: 2, title: 'Panduan Audit 5R 2026', type: 'pdf', size: '5.1 MB', date: '10 Mei 2026', category: 'panduan' },
    { id: 3, title: 'Template Checklist Harian', type: 'xlsx', size: '124 KB', date: '5 Mei 2026', category: 'template' },
    { id: 4, title: 'Materi Training 5R Dasar', type: 'pptx', size: '8.2 MB', date: '1 Mei 2026', category: 'training' },
    { id: 5, title: 'SOP-5R-002 Penerapan Rapi', type: 'pdf', size: '2.1 MB', date: '20 Apr 2026', category: 'sop' },
    { id: 6, title: 'Form Red Tag Template', type: 'docx', size: '350 KB', date: '15 Apr 2026', category: 'template' },
    { id: 7, title: 'Laporan Audit Q1 2026', type: 'pdf', size: '4.7 MB', date: '5 Apr 2026', category: 'laporan' },
  ],
  isOnline: true,
  isAuthenticated: false,
  lastSync: new Date().toISOString(),
};

export const AUDIT_CATEGORIES = [
  {
    id: 1, name: 'Ringkas (Seiri)', color: '#D32F2F',
    items: [
      'Item tidak terpakai sudah disingkirkan',
      'Tidak ada barang berlebihan di area kerja',
      'Klasifikasi barang berdasarkan frekuensi pakai',
    ],
  },
  {
    id: 2, name: 'Rapi (Seiton)', color: '#F57C00',
    items: [
      'Setiap barang memiliki tempat yang jelas',
      'Label/marking jelas di setiap area',
      'Mudah ditemukan saat dibutuhkan',
    ],
  },
  {
    id: 3, name: 'Resik (Seiso)', color: '#2E7D32',
    items: [
      'Area kerja bersih dari debu & sampah',
      'Mesin/peralatan dalam kondisi bersih',
      'Tidak ada ceceran oli/cairan',
    ],
  },
  {
    id: 4, name: 'Rawat (Seiketsu)', color: '#1976D2',
    items: [
      'Standar 5R didokumentasikan',
      'Inspeksi rutin dilakukan',
      'Visualisasi standar (foto/poster)',
    ],
  },
  {
    id: 5, name: 'Rajin (Shitsuke)', color: '#7B1FA2',
    items: [
      'Karyawan mengikuti SOP dengan disiplin',
      'Training 5R rutin dilaksanakan',
      'Perbaikan berkelanjutan terlihat',
    ],
  },
];

export const CHECKLIST_ITEMS = {
  1: ['Tidak ada barang asing di area', 'Tools di tempat yang seharusnya', 'Area bebas dari item tidak terpakai'],
  2: ['Label area terbaca jelas', 'Barang tersusun rapi', 'Tidak ada barang menghalangi jalan'],
  3: ['Lantai bersih dari sampah', 'Mesin bebas dari debu/oli', 'Sampah dibuang ke tempat yang sesuai'],
};

export const CHECKLIST_CATEGORIES = [
  { id: 1, name: 'Ringkas', color: '#D32F2F' },
  { id: 2, name: 'Rapi', color: '#F57C00' },
  { id: 3, name: 'Resik', color: '#2E7D32' },
];

// ============ HELPERS ============
export function formatDate(d) {
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date)) return d;
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function todayKey() {
  return new Date().toISOString().split('T')[0];
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat pagi,';
  if (h < 15) return 'Selamat siang,';
  if (h < 19) return 'Selamat sore,';
  return 'Selamat malam,';
}
