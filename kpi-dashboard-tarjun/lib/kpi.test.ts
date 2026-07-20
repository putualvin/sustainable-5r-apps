import { describe, it, expect } from 'vitest'
import {
  achievement,
  achievementAt,
  rollup,
  statusOf,
  categoryScore,
  unitScore,
  statusCounts,
  type KPI,
} from './kpi'
import { KPIS, CATEGORIES, getKpiById } from '@/data/kpi'

describe('achievement()', () => {
  it('higher: Ach = actual / target', () => {
    expect(achievement(100, 96, 'higher')).toBeCloseTo(0.96, 5)
  })

  it('lower: cost yang actual > target menghasilkan Ach < 100% (membengkak = jelek)', () => {
    // Refinery 1: target 227503, actual 325990 (over budget)
    const ach = achievement(227503, 325990, 'lower')!
    expect(ach).toBeLessThan(1)
    expect(ach).toBeCloseTo(227503 / 325990, 5)
  })

  it('lower: cost yang actual < target menghasilkan Ach > 100% (hemat = bagus)', () => {
    // Factory Cost: target 561992, actual 433927 (under budget)
    const ach = achievement(561992, 433927, 'lower')!
    expect(ach).toBeGreaterThan(1)
    expect(ach).toBeCloseTo(561992 / 433927, 5)
  })

  it('null bila target atau actual null', () => {
    expect(achievement(null, 100, 'higher')).toBeNull()
    expect(achievement(100, null, 'higher')).toBeNull()
    expect(achievement(null, null, 'lower')).toBeNull()
  })

  it('null bila pembagi 0 (hindari Infinity)', () => {
    expect(achievement(0, 50, 'higher')).toBeNull() // target 0
    expect(achievement(50, 0, 'lower')).toBeNull() // actual 0
  })

  it('higher dengan actual 0 → 0 (bukan null)', () => {
    expect(achievement(100, 0, 'higher')).toBe(0)
  })
})

describe('rollup()', () => {
  it('rata-rata berbobot dihitung benar', () => {
    // (1.0*0.3 + 0.8*0.2) / (0.3+0.2) = 0.46 / 0.5 = 0.92
    const r = rollup([
      { value: 1.0, bobot: 0.3 },
      { value: 0.8, bobot: 0.2 },
    ])
    expect(r).toBeCloseTo(0.92, 5)
  })

  it('mengabaikan value null dan menormalisasi bobot valid', () => {
    // Hanya item pertama valid → hasil = value item pertama.
    const r = rollup([
      { value: 0.9, bobot: 0.5 },
      { value: null, bobot: 0.5 },
    ])
    expect(r).toBeCloseTo(0.9, 5)
  })

  it('mengabaikan item dengan bobot <= 0', () => {
    const r = rollup([
      { value: 0.5, bobot: 0 },
      { value: 1.0, bobot: 1 },
    ])
    expect(r).toBeCloseTo(1.0, 5)
  })

  it('null bila tidak ada item valid', () => {
    expect(rollup([])).toBeNull()
    expect(rollup([{ value: null, bobot: 1 }])).toBeNull()
    expect(rollup([{ value: 0.9, bobot: 0 }])).toBeNull()
  })
})

describe('statusOf()', () => {
  it('mengklasifikasikan ambang batas dengan benar', () => {
    expect(statusOf(0.95)).toBe('on-target')
    expect(statusOf(1.3)).toBe('on-target')
    expect(statusOf(0.9499)).toBe('waspada')
    expect(statusOf(0.85)).toBe('waspada')
    expect(statusOf(0.8499)).toBe('under')
    expect(statusOf(0)).toBe('under')
    expect(statusOf(null)).toBe('na')
  })
})

describe('rollup terhadap seed (integrasi)', () => {
  const M = 0 // Januari

  it('skor Financial > 100% karena Factory Cost hemat (data asli)', () => {
    const s = categoryScore(KPIS, 'Financial', M)!
    // Factory Cost Ach = 561992/433927 ≈ 1.295; GA & Capex null → diabaikan.
    expect(s).toBeCloseTo(561992 / 433927, 5)
  })

  it('skor Logistic < 85% (Handling jauh di bawah target)', () => {
    const s = categoryScore(KPIS, 'Logistic', M)!
    expect(s).toBeLessThan(0.85)
    // rata-rata berbobot 0.5/0.5 dari 255720/901650 dan 84.9/100
    const expected = (255720 / 901650) * 0.5 + (84.9 / 100) * 0.5
    expect(s).toBeCloseTo(expected, 5)
  })

  it('skor EHFS = 100% (semua tepat target)', () => {
    expect(categoryScore(KPIS, 'EHFS', M)!).toBeCloseTo(1.0, 5)
  })

  it('unitScore ternormalisasi terhadap total bobot kategori', () => {
    const s = unitScore(KPIS, CATEGORIES, M)
    expect(s).not.toBeNull()
    // Hitung ulang manual sebagai pembanding.
    const totalW = CATEGORIES.reduce((a, c) => a + c.bobot, 0)
    const weighted = CATEGORIES.reduce((a, c) => {
      const cs = categoryScore(KPIS, c.nama, M)
      return cs == null ? a : a + cs * c.bobot
    }, 0)
    expect(s!).toBeCloseTo(weighted / totalW, 5)
  })

  it('achievementAt cocok dengan perhitungan langsung untuk KPI asli', () => {
    const factoryCost = getKpiById('1')!
    expect(achievementAt(factoryCost, 0)).toBeCloseTo(561992 / 433927, 5)
  })

  it('statusCounts menjumlahkan seluruh KPI', () => {
    const counts = statusCounts(KPIS, M)
    const total =
      counts['on-target'] + counts.waspada + counts.under + counts.na
    expect(total).toBe(KPIS.length)
    // GA Cost & Capex Realization tak punya data → minimal 2 N/A.
    expect(counts.na).toBeGreaterThanOrEqual(2)
  })
})

describe('data seed konsisten', () => {
  it('setiap KPI punya 12 bulan', () => {
    KPIS.forEach((k: KPI) => expect(k.monthly).toHaveLength(12))
  })

  it('parentId selalu menunjuk KPI yang ada', () => {
    const ids = new Set(KPIS.map((k) => k.id))
    KPIS.forEach((k) => {
      if (k.parentId != null) expect(ids.has(k.parentId)).toBe(true)
    })
  })

  it('bobot kategori total 1.0', () => {
    const total = CATEGORIES.reduce((a, c) => a + c.bobot, 0)
    expect(total).toBeCloseTo(1.0, 5)
  })
})
