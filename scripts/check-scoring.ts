/**
 * Validasi fungsi scoring terhadap baseline April 2026 (CLAUDE.md §5.4 / §10).
 * Jalankan: npx tsx scripts/check-scoring.ts
 */
import { hitungScore, hitungNilaiUtama, type FindingStatus } from "../src/lib/scoring";

let failed = 0;
function expect(label: string, got: number, want: number) {
  const ok = Math.abs(got - want) < 1e-9;
  if (!ok) failed++;
  console.log(`${ok ? "✓" : "✗"} ${label}: got ${got}, want ${want}`);
}

// Helper: area dengan N temuan, semua Done.
const allDone = (n: number): FindingStatus[] => Array(n).fill("DONE");

// --- Baseline April 2026: semua Done (Nilai Utama 100), parking lot 0 ---
expect("0 berulang → 100.0", hitungScore({ statuses: allDone(21), recurringCount: 0 }).scoreAkhir, 100.0);
expect("1 berulang → 99.0", hitungScore({ statuses: allDone(21), recurringCount: 1 }).scoreAkhir, 99.0);
expect("5 berulang → 95.0", hitungScore({ statuses: allDone(21), recurringCount: 5 }).scoreAkhir, 95.0);

// --- Lapis 1 (Nilai Utama) ---
expect("semua Done → 100", hitungNilaiUtama(allDone(10)), 100);
expect("semua Progress → 50", hitungNilaiUtama(Array(10).fill("PROGRESS")), 50);
expect("semua No Progress → -50", hitungNilaiUtama(Array(10).fill("NO_PROGRESS")), -50);
expect("kosong → 0", hitungNilaiUtama([]), 0);

// --- Campuran + parking lot ---
// 8 Done, 2 Progress (dari 10): pctDone .8, pctProg .2
// nilai = (.8*2 + .2*1)/2*100 = (1.6+.2)/2*100 = 90
const mixed = hitungScore({
  statuses: [...allDone(8), "PROGRESS", "PROGRESS"],
  recurringCount: 0,
});
expect("8D/2P → nilaiUtama 90", mixed.nilaiUtama, 90);
expect("8D/2P → parkingLot 2", mixed.parkingLot, 2);
expect("8D/2P → scoreAkhir 88", mixed.scoreAkhir, 88); // 90 - 0 - 2

console.log(failed === 0 ? "\nSEMUA LULUS ✅" : `\n${failed} GAGAL ❌`);
process.exit(failed === 0 ? 0 : 1);
