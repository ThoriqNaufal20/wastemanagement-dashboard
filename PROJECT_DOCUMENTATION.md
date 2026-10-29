# 📘 Dokumentasi Lengkap Proyek WM Dashboard & Landing Page
**PT. Adira Semesta Industry — Waste Management Department**

Dokumentasi ini mencakup arsitektur teknis, struktur file, framework, logika bisnis, integrasi data Google Sheets, serta panduan praktis (seperti mengganti icon, menambah foto carousel, mengubah link, dll.) untuk pemeliharaan dan pengembangan aplikasi.

---

## 📑 Daftar Isi
1. [Ringkasan Proyek & Arsitektur](#1-ringkasan-proyek--arsitektur)
2. [Teknologi & Framework yang Digunakan](#2-teknologi--framework-yang-digunakan)
3. [Struktur Folder & Rincian File](#3-struktur-folder--rincian-file)
4. [Sistem Integrasi Data Google Sheets](#4-sistem-integrasi-data-google-sheets)
5. [Logika Bisnis & Fitur Tiap Modul](#5-logika-bisnis--fitur-tiap-modul)
6. [Panduan Kustomisasi Praktis (How-To)](#6-panduan-kustomisasi-praktis-how-to)
   - [A. Mengganti Favicon & Icon Website](#a-mengganti-favicon--icon-website)
   - [B. Mengganti Logo Perusahaan](#b-mengganti-logo-perusahaan)
   - [C. Menambah / Mengganti Foto di Carousel Momen Tim](#c-menambah--mengganti-foto-di-carousel-momen-tim)
   - [D. Mengganti Foto Profil / Avatar Struktur Tim](#d-mengganti-foto-profil--avatar-struktur-tim)
   - [E. Menambah / Mengubah Data Arsip & Publikasi](#e-menambah--mengubah-data-arsip--publikasi)
   - [F. Mengubah Link Aplikasi Eksternal di Menu Apps Navbar](#f-mengubah-link-aplikasi-eksternal-di-menu-apps-navbar)
   - [G. Mengatur Dark Mode / Light Mode](#g-mengatur-dark-mode--light-mode)
7. [Panduan Instalasi & Deployment](#7-panduan-instalasi--deployment)

---

## 1. Ringkasan Proyek & Arsitektur

Aplikasi **WM Dashboard** memiliki dua pilar utama:
1. **Landing Page Profil Departemen (`/`)**:
   - Memperkenalkan visi, misi, proses kerja (*What We Do*), metrik ringkasan (KPI), struktur tim organisasi, galeri momen kerja interaktif, arsip materi, serta kontak.
   - Menggunakan sistem **Full Page Snap Scroll** yang mulus di desktop dengan bilah navigasi dinamis (*Landing Navbar*) yang menyertakan dropdown integrasi menu **Apps**.
2. **Main Operational Dashboard (`/dashboard`) & Halaman Detail**:
   - Menampilkan status operasional departemen Waste Management secara realtime:
     - Jam live & deteksi otomatis kuartal kalender realtime (*Current Quarter Badge*).
     - Indikator scorecard & dashboard departemen.
     - Ringkasan angka penting (*Severity-weighted problem items*).
     - Grafik tren & distribusi (*Progress Shipment*, *WIP Sewing*, *Kelolosan Sampah Kulit*, *Corrective Action Plan / CAP*).
     - Tabel temuan *Internal Audit* dan rangkuman *Internal Audit Support Team* dengan tinggi visual yang seimbang (*equal visual height*).
     - Halaman detail komprehensif untuk setiap modul dengan filter interaktif, pencarian, dan tabel agregasi.

---

## 2. Teknologi & Framework yang Digunakan

| Kategori | Teknologi | Deskripsi & Versi |
|---|---|---|
| **Core Framework** | **Next.js 16 (App Router)** | Framework React dengan Server Components, Client Components, dan Server Actions/API Routes (`v16.2.12`). |
| **Library UI** | **React 19** | Versi React terbaru (`v19.2.4`) untuk rendering UI modern. |
| **Bahasa Pemrograman** | **TypeScript 5** | Static typing ketat untuk keandalan data dan pencegahan bug runtime. |
| **Styling & Desain** | **Tailwind CSS v4** | Framework utilitas CSS generasi baru `@tailwindcss/postcss` & `tailwindcss v4`. |
| **Animasi** | **CSS Marquee & Keyframes** | Animasi marquee mulus untuk carousel foto (`tw-animate-css`). |
| **Ikon** | **Lucide React** | Koleksi ikon SVG modern, konsisten, dan ringan (`lucide-react v1.27.0`). |
| **Grafik & Visualisasi** | **Recharts** | Library chart berbasis SVG (`recharts v3.10.1`) untuk Bar Chart, Line Chart, dan Tooltip kustom. |
| **Integrasi Data** | **Google APIs (`googleapis`)** | Otentikasi Service Account JWT untuk membaca data spreadsheet realtime melalui Named Range (`v173.0.0`). |
| **Tema (Dark/Light)** | **next-themes** | Pengelolaan tema gelap/terang tanpa flicker saat SSR (`next-themes v0.4.6`). |
| **Tipografi** | **Public Sans** | Font Google Font modern berbobot bersih yang dimuat via `next/font/google`. |

---

## 3. Struktur Folder & Rincian File

```
wm-dashboard/
├── app/                              # Next.js App Router (Halaman & Rute API)
│   ├── layout.tsx                    # Root layout (Metadata, Font, ThemeProvider, FloatingNav)
│   ├── page.tsx                      # Landing Page (FullPageScroll container)
│   ├── globals.css                   # Global styling Tailwind v4, tema CSS variable, animasi marquee
│   ├── favicon.ico                   # Icon tab browser
│   ├── dashboard/                    # Halaman Utama Dashboard (/dashboard)
│   ├── internal-audit/               # Halaman Detail Internal Audit (/internal-audit)
│   ├── audit-supportive-dept/        # Halaman Detail Internal Audit Support Team (/audit-supportive-dept)
│   ├── progress-shipment/            # Halaman Detail Progress Shipment (/progress-shipment)
│   ├── wip-sewing/                   # Halaman Detail WIP Sewing (/wip-sewing)
│   ├── three-r/                      # Halaman Detail 3R (/three-r)
│   ├── scorecard/                    # Halaman Detail Scorecard Departemen (/scorecard)
│   ├── dashboard-departement/        # Halaman Detail Dashboard Departemen (/dashboard-departement)
│   ├── corrective-action-plan/       # Halaman Detail CAP (/corrective-action-plan atau /cap)
│   ├── kelolosan-sampah-kulit/       # Halaman Detail Kelolosan Sampah Kulit
│   ├── login/                        # Halaman Login
│   └── api/                          # Endpoint REST API Internal
│       ├── archive-data/route.ts     # API arsip publikasi
│       ├── cap-data/route.ts         # API data CAP
│       ├── dashboard-data/route.ts   # API gabungan dashboard
│       ├── dashboard-dept-data/      # API dashboard departemen
│       ├── progress-shipment-data/   # API progress shipment
│       ├── scorecard-data/           # API scorecard
│       ├── sheets-status/            # Health check koneksi Google Sheets
│       ├── three-r-data/             # API data 3R
│       └── wip-sewing-data/          # API data WIP sewing
│
├── components/                       # Komponen UI React
│   ├── audit-support/                # Komponen halaman Audit Supportive Dept
│   │   └── audit-support-view.tsx    # Kartu breakdown pabrik, kartu late/progress per dept, tabel temuan
│   ├── internal-audit/               # Komponen halaman Internal Audit
│   │   └── internal-audit-view.tsx   # KPI cards, filter pabrik, status temuan, tabel temuan
│   ├── dashboard/                    # Komponen Dashboard Utama
│   │   ├── dashboard-header.tsx      # Header dashboard (Logo, live clock, kuartal realtime)
│   │   ├── current-quarter-badge.tsx # Komponen pendeteksi kuartal berjalan realtime
│   │   ├── live-clock.tsx            # Komponen jam & tanggal realtime
│   │   ├── metric-card.tsx           # Kartu indikator angka ringkasan
│   │   ├── status-chip.tsx           # Badge status (critical, late, overdue, attention, on_progress)
│   │   ├── progress-shipment-card.tsx# Kartu chart progress shipment di dashboard utama
│   │   ├── wip-sewing-card.tsx       # Kartu chart WIP sewing
│   │   ├── kelolosan-chart-card.tsx  # Kartu chart kelolosan sampah kulit
│   │   ├── corrective-action-plan-card.tsx # Kartu chart CAP
│   │   ├── internal-audit-table.tsx  # Tabel ringkasan Internal Audit
│   │   ├── internal-audit-support-table.tsx # Tabel ringkasan Support Team
│   │   ├── floating-nav.tsx          # Navigasi melayang cepat antar-halaman
│   │   ├── floating-theme-toggle.tsx # Tombol toggle Dark/Light mode melayang
│   │   ├── logo.tsx                  # Komponen logo terpusat (/public/LOGO ADIRA.png)
│   │   ├── scroll-reveal.tsx         # Animasi kemunculan elemen saat scroll
│   │   └── *-detail-client.tsx       # Komponen client untuk halaman detail masing-masing modul
│   ├── landing/                      # Komponen Landing Page Profil
│   │   ├── full-page-scroll.tsx      # Sistem navigasi slide per-section layar penuh
│   │   ├── landing-navbar.tsx        # Navbar atas dengan dropdown menu 'Apps' terintegrasi
│   │   ├── landing-hero.tsx          # Section 1: Hero banner & pengantar
│   │   ├── about-what-we-do.tsx      # Section 2: Tentang kami & pilar aktivitas
│   │   ├── kpi-section.tsx           # Section 3: Ringkasan KPI departemen
│   │   ├── dashboard-preview.tsx     # Section 4: Pratinjau visual dashboard
│   │   ├── team-carousel.tsx         # Section 5: Struktur tim organisasi & Carousel Momen Foto
│   │   └── archive-section.tsx       # Section 6: Arsip dokumen, presentasi, & poster
│   └── ui/                           # Komponen Primitif UI (Shadcn-style)
│       ├── badge.tsx, button.tsx, card.tsx, table.tsx, tooltip.tsx, switch.tsx, dropdown-menu.tsx
│
├── lib/                              # Logika Bisnis, Fetching, Parser, & Tipe Data
│   ├── google-sheets.ts              # Driver otentikasi Google Sheets API & pemanggilan Named Range
│   ├── urgency.ts                    # Logika perhitungan status urgensi (kritis, late, attention, dll.)
│   ├── mock-data.ts                  # Data fallback jika Google Sheets tidak terjangkau
│   ├── utils.ts                      # Helper fungsi (clsx, twMerge)
│   ├── internal-audit-data.ts        # Data service & parser Internal Audit
│   ├── internal-audit-types.ts       # Interface tipe data Internal Audit
│   ├── internal-audit-utils.ts       # Helper validasi tanggal & status audit
│   ├── internal-audit-support-data.ts# Data service Internal Audit Support Team (late vs in-progress)
│   ├── internal-audit-support-types.ts# Interface tipe data Support Team
│   ├── progress-shipment-data.ts     # Data service Progress Shipment (Hutang Prod, Pack/Carton, Beban)
│   ├── progress-shipment-types.ts    # Interface tipe data Progress Shipment
│   ├── wip-sewing-data.ts            # Data service WIP Sewing (per box & per fact-spo grouping)
│   ├── wip-sewing-types.ts           # Interface tipe data WIP Sewing
│   ├── archive-data.ts               # Data service Arsip & Publikasi
│   ├── archive-constants.ts          # Data arsip default jika Google Sheets kosong
│   ├── archive-types.ts              # Interface tipe data Arsip
│   ├── cap-data.ts & cap-types.ts    # Data service & tipe data CAP
│   ├── scorecard-data.ts & types.ts  # Data service & tipe data Scorecard
│   ├── dashboard-dept-data.ts        # Data service Dashboard Departemen
│   └── timbangan-3r-*.ts & glove-3r* # Data service penimbangan 3R & sarung tangan
│
├── public/                           # File Aset Statis Publik (Dapat Diakses Langsung via URL Browser)
│   ├── favicon.ico                   # Favicon website
│   ├── LOGO ADIRA.png                # Logo resmi PT. Adira Semesta Industry
│   ├── team/                         # Direktori Foto Carousel & Avatar Profil Tim
│   │   ├── 1.jpeg, 2.jpeg, 3.jpeg    # Foto momen kegiatan tim
│   └── ...                           # File SVG bawaan
│
├── .env.local                        # File Kredensial Lingkungan Lokal (JANGAN di-commit ke Git Publik)
├── next.config.ts                    # Konfigurasi Next.js
├── package.json                      # Daftar dependencies dan scripts npm
├── postcss.config.mjs                # Konfigurasi PostCSS Tailwind
└── tsconfig.json                     # Konfigurasi TypeScript
```

---

## 4. Sistem Integrasi Data Google Sheets

Data operasional diambil secara realtime dari Google Sheets menggunakan kredensial **Google Service Account**. Setiap modul terhubung ke sheet melalui **Named Range** yang telah ditentukan.

### A. Environment Variables (`.env.local`)
```env
# Email service account Google Cloud Console
GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"

# Private key dari file JSON service account (bisa dengan tanda kutip atau tanpa tanda kutip)
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# ID Spreadsheet Google Sheets (terdapat pada URL sheet antara /d/ dan /edit)
GOOGLE_SHEETS_SPREADSHEET_ID="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"

# Link URL aplikasi eksternal Internal Audit (untuk menu dropdown Apps di Landing Page)
NEXT_PUBLIC_INTERNAL_AUDIT_URL="https://your-internal-audit-system.com"
```

### B. Daftar Named Range & Modul Terkait
| Modul | Nama Named Range | Kolom Utama yang Dibaca |
|---|---|---|
| **Internal Audit Main** | `WEBInternalAuditMain` | Factory, Period, OTS Finding, AVG Score, Area Belum Audit, Start Date, End Date |
| **OTS Internal Audit Area** | `WEBOTSInternalAudit` | Period, Factory, Area, OTS Finding, In Progress, No CAP, Hold, PIC |
| **OTS Internal Audit Detail** | `WEBOTSInternalAuditDetail` | Periode, Factory, Area, Section, No Poin, Poin Audit, Kategori, Status, Deskripsi Temuan, Tgl Dibuat, CAP (Tindakan Perbaikan), Target CAP, Tgl Selesai Aktual, Team Support, Link Foto Temuan, Link Foto Perbaikan |
| **Internal Audit Belum Audit** | `WEBInternalAuditBelumAudit` | Factory, Period, Area, Section, Poin Audit, Jawaban PIC |
| **Audit Support Team** | `WEBInternalAuditSupportTeam` | PERIOD, FACT., AREA, STATUS, FINDING, IMAGE, SUPPORTIVE DEPARTMENT, CAP, TARGET FIN, ACTUAL FIN |
| **Progress Shipment** | `WEBProgressShipment` | W, Inv#, Buyer, Qty Shipment, Qty Carton, Hutang Prod, Hutang Carton, Hutang Envelope, Filter Week |
| **WIP Sewing** | `WEBWipSewing` | FACT, LINE, SPO, STYLE, SIZE, QTY (PCS), SCAN DST, OVERDUE |
| **3R Glove Active** | `WEBGlove3R` | Permintaan sarung tangan, status pengerjaan, telat/pending |
| **3R Timbangan** | `WEBTimbangan3R` | Penimbangan limbah Pola, Logo, Glove |
| **3R Kulit** | `WEBTimbangan3RKulit` | Penimbangan limbah kulit (Berat Kiriman KG) |
| **CAP** | `WEBCap` | Corrective Action Plan, status open/closed, departemen terkait |
| **Kelolosan Kulit** | `WEBKelolosan` | Data tren kelolosan sampah kulit per bulan |
| **Scorecard Dept** | `WEBScorecard` | Skor evaluasi per departemen |
| **Dashboard Dept** | `WEBDashboardDept` | Indikator performa departemen |
| **Arsip & Publikasi** | `WEBArchive` | Judul arsip, kategori, link, tipe badge, thumbnail |

> **Fallback Handshake Otomatis**: Jika Google Sheets API tidak dapat diakses atau kredensial belum diisi, seluruh modul memiliki data *fallback* lokal di `lib/` sehingga tampilan aplikasi tidak pernah crash (*zero-downtime display*).

---

## 5. Logika Bisnis & Fitur Tiap Modul

### 1. Internal Audit & Support Team
- **Internal Audit Utama**:
  - Kolom **OTS Finding**: Jika nilai `> 0`, otomatis teks berwarna **merah tebal**.
  - **Status Per Pabrik**:
    - `Done`: Jika sudah tidak ada area yang belum diaudit (`areaBelumAudit === 0`).
    - `On Progress`: Masih ada area yang belum diaudit dan tanggal hari ini belum melewati `End Date`.
    - `Late`: Masih ada area yang belum diaudit dan tanggal hari ini telah melewati `End Date`.
- **Internal Audit Support Team**:
  - Menampilkan rangkuman pabrik dan kartu progress per departemen pendukung (*Maintenance Facility, MT, Quality, HSE Compliance, HR, IT*).
  - Status **OTS (Outstanding)**: Data dengan status selain `Done` dan `Shared with team`.
  - Status **Late**: Temuan OTS yang tanggal `TARGET FIN`-nya telah melewati tanggal hari ini.
  - Kartu per departemen menampilkan rasio **`Late / In Progress`**: jika `Late > 0`, angka otomatis berwarna merah tebal dengan chip `LATE`.
  - Kartu dapat diklik untuk memfilter tabel temuan secara otomatis.

### 2. Progress Shipment
- **Hutang Prod**: Barang yang masih dalam proses pengerjaan produksi.
- **Hutang Pack**: Diambil dari data kolom *Hutang Carton* pada spreadsheet.
- **Total Beban Shipment**: Dihitung dari penjumlahan **`Hutang Prod + Hutang Pack`**.
- Pada hari Jumat, jika terdapat total hutang `> 0`, sistem memunculkan indikator status **`Attention`** (oranye) sebagai pengingat batas waktu pengiriman akhir pekan.

### 3. WIP Sewing
- **Dua Model Tampilan Tabel**:
  1. *Tabel Detail per Box/Item*: Menampilkan data mentah baris per baris.
  2. *Tabel Grouped (Rangkuman)*: Mengelompokkan data berdasarkan kombinasi `Fact`, `SPO`, `Style`, `Size` dengan menjumlahkan `Qty (pcs)` dan mendeteksi status `Overdue`.
- Membantu tim mengetahui total pcs WIP yang menumpuk tanpa harus menghitung manual satu per satu.

### 4. Kuartal Realtime & Live Clock
- Komponen [`CurrentQuarterBadge`](file:///c:/Users/ITAdmin/Documents/Project/wm-dashboard/components/dashboard/current-quarter-badge.tsx) membaca tanggal kalender realtime:
  - Bulan 1-3 = Kuartal 1
  - Bulan 4-6 = Kuartal 2
  - Bulan 7-9 = Kuartal 3
  - Bulan 10-12 = Kuartal 4
- Kartu Scorecard Dept & Dashboard Dept dilengkapi label keterangan *"Penilaian ini adalah kuartal 2"* sesuai jadwal audit berkala.

---

## 6. Panduan Kustomisasi Praktis (How-To)

### A. Mengganti Favicon & Icon Website

1. **Format File**: Siapkan gambar logo persegi berukuran `32x32px` atau `64x64px` (format `.ico` atau `.png`).
2. **Cara 1 (Otomatis Next.js)**:
   - Ganti file yang ada di:
     📁 `app/favicon.ico`
   - Atau letakkan icon baru di `app/icon.png` (Next.js App Router otomatis mengenali file ini sebagai favicon browser).
3. **Cara 2 (Kustom via Metadata)**:
   - Buka file [`app/layout.tsx`](file:///c:/Users/ITAdmin/Documents/Project/wm-dashboard/app/layout.tsx).
   - Perbarui objek `metadata`:
     ```tsx
     export const metadata: Metadata = {
       title: "Waste Management - PT. Adira Semesta Industry",
       description: "Department Profile & Operational Dashboard",
       icons: {
         icon: "/favicon.ico",
         apple: "/apple-touch-icon.png",
       },
     };
     ```

---

### B. Mengganti Logo Perusahaan

1. Siapkan file logo perusahaan berlatar belakang transparan (format `.png` atau `.svg`).
2. Beri nama file: **`LOGO ADIRA.png`**.
3. Letakkan di dalam folder:
   📁 **`public/LOGO ADIRA.png`**
4. Seluruh komponen (Navbar Landing Page, Header Dashboard, dan Halaman Login) secara terpusat mengambil logo dari komponen [`components/dashboard/logo.tsx`](file:///c:/Users/ITAdmin/Documents/Project/wm-dashboard/components/dashboard/logo.tsx) sehingga logo akan otomatis berganti serentak.

---

### C. Menambah / Mengganti Foto di Carousel Momen Tim

Carousel foto di landing page telah dilengkapi fitur **auto-scroll (marquee)**, **pause on hover**, dan **fullscreen lightbox preview** saat foto diklik.

1. **Simpan File Foto**:
   - Taruh foto berorientasi *landscape* ke dalam folder:
     📁 **`public/team/`**
   - Contoh nama file: `1.jpeg`, `2.jpeg`, `3.jpeg`, `kegiatan-lapangan.jpg`.
2. **Daftarkan di Kode**:
   - Buka file [**`components/landing/team-carousel.tsx`**](file:///c:/Users/ITAdmin/Documents/Project/wm-dashboard/components/landing/team-carousel.tsx#L32-L40).
   - Edit array `TEAM_PHOTOS`:
     ```tsx
     export const TEAM_PHOTOS: TeamPhoto[] = [
       { src: "/team/1.jpeg", alt: "Yearly Photo Waste Management" },
       { src: "/team/2.jpeg", alt: "Aktivitas Sortir Limbah 3R" },
       { src: "/team/3.jpeg", alt: "Briefing Tim Waste Management" },
       { src: "/team/kegiatan-lapangan.jpg", alt: "Inspeksi Lapangan" },
     ];
     ```
3. **Mengatur Ukuran Foto di Carousel**:
   - Jika ingin mengubah ukuran kotak foto, cukup edit kelas Tailwind pada container foto di baris ~160:
     ```tsx
     // Saat ini diatur seimbang pada h-28 w-44 sm:h-32 sm:w-52 2xl:h-44 2xl:w-64
     className="group/photo relative flex h-28 w-44 sm:h-32 sm:w-52 2xl:h-44 2xl:w-64 ..."
     ```

---

### D. Mengganti Foto Profil / Avatar Struktur Tim

Pada diagram struktur pohon organisasi di atas carousel, Anda dapat menambahkan foto wajah asli setiap anggota:

1. Simpan foto profil (persegi) ke `public/team/` (misal: `public/team/caren.jpg`, `public/team/inas.jpg`).
2. Buka [**`components/landing/team-carousel.tsx`**](file:///c:/Users/ITAdmin/Documents/Project/wm-dashboard/components/landing/team-carousel.tsx#L10-L20).
3. Tambahkan properti `avatar`:
   ```tsx
   const TEAM: { head: TeamMember; members: TeamMember[] } = {
     head: { 
       name: "Caren Ryana Kosasih", 
       role: "Manager Waste Management",
       avatar: "/team/caren.jpg", // <-- Foto Manager
     },
     members: [
       { 
         name: "Inas Arfieny Halimatus Nadiyah", 
         role: "Staff Waste Management",
         avatar: "/team/inas.jpg", // <-- Foto Staff
       },
       { name: "Joseph Johanes Aditya", role: "Staff 3R" },
       { name: "Dicky Abrian Setiyanto", role: "Staff Data Analyst" },
       { name: "Muhammad Thoriq Naufal", role: "Staff Data Analyst" },
     ],
   };
   ```
   *(Bila `avatar` tidak diisi, otomatis menampilkan ikon avatar standar).*

---

### E. Menambah / Mengubah Data Arsip & Publikasi

Section **Arsip & Publikasi** di Landing Page menampilkan kartu dokumen, panduan, poster, dan video.

1. **Buka File**: [`lib/archive-constants.ts`](file:///c:/Users/ITAdmin/Documents/Project/wm-dashboard/lib/archive-constants.ts).
2. Tambahkan objek baru ke dalam array `DEFAULT_ARCHIVE_ITEMS`:
   ```tsx
   {
     id: "sop-pengelolaan-limbah-2026",
     title: "SOP Pengelolaan Limbah Padat & 3R 2026",
     category: "meeting", // Pilihan: "all" | "meeting" | "slides" | "data" | "poster" | "video"
     categoryLabel: "Standar Operasional",
     typeBadge: "PDF Guide",
     iconType: "pdf", // Pilihan: "pdf" | "sheets" | "presentation" | "video" | "image"
     description: "Dokumen panduan tata kelola pemilahan dan penimbangan limbah padat di seluruh factory.",
     url: "https://drive.google.com/your-document-link", // Link file Google Drive / Canva
     periodOrDuration: "Jan 2026",
     starred: true,
   }
   ```
3. Jika sheet `WEBArchive` aktif di Google Sheets, sistem akan otomatis mengutamakan data live dari sheet tersebut.

---

### F. Mengubah Link Aplikasi Eksternal di Menu Apps Navbar

Menu navigasi landing page memiliki dropdown tombol **Apps** sederhana:
- **Dashboard**: Mengarah ke rute internal `/dashboard`.
- **Internal Audit**: Mengarah ke tautan aplikasi audit eksternal dan membuka di tab baru (`target="_blank"`).

**Cara Mengubah URL Target Internal Audit**:
- **Opsi 1 (Direkomendasikan via `.env.local`)**:
  ```env
  NEXT_PUBLIC_INTERNAL_AUDIT_URL="https://link-aplikasi-internal-audit-anda.com"
  ```
- **Opsi 2 (Langsung di Kode)**:
  Buka file [**`components/landing/landing-navbar.tsx`**](file:///c:/Users/ITAdmin/Documents/Project/wm-dashboard/components/landing/landing-navbar.tsx#L16-L17) dan ubah nilai default:
  ```tsx
  export const INTERNAL_AUDIT_APP_URL =
    process.env.NEXT_PUBLIC_INTERNAL_AUDIT_URL || "https://link-anda.com";
  ```

---

### G. Mengatur Dark Mode / Light Mode

Aplikasi mendukung tema **Light** dan **Dark** dengan transisi warna halus.
- Dikelola oleh provider [`components/theme-provider.tsx`](file:///c:/Users/ITAdmin/Documents/Project/wm-dashboard/components/theme-provider.tsx).
- Terdapat tombol toggle melayang di pojok kanan bawah ([`components/dashboard/floating-theme-toggle.tsx`](file:///c:/Users/ITAdmin/Documents/Project/wm-dashboard/components/dashboard/floating-theme-toggle.tsx)).
- Variabel warna tema tersimpan rapi di [`app/globals.css`](file:///c:/Users/ITAdmin/Documents/Project/wm-dashboard/app/globals.css) pada blok `:root` dan `.dark`.

---

## 7. Panduan Instalasi & Deployment

### Prasyarat
- **Node.js**: Versi 20.x atau lebih baru.
- **npm**: Versi 10.x atau lebih baru.

### Langkah Menjalankan di Lokal (Development)
```bash
# 1. Masuk ke direktori proyek
cd c:\Users\ITAdmin\Documents\Project\wm-dashboard

# 2. Pasang dependencies
npm install

# 3. Jalankan server development lokal
npm run dev
```
Buka browser di: `http://localhost:3000`

### Menjalankan Uji Tipe (Type-Check)
```bash
npx tsc --noEmit
```

### Build untuk Produksi
```bash
npm run build
npm run start
```

### Panduan Deployment ke Vercel
1. Hubungkan repositori Git proyek ke akun Vercel.
2. Tambahkan **Environment Variables** di dashboard Vercel (`Settings > Environment Variables`):
   - `GOOGLE_SHEETS_CLIENT_EMAIL`
   - `GOOGLE_SHEETS_PRIVATE_KEY`
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
   - `NEXT_PUBLIC_INTERNAL_AUDIT_URL`
3. Klik **Deploy**. Vercel akan otomatis mengompilasi dan mengaktifkan URL live.

---
*Dokumentasi ini dibuat untuk mempermudah serah terima, pemeliharaan jangka panjang, dan kelancaran operasional tim Waste Management PT. Adira Semesta Industry.*

