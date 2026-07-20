// ============================================================
// Seed data for KPI Tarjun — Sinar Mas Agribusiness and Food
// Angka bersifat contoh (dummy) untuk demo. Ganti dengan data nyata
// atau hubungkan ke API/spreadsheet saat integrasi.
// ============================================================

export const SITE = {
  name: 'Tarjun',
  fullName: 'PKS & Refinery Tarjun',
  region: 'Kotabaru, Kalimantan Selatan',
  period: 'Juli 2026',
}

export const MONTHS = ['Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul']

// KPI utama. `trend` = 6 bulan terakhir (sejalan dengan MONTHS).
// `direction` = arah yang diinginkan: 'up' makin tinggi makin baik, 'down' sebaliknya.
export const KPIS = [
  {
    id: 'ffb',
    label: 'FFB Diterima',
    unit: 'ton',
    value: 48250,
    target: 46000,
    direction: 'up',
    trend: [41200, 43800, 45100, 46700, 47500, 48250],
    icon: '🌴',
    group: 'Produksi',
  },
  {
    id: 'cpo',
    label: 'Produksi CPO',
    unit: 'ton',
    value: 10186,
    target: 9800,
    direction: 'up',
    trend: [8650, 9120, 9450, 9720, 9980, 10186],
    icon: '🛢️',
    group: 'Produksi',
  },
  {
    id: 'oer',
    label: 'OER (Rendemen)',
    unit: '%',
    value: 21.1,
    target: 21.0,
    direction: 'up',
    trend: [20.4, 20.6, 20.8, 20.9, 21.0, 21.1],
    icon: '📈',
    group: 'Produksi',
  },
  {
    id: 'ker',
    label: 'KER (Kernel)',
    unit: '%',
    value: 5.0,
    target: 5.2,
    direction: 'up',
    trend: [4.7, 4.8, 4.9, 4.9, 5.0, 5.0],
    icon: '🥥',
    group: 'Produksi',
  },
  {
    id: 'ffa',
    label: 'FFA CPO',
    unit: '%',
    value: 2.9,
    target: 3.0,
    direction: 'down',
    trend: [3.4, 3.3, 3.2, 3.1, 3.0, 2.9],
    icon: '🧪',
    group: 'Kualitas',
  },
  {
    id: 'uptime',
    label: 'Pabrik Uptime',
    unit: '%',
    value: 94.8,
    target: 95.0,
    direction: 'up',
    trend: [91.2, 92.5, 93.1, 94.0, 94.5, 94.8],
    icon: '⚙️',
    group: 'Operasi',
  },
  {
    id: 'ltifr',
    label: 'LTIFR (Safety)',
    unit: '',
    value: 0.42,
    target: 0.50,
    direction: 'down',
    trend: [0.71, 0.66, 0.58, 0.51, 0.47, 0.42],
    icon: '🦺',
    group: 'HSE',
  },
  {
    id: 'bod',
    label: 'Effluent BOD',
    unit: 'mg/L',
    value: 92,
    target: 100,
    direction: 'down',
    trend: [118, 112, 105, 99, 95, 92],
    icon: '💧',
    group: 'HSE',
  },
]

export const GROUPS = ['Produksi', 'Kualitas', 'Operasi', 'HSE']
