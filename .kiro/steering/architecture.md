---
inclusion: always
---

# EduSpin — Architecture & Product Steering

> Single source of truth untuk semua keputusan teknis & produk EduSpin.
> Update file ini setiap kali ada perubahan arah.

## 1. Visi Produk

**EduSpin** adalah aplikasi edukasi anak (usia 3–10) yang mengubah belajar menjadi pengalaman game koleksi. Anak menjawab kuis sederhana untuk mendapat koin, lalu menukar koin di mesin claw untuk mengumpulkan koleksi karakter lucu (hewan, robot, dinosaurus, dll).

**Filosofi inti:**
- Fun, ringan, visual menarik
- Tidak terasa seperti belajar formal
- **Tidak manipulatif** (no near-miss, no FOMO timer, no fear streak)
- **Bukan gambling** (rate transparan, pity system jujur, tidak ada premium currency)
- **Bukan pay-to-win** (100% gratis di MVP)

## 2. Audiens & Compliance

- **User utama**: anak usia 3–10 (di bawah ambang COPPA)
- **Akun**: dimiliki orang tua, anak hanya pakai
- **PII minimum**: hanya nickname + umur (BUKAN tanggal lahir asli, BUKAN nama lengkap, BUKAN email anak)
- **Tidak ada iklan pihak ketiga, tidak ada tracking yang mengidentifikasi anak**

## 3. Stack (Final MVP)

```yaml
Frontend:
  framework: Next.js 14 (App Router) + TypeScript (strict)
  styling: Tailwind CSS
  animation: Framer Motion (+ Lottie untuk collectible)
  state: Zustand (+ persist middleware via localStorage)
  pwa: optional, dipertimbangkan v1.1

Firebase:
  auth: Anonymous Auth (tanpa form di MVP, tanpa PIN)
  database: Firestore (offline persistence ON, sync ke cloud saat online)
  storage: Cloud Storage (assets collectible) — siap, belum dipakai di MVP
  config: Remote Config (rarity rate, pity threshold, harga claw) — v1.1

Hosting:
  target: Cloud Run
  region: asia-southeast2 (Jakarta)
  container: Dockerfile multi-stage (Next.js standalone output)
  ci: cloudbuild.yaml (deploy on push to main)

Konten:
  questions: /src/data/questions/*.ts (TypeScript, type-safe)
  collectibles: /src/data/collectibles.ts
  audio: /public/sfx/*.mp3 (CC0)
  visuals: emoji + Tailwind shapes sebagai placeholder MVP
```

## 4. Core Gameplay Loop (MVP)

```
Onboarding (nama + umur)
        ↓
Home (lihat koin, daily bonus, pilih menu)
        ↓
Quiz (pilih kategori → jawab 10 soal → +1 koin/benar, +5 bonus selesai sesi)
        ↓
Claw Machine (10 koin = 1 tarikan, animasi 2D, reveal)
        ↓
Sticker Book (tap koleksi → animasi + SFX)
        ↓
Settings (ganti nama/umur, mute, lihat rate transparan)
```

## 5. Sistem Koin (Final)

| Action | Reward |
|---|---|
| 1 jawaban benar | +1 koin |
| Selesaikan sesi quiz (10 soal) | +5 koin bonus |
| Daily login (1x per 24 jam) | +5 koin |
| 1 tarikan claw machine | -10 koin |

Anak realistis butuh ~7 jawaban benar per tarikan (lebih reachable untuk umur 3-6).

## 6. Sistem Rarity & Pity (Transparan)

**Rate dasar (ditampilkan di Settings):**
| Rarity | Rate |
|---|---|
| Common | 60% |
| Rare | 25% |
| Epic | 10% |
| Legendary | 5% |

**Pity system:**
- Tarikan ke-10 berturut-turut tanpa Epic+ → **dijamin Epic atau lebih**
- Tarikan ke-30 berturut-turut tanpa Legendary → **dijamin Legendary**
- Counter pity di-reset saat kondisi terpenuhi

**Tidak ada:**
- Animasi "near-miss" yang fake
- Pity tersembunyi
- Banner event yang manipulatif

## 7. Adaptive Difficulty

Setiap soal di-tag `{ ageMin, ageMax, difficulty }`. Engine memilih soal sesuai umur anak ± toleransi 1 tahun. Belum ML, sudah cukup adaptif untuk MVP.

**Mapping kategori per umur (referensi konten):**
| Umur | Kategori MVP |
|---|---|
| 3–4 | Shape, Color, Animal |
| 5–6 | Shape, Color, Animal, Counting |
| 7–8 | Counting (lanjutan) |
| 9–10 | (V2: math, pattern, logic) |

## 8. Kategori Quiz MVP (4 dari 9)

1. **Shape Recognition** — lingkaran, segitiga, persegi, dll
2. **Color Recognition** — merah, biru, hijau, dll
3. **Animal Recognition** — kucing, anjing, ikan, gajah (dengan SFX hewan)
4. **Counting Numbers** — hitung emoji

V2: Basic Math, Pattern, Alphabet, Emotion, Daily Life Knowledge.

## 9. Collectible Strategy

**MVP:** semua tier (Common → Legendary) memiliki interaksi **Level 1**:
- Tap → animasi sederhana (bounce/wiggle) + SFX

**V2:** pembedaan per-rarity:
- Basic → makan sebagian (buah)
- Epic → tepuk + suara hewan
- Mahal → arahkan/feed/mini-game

## 10. Data Model (Firestore + Local)

### Local-first (Zustand persist + Firestore sync)

```ts
ChildProfile {
  uid: string              // anonymous auth uid
  nickname: string         // 1-20 char
  age: number              // 3-10
  createdAt: timestamp
  updatedAt: timestamp
}

Wallet {
  uid: string
  coins: number
  totalEarned: number      // lifetime, untuk V2 stats
  lastDailyClaim: timestamp | null
  updatedAt: timestamp
}

PullHistory {
  uid: string
  totalPulls: number
  pityCounterEpic: number       // reset saat dapat Epic+
  pityCounterLegendary: number  // reset saat dapat Legendary
  updatedAt: timestamp
}

Collection {
  uid: string
  items: { [collectibleId: string]: { count: number, firstPulledAt: timestamp } }
  updatedAt: timestamp
}

QuizStats {
  uid: string
  totalCorrect: number
  totalAnswered: number
  byCategory: { [categoryId]: { correct: number, answered: number } }
  updatedAt: timestamp
}

Settings {
  uid: string
  muted: boolean
  // future: language, theme, etc.
}
```

### Firestore Path
```
/profiles/{uid}                  → ChildProfile + Wallet + Pity + Settings (denormalized)
/profiles/{uid}/collection/{itemId}
/profiles/{uid}/quizStats/byCategory/{categoryId}
```

## 11. Security Notes

- **Gacha di client-side** untuk MVP (tidak ada uang asli, risiko cheat rendah)
- **Saat monetisasi muncul**, gacha WAJIB pindah ke Cloud Function dengan App Check
- **Firestore rules**: user hanya boleh baca/tulis dokumen di bawah `uid`-nya sendiri
- **Anonymous auth**: data hilang jika cache browser dibersihkan. Solusi v1.1: link ke email opsional.

## 12. Region & Performance

- Cloud Run region: `asia-southeast2` (Jakarta)
- Firestore region: `asia-southeast2` (Jakarta) — co-located
- Target Lighthouse: Performance ≥ 90, Accessibility ≥ 95

## 13. Roadmap

### MVP (v1.0) — current scope
✅ Onboarding (nama, umur)
✅ 4 kategori quiz dengan adaptive
✅ Coin system + daily bonus
✅ Claw machine 2D + pity transparan
✅ Sticker book interaksi level 1
✅ Settings + rate viewer
✅ Offline-first (anonymous auth)
✅ Deploy ke Cloud Run Jakarta

### V1.1 (post-MVP)
- Parent PIN gate untuk Settings
- Backup ke Email (link anonymous → email)
- PWA installable
- 2-3 kategori quiz tambahan

### V2.0
- 9 kategori quiz lengkap
- Parent Dashboard (web)
- Mini-game per collectible (level 2 & 3)
- Cloud Function gacha (saat ada monetisasi)
- Multi-anak per akun
- LLM quiz generator (kurated)
- Mobile native (React Native + Expo)

## 14. Anti-Pattern (Hal yang TIDAK boleh kita lakukan)

- ❌ "Hampir Legendary!" animasi yang menipu
- ❌ Timer "kesempatan emas berakhir 1 jam!"
- ❌ Streak yang menghukum kalau bolong
- ❌ Premium currency yang dibeli pakai uang asli
- ❌ Iklan pihak ketiga
- ❌ Mengumpulkan tanggal lahir asli, foto, lokasi
- ❌ Menampilkan pity counter dengan cara yang membuat anak "menambah pengeluaran"

## 15. Konvensi Kode

- TypeScript **strict mode** wajib
- Tidak ada `any` kecuali sangat justified
- Komponen React: functional + hooks
- File naming: `kebab-case.tsx` untuk components, `camelCase.ts` untuk utils
- Folder: `src/app` (routes), `src/components`, `src/lib`, `src/data`, `src/store`, `src/types`
- Commit: Conventional Commits (feat/, fix/, chore/, dll)
