export interface CapItem {
  id: string;
  tanggal: string; // Raw date string e.g. "20-Jan-24"
  spo: string;
  order: string;
  dibuatOleh: string;
  ditujukanUntuk: string;
  temuanMasalah: string;
  analisaMasalah: string;
  penyebabMasalah: string;
  evaluasiPermasalahan: string;
  tindakanPenyelesaian: string;
  tanggalDiselesaikan: string;
  klasifikasiMasalah: string; // e.g. "Material", "Man", "Method", "Machine"
  status: string; // e.g. "Done"
  year?: number; // e.g. 2026, 2025, 2024
  isoDate?: string; // e.g. "2026-01-20" for filtering & sorting
}

export interface CapClassificationSummary {
  name: string;
  count: number;
  value: number; // percentage (0 - 100)
  color: string;
}

export interface CapDashboardData {
  year: number;
  totalCases: number;
  distribution: CapClassificationSummary[];
  topContributor: {
    name: string;
    count: number;
    percentage: number;
  } | null;
}

// Skema warna kategori non-urgent (bebas dari merah/kuning/oranye)
export const CAP_CLASSIFICATION_COLORS: Record<string, string> = {
  material: "#2563eb", // Royal Blue
  man: "#0d9488",      // Teal / Dark Mint
  method: "#6366f1",   // Indigo
  machine: "#0891b2",  // Cyan / Deep Sky
  lainnya: "#64748b",  // Slate
};

export const DEFAULT_CAP_COLORS = [
  "#2563eb", // Blue
  "#0d9488", // Teal
  "#6366f1", // Indigo
  "#0891b2", // Cyan
  "#7c3aed", // Violet
  "#64748b", // Slate
];

