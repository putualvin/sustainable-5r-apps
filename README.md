# Sustainable 5R Apps — Shadow Build

Aplikasi digitalisasi program **Sustainable 5R** (Ringkas, Rapi, Resik, Rawat, Rajin) untuk **Sinar Mas Agribusiness and Food** — unit pilot **Refinery 2 (12 area)**. Demo personal untuk validasi requirement BRD (bukan sistem produksi).

> Konteks proyek lengkap & aturan bisnis terkunci ada di [`CLAUDE.md`](./CLAUDE.md).

## Tech Stack

- **Next.js 14** (App Router) + **TypeScript** (strict)
- **Prisma** + **SQLite** (file lokal `prisma/dev.db`)
- **Tailwind CSS** · **recharts**

## Quick start

```bash
# 1. Install dependency (otomatis prisma generate)
npm install

# 2. Buat & isi database SQLite
npm run db:reset        # push schema + seed data dummy

# 3. Jalankan dev server (http://localhost:3000)
npm run dev
```

## Script penting

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (type-check + lint) |
| `npm run db:push` | Sinkron schema Prisma → SQLite |
| `npm run db:seed` | Isi seed data dummy |
| `npm run db:reset` | Reset DB + seed ulang |
| `npm run db:studio` | Prisma Studio (lihat data) |
| `npx tsx scripts/check-scoring.ts` | Validasi fungsi scoring vs baseline April 2026 |

## Status

**Modul 0 (Setup & Seed) — selesai.** Schema lengkap, seed realistis (12 area, 11 user / 6 role, 20 guiding question, checklist, red tag, siklus baseline 2026-04 + aktif 2026-06). Fungsi scoring murni tervalidasi ke baseline (5 berulang → 95.0, 1 → 99.0, 0 → 100.0).

Roadmap modul: lihat `CLAUDE.md` §9.

## Catatan

- Prototype UI lama (Vite + React) diarsipkan di [`/legacy`](./legacy) sebagai referensi visual saja.
- Seluruh teks UI Bahasa Indonesia, mobile-first.
