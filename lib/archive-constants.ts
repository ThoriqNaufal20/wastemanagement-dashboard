import type { ArchiveItem } from "./archive-types";

export const DEFAULT_ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: "sop-audit-lingkungan",
    title: "SOP & Standar Kepatuhan Audit Lingkungan Pabrik 2026",
    category: "meeting",
    categoryLabel: "Pedoman Kepatuhan",
    typeBadge: "PDF Document",
    badgeColorClass: "bg-blue-600/80 text-white",
    periodOrDuration: "Revisi 2026",
    date: "1 Oct 2026",
    timestamp: Date.UTC(2026, 9, 1),
    description:
      "Dokumen standar operasional prosedur terkait kepatuhan regulasi lingkungan, penyimpanan limbah B3, dan checklist audit internal.",
    gradientClass: "from-slate-900 via-sky-900 to-indigo-950",
    iconType: "pdf",
    fileMeta: "18 Halaman",
    externalUrl: "#",
    actionLabel: "Unduh SOP",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "laporan-meeting-q1-q3",
    title: "Laporan Evaluasi Meeting Q1 - Q3 2026 Waste Management",
    category: "meeting",
    categoryLabel: "Laporan Rapat",
    typeBadge: "PDF Document",
    badgeColorClass: "bg-blue-500/80 text-white",
    periodOrDuration: "Q1–Q3 2026",
    date: "30 Sep 2026",
    timestamp: Date.UTC(2026, 8, 30),
    description:
      "Rekapitulasi pencapaian target reduksi limbah, status audit internal, dan tindak lanjut perbaikan seluruh factory.",
    gradientClass: "from-blue-900 via-blue-800 to-indigo-950",
    iconType: "pdf",
    fileMeta: "36 Halaman",
    externalUrl: "#",
    actionLabel: "Buka Dokumen",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "video-tutorial-pemilahan-sewing",
    title: "Video Tutorial Pemilahan Limbah Kulit & Glove Reject di Area Sewing",
    category: "video",
    categoryLabel: "Video Dokumentasi",
    typeBadge: "Video YouTube / MP4",
    badgeColorClass: "bg-rose-600/80 text-white",
    periodOrDuration: "04:15 Menit",
    date: "15 Aug 2026",
    timestamp: Date.UTC(2026, 7, 15),
    description:
      "Panduan video langkah demi langkah tata cara pemilahan potongan kulit asli dan penimbangan scrap kain sebelum diserahkan ke 3R.",
    gradientClass: "from-red-950 via-rose-900 to-purple-950",
    iconType: "video",
    fileMeta: "Full HD 1080p",
    externalUrl: "#",
    actionLabel: "Tonton Video",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "slides-roadmap-zero-waste",
    title: "Presentasi Kebijakan Zero Waste & Roadmap Keberlanjutan 2026",
    category: "slides",
    categoryLabel: "Presentasi Slides",
    typeBadge: "Google Slides",
    badgeColorClass: "bg-amber-500/80 text-white",
    periodOrDuration: "Slide Deck",
    date: "1 Jul 2026",
    timestamp: Date.UTC(2026, 6, 1),
    description:
      "Materi presentasi eksekutif mengenai strategi efisiensi biaya pengelolaan limbah dan pencapaian target dekarbonisasi pabrik.",
    gradientClass: "from-amber-800 via-orange-900 to-yellow-950",
    iconType: "presentation",
    fileMeta: "24 Slides",
    externalUrl: "#",
    actionLabel: "Buka Slides",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "project-data-driven-waste",
    title: "Project Analisa Data Driven Tracking Waste & Efisiensi Material",
    category: "data",
    categoryLabel: "Data Driven Meeting",
    typeBadge: "Sheets & Dashboard",
    badgeColorClass: "bg-emerald-500/80 text-white",
    periodOrDuration: "Live Project",
    date: "15 Jun 2026",
    timestamp: Date.UTC(2026, 5, 15),
    description:
      "Model integrasi otomatis spreadsheet untuk monitoring bobot timbangan limbah kulit, sarung tangan reject, dan tren kelolosan.",
    gradientClass: "from-emerald-900 via-teal-900 to-cyan-950",
    iconType: "sheets",
    fileMeta: "Spreadsheet & Analytics",
    externalUrl: "#",
    actionLabel: "Akses Project",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "poster-awareness-3r-canva",
    title: "Poster Kampanye 3R: Pilah Sampah Sebelum Terlambat",
    category: "poster",
    categoryLabel: "Awareness & Poster",
    typeBadge: "Canva Template",
    badgeColorClass: "bg-purple-500/80 text-white",
    periodOrDuration: "Siap Cetak",
    date: "1 May 2026",
    timestamp: Date.UTC(2026, 4, 1),
    description:
      "Materi edukasi visual pemilahan sampah organik, anorganik, dan limbah B3 untuk ditempel di area sewing, kantin, dan produksi.",
    gradientClass: "from-purple-900 via-pink-900 to-amber-900",
    iconType: "image",
    fileMeta: "Canva Template",
    externalUrl: "#",
    actionLabel: "Buka di Canva",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80",
  },
];

export const ARCHIVE_CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "meeting", label: "Laporan Rapat" },
  { id: "data", label: "Data" },
  { id: "poster", label: "Poster" },
  { id: "slides", label: "Google Slides" },
  { id: "video", label: "Video Edukasi" },
] as const;

