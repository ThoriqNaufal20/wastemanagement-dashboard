import "server-only";
import { getNamedRangeData } from "@/lib/google-sheets";
import {
  CapItem,
  CapClassificationSummary,
  CapDashboardData,
  CAP_CLASSIFICATION_COLORS,
  DEFAULT_CAP_COLORS,
} from "./cap-types";

const MONTH_MAP: Record<string, string> = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  mei: "05",
  jun: "06",
  jul: "07",
  aug: "08",
  agu: "08",
  sep: "09",
  oct: "10",
  okt: "10",
  nov: "11",
  nop: "11",
  dec: "12",
  des: "12",
};

/**
 * Parsing tanggal dari berbagai variasi:
 * "20-Jan-24", "18-Apr-26", "2026-01-20", dll.
 */
export function parseCapDate(rawDate: string | undefined): {
  year?: number;
  isoDate?: string;
} {
  if (!rawDate) return {};
  const str = rawDate.trim();
  if (!str) return {};

  // Coba format DD-MMM-YY atau DD-MMM-YYYY (contoh: 20-Jan-24)
  const dmyMatch = str.match(/^(\d{1,2})[-/ ]([A-Za-z]+)[-/ ](\d{2,4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, "0");
    const monthKey = dmyMatch[2].toLowerCase().slice(0, 3);
    const month = MONTH_MAP[monthKey] || "01";
    let yr = parseInt(dmyMatch[3], 10);
    if (yr < 100) {
      yr = 2000 + yr;
    }
    return {
      year: yr,
      isoDate: `${yr}-${month}-${day}`,
    };
  }

  // Coba format YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (isoMatch) {
    const yr = parseInt(isoMatch[1], 10);
    const month = isoMatch[2].padStart(2, "0");
    const day = isoMatch[3].padStart(2, "0");
    return {
      year: yr,
      isoDate: `${yr}-${month}-${day}`,
    };
  }

  // Fallback standar JS Date
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const yr = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return {
      year: yr,
      isoDate: `${yr}-${month}-${day}`,
    };
  }

  return {};
}

/**
 * Mengambil seluruh baris data dari named range 'WEBCAP' di Google Sheets.
 */
export async function getAllCapItems(): Promise<CapItem[]> {
  try {
    const rows = await getNamedRangeData("WEBCAP");
    if (!rows || rows.length === 0) {
      return [];
    }

    const items: CapItem[] = [];

    rows.forEach((row, index) => {
      // Normalisasi nama kolom (handle case-insensitive & trailing spaces)
      const cleanRow: Record<string, string> = {};
      Object.keys(row).forEach((key) => {
        cleanRow[key.trim().toUpperCase()] = (row[key] || "").trim();
      });

      const tanggal = cleanRow["TANGGAL"] || "";
      const temuanMasalah = cleanRow["TEMUAN MASALAH"] || "";

      // Lewati baris kosong tanpa tanggal dan tanpa temuan
      if (!tanggal && !temuanMasalah) return;

      const { year, isoDate } = parseCapDate(tanggal);

      const klasifikasiMasalah =
        cleanRow["KLASIFIKASI MASALAH"] || "Lainnya";

      items.push({
        id: `cap-${index + 1}`,
        tanggal,
        spo: cleanRow["SPO"] || "",
        order: cleanRow["ORDER"] || "",
        dibuatOleh: cleanRow["DIBUAT OLEH"] || "",
        ditujukanUntuk: cleanRow["DITUJUKAN UNTUK"] || "",
        temuanMasalah,
        analisaMasalah: cleanRow["ANALISA MASALAH"] || "",
        penyebabMasalah: cleanRow["PENYEBAB MASALAH"] || "",
        evaluasiPermasalahan: cleanRow["EVALUASI PERMASALAHAN"] || "",
        tindakanPenyelesaian:
          cleanRow["TINDAKAN PENYELESAIAN DAN PENCEGAHAN"] || "",
        tanggalDiselesaikan:
          cleanRow["TANGGAL DISELESAIKAN"] ||
          cleanRow["TANGGAL DISELESAIKAN "] ||
          "",
        klasifikasiMasalah,
        status: cleanRow["STATUS"] || "Done",
        year,
        isoDate,
      });
    });

    // Urutkan default dari terbaru ke terlama (Z-A descending)
    items.sort((a, b) => {
      const dateA = a.isoDate || "";
      const dateB = b.isoDate || "";
      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }
      return b.id.localeCompare(a.id, undefined, { numeric: true });
    });

    return items;
  } catch (err) {
    console.error("[CAP Data] Gagal memuat named range WEBCAP:", err);
    return [];
  }
}

/**
 * Menghitung agregasi klasifikasi masalah untuk Pie Chart.
 * Menggunakan palet warna sejuk/non-urgent (bebas merah & kuning).
 */
export function getCapDistribution(items: CapItem[]): CapClassificationSummary[] {
  const counts: Record<string, number> = {};
  let total = 0;

  items.forEach((item) => {
    let raw = (item.klasifikasiMasalah || "Lainnya").trim();
    // Rapikan kapitalisasi: "man" -> "Man", "MATERIAL" -> "Material"
    const formatted =
      raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    counts[formatted] = (counts[formatted] || 0) + 1;
    total++;
  });

  if (total === 0) return [];

  // Urutkan klasifikasi dari jumlah terbanyak
  const sortedNames = Object.keys(counts).sort(
    (a, b) => counts[b] - counts[a]
  );

  return sortedNames.map((name, idx) => {
    const count = counts[name];
    const value = Math.round((count / total) * 1000) / 10; // 1 desimal
    const colorKey = name.toLowerCase();
    const color =
      CAP_CLASSIFICATION_COLORS[colorKey] ||
      DEFAULT_CAP_COLORS[idx % DEFAULT_CAP_COLORS.length];

    return {
      name,
      count,
      value,
      color,
    };
  });
}

/**
 * Mengambil ringkasan data CAP untuk kartu dashboard utama (default filter: tahun 2026).
 */
export async function getCapDashboardData(
  targetYear = 2026
): Promise<CapDashboardData> {
  const allItems = await getAllCapItems();
  const yearItems = allItems.filter((item) => item.year === targetYear);

  const distribution = getCapDistribution(yearItems);
  const totalCases = yearItems.length;

  let topContributor = null;
  if (distribution.length > 0) {
    const top = distribution[0];
    topContributor = {
      name: top.name,
      count: top.count,
      percentage: top.value,
    };
  }

  return {
    year: targetYear,
    totalCases,
    distribution,
    topContributor,
  };
}

