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

      items.push({
        id: `archive-${index + 1}`,
        title,
        category,
        categoryLabel: config.categoryLabel,
        typeBadge: config.typeBadge,
        badgeColorClass: config.badgeColorClass,
        periodOrDuration: periodOrDuration || undefined,
        description,
        gradientClass: config.gradientClass,
        iconType: config.iconType,
        fileMeta: fileMeta || undefined,
        externalUrl,
        actionLabel: config.actionLabel,
      });
    });

    return items.length > 0 ? items : DEFAULT_ARCHIVE_ITEMS;
  } catch (err) {
    console.warn(
      "[Archive] Named range WEBArchive belum tersedia di Google Sheets atau gagal dimuat. Menggunakan data default:",
      err
    );
    return DEFAULT_ARCHIVE_ITEMS;
  }
}
