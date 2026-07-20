# Dashboard KPI — Unit Tarjun

Mockup **web dashboard KPI Unit Tarjun** (Sinar Mas Agri) untuk dibahas ke tim.
Menampilkan satu skor ringkas Unit Tarjun, lalu tiap kategori KPI sebagai baris
berisi tile KPI; klik satu KPI → halaman detail dengan tren bulanan.

> ⚠️ **Ini mockup.** Belum terhubung ke database/API — data di-seed hardcoded.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · lucide-react · recharts · Vitest

---

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build produksi
npm run start      # jalankan hasil build
npm test           # unit test (Vitest) untuk logika achievement & rollup
npm run lint
```

---

## Catatan penting (baca sebelum dipakai untuk keputusan)

- **Data asli hanya Januari 2025** (dari _Master Data KPI Tarjun 2025_).
  Bulan **Feb–Des di-generate dummy** (variasi ±20% deterministik di sekitar
  actual Januari) hanya agar grafik tren ada isinya. Ditandai jelas di
  komentar `data/kpi.ts`.
- **Bobot kategori & KPI adalah ASUMSI** (lihat `CATEGORIES` dan `bobot` tiap
  KPI) dan **harus dikonfirmasi** ke pemilik KPI.
- Skor kategori & skor unit **tidak di-hardcode** — dihitung lewat `rollup()`
  berbobot. Achievement **tidak disimpan** sebagai angka jadi, selalu dihitung
  dari target/actual + arah.

---

## Aturan perhitungan (inti mockup)

**Achievement** (`lib/kpi.ts → achievement`):

| Arah | Rumus | Contoh |
|---|---|---|
| `higher` (produksi, makin besar makin baik) | `actual / target` | Volume 234766/280750 = 83.6% |
| `lower` (cost/loss, makin kecil makin baik) | `target / actual` | Factory Cost 561992/433927 = 129.5% |

Karena arah `lower` memakai `target/actual`, **cost yang membengkak
(actual > target) otomatis tampil < 100%** — tidak bisa salah tampil sebagai
overperformance. Diuji di `lib/kpi.test.ts`.

**Rollup berbobot** (`lib/kpi.ts → rollup`):

- Skor kategori = rata-rata berbobot achievement KPI level-1 di dalamnya.
- Skor Unit Tarjun = rata-rata berbobot skor tiap kategori (bobot di `CATEGORIES`).
- Item dengan data kosong (null) diabaikan dan bobot dinormalisasi, sehingga
  KPI yang belum terisi (mis. GA Cost, Capex) tidak menyeret skor ke 0.

**Status warna** (`lib/kpi.ts → statusOf`):

| Status | Ambang | Warna |
|---|---|---|
| On-target | Ach ≥ 95% | emerald |
| Waspada | 85% ≤ Ach < 95% | amber |
| Under | Ach < 85% | rose |
| N/A | data null → "—" | slate |

---

## Struktur data KPI (berjenjang)

KPI berjenjang hingga 4 level via `parentId`, bukan flat:

- **Kategori** (Financial, Production, Utility, Logistic, Power Plant, EHFS,
  Collaboration) — wadah, tidak punya angka sendiri (dikonfigurasi di
  `CATEGORIES`).
- **KPI** di dalam kategori (mis. Financial → Factory Cost, GA Cost, Capex).
- **Sub-KPI / level pabrik** (mis. Factory Cost → Refinery → Refinery 1..4).

Tiap KPI: `id`, `parentId`, `level` (1–4), `kategori`, `nama`, `uom`, `arah`
(`higher`/`lower`), `bobot` (0–1), dan 12 bulan `target` & `actual`.

---

## Struktur file

```
kpi-dashboard-tarjun/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx            # Overview (/)
│   └── kpi/[id]/page.tsx   # Detail KPI (/kpi/[id]) + tren 12 bulan
├── components/
│   ├── ScorePanel.tsx      # skor Unit Tarjun + ringkasan status
│   ├── KategoriRow.tsx     # baris kategori + tile KPI
│   ├── KpiTile.tsx         # tile KPI (link ke detail)
│   ├── StatusBadge.tsx
│   └── TrendChart.tsx      # grafik tren (recharts, client component)
├── data/
│   └── kpi.ts              # SEED: Jan 2025 asli + generator Feb–Des dummy
├── lib/
│   ├── kpi.ts              # tipe + achievement/rollup/status (pure)
│   ├── kpi.test.ts         # unit test (Vitest)
│   ├── icons.ts            # peta nama KPI → icon lucide
│   ├── status-style.ts     # kelas Tailwind & hex per status
│   └── theme.ts            # token warna (brand placeholder)
├── tailwind.config.ts / postcss.config.mjs
├── next.config.mjs / tsconfig.json / vitest.config.ts
└── package.json
```

---

## Mengganti seed dengan sumber data asli (nanti)

Semua data ada di [`data/kpi.ts`](data/kpi.ts) pada array `RAW` (+ `CATEGORIES`).
Untuk integrasi Excel/SharePoint nanti: parse sumber → hasilkan array `RawKpi`
(atau langsung `KPI[]`) berbentuk sama, lalu `buildKpis()` mengisi 12 bulan.
Seluruh UI membaca dari `KPIS`, jadi **cukup ubah file ini** — komponen &
perhitungan tidak perlu disentuh.

Ganti warna brand di `app/globals.css` (`--brand`) dan `lib/theme.ts` saat
warna korporat resmi tersedia.

---

© 2025 Sinar Mas Agribusiness and Food — Internal (mockup).
