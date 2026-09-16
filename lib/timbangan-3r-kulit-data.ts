import { getNamedRangeData } from "@/lib/google-sheets";

function parseNumber(value: string | undefined): number {
  if (!value) return 0;
  const num = parseFloat(value.replace(/,/g, "").replace("%", "").trim());
  return Number.isNaN(num) ? 0 : num;
}

// ---------- WIP Kulit summary (untuk MetricCard) ----------

export interface WipKulitSummary {
  late: number;
  total: number; // late + onProgress, dalam KG (jumlah BERAT KIRIMAN)
}

async function fetchWipKulitSummary(): Promise<WipKulitSummary> {
  const rows = await getNamedRangeData("WEBTimbangan3RKulit");

  let late = 0;
  let onProgress = 0;

  rows.forEach((row) => {
    const status = row["Status"]?.trim().toUpperCase();
    const beratKiriman = parseNumber(row["BERAT KIRIMAN (KG)"]);

    if (status === "LATE") late += beratKiriman;
    else if (status === "WIP") onProgress += beratKiriman;
    // "OK" dan baris tanpa status diabaikan total.
  });

  return { late: Math.round(late * 10) / 10, total: Math.round((late + onProgress) * 10) / 10 };
}

export async function getWipKulitSummary(): Promise<WipKulitSummary> {
  return fetchWipKulitSummary();
}

export interface WipKulitDetailItem {
  tanggal: string;
  tglCek3R: string;
  fact: string;
  spo: string;
  style: string;
  beratKiriman: number;
  beratSetelahCek: number;
  kelolosan: number;
  temuan: string;
  keterangan: string;
  status: string;
}

async function fetchWipKulitDetails(): Promise<WipKulitDetailItem[]> {
  const rows = await getNamedRangeData("WEBTimbangan3RKulit");
  const items: WipKulitDetailItem[] = [];

  rows.forEach((row) => {
    const status = row["Status"]?.trim().toUpperCase();
    if (status !== "LATE" && status !== "WIP") return;

    items.push({
      tanggal: row["TANGGAL"]?.trim() || "-",
      tglCek3R: row["TGL CEK 3R"]?.trim() || "-",
      fact: row["FACT"]?.trim() || "-",
      spo: row["SPO"]?.trim() || "-",
      style: row["STYLE"]?.trim() || "-",
      beratKiriman: parseNumber(row["BERAT KIRIMAN (KG)"]),
      beratSetelahCek: parseNumber(row["BERAT SETELAH CEK 3R (KG)"]),
      kelolosan: parseNumber(row["% KELOLOSAN"]),
      temuan: row["TEMUAN"]?.trim() || "-",
      keterangan: row["KETERANGAN"]?.trim() || "-",
      status: status,
    });
  });

  return items;
}

export async function getWipKulitDetails(): Promise<WipKulitDetailItem[]> {
  return fetchWipKulitDetails();
}


// ---------- % Kelolosan chart (data sama, dipakai beda) ----------

export interface KelolosanWeekPoint {
  week: string;
  [factLabel: string]: string | number;
}

// ISO week number dari sebuah tanggal.
function getISOWeek(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.round((firstThursday - target.valueOf()) / (7 * 24 * 3600 * 1000));
}

function parseSheetDate(value: string | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function fetchKelolosanChartData(): Promise<KelolosanWeekPoint[]> {
  const rows = await getNamedRangeData("WEBTimbangan3RKulit");

  const raw: { week: string; fact: string; value: number }[] = [];

  rows.forEach((row) => {
    const isFilterWeek = row["Filter Week"]?.trim().toUpperCase() === "YES";
    if (!isFilterWeek) return;

    const date = parseSheetDate(row["TANGGAL"]);
    const factRaw = row["FACT"]?.trim().toUpperCase();
    if (!date || !factRaw) return;

    const weekNumber = getISOWeek(date);
    const kelolosan = parseNumber(row["% KELOLOSAN"]);

    raw.push({
      week: `Week ${weekNumber}`,
      fact: `Fact ${factRaw}`, // "Fact A", "Fact K", dst — dipakai langsung sebagai nama series
      value: Math.round(kelolosan * 10) / 10,
    });
  });

  const weekMap = new Map<string, KelolosanWeekPoint>();
  const sumMap = new Map<string, { sum: number; count: number }>(); // key = "week|fact"

  raw.forEach(({ week, fact, value }) => {
    const mapKey = `${week}|${fact}`;
    const entry = sumMap.get(mapKey) ?? { sum: 0, count: 0 };
    entry.sum += value;
    entry.count += 1;
    sumMap.set(mapKey, entry);
  });

  sumMap.forEach((entry, mapKey) => {
    const [week, fact] = mapKey.split("|");
    if (!weekMap.has(week)) weekMap.set(week, { week });
    const average = Math.round((entry.sum / entry.count) * 10) / 10;
    weekMap.get(week)![fact] = average;
  });

  return Array.from(weekMap.values()).sort((a, b) => {
    const na = parseInt(String(a.week).replace("Week ", ""), 10);
    const nb = parseInt(String(b.week).replace("Week ", ""), 10);
    return na - nb;
  });
}

export async function getKelolosanChartData(): Promise<KelolosanWeekPoint[]> {
  return fetchKelolosanChartData();
}
