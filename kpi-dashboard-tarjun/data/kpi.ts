// ============================================================================
// SEED DATA — Master Data KPI Unit Tarjun (Sinar Mas Agri).
//
// SUMBER DATA:
//  - Kolom Januari 2025 (target/actual) = DATA ASLI dari Master Data KPI Tarjun 2025.
//  - Bulan Feb–Des = DATA DUMMY, di-generate deterministik (±20% di sekitar actual
//    Januari, target dibuat tetap = target Januari). Hanya untuk mengisi grafik tren.
//    JANGAN dipakai sebagai angka nyata.
//
// BOBOT:
//  - Bobot kategori & bobot KPI di bawah adalah ASUMSI dan HARUS DIKONFIRMASI ke
//    pemilik KPI masing-masing unit.
//
// MENGGANTI SUMBER DATA NANTI:
//  - Ganti isi `RAW` (dan `CATEGORIES`) dengan hasil parsing Excel/SharePoint.
//    Struktur `KPI[]` yang dihasilkan `buildKpis()` sudah dipakai seluruh UI,
//    jadi cukup ubah file ini saja.
// ============================================================================

import type {
  KPI,
  MonthlyValue,
  CategoryConfig,
  Arah,
  Kategori,
  Level,
} from '@/lib/kpi'

/** Bulan yang dijadikan "periode berjalan" di halaman Overview. 0 = Januari (data asli). */
export const CURRENT_MONTH_INDEX = 0
export const PERIODE_LABEL = 'Januari 2025'

// --- Bobot kategori (ASUMSI — total 1.00) -----------------------------------
export const CATEGORIES: CategoryConfig[] = [
  { nama: 'Financial', bobot: 0.3 },
  { nama: 'Production', bobot: 0.2 },
  { nama: 'Utility', bobot: 0.1 },
  { nama: 'Logistic', bobot: 0.1 },
  { nama: 'Power Plant', bobot: 0.1 },
  { nama: 'EHFS', bobot: 0.15 },
  { nama: 'Collaboration', bobot: 0.05 },
]

interface RawKpi {
  id: string
  parentId: string | null
  level: Level
  kategori: Kategori
  nama: string
  uom: string
  arah: Arah
  bobot: number
  /** target/actual Januari 2025 (asli). null = belum terisi. */
  jan: { target: number | null; actual: number | null }
}

// --- Data mentah (Januari 2025 asli) ----------------------------------------
const RAW: RawKpi[] = [
  // ===================== FINANCIAL (arah lower, Rp/ton) =====================
  { id: '1', parentId: null, level: 1, kategori: 'Financial', nama: 'Factory Cost', uom: 'Rp/ton', arah: 'lower', bobot: 0.5, jan: { target: 561992, actual: 433927 } },
  { id: '1.1', parentId: '1', level: 2, kategori: 'Financial', nama: 'Refinery', uom: 'Rp/ton', arah: 'lower', bobot: 0.4, jan: { target: 229691, actual: 211452 } },
  { id: '1.1.1', parentId: '1.1', level: 3, kategori: 'Financial', nama: 'Refinery 1', uom: 'Rp/ton', arah: 'lower', bobot: 0.25, jan: { target: 227503, actual: 325990 } },
  { id: '1.1.2', parentId: '1.1', level: 3, kategori: 'Financial', nama: 'Refinery 2', uom: 'Rp/ton', arah: 'lower', bobot: 0.25, jan: { target: 223476, actual: 249086 } },
  { id: '1.1.3', parentId: '1.1', level: 3, kategori: 'Financial', nama: 'Refinery 3', uom: 'Rp/ton', arah: 'lower', bobot: 0.25, jan: { target: 302859, actual: 170080 } },
  { id: '1.1.4', parentId: '1.1', level: 3, kategori: 'Financial', nama: 'Refinery 4', uom: 'Rp/ton', arah: 'lower', bobot: 0.25, jan: { target: 211199, actual: 160989 } },
  { id: '1.2', parentId: '1', level: 2, kategori: 'Financial', nama: 'Fractionation', uom: 'Rp/ton', arah: 'lower', bobot: 0.3, jan: { target: 90112, actual: 70886 } },
  { id: '1.2.1', parentId: '1.2', level: 3, kategori: 'Financial', nama: 'Fractionation 1', uom: 'Rp/ton', arah: 'lower', bobot: 0.5, jan: { target: 100364, actual: 153858 } },
  { id: '1.2.2', parentId: '1.2', level: 3, kategori: 'Financial', nama: 'Fractionation 2', uom: 'Rp/ton', arah: 'lower', bobot: 0.5, jan: { target: 84945, actual: 50273 } },
  { id: '1.3', parentId: '1', level: 2, kategori: 'Financial', nama: 'Biodiesel', uom: 'Rp/ton', arah: 'lower', bobot: 0.3, jan: { target: 1216229, actual: 1187169 } },
  { id: '1.3.1', parentId: '1.3', level: 3, kategori: 'Financial', nama: 'Biodiesel 1', uom: 'Rp/ton', arah: 'lower', bobot: 0.5, jan: { target: 1231799, actual: 1322679 } },
  { id: '1.3.2', parentId: '1.3', level: 3, kategori: 'Financial', nama: 'Biodiesel 2', uom: 'Rp/ton', arah: 'lower', bobot: 0.5, jan: { target: 1205849, actual: 1122196 } },
  { id: '2', parentId: null, level: 1, kategori: 'Financial', nama: 'GA Cost', uom: 'Rp/ton', arah: 'lower', bobot: 0.3, jan: { target: null, actual: null } },
  // Capex Realization: realisasi vs rencana → makin mendekati/melebihi rencana makin baik (higher).
  { id: '3', parentId: null, level: 1, kategori: 'Financial', nama: 'Capex Realization', uom: '%', arah: 'higher', bobot: 0.2, jan: { target: null, actual: null } },

  // ===================== PRODUCTION (arah higher) ==========================
  { id: 'P1', parentId: null, level: 1, kategori: 'Production', nama: 'Volume', uom: 'ton', arah: 'higher', bobot: 0.5, jan: { target: 280750, actual: 234766 } },
  { id: 'P2', parentId: null, level: 1, kategori: 'Production', nama: 'Efficiency', uom: '%', arah: 'higher', bobot: 0.25, jan: { target: 100, actual: 96 } },
  { id: 'P3', parentId: null, level: 1, kategori: 'Production', nama: 'Yield & Loss', uom: '%', arah: 'higher', bobot: 0.25, jan: { target: 100, actual: 78 } },

  // ===================== UTILITY (arah higher, %) ==========================
  { id: 'U1', parentId: null, level: 1, kategori: 'Utility', nama: 'SWRO Ratio', uom: '%', arah: 'higher', bobot: 0.5, jan: { target: 40, actual: 29 } },
  { id: 'U2', parentId: null, level: 1, kategori: 'Utility', nama: 'BWRO Ratio', uom: '%', arah: 'higher', bobot: 0.5, jan: { target: 75, actual: 74.8 } },

  // ===================== LOGISTIC ==========================================
  { id: 'L1', parentId: null, level: 1, kategori: 'Logistic', nama: 'Handling', uom: 'ton', arah: 'higher', bobot: 0.5, jan: { target: 901650, actual: 255720 } },
  { id: 'L2', parentId: null, level: 1, kategori: 'Logistic', nama: 'Efficiency', uom: '%', arah: 'higher', bobot: 0.5, jan: { target: 100, actual: 84.9 } },

  // ===================== POWER PLANT (ratio) ===============================
  { id: 'PP1', parentId: null, level: 1, kategori: 'Power Plant', nama: 'Steam Ratio', uom: 'ratio', arah: 'higher', bobot: 1, jan: { target: 4.2, actual: 4.61 } },

  // ===================== EHFS (arah higher, %) =============================
  { id: 'E1', parentId: null, level: 1, kategori: 'EHFS', nama: 'Environment', uom: '%', arah: 'higher', bobot: 0.34, jan: { target: 100, actual: 100 } },
  { id: 'E2', parentId: null, level: 1, kategori: 'EHFS', nama: 'Safety', uom: '%', arah: 'higher', bobot: 0.33, jan: { target: 100, actual: 100 } },
  { id: 'E3', parentId: null, level: 1, kategori: 'EHFS', nama: 'Audit', uom: '%', arah: 'higher', bobot: 0.33, jan: { target: 100, actual: 100 } },

  // ===================== COLLABORATION (arah higher, %) ====================
  { id: 'C1', parentId: null, level: 1, kategori: 'Collaboration', nama: '5R', uom: '%', arah: 'higher', bobot: 0.5, jan: { target: 100, actual: 78 } },
  { id: 'C2', parentId: null, level: 1, kategori: 'Collaboration', nama: 'BBS', uom: '%', arah: 'higher', bobot: 0.5, jan: { target: 100, actual: 80 } },
]

// --- Generator tren deterministik -------------------------------------------
// PRNG deterministik agar hasil identik di server & client (hindari hydration
// mismatch) dan stabil antar build. TIDAK memakai Math.random().
function seededNoise(seed: number): number {
  const x = Math.sin(seed) * 10000
  return (x - Math.floor(x)) * 2 - 1 // → [-1, 1]
}

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 100000
  return h
}

function roundByUom(value: number, uom: string): number {
  if (uom === 'ratio') return Math.round(value * 100) / 100
  if (uom === '%') return Math.round(value * 10) / 10
  return Math.round(value) // Rp/ton, ton
}

/** Ubah satu RawKpi → 12 bulan MonthlyValue. */
function genMonthly(raw: RawKpi): MonthlyValue[] {
  const months: MonthlyValue[] = []
  for (let m = 0; m < 12; m++) {
    // Bulan tanpa data Januari → seluruh tahun null.
    if (raw.jan.target == null || raw.jan.actual == null) {
      months.push({ target: raw.jan.target, actual: raw.jan.actual })
      continue
    }
    // Januari = data asli.
    if (m === 0) {
      months.push({ target: raw.jan.target, actual: raw.jan.actual })
      continue
    }
    // Feb–Des = dummy: target tetap, actual bervariasi ±20% (deterministik).
    const factor = 1 + 0.2 * seededNoise(hashId(raw.id) + m * 7)
    months.push({
      target: raw.jan.target,
      actual: roundByUom(raw.jan.actual * factor, raw.uom),
    })
  }
  return months
}

/** Bangun daftar KPI final dari data mentah. */
export function buildKpis(raw: RawKpi[] = RAW): KPI[] {
  return raw.map((r) => ({
    id: r.id,
    parentId: r.parentId,
    level: r.level,
    kategori: r.kategori,
    nama: r.nama,
    uom: r.uom,
    arah: r.arah,
    bobot: r.bobot,
    monthly: genMonthly(r),
  }))
}

export const KPIS: KPI[] = buildKpis()

/** Lookup by id (untuk halaman detail). */
export function getKpiById(id: string): KPI | undefined {
  return KPIS.find((k) => k.id === id)
}
