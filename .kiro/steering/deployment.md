---
inclusion: manual
---

# EduSpin — Panduan Deployment ke GCP

> Step-by-step deploy aplikasi ke Cloud Run Jakarta + auto-deploy via push GitHub.
> Estimasi waktu: 30–45 menit (sekali setup).
> Estimasi biaya bulanan untuk MVP: **$0–$1** (hampir semua di free tier).

---

## 🗺️ Arsitektur Akhir

```
┌────────────┐     git push main      ┌──────────────┐
│   GitHub   │ ─────────────────────► │ Cloud Build  │
│   (repo)   │                        │   Trigger    │
└────────────┘                        └──────┬───────┘
                                             │ build & deploy
                                             ▼
                                      ┌──────────────┐
                                      │ Artifact Reg │
                                      │ (container)  │
                                      └──────┬───────┘
                                             │
                                             ▼
                                      ┌──────────────┐         ┌──────────────┐
                                      │  Cloud Run   │ ──auth──│   Firebase   │
                                      │  (Jakarta)   │ ──data──│ Auth+Firestore│
                                      └──────────────┘         └──────────────┘
                                             ▲
                                             │ HTTPS
                                      ┌──────┴───────┐
                                      │ User Browser │
                                      └──────────────┘
```

---

## 📋 Prasyarat

- [ ] Akun Google
- [ ] `gcloud` CLI ter-install ([panduan install](https://cloud.google.com/sdk/docs/install))
- [ ] Repo GitHub `fafauwu/eduspin` (sudah ada)
- [ ] Kartu kredit/debit untuk billing GCP (tetap $0 jika di free tier)

---

## FASE 1 — Setup GCP Project (sekali saja, ~10 menit)

### 1.1 Login & Buat Project

```bash
# Login ke gcloud
gcloud auth login

# Buat project baru (ganti PROJECT_ID — harus unik global)
export PROJECT_ID="eduspin-prod"
gcloud projects create $PROJECT_ID --name="EduSpin"

# Set sebagai project aktif
gcloud config set project $PROJECT_ID
```

### 1.2 Aktifkan Billing

Buka: <https://console.cloud.google.com/billing>
- Link billing account ke project `eduspin-prod`
- Kalau Anda baru, klaim **kredit gratis $300 / 90 hari** di sini juga

### 1.3 Enable APIs yang Diperlukan

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  firestore.googleapis.com \
  firebase.googleapis.com \
  iam.googleapis.com
```

### 1.4 Buat Artifact Registry Repo

```bash
gcloud artifacts repositories create eduspin \
  --repository-format=docker \
  --location=asia-southeast2 \
  --description="EduSpin container images"
```

### 1.5 Beri Izin ke Service Account Cloud Build

Cloud Build perlu izin untuk deploy ke Cloud Run dan menggunakan service account-nya.

```bash
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Cloud Run Admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/run.admin"

# Service Account User (untuk attach SA ke Cloud Run)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/iam.serviceAccountUser"
```

> ✅ Setelah fase ini, infrastruktur GCP siap.

---

## FASE 2 — Setup Firebase (sekali saja, ~5 menit)

### 2.1 Tambahkan Firebase ke Project GCP yang Sudah Ada

Buka <https://console.firebase.google.com/>:
1. Klik **Add project**
2. Pilih existing GCP project: `eduspin-prod`
3. Skip Google Analytics (tidak perlu untuk MVP, hindari tracking anak)

### 2.2 Aktifkan Anonymous Auth

Firebase Console → **Build > Authentication** → Get started → **Sign-in method** → enable **Anonymous**.

### 2.3 Buat Firestore Database

Firebase Console → **Build > Firestore Database** → Create database:
- Mode: **Production mode** (kita punya rules sendiri)
- Region: **asia-southeast2 (Jakarta)** ⚠️ tidak bisa diubah setelah dibuat!

### 2.4 Daftarkan Web App & Ambil Config

Firebase Console → ⚙️ **Project settings** → **General** → scroll ke "Your apps" → tambah Web App:
- Nickname: `EduSpin Web`
- ✗ **Jangan** centang "Firebase Hosting"
- Klik Register

Salin nilai berikut (akan dipakai di Fase 3):
```
apiKey:           AIzaSy...
authDomain:       eduspin-prod.firebaseapp.com
projectId:        eduspin-prod
storageBucket:    eduspin-prod.firebasestorage.app
messagingSenderId: 123456789012
appId:            1:1234:web:abcd...
```

### 2.5 Deploy Firestore Rules

```bash
# Install firebase CLI sekali saja
npm install -g firebase-tools
firebase login

# Dari root repo
cd /path/to/eduspin
firebase use --add  # pilih eduspin-prod, alias "default"
firebase deploy --only firestore:rules
```

---

## FASE 3 — Setup Auto-Deploy via Cloud Build Trigger

### 3.1 Connect Repo GitHub ke Cloud Build

Buka <https://console.cloud.google.com/cloud-build/triggers>:

1. Pilih region: **asia-southeast2** (Jakarta) di dropdown atas
2. Klik **"Connect Repository"** (atau "Manage repositories")
3. Pilih source: **GitHub (Cloud Build GitHub App)**
4. OAuth ke akun GitHub `fafauwu`
5. Install aplikasi "Google Cloud Build" pada repo `fafauwu/eduspin`
6. Pilih repo `fafauwu/eduspin`
7. Skip "Create a trigger" di akhir wizard ini (kita buat manual di step 3.2)

### 3.2 Buat Trigger Auto-Deploy

Masih di Cloud Build → **Triggers** → klik **"+ Create Trigger"**:

| Field | Nilai |
|---|---|
| **Name** | `eduspin-main-deploy` |
| **Region** | `asia-southeast2` |
| **Event** | `Push to a branch` |
| **Source** | Pilih `fafauwu/eduspin` (yang baru di-connect) |
| **Branch** | `^main$` |
| **Configuration > Type** | `Cloud Build configuration file (yaml or json)` |
| **Location** | `Repository` |
| **Path** | `cloudbuild.yaml` |

**Substitution variables** (klik "+ ADD VARIABLE" untuk masing-masing):

| Variable | Value (dari Fase 2.4) |
|---|---|
| `_FB_API_KEY` | `AIzaSy...` |
| `_FB_AUTH_DOMAIN` | `eduspin-prod.firebaseapp.com` |
| `_FB_PROJECT_ID` | `eduspin-prod` |
| `_FB_BUCKET` | `eduspin-prod.firebasestorage.app` |
| `_FB_SENDER_ID` | `123456789012` |
| `_FB_APP_ID` | `1:1234:web:abcd...` |
| `_FB_ENABLED` | `true` |

> 💡 Substitution lain seperti `_REGION`, `_SERVICE`, `_REPO` sudah punya default di `cloudbuild.yaml`, tidak perlu diisi.

Klik **Create**.

---

## FASE 4 — First Deploy

Anda punya 2 opsi:

### Opsi A — Push Commit ke `main` (paling natural)

Saat ini branch `main` dan `feat/mvp-scaffold` di GitHub berisi commit yang sama. Cara tercepat untuk trigger build adalah commit kosong:

```bash
git checkout main
git commit --allow-empty -m "chore: trigger first deploy"
git push origin main
```

### Opsi B — Trigger Manual dari Console

Cloud Build → Triggers → klik **"RUN"** di sebelah `eduspin-main-deploy` → pilih branch `main` → Run.

### 4.1 Pantau Build

<https://console.cloud.google.com/cloud-build/builds?region=asia-southeast2>

Tahap-tahap (~3–5 menit):
1. ⏳ `build` — Docker build Next.js
2. ⏳ `push` — push image ke Artifact Registry
3. ⏳ `deploy` — deploy ke Cloud Run

### 4.2 Dapatkan URL Aplikasi

```bash
gcloud run services describe eduspin \
  --region=asia-southeast2 \
  --format="value(status.url)"
```

Output: `https://eduspin-xxxxxxxxxx-et.a.run.app`

🎉 **Buka di browser → aplikasi sudah live!**

### 4.3 Tambahkan URL ke Authorized Domains Firebase

Anonymous Auth perlu tahu domain yang diperbolehkan:

Firebase Console → **Authentication** → **Settings** → **Authorized domains** → **Add domain** → paste hostname Cloud Run (tanpa `https://`, contoh: `eduspin-xxxxxxxxxx-et.a.run.app`).

---

## FASE 5 — Workflow Selanjutnya (Auto-Deploy)

```bash
# Edit kode...
git add .
git commit -m "feat: tambah kategori quiz baru"
git push origin main
# ☕ Tunggu 3-5 menit, otomatis live di URL yang sama
```

Setiap push ke `main` → Cloud Build trigger → build → deploy. Tidak perlu manual lagi.

### Pakai Branch + PR (best practice)

```bash
git checkout -b feat/parent-dashboard
# kerja...
git push origin feat/parent-dashboard
# Buat PR di GitHub
# Review → merge ke main → auto deploy
```

> Anda bisa menambah trigger kedua untuk **preview deploys per PR** kalau mau (advanced).

---

## 🔧 Custom Domain (Opsional)

Kalau Anda punya domain (misal `eduspin.app`):

```bash
gcloud beta run domain-mappings create \
  --service=eduspin \
  --domain=eduspin.app \
  --region=asia-southeast2
```

Ikuti instruksi DNS yang diberikan. Tambahkan domain ke Firebase Authorized Domains.

---

## 💸 Monitoring Biaya

```bash
# Lihat tagihan terkini
gcloud billing accounts list
# Buka di console untuk detail
echo "https://console.cloud.google.com/billing"
```

**Set Budget Alert** (sangat direkomendasikan):
1. Buka <https://console.cloud.google.com/billing/budgets>
2. Create Budget
3. Amount: $5 (sesuai kredit Anda)
4. Alert pada 50%, 90%, 100%
5. Email Anda → notifikasi otomatis

---

## 🆘 Troubleshooting

### Build gagal: "Permission denied to deploy"
Re-run perintah grant IAM di Fase 1.5.

### Build gagal: "Repository asia-southeast2-docker.pkg.dev/.../eduspin not found"
Artifact Registry belum dibuat. Re-run Fase 1.4.

### App live tapi error "Firebase: Error (auth/unauthorized-domain)"
URL Cloud Run belum ditambahkan ke Authorized Domains. Lihat Fase 4.3.

### App live tapi data tidak ter-sync ke Firestore
Cek `_FB_ENABLED=true` di trigger substitution. Cek browser console.

### Build lambat / habis quota Cloud Build gratis
Cloud Build gratis: 120 menit/hari. EduSpin build ~5 menit → cukup untuk 24 build/hari. Lebih dari itu: $0,003/menit.

---

## 🔒 Hardening Sebelum Production Real

Untuk demo & MVP cukup setup di atas. Sebelum ratusan/ribuan user:

- [ ] Aktifkan **Firebase App Check** (cegah abuse Firestore dari bot)
- [ ] Aktifkan **reCAPTCHA Enterprise** untuk anonymous auth
- [ ] Setup **Cloud Armor** untuk rate limiting
- [ ] Setup **Cloud Logging** alerts
- [ ] Pindahkan logika gacha ke **Cloud Functions** (saat ada monetisasi)
- [ ] **Backup Firestore** scheduled
- [ ] **GDPR/COPPA**: tambah privacy policy URL ke aplikasi
