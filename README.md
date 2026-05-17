# EduSpin

> **Belajar terasa seperti bermain game koleksi.**
>
> Aplikasi edukasi anak (3–10 tahun) berbasis kuis sederhana, sistem koin,
> claw machine, dan koleksi karakter lucu.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Anon%20Auth%20%2B%20Firestore-orange)](https://firebase.google.com)
[![Cloud Run](https://img.shields.io/badge/Deploy-Cloud%20Run%20Jakarta-blue)](https://cloud.google.com/run)

---

## 🎯 Konsep

```
Jawab Kuis  →  Kumpulkan Koin  →  Tarik Claw Machine  →  Koleksi Karakter
   (+1)         (10 koin)            (1 collectible)       (lengkapi buku)
```

- **1 jawaban benar = +1 koin**
- **Sesi kuis selesai (10 soal) = bonus +5 koin**
- **Daily login = +5 koin**
- **1 tarikan claw machine = 10 koin**

## ✨ Fitur MVP

- Onboarding ramah anak (nama panggilan + umur)
- 4 kategori kuis: Bentuk, Warna, Hewan, Berhitung — **adaptif sesuai umur**
- Sistem koin dengan animasi feedback
- Claw machine 2D (Framer Motion) dengan **pity transparan**
- Buku Koleksi: tap koleksi untuk animasi + SFX
- Settings: ubah nama/umur, mute, lihat peluang & jaminan pity
- **Offline-first** (anonymous auth + localStorage)
- 100% gratis · tanpa iklan · tanpa pembelian uang asli

## 🛡️ Filosofi

**Anti-pattern yang TIDAK kami lakukan:**
- ❌ Animasi "near-miss" yang menipu
- ❌ Timer FOMO ("kesempatan emas berakhir!")
- ❌ Streak yang menghukum
- ❌ Premium currency
- ❌ Mengumpulkan PII anak (hanya nickname + umur)

**Yang KAMI lakukan:**
- ✅ Rate gacha **transparan** (tertera di Settings & Claw page)
- ✅ Pity system **transparan**: tarikan ke-10 tanpa Epik dijamin Epik+, tarikan ke-30 tanpa Legendaris dijamin Legendaris
- ✅ Semua karakter lucu — tidak ada "reward buruk"

## 🛠️ Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript strict |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State | Zustand (+ persist via localStorage) |
| Auth | Firebase Anonymous Auth (opsional, app jalan offline) |
| Database | Firestore (offline persistence) |
| SFX | Web Audio API (synthesized — zero asset) |
| Hosting | Cloud Run · region `asia-southeast2` (Jakarta) |
| CI | Cloud Build |

## 🚀 Menjalankan Lokal

```bash
# 1. Install dependencies
npm install

# 2. (Opsional) Konfigurasi Firebase
cp .env.example .env.local
# Isi dengan nilai dari Firebase Console → Project Settings → Web App

# 3. Jalankan dev server
npm run dev
# → http://localhost:3000

# Build production
npm run build
npm run start

# Type check
npm run typecheck
```

> **Catatan:** Firebase **opsional**. Aplikasi sepenuhnya berfungsi tanpa env Firebase
> (mode offline-only via localStorage). Set `NEXT_PUBLIC_FIREBASE_ENABLED=true` untuk
> mengaktifkan anonymous auth + Firestore sync.

## ☁️ Deploy ke Cloud Run (Jakarta)

### Setup Awal (sekali saja)

```bash
# 1. Set project
gcloud config set project YOUR_PROJECT_ID

# 2. Enable APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
  artifactregistry.googleapis.com

# 3. Buat Artifact Registry repo
gcloud artifacts repositories create eduspin \
  --repository-format=docker \
  --location=asia-southeast2 \
  --description="EduSpin container images"

# 4. (Setup Cloud Build trigger via Console — connect ke repo GitHub)
```

### Deploy Manual

```bash
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_FB_API_KEY=...,_FB_PROJECT_ID=...,_FB_ENABLED=true
```

### Auto Deploy

Connect repo ke Cloud Build trigger. Setiap push ke `main` akan otomatis:
1. Build container via `Dockerfile`
2. Push ke Artifact Registry (`asia-southeast2`)
3. Deploy ke Cloud Run service `eduspin` di Jakarta

## 🔥 Setup Firebase

```bash
# 1. Buat project di https://console.firebase.google.com
# 2. Enable: Authentication → Anonymous
# 3. Enable: Firestore Database (region: asia-southeast2)
# 4. Deploy security rules
firebase deploy --only firestore:rules
```

Lihat `firestore.rules` untuk aturan keamanan (user hanya akses data miliknya).

## 📁 Struktur Folder

```
src/
├── app/                     # Next.js App Router pages
│   ├── page.tsx            # Splash / redirect
│   ├── onboarding/         # Onboarding nama + umur
│   ├── home/               # Beranda + daily bonus
│   ├── quiz/               # Quiz picker
│   │   └── [category]/     # Quiz session
│   ├── claw/               # Claw machine
│   ├── collection/         # Buku koleksi
│   └── settings/           # Pengaturan
├── components/             # Komponen reusable
├── data/
│   ├── categories.ts
│   ├── collectibles.ts
│   └── questions/          # Bank soal per kategori
├── lib/
│   ├── firebase.ts
│   ├── gacha.ts            # Logika rarity + pity
│   ├── sfx.ts              # Web Audio synth
│   └── utils.ts
├── store/
│   └── useAppStore.ts      # Zustand store
└── types/
    └── index.ts
```

## 🗺️ Roadmap

**v1.0 (MVP) — current**
- ✅ 4 kategori quiz adaptif
- ✅ Claw machine + pity transparan
- ✅ Sticker book interaksi level 1
- ✅ Offline-first

**v1.1**
- Parent PIN gate untuk Settings
- Backup ke Email (link anonymous → email)
- PWA installable
- 2-3 kategori quiz tambahan

**v2.0**
- 9 kategori quiz lengkap
- Parent Dashboard (web)
- Mini-game per collectible (level 2 & 3)
- Cloud Function gacha
- Mobile native (React Native + Expo)

## 📜 Lisensi

(Tentukan lisensi sesuai kebutuhan, misal MIT.)

## 🙏 Kredit

Dibuat dengan harapan bisa membantu anak-anak Indonesia belajar dengan cara yang
lebih menyenangkan. 🇮🇩
