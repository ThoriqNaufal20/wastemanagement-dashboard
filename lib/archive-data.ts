import type { ArchiveItem } from "@/lib/archive-types";

export const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: "laporan-meeting-q1-q3",
    title: "Laporan Evaluasi Meeting Q1 - Q3 2026 Waste Management",
    category: "meeting",
    categoryLabel: "Laporan Rapat",
    typeBadge: "PDF Document",
    badgeColorClass: "bg-blue-500/80 text-white",
    periodOrDuration: "Q1–Q3 2026",
    description:
      "Rekapitulasi pencapaian target reduksi limbah, status audit internal, dan tindak lanjut perbaikan seluruh factory.",
    gradientClass: "from-blue-900 via-blue-800 to-indigo-950",
    iconType: "pdf",
    fileMeta: "36 Halaman",
    externalUrl: "#", // Ganti dengan link Google Drive / PDF viewer asli
    actionLabel: "Buka Dokumen",
  },
  {
    id: "project-data-driven-waste",
    title: "Project Analisa Data Driven Tracking Waste & Efisiensi Material",
    category: "data",
    categoryLabel: "Data Driven Meeting",
    typeBadge: "Sheets & Dashboard",
    badgeColorClass: "bg-emerald-500/80 text-white",
    periodOrDuration: "Live Project",
    description:
      "Model integrasi otomatis spreadsheet untuk monitoring bobot timbangan limbah kulit, sarung tangan reject, dan tren kelolosan.",
    gradientClass: "from-emerald-900 via-teal-900 to-cyan-950",
    iconType: "sheets",
    fileMeta: "Spreadsheet & Analytics",
    externalUrl: "#", // Ganti dengan link Google Sheets / Dashboard project asli
    actionLabel: "Akses Project",
  },
  {
    id: "poster-awareness-3r-canva",
    title: "Poster Kampanye 3R: Pilah Sampah Sebelum Terlambat",
    category: "poster",
    categoryLabel: "Awareness & Poster",
    typeBadge: "Canva Template",
    badgeColorClass: "bg-purple-500/80 text-white",
    periodOrDuration: "Siap Cetak",
    description:
      "Materi edukasi visual pemilahan sampah organik, anorganik, dan limbah B3 untuk ditempel di area sewing, kantin, dan produksi.",
    gradientClass: "from-purple-900 via-pink-900 to-amber-900",
    iconType: "image",
    fileMeta: "Canva Template",
    externalUrl: "#", // Ganti dengan link Canva asli
    actionLabel: "Buka di Canva",
  },
  {
    id: "slides-roadmap-zero-waste",
    title: "Presentasi Kebijakan Zero Waste & Roadmap Keberlanjutan 2026",
    category: "slides",
    categoryLabel: "Presentasi Slides",
    typeBadge: "Google Slides",
    badgeColorClass: "bg-amber-500/80 text-white",
    periodOrDuration: "Slide Deck",
    description:
      "Materi presentasi eksekutif mengenai strategi efisiensi biaya pengelolaan limbah dan pencapaian target dekarbonisasi pabrik.",
    gradientClass: "from-amber-800 via-orange-900 to-yellow-950",
    iconType: "presentation",
    fileMeta: "24 Slides",
    externalUrl: "#", // Ganti dengan link Google Slides asli
    actionLabel: "Buka Slides",
  },
  {
    id: "video-tutorial-pemilahan-sewing",
    title: "Video Tutorial Pemilahan Limbah Kulit & Glove Reject di Area Sewing",
    category: "video",
    categoryLabel: "Video Dokumentasi",
    typeBadge: "Video YouTube / MP4",
    badgeColorClass: "bg-rose-600/80 text-white",
    periodOrDuration: "04:15 Menit",
    description:
      "Panduan video langkah demi langkah tata cara pemilahan potongan kulit asli dan penimbangan scrap kain sebelum diserahkan ke 3R.",
    gradientClass: "from-red-950 via-rose-900 to-purple-950",
    iconType: "video",
    fileMeta: "Full HD 1080p",
    externalUrl: "#", // Ganti dengan link YouTube / Google Drive Video asli
    actionLabel: "Tonton Video",
  },
  {
    id: "sop-audit-lingkungan",
    title: "SOP & Standar Kepatuhan Audit Lingkungan Pabrik 2026",
    category: "meeting",
    categoryLabel: "Pedoman Kepatuhan",
    typeBadge: "PDF Document",
    badgeColorClass: "bg-blue-600/80 text-white",
    periodOrDuration: "Revisi 2026",
    description:
      "Dokumen standar operasional prosedur terkait kepatuhan regulasi lingkungan, penyimpanan limbah B3, dan checklist audit internal.",
    gradientClass: "from-slate-900 via-sky-900 to-indigo-950",
    iconType: "pdf",
    fileMeta: "18 Halaman",
    externalUrl: "#", // Ganti dengan link PDF SOP asli
    actionLabel: "Unduh SOP",
  },
];

export const ARCHIVE_CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "meeting", label: "Laporan Rapat" },
  { id: "data", label: "Data Driven" },
  { id: "poster", label: "Poster & Canva" },
  { id: "slides", label: "Google Slides" },
  { id: "video", label: "Video Edukasi" },
] as const;

