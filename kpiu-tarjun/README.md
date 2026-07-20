# KPI Tarjun

Dashboard **KPI (Key Performance Indicator)** untuk site **Tarjun** — PKS & Refinery, Sinar Mas Agribusiness and Food. Mobile-first, dibangun dengan **React + Vite**, siap deploy ke static host manapun.

![tech](https://img.shields.io/badge/React-18-61dafb)
![tech](https://img.shields.io/badge/Vite-5-646cff)

---

## ✨ Fitur

- **Ringkasan performa** — persentase KPI yang mencapai target bulan ini (progress ring)
- **8 KPI utama** dikelompokkan: Produksi, Kualitas, Operasi, HSE
  - FFB Diterima, Produksi CPO, OER, KER, FFA, Uptime Pabrik, LTIFR, Effluent BOD
- **Kartu KPI** dengan nilai, target, badge On-Target/Below, delta Month-on-Month, dan sparkline 6 bulan
- **Filter grup** untuk fokus per kategori
- **Trend chart** bar 6 bulan untuk KPI yang dipilih (tap kartu untuk mengganti)
- Arah target cerdas (`up`/`down`) — mis. LTIFR & BOD makin rendah makin baik
- **PWA-ready** (manifest + theme-color), responsif fullscreen di HP

> ⚠️ Angka pada `src/data.js` adalah **data contoh (dummy)** untuk demo. Ganti dengan data nyata atau hubungkan ke API/spreadsheet saat integrasi.

---

## 🚀 Quick start

```bash
npm install      # install dependencies
npm run dev      # dev server → http://localhost:3000
npm run build    # build production ke dist/
npm run preview  # preview hasil build
```

---

## 📁 Struktur

```
kpiu-tarjun/
├── public/
│   ├── icon.svg
│   └── manifest.webmanifest
├── src/
│   ├── components/
│   │   ├── KpiCard.jsx      # kartu KPI + logika meetsTarget()
│   │   ├── Sparkline.jsx    # mini grafik SVG
│   │   └── TrendChart.jsx   # bar chart tren 6 bulan
│   ├── App.jsx             # layout + state dashboard
│   ├── data.js             # seed KPI + konstanta site
│   ├── index.css           # design tokens & styling
│   └── main.jsx            # entry React
├── index.html
├── vite.config.js
├── vercel.json / netlify.toml
└── package.json
```

---

## 🔧 Mengganti data

Semua angka ada di [`src/data.js`](src/data.js). Tiap KPI punya bentuk:

```js
{
  id: 'cpo',
  label: 'Produksi CPO',
  unit: 'ton',
  value: 10186,          // nilai bulan berjalan
  target: 9800,          // target
  direction: 'up',       // 'up' = makin tinggi makin baik, 'down' = sebaliknya
  trend: [/* 6 bulan terakhir, sejajar dengan MONTHS */],
  icon: '🛢️',
  group: 'Produksi',
}
```

Ubah `SITE`, `MONTHS`, dan array `KPIS` sesuai kebutuhan. Tidak perlu ubah komponen.

---

## 🌐 Deployment

**Vercel / Cloudflare Pages / Netlify:** import repo → build `npm run build`, output `dist`. Config sudah disertakan (`vercel.json`, `netlify.toml`).

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary (Merah Sinar Mas) | `#D32F2F` |
| Success | `#2e7d32` |
| Font | Inter |
| Breakpoint mobile | ≤480px → fullscreen |

---

© 2026 Sinar Mas Agribusiness and Food — Internal Use Only.
