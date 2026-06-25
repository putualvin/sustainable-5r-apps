/**
 * Scoring Sustainable 5R — DUA LAPIS (CLAUDE.md §5.4).
 * PURE FUNCTION: tanpa I/O, tanpa state. Dihitung dari data temuan, bukan hardcode.
 *
 * Lapis 1 — Nilai Utama (Score Hasil Audit):
 *   Bobot status: Done = +2, Progress = +1, No Progress = -1. Total bobot = 2.
 *   Nilai Utama = ( Σ(persentase kategori × bobot) / 2 ) × 100
 *   → semua Done  => 100 ; semua Progress => 50 ; semua No Progress => -50.
 *
 * Lapis 2 — Score Akhir:
 *   Score Akhir = Nilai Utama − Temuan Berulang − Parking Lot
 *   - Temuan Berulang: -1 poin per temuan berulang (sama, PIC area sama, 2 bulan berturut).
 *   - Parking Lot: kumpulan temuan Not Done (Progress / No Progress); -1 poin per item.
 *
 * Validasi baseline April 2026 (semua Done, parking lot 0):
 *   0 berulang → 100.0 ; 1 berulang → 99.0 ; 5 berulang → 95.0.
 */

export type FindingStatus = "DONE" | "PROGRESS" | "NO_PROGRESS";

export const STATUS_WEIGHT: Record<FindingStatus, number> = {
  DONE: 2,
  PROGRESS: 1,
  NO_PROGRESS: -1,
};

/** Total bobot acuan (§5.4). */
export const TOTAL_BOBOT = 2;

export interface ScoreInput {
  /** Status temuan yang SUDAH dinilai komite untuk satu area dalam satu siklus. */
  statuses: FindingStatus[];
  /** Jumlah temuan berulang (sama, PIC area sama, 2 bulan berturut). */
  recurringCount: number;
}

export interface ScoreResult {
  nilaiUtama: number;
  temuanBerulang: number;
  parkingLot: number;
  scoreAkhir: number;
  breakdown: {
    total: number;
    done: number;
    progress: number;
    noProgress: number;
    pctDone: number;
    pctProgress: number;
    pctNoProgress: number;
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Lapis 1 — Nilai Utama dari distribusi status temuan. */
export function hitungNilaiUtama(statuses: FindingStatus[]): number {
  const total = statuses.length;
  if (total === 0) return 0;

  const done = statuses.filter((s) => s === "DONE").length;
  const progress = statuses.filter((s) => s === "PROGRESS").length;
  const noProgress = statuses.filter((s) => s === "NO_PROGRESS").length;

  const pctDone = done / total;
  const pctProgress = progress / total;
  const pctNoProgress = noProgress / total;

  const weighted =
    pctDone * STATUS_WEIGHT.DONE +
    pctProgress * STATUS_WEIGHT.PROGRESS +
    pctNoProgress * STATUS_WEIGHT.NO_PROGRESS;

  return round1((weighted / TOTAL_BOBOT) * 100);
}

/** Lapis 2 — Score Akhir lengkap dengan breakdown. */
export function hitungScore(input: ScoreInput): ScoreResult {
  const { statuses, recurringCount } = input;
  const total = statuses.length;

  const done = statuses.filter((s) => s === "DONE").length;
  const progress = statuses.filter((s) => s === "PROGRESS").length;
  const noProgress = statuses.filter((s) => s === "NO_PROGRESS").length;

  const nilaiUtama = hitungNilaiUtama(statuses);

  // Parking Lot = temuan Not Done (Progress + No Progress).
  const parkingLot = progress + noProgress;
  const temuanBerulang = Math.max(0, recurringCount);

  const scoreAkhir = round1(nilaiUtama - temuanBerulang - parkingLot);

  return {
    nilaiUtama,
    temuanBerulang,
    parkingLot,
    scoreAkhir,
    breakdown: {
      total,
      done,
      progress,
      noProgress,
      pctDone: total ? round1((done / total) * 100) : 0,
      pctProgress: total ? round1((progress / total) * 100) : 0,
      pctNoProgress: total ? round1((noProgress / total) * 100) : 0,
    },
  };
}
