# 🌿 Waste Management Dashboard & Profile
**PT. Adira Semesta Industry**

Aplikasi profil departemen dan dashboard operasional terintegrasi Waste Management berbasis Next.js App Router, Tailwind CSS v4, dan Google Sheets Realtime API.

---

## 📖 Dokumentasi Lengkap
Untuk panduan mendetail mengenai arsitektur, seluruh file proyek, logika bisnis tiap modul, cara mengganti icon website, menambah foto carousel, serta konfigurasi Google Sheets, silakan baca:
👉 [**PROJECT_DOCUMENTATION.md**](./PROJECT_DOCUMENTATION.md)

---

## 🚀 Memulai (Quick Start)

### 1. Prasyarat
- Node.js versi 20+
- npm versi 10+

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (`.env.local`)
Salin file `.env.example` atau buat file `.env.local` di root direktori:
```env
GOOGLE_SHEETS_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
NEXT_PUBLIC_INTERNAL_AUDIT_URL="https://your-internal-audit-system.com"
```

### 4. Menjalankan Server Development
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Ringkasan Teknologi
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons, tw-animate-css
- **Visualisasi**: Recharts (Bar Charts, Line Charts, Tooltips)
- **Data Live**: Google Sheets API (`googleapis`) via Service Account JWT & Named Ranges
- **Tema**: Light & Dark mode support (`next-themes`)

---

## 📂 Struktur Rute Halaman
- `/` : Landing Page Profil Departemen (Full Page Scroll, Hero, About, KPI, Tim, Arsip, Kontak)
- `/dashboard` : Main Operational Dashboard (Realtime Quarter Badge, Problem Items, Charts, Tables)
- `/internal-audit` : Detail Temuan Internal Audit (OTS status, per-factory breakdown)
- `/audit-supportive-dept` : Detail Internal Audit Support Team (Progress per dept: Late / In-Progress)
- `/progress-shipment` : Detail Progress Shipment (Hutang Prod, Pack/Carton, Total Beban, Friday Attention)
- `/wip-sewing` : Detail WIP Sewing (Tabel per Box & Tabel Grouping Fact/SPO/Style/Size)
- `/three-r` : Detail Penimbangan 3R & Permintaan Sarung Tangan
- `/scorecard` : Skor Evaluasi Antar Departemen
- `/dashboard-departement` : Rating & Indikator Performa Departemen
- `/corrective-action-plan` : Corrective Action Plan (CAP)
- `/kelolosan-sampah-kulit` : Tren Kelolosan Sampah Kulit per Bulan

---
*Silakan buka [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) untuk panduan teknis lengkap.*
