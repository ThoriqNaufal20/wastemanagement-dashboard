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
  totalPending: number; // gabungan Pola + Logo + Glove yang Status = "Pending"
}

const CATEGORY_MAP: Record<string, keyof Omit<Timbangan3RSummary, "totalPending">> = {
  "POLA REJECT": "pola",
  "LOGO REJECT": "logo",
  "GLOVE REJECT": "glove",
};

function emptyCounter(): CategoryCounter {
  return { late: 0, onProgress: 0, pending: 0 };
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

    // "DONE" sengaja diabaikan total — tidak masuk late, in-progress,
    // atau pending, sama seperti "sudah dikirim" di data Glove.
    if (status === "DONE") return;

    if (status === "LATE") counters[key].late++;
    else if (status === "DALAM PROSES") counters[key].onProgress++;
    else if (status === "PENDING") counters[key].pending++;
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
