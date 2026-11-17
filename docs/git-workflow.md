# TixPulse Git Branching & CI/CD Deployment Workflow

Dokumen ini menjelaskan alur kerja Git (Branching Strategy) dan proses deployment bertahap (Local/Develop → Staging → Production) yang terintegrasi dengan Automated Quality Gate di GitHub Actions.

---

## 1. Struktur Branch

```mermaid
gitGraph
   commit id: "Init Project (v0.1.0)"
   branch develop
   checkout develop
   commit id: "Base Develop"
   branch feat/auth-login
   checkout feat/auth-login
   commit id: "feat: add user login"
   commit id: "test: add auth unit tests"
   checkout develop
   merge feat/auth-login id: "PR merged to develop (CI Passed)"
   branch staging
   checkout staging
   merge develop id: "Deploy to Staging (CI Passed)"
   checkout main
   merge staging id: "Deploy to Production (Release v1.0.0)"
```

| Branch | Lingkungan | Akses & Kebijakan | Fungsi |
|---|---|---|---|
| `feat/*` / `fix/*` | Local Developer | Developer | Tempat coding per fungsi atau user story |
| `develop` | Development | Tim Pengembang | Cabang integrasi seluruh fitur yang sedang aktif dikerjakan |
| `staging` | Staging Server | QA & Stakeholder | Lingkungan pre-production untuk verifikasi fungsi sebelum ke publik |
| `main` | Production Server | Terproteksi (Wajib Review) | Sumber kode stabil yang melayani pengguna nyata |

---

## 2. Automated Quality Gate di GitHub Actions

Setiap kali ada **Pull Request (PR)** menuju `develop`, `staging`, atau `main`, sistem GitHub Actions (`.github/workflows/ci.yml`) secara otomatis menjalankan 5 lapisan pengecekan ketat:

1. **Linting & Code Style Check:** Memastikan kode rapi dan tidak melanggar aturan coding standard.
2. **TypeScript Compilation Check (`tsc --noEmit`):** Memastikan tidak ada *type error* atau inkonsistensi tipe data.
3. **Security & Vulnerability Audit:** Memeriksa apakah ada celah keamanan (*vulnerabilities*) pada paket dependensi.
4. **Automated Testing (Unit & Integration):** Menyalakan service PostgreSQL & Redis di GitHub runner dan menjalankan seluruh test suite (`npm test`). Jika ada fungsi yang gagal/rusak, PR **ditolak**.
5. **Docker Build Verification:** Memastikan aplikasi dapat dibungkus menjadi Docker image tanpa error.

---

## 3. SOP Deployment Per User Story / Fungsi

### Langkah 1: Pengerjaan di Lokal
```bash
# Pastikan branch develop lokal terbaru
git checkout develop
git pull origin develop

# Buat branch fitur baru sesuai User Story
git checkout -b feat/user-story-nama-fitur

# Kerjakan fitur, lalu tes di lokal
npm run lint
npm test
npm run build
```

### Langkah 2: Push ke GitHub & Buka Pull Request ke `develop`
```bash
git add .
git commit -m "feat(module): deskripsi fungsi yang diselesaikan"
git push -u origin feat/user-story-nama-fitur
```
* Buka GitHub, buat **Pull Request** dari `feat/user-story-nama-fitur` ke `develop`.
* Tunggu checklist hijau dari GitHub Actions Quality Gate.
* Lakukan review kode dan klik **Merge Pull Request**.

### Langkah 3: Promosi ke `staging` (Deploy Staging)
Setelah fitur di `develop` lengkap untuk diuji di lingkungan staging:
1. Buat **Pull Request** dari `develop` ke `staging`.
2. GitHub Quality Gate akan memeriksa kembali apakah integrasi aman.
3. Saat di-merge ke `staging`, workflow `.github/workflows/deploy-staging.yml` otomatis aktif dan men-deploy ke server staging.
4. QA / Tester menguji alur di staging.

### Langkah 4: Promosi ke `main` (Deploy Production)
Setelah pengujian di staging disetujui:
1. Buat **Pull Request** dari `staging` ke `main`.
2. Lakukan *peer review* dan persetujuan rilis.
3. Saat di-merge ke `main`, workflow `.github/workflows/deploy-prod.yml` otomatis membangun image rilis dan men-deploy ke server production.
