# Sustainable 5R Apps

Aplikasi digitalisasi program **5R** (Ringkas, Rapi, Resik, Rawat, Rajin) untuk **Sinar Mas Agribusiness and Food**. Mobile-first, built dengan React + Vite, siap-deploy ke static host manapun.

![tech](https://img.shields.io/badge/React-18-61dafb)
![tech](https://img.shields.io/badge/Vite-5-646cff)
![tech](https://img.shields.io/badge/Router-v6-CA4245)

---

## ✨ Fitur

- **Login SSO** dengan validasi & session persistence
- **Dashboard** dengan ringkasan performa (Skor 5R, Checklist, CAPA, Red Tag)
- **Audit 5R** form lengkap dengan 5 kategori × 3 item, skor 1–5, real-time score ring
- **Daily Checklist** dengan progress per kategori
- **Red Tag Management** — CRUD lengkap dengan filter (Aktif/Overdue/Selesai)
- **Dokumen 5R** dengan pencarian & kategori (SOP/Panduan/Template/Training)
- **Laporan & Skor** — bar chart tren 6 bulan, breakdown 5R, ringkasan aktivitas
- **Profile** — sync data, toggle offline, logout
- **Notifikasi** dengan mark-as-read
- **CAPA** open finding tracker
- **Offline mode** dengan banner dan persistensi `localStorage`
- **PWA-ready** (manifest + theme-color)

---

## 🚀 Quick start

```bash
# 1. Install dependencies
npm install

# 2. Jalankan dev server (http://localhost:3000)
npm run dev

# 3. Build untuk production
npm run build

# 4. Preview hasil build
npm run preview
```

> Vite akan otomatis mengekspos server ke LAN (lihat `vite.config.js`). Scan QR atau ketik `http://<IP-laptop>:3000` di HP untuk testing mobile.

---

## 📁 Struktur Project

```
.
├── public/
│   ├── icon.svg               # App icon
│   └── manifest.webmanifest   # PWA manifest
├── src/
│   ├── components/            # Shared UI: StatusBar, BottomNav, Modal, etc.
│   ├── screens/               # Page components (Login, Dashboard, …)
│   ├── App.jsx                # Router + layout shell
│   ├── main.jsx               # React entry
│   ├── store.jsx              # Context + reducer + localStorage
│   ├── data.js                # Seed data + constants
│   └── index.css              # Global styles & design tokens
├── index.html                 # Vite entry HTML
├── package.json
├── vite.config.js
├── vercel.json                # Vercel deployment config
└── netlify.toml               # Netlify deployment config
```

---

## 🌐 Deployment

### Opsi 1: Vercel (Recommended — paling mudah)

**A) Via Git (auto-deploy on push):**
1. Push project ke GitHub
2. Buka [vercel.com/new](https://vercel.com/new) → Import repo
3. Vercel auto-detect Vite. Klik **Deploy**. Selesai dalam ~30 detik.

**B) Via CLI:**
```bash
npm i -g vercel
vercel              # follow prompt, hasilnya: https://xxx.vercel.app
vercel --prod       # production URL
```

### Opsi 2: Netlify

```bash
npm i -g netlify-cli
netlify deploy --build        # preview URL
netlify deploy --build --prod # production URL
```

Atau drag-and-drop folder `dist/` ke [app.netlify.com/drop](https://app.netlify.com/drop).

### Opsi 3: GitHub Pages

```bash
npm run build
# Push isi dist/ ke branch gh-pages, atau gunakan action:
# https://github.com/peaceiris/actions-gh-pages
```

### Opsi 4: Cloudflare Pages

Sama seperti Vercel — import repo, build command `npm run build`, output `dist`.

---

## 🔗 Sharing Sementara (Tunneling)

Mau orang lain bisa lihat **tanpa deploy**? Tunnel dari laptop ke internet:

```bash
# Pastikan dev server jalan dulu: npm run dev (port 3000)

# Pilihan A: cloudflared (tidak perlu install)
npx cloudflared tunnel --url http://localhost:3000

# Pilihan B: localtunnel
npx localtunnel --port 3000

# Pilihan C: ngrok (perlu daftar gratis di ngrok.com)
ngrok http 3000
```

Anda akan dapat URL publik (mis. `https://abc.trycloudflare.com`) yang bisa dibuka siapa saja. URL akan **hilang ketika tunnel dimatikan** — cocok untuk demo cepat.

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary (Merah Sinar Mas) | `#D32F2F` |
| Secondary (Biru) | `#1976D2` |
| Success | `#2e7d32` |
| Warning | `#f57c00` |
| Font family | Inter |
| Border radius | 8–12 dp |
| Mobile breakpoint | ≤480px → fullscreen |

---

## 🔐 Demo Credentials

```
Email:    auditor@sinarmas.co.id
Password: demo1234
```

Tidak ada backend nyata — auth disimulasi via state + localStorage.

---

## 📋 Roadmap

- [ ] Integrasi backend (REST API / GraphQL)
- [ ] Real SSO (Azure AD / Okta)
- [ ] Push notification (Firebase Cloud Messaging)
- [ ] QR scanner untuk audit area
- [ ] Kamera real untuk foto bukti
- [ ] Export PDF aktual (jsPDF / react-pdf)
- [ ] Service worker untuk full offline support
- [ ] i18n (Indonesia + English)

---

## 📄 License

© 2026 PT Sinar Mas Agro Resources and Technology Tbk — Internal Use Only.
