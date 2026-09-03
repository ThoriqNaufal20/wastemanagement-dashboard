import { unstable_cache } from "next/cache";
import { getNamedRangeData } from "@/lib/google-sheets";

interface CategoryCounter {
  late: number;
  onProgress: number;
  pending: number;
}

export interface CategorySummary {
  late: number;
  total: number; // late + onProgress + pending, konsisten dengan pola Glove Active
}

export interface Timbangan3RSummary {
  pola: CategorySummary;
  logo: CategorySummary;
  glove: CategorySummary;
  totalPending: number; // gabungan Pola + Logo + Glove yang Status = "PENDING"
}

const CATEGORY_MAP: Record<string, keyof Omit<Timbangan3RSummary, "totalPending">> = {
  "POLA REJECT": "pola",
  "LOGO REJECT": "logo",
  "GLOVE REJECT": "glove",
};

function emptyCounter(): CategoryCounter {
  return { late: 0, onProgress: 0, pending: 0 };
}

function parseQty(value: string | undefined): number {
  if (!value) return 0;
  const num = parseFloat(value.replace(/,/g, "").trim());
  return Number.isNaN(num) ? 0 : num;
}

async function fetchTimbangan3RSummary(): Promise<Timbangan3RSummary> {
  const rows = await getNamedRangeData("WEBTimbangan3R");

  const counters: Record<string, CategoryCounter> = {
    pola: emptyCounter(),
    logo: emptyCounter(),
    glove: emptyCounter(),
  };

  rows.forEach((row) => {
    const category = row["Kategori barang"]?.trim().toUpperCase();
    const status = row["Status"]?.trim().toUpperCase();
    const key = category ? CATEGORY_MAP[category] : undefined;
    if (!key) return;

    // "DONE" diabaikan total — tidak masuk late, in-progress, atau pending.
    if (status === "DONE") return;

    const qty = parseQty(row["QTY"]);

    if (status === "LATE") counters[key].late += qty;
    else if (status === "DALAM PROSES") counters[key].onProgress += qty;
    else if (status === "PENDING") counters[key].pending += qty;
  });

  function summarize(c: CategoryCounter): CategorySummary {
    return { late: c.late, total: c.late + c.onProgress + c.pending };
  }

  const totalPending =
    counters.pola.pending + counters.logo.pending + counters.glove.pending;

  return {
    pola: summarize(counters.pola),
    logo: summarize(counters.logo),
    glove: summarize(counters.glove),
    totalPending,
  };
}

export const getTimbangan3RSummary = unstable_cache(
  fetchTimbangan3RSummary,
  ["timbangan-3r-summary"],
  { revalidate: 120 }
);
