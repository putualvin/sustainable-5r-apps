// ============================================================================
// Tipe & fungsi murni (pure) untuk perhitungan KPI Unit Tarjun.
//
// PRINSIP:
//  - Achievement TIDAK PERNAH disimpan sebagai angka jadi; selalu dihitung dari
//    target/actual + arah (lihat `achievement`).
//  - Skor kategori & unit TIDAK di-hardcode; dihitung lewat `rollup` berbobot.
//  - Semua fungsi di file ini pure (tanpa efek samping) sehingga mudah diuji.
//    Lihat lib/kpi.test.ts.
// ============================================================================

export type Arah = 'higher' | 'lower'

export type Kategori =
  | 'Financial'
  | 'Production'
  | 'Utility'
  | 'Logistic'
  | 'Power Plant'
  | 'EHFS'
  | 'Collaboration'

export type Level = 1 | 2 | 3 | 4

export interface MonthlyValue {
  /** null = data belum tersedia → tampil "—" */
  target: number | null
  actual: number | null
}

export interface KPI {
  id: string
  parentId: string | null
  level: Level
  kategori: Kategori
  nama: string
  uom: string
  arah: Arah
  /** bobot 0..1 untuk rollup dalam kategori */
  bobot: number
  /** 12 bulan, index 0 = Januari … 11 = Desember */
  monthly: MonthlyValue[]
}

export interface CategoryConfig {
  nama: Kategori
  /** bobot 0..1 untuk rollup ke skor unit */
  bobot: number
}

export type Status = 'on-target' | 'waspada' | 'under' | 'na'

export const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
] as const

/**
 * Achievement satu titik data.
 *   arah "higher": Ach = actual / target  (produksi — makin besar makin baik)
 *   arah "lower" : Ach = target / actual  (cost/loss — makin kecil makin baik)
 * Mengembalikan RASIO (mis. 0.96), bukan persen. null bila data tak lengkap
 * atau pembagi 0.
 */
export function achievement(
  target: number | null,
  actual: number | null,
  arah: Arah,
): number | null {
  if (target == null || actual == null) return null
  if (arah === 'higher') {
    if (target === 0) return null
    return actual / target
  }
  // arah === 'lower'
  if (actual === 0) return null
  return target / actual
}

/** Achievement sebuah KPI pada bulan tertentu (index 0..11). */
export function achievementAt(kpi: KPI, monthIndex: number): number | null {
  const m = kpi.monthly[monthIndex]
  if (!m) return null
  return achievement(m.target, m.actual, kpi.arah)
}

/** Deret achievement 12 bulan untuk grafik tren. */
export function achievementSeries(kpi: KPI): (number | null)[] {
  return kpi.monthly.map((m) => achievement(m.target, m.actual, kpi.arah))
}

/**
 * Rata-rata berbobot yang tahan terhadap data kosong: item dengan value null
 * atau bobot <= 0 diabaikan, dan pembagi dinormalisasi ke total bobot item yang
 * valid (sehingga KPI yang belum terisi tidak menyeret skor ke 0).
 * Mengembalikan null bila tidak ada item valid.
 */
export function rollup(
  items: { value: number | null; bobot: number }[],
): number | null {
  const valid = items.filter(
    (i) => i.value != null && Number.isFinite(i.value) && i.bobot > 0,
  )
  if (valid.length === 0) return null
  const totalWeight = valid.reduce((s, i) => s + i.bobot, 0)
  if (totalWeight === 0) return null
  const weighted = valid.reduce((s, i) => s + (i.value as number) * i.bobot, 0)
  return weighted / totalWeight
}

/** KPI level-1 (top level) sebuah kategori — dipakai untuk rollup kategori. */
export function topLevelKpis(kpis: KPI[], kategori: Kategori): KPI[] {
  return kpis.filter((k) => k.kategori === kategori && k.level === 1)
}

/** Anak langsung sebuah KPI. */
export function childrenOf(kpis: KPI[], id: string): KPI[] {
  return kpis.filter((k) => k.parentId === id)
}

/** Skor rollup satu kategori pada bulan tertentu (rasio, atau null). */
export function categoryScore(
  kpis: KPI[],
  kategori: Kategori,
  monthIndex: number,
): number | null {
  const items = topLevelKpis(kpis, kategori).map((k) => ({
    value: achievementAt(k, monthIndex),
    bobot: k.bobot,
  }))
  return rollup(items)
}

/** Skor Unit Tarjun = rollup berbobot dari skor tiap kategori. */
export function unitScore(
  kpis: KPI[],
  categories: CategoryConfig[],
  monthIndex: number,
): number | null {
  const items = categories.map((c) => ({
    value: categoryScore(kpis, c.nama, monthIndex),
    bobot: c.bobot,
  }))
  return rollup(items)
}

/**
 * Status dari rasio achievement:
 *   on-target: Ach >= 95%
 *   waspada  : 85% <= Ach < 95%
 *   under    : Ach < 85%
 *   na       : Ach null (data belum ada)
 */
export function statusOf(ach: number | null): Status {
  if (ach == null || !Number.isFinite(ach)) return 'na'
  const pct = ach * 100
  if (pct >= 95) return 'on-target'
  if (pct >= 85) return 'waspada'
  return 'under'
}

export const STATUS_LABEL: Record<Status, string> = {
  'on-target': 'On-target',
  waspada: 'Waspada',
  under: 'Under',
  na: 'N/A',
}

/** Ringkasan jumlah KPI per status (dipakai di panel skor). */
export function statusCounts(
  kpis: KPI[],
  monthIndex: number,
): Record<Status, number> {
  const counts: Record<Status, number> = {
    'on-target': 0,
    waspada: 0,
    under: 0,
    na: 0,
  }
  for (const k of kpis) {
    counts[statusOf(achievementAt(k, monthIndex))] += 1
  }
  return counts
}

/** Format rasio → persen string, mis. 0.958 → "95.8%". null → "—". */
export function fmtPct(ach: number | null): string {
  if (ach == null || !Number.isFinite(ach)) return '—'
  return `${(ach * 100).toFixed(1)}%`
}

/** Format angka target/actual dengan lokal Indonesia. null → "—". */
export function fmtNum(v: number | null, uom?: string): string {
  if (v == null || !Number.isFinite(v)) return '—'
  const n = v.toLocaleString('id-ID', { maximumFractionDigits: 2 })
  return uom ? `${n} ${uom}` : n
}

export interface TrendPoint {
  bulan: string
  /** achievement dalam persen (mis. 96.2), atau null bila data kosong */
  ach: number | null
}

/**
 * Bangun titik grafik tren dari deret achievement rasio (12 bulan).
 * Pure & non-client agar bisa dipanggil di server component.
 */
export function toTrendPoints(series: (number | null)[]): TrendPoint[] {
  return series.map((ach, i) => ({
    bulan: MONTH_LABELS[i] ?? `${i + 1}`,
    ach: ach == null ? null : Math.round(ach * 1000) / 10,
  }))
}
