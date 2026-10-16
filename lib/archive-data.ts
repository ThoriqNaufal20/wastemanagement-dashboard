import { getNamedRangeDataWithLinks } from "@/lib/google-sheets";
import type {
  ArchiveItem,
  ArchiveCategory,
  ArchiveItemCategory,
} from "@/lib/archive-types";

import {
  DEFAULT_ARCHIVE_ITEMS,
  ARCHIVE_CATEGORIES,
} from "./archive-constants";

export { DEFAULT_ARCHIVE_ITEMS, ARCHIVE_CATEGORIES };

const MONTH_MAP: Record<string, number> = {
  jan: 0,
  januari: 0,
  january: 0,
  feb: 1,
  februari: 1,
  february: 1,
  mar: 2,
  maret: 2,
  march: 2,
  apr: 3,
  april: 3,
  mei: 4,
  may: 4,
  jun: 5,
  juni: 5,
  june: 5,
  jul: 6,
  juli: 6,
  july: 6,
  agu: 7,
  ags: 7,
  agust: 7,
  agustus: 7,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  okt: 9,
  oct: 9,
  oktober: 9,
  october: 9,
  nov: 10,
  nop: 10,
  nopember: 10,
  november: 10,
  des: 11,
  dec: 11,
  desember: 11,
  december: 11,
};

/**
 * Mengonversi string tanggal atau periode ke nilai timestamp numerik (milidetik)
 * untuk pengurutan kronologis (terbaru ke terlama).
 */
export function parseArchiveDateToTimestamp(
  rawDate?: string,
  period?: string
): number {
  if (rawDate) {
    const clean = rawDate.trim().toLowerCase();

    // 1. Format: "12 Oct 2026", "12-Oct-2026", "12 Oktober 2026"
    const dmyWordMatch = clean.match(
      /^(\d{1,2})[\s\-\/\.]+([a-z]+)[\s\-\/\.]+(\d{4})/
    );
    if (dmyWordMatch) {
      const day = parseInt(dmyWordMatch[1], 10);
      const mStr = dmyWordMatch[2];
      const year = parseInt(dmyWordMatch[3], 10);
      const month = MONTH_MAP[mStr] ?? MONTH_MAP[mStr.substring(0, 3)];
      if (month !== undefined) {
        return new Date(Date.UTC(year, month, day)).getTime();
      }
    }

    // 2. Format: "YYYY-MM-DD" atau "YYYY/MM/DD"
    const ymdMatch = clean.match(/^(\d{4})[\-\/\.](\d{1,2})[\-\/\.](\d{1,2})/);
    if (ymdMatch) {
      const year = parseInt(ymdMatch[1], 10);
      const month = parseInt(ymdMatch[2], 10) - 1;
      const day = parseInt(ymdMatch[3], 10);
      return new Date(Date.UTC(year, month, day)).getTime();
    }

    // 3. Format: "DD-MM-YYYY" atau "DD/MM/YYYY"
    const dmyNumMatch = clean.match(
      /^(\d{1,2})[\-\/\.](\d{1,2})[\-\/\.](\d{4})/
    );
    if (dmyNumMatch) {
      const day = parseInt(dmyNumMatch[1], 10);
      const month = parseInt(dmyNumMatch[2], 10) - 1;
      const year = parseInt(dmyNumMatch[3], 10);
      return new Date(Date.UTC(year, month, day)).getTime();
    }

    // 4. Format: "Oct 2026" atau "Oktober 2026"
    const myWordMatch = clean.match(/^([a-z]+)[\s\-\/\.]+(\d{4})/);
    if (myWordMatch) {
      const mStr = myWordMatch[1];
      const year = parseInt(myWordMatch[2], 10);
      const month = MONTH_MAP[mStr] ?? MONTH_MAP[mStr.substring(0, 3)];
      if (month !== undefined) {
        return new Date(Date.UTC(year, month, 1)).getTime();
      }
    }

    // 5. Fallback native Date.parse
    const parsed = Date.parse(rawDate);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  // 6. Estimasi dari periode jika rawDate kosong
  if (period) {
    const cleanPeriod = period.trim().toLowerCase();
    const yearMatch = cleanPeriod.match(/\b(20\d{2})\b/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : 2026;

    if (
      cleanPeriod.includes("q4") ||
      cleanPeriod.includes("kuartal iv") ||
      cleanPeriod.includes("kuartal 4")
    ) {
      return new Date(Date.UTC(year, 11, 31)).getTime();
    }
    if (
      cleanPeriod.includes("q3") ||
      cleanPeriod.includes("kuartal iii") ||
      cleanPeriod.includes("kuartal 3")
    ) {
      return new Date(Date.UTC(year, 8, 30)).getTime();
    }
    if (
      cleanPeriod.includes("q2") ||
      cleanPeriod.includes("kuartal ii") ||
      cleanPeriod.includes("kuartal 2")
    ) {
      return new Date(Date.UTC(year, 5, 30)).getTime();
    }
    if (
      cleanPeriod.includes("q1") ||
      cleanPeriod.includes("kuartal i") ||
      cleanPeriod.includes("kuartal 1")
    ) {
      return new Date(Date.UTC(year, 2, 31)).getTime();
    }
    if (yearMatch) {
      return new Date(Date.UTC(year, 0, 1)).getTime();
    }
  }

  return 0;
}

/**
 * Mengekstrak URL preview thumbnail nyata dari berbagai sumber media:
 * - Google Drive File / Video / Image -> https://drive.google.com/thumbnail?id={id}&sz=w800
 * - Google Slides -> https://docs.google.com/presentation/d/{id}/export/png
 * - YouTube Video -> https://img.youtube.com/vi/{id}/hqdefault.jpg
 * - URL Gambar langsung (.png, .jpg, .webp, dll)
 */
export function extractThumbnailUrl(url?: string): string | undefined {
  if (!url || url === "#") return undefined;

  const cleanUrl = url.trim();

  // 1. Google Drive File (Video, Gambar, Dokumen)
  const driveMatch =
    cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
  }

  // 2. Google Slides Presentation
  const slidesMatch =
    cleanUrl.match(/\/presentation\/[ud]\/(?:[0-9]+\/)?d\/([a-zA-Z0-9_-]+)/) ||
    cleanUrl.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (slidesMatch && slidesMatch[1]) {
    const presentationId = slidesMatch[1];
    return `https://docs.google.com/presentation/d/${presentationId}/export/png`;
  }

  // 3. YouTube Video
  const ytMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }

  // 4. File gambar langsung
  if (cleanUrl.match(/\.(jpeg|jpg|png|webp|svg)(\?.*)?$/i)) {
    return cleanUrl;
  }

  return undefined;
}

function normalizeCategory(
  rawCat: string | undefined,
  rawType: string | undefined
): ArchiveItemCategory {
  const cat = (rawCat || "").trim().toLowerCase();
  const type = (rawType || "").trim().toLowerCase();

  // Jika tipe media spesifik tapi kategori umum
  if (cat.includes("data") || cat.includes("sheet") || cat.includes("project")) {
    return "data";
  }
  if (cat.includes("poster") || cat.includes("canva") || cat.includes("awareness")) {
    return "poster";
  }
  if (
    cat.includes("slide") ||
    cat.includes("presentasi") ||
    cat.includes("deck") ||
    cat.includes("ppt") ||
    type.includes("ppt") ||
    type.includes("slide")
  ) {
    return "slides";
  }
  if (
    cat.includes("video") ||
    cat.includes("youtube") ||
    cat.includes("mp4") ||
    cat.includes("animasi") ||
    type.includes("video") ||
    type.includes("mov") ||
    type.includes("mp4")
  ) {
    return "video";
  }
  return "meeting";
}

function getCategoryConfig(
  category: ArchiveItemCategory,
  rawType?: string,
  rawCategory?: string
) {
  const typeLower = (rawType || "").trim().toLowerCase();

  // Override visual dan action berdasarkan media type aktual jika tersedia
  if (
    typeLower.includes("video") ||
    typeLower.includes("mp4") ||
    typeLower.includes("mov") ||
    typeLower.includes("animasi")
  ) {
    return {
      categoryLabel:
        category === "data" ? "Project" : "Video Dokumentasi",
      typeBadge: rawType || "Video",
      badgeColorClass: "bg-rose-600/80 text-white",
      gradientClass: "from-red-950 via-rose-900 to-purple-950",
      iconType: "video" as const,
      actionLabel: "Tonton Video",
    };
  }

  if (
    typeLower.includes("ppt") ||
    typeLower.includes("slide") ||
    typeLower.includes("presentasi") ||
    typeLower.includes("deck")
  ) {
    return {
      categoryLabel:
        category === "data" ? "Project" : "Presentasi Slides",
      typeBadge: rawType || "Google Slides",
      badgeColorClass: "bg-amber-500/80 text-white",
      gradientClass: "from-amber-800 via-orange-900 to-yellow-950",
      iconType: "presentation" as const,
      actionLabel: "Buka Slides",
    };
  }

  if (
    typeLower.includes("canva") ||
    typeLower.includes("poster") ||
    typeLower.includes("infografis") ||
    typeLower.includes("gambar")
  ) {
    return {
      categoryLabel: "Awareness & Poster",
      typeBadge: rawType || "Canva Template",
      badgeColorClass: "bg-purple-500/80 text-white",
      gradientClass: "from-purple-900 via-pink-900 to-amber-900",
      iconType: "image" as const,
      actionLabel: "Buka di Canva",
    };
  }

  if (
    typeLower.includes("sheet") ||
    typeLower.includes("excel") ||
    typeLower.includes("spreadsheet")
  ) {
    return {
      categoryLabel: "Data Driven Meeting",
      typeBadge: rawType || "Sheets & Dashboard",
      badgeColorClass: "bg-emerald-500/80 text-white",
      gradientClass: "from-emerald-900 via-teal-900 to-cyan-950",
      iconType: "sheets" as const,
      actionLabel: "Akses Project",
    };
  }

  // Fallback ke konfigurasi kategori dasar
  switch (category) {
    case "data":
      return {
        categoryLabel: rawCategory || "Data Driven Meeting",
        typeBadge: rawType || "Sheets & Dashboard",
        badgeColorClass: "bg-emerald-500/80 text-white",
        gradientClass: "from-emerald-900 via-teal-900 to-cyan-950",
        iconType: "sheets" as const,
        actionLabel: "Akses Project",
      };
    case "poster":
      return {
        categoryLabel: rawCategory || "Awareness & Poster",
        typeBadge: rawType || "Canva Template",
        badgeColorClass: "bg-purple-500/80 text-white",
        gradientClass: "from-purple-900 via-pink-900 to-amber-900",
        iconType: "image" as const,
        actionLabel: "Buka di Canva",
      };
    case "slides":
      return {
        categoryLabel: rawCategory || "Presentasi Slides",
        typeBadge: rawType || "Google Slides",
        badgeColorClass: "bg-amber-500/80 text-white",
        gradientClass: "from-amber-800 via-orange-900 to-yellow-950",
        iconType: "presentation" as const,
        actionLabel: "Buka Slides",
      };
    case "video":
      return {
        categoryLabel: rawCategory || "Video Dokumentasi",
        typeBadge: rawType || "Video YouTube / MP4",
        badgeColorClass: "bg-rose-600/80 text-white",
        gradientClass: "from-red-950 via-rose-900 to-purple-950",
        iconType: "video" as const,
        actionLabel: "Tonton Video",
      };
    case "meeting":
    default:
      return {
        categoryLabel: rawCategory || "Laporan Rapat",
        typeBadge: rawType || "PDF Document",
        badgeColorClass: "bg-blue-500/80 text-white",
        gradientClass: "from-blue-900 via-blue-800 to-indigo-950",
        iconType: "pdf" as const,
        actionLabel: "Buka Dokumen",
      };
  }
}

/**
 * Mengambil data arsip dari named range 'WEBArchive' di Google Sheets dengan ekstraksi Smart Chips otomatis.
 * Jika named range belum dibuat atau error, otomatis menggunakan DEFAULT_ARCHIVE_ITEMS.
 */
export async function getArchiveItems(): Promise<ArchiveItem[]> {
  try {
    const rows = await getNamedRangeDataWithLinks("WEBArchive");
    if (!rows || rows.length === 0) {
      return DEFAULT_ARCHIVE_ITEMS;
    }

    const items: ArchiveItem[] = [];

    rows.forEach((row, index) => {
      // Dukung berbagai variasi nama kolom (Bahasa Indonesia / English)
      const title = (row["Judul"] || row["Title"] || "").trim();
      if (!title) return; // Lewati baris kosong

      const rawCat = (row["Kategori"] || row["Category"] || "").trim();
      const rawType = (row["Tipe Media"] || row["Tipe"] || row["Type"] || "").trim();
      const category = normalizeCategory(rawCat, rawType);
      const config = getCategoryConfig(category, rawType, rawCat);

      const rawPeriod = (
        row["Periode"] ||
        row["Period"] ||
        row["Durasi"] ||
        row["Duration"] ||
        ""
      ).trim();

      const rawDate = (
        row["Tanggal Dok"] ||
        row["Tanggal"] ||
        row["Date"] ||
        ""
      ).trim();

      let periodOrDuration = rawPeriod;
      if (rawPeriod && rawDate) {
        periodOrDuration = `${rawPeriod} • ${rawDate}`;
      } else if (!periodOrDuration && rawDate) {
        periodOrDuration = rawDate;
      }

      const description = (row["Deskripsi"] || row["Description"] || "").trim();
      const externalUrl = (row["Link URL"] || row["Link"] || row["URL"] || "#").trim();
      const fileMeta = (row["Meta File"] || row["Meta"] || "").trim();

      const timestamp = parseArchiveDateToTimestamp(rawDate, rawPeriod);
      const thumbnailUrl = extractThumbnailUrl(externalUrl);

      items.push({
        id: `archive-${index + 1}`,
        title,
        category,
        categoryLabel: config.categoryLabel,
        typeBadge: config.typeBadge,
        badgeColorClass: config.badgeColorClass,
        periodOrDuration: periodOrDuration || undefined,
        date: rawDate || undefined,
        timestamp,
        description,
        gradientClass: config.gradientClass,
        iconType: config.iconType,
        fileMeta: fileMeta || undefined,
        externalUrl,
        actionLabel: config.actionLabel,
        thumbnailUrl,
      });
    });

    // Urutkan item dari tanggal terbaru ke terlama (paling kiri = tanggal paling baru)
    items.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));

    return items.length > 0 ? items : DEFAULT_ARCHIVE_ITEMS;
  } catch (err) {
    console.warn(
      "[Archive] Named range WEBArchive belum tersedia di Google Sheets atau gagal dimuat. Menggunakan data default:",
      err
    );
    return DEFAULT_ARCHIVE_ITEMS;
  }
}
