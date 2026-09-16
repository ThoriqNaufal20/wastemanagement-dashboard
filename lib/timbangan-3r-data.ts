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

export async function getTimbangan3RSummary(): Promise<Timbangan3RSummary> {
  return fetchTimbangan3RSummary();
}

export interface Timbangan3RDetailItem {
  tanggal: string;
  tipe: string;
  dept: string;
  noSj: string;
  operator: string;
  kategori: string;
  barang: string;
  qty: number;
  uom: string;
  beratKg: string;
  status: string;
  note: string;
}

async function fetchTimbangan3RDetails(): Promise<Timbangan3RDetailItem[]> {
  const rows = await getNamedRangeData("WEBTimbangan3R");
  const items: Timbangan3RDetailItem[] = [];

  rows.forEach((row) => {
    const status = (row["Status"] || row["STATUS"] || "").trim().toUpperCase();
    if (!status || status === "DONE") return;

    items.push({
      tanggal: row["TANGGAL"]?.trim() || "-",
      tipe: row["PENERIMAAN / PENGIRIMAN"]?.trim() || "-",
      dept: row["DEPT PENGIRIM / DEPT TERTUJU"]?.trim() || "-",
      noSj: row["NO SJ"]?.trim() || "-",
      operator: row["NAMA OPERATOR"]?.trim() || "-",
      kategori: row["Kategori barang"]?.trim() || "-",
      barang: row["BARANG"]?.trim() || "-",
      qty: parseQty(row["QTY"]),
      uom: row["UOM"]?.trim() || "PCS",
      beratKg: row["BERAT (KG)"]?.trim() || "-",
      status: status,
      note: row["Note"]?.trim() || "-",
    });
  });

  return items;
}

export async function getTimbangan3RDetails(): Promise<Timbangan3RDetailItem[]> {
  return fetchTimbangan3RDetails();
}

