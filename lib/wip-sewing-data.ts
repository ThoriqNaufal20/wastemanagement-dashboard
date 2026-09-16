import { getNamedRangeData } from "@/lib/google-sheets";
import {
  WIP_SEWING_THRESHOLD,
  type WipSewingFactSummary,
  type WipSewingDetailItem,
} from "@/lib/wip-sewing-types";

export {
  WIP_SEWING_THRESHOLD,
  type WipSewingFactSummary,
  type WipSewingDetailItem,
};

function parseNumber(value: string | undefined): number {
  if (!value) return 0;
  const num = parseFloat(value.replace(/,/g, "").trim());
  return Number.isNaN(num) ? 0 : num;
}

async function fetchWipSewingSummary(): Promise<WipSewingFactSummary[]> {
  const rows = await getNamedRangeData("WEBWIPSewing7Hari");
  if (rows.length === 0) {
    return [
      { fact: "A", qty: 0, maxOverdue: 0, avgOverdue: 0, totalBox: 0, isCritical: false },
      { fact: "F", qty: 0, maxOverdue: 0, avgOverdue: 0, totalBox: 0, isCritical: false },
      { fact: "K", qty: 0, maxOverdue: 0, avgOverdue: 0, totalBox: 0, isCritical: false },
    ];
  }

  const factMap = new Map<
    string,
    { qty: number; overdueList: number[]; totalBox: number }
  >();

  // Inisialisasi factory A, F, K agar urutan konsisten
  ["A", "F", "K"].forEach((fact) => {
    factMap.set(fact, { qty: 0, overdueList: [], totalBox: 0 });
  });

  rows.forEach((row) => {
    const fact = row["Fact"]?.trim().toUpperCase();
    if (!fact) return;

    if (!factMap.has(fact)) {
      factMap.set(fact, { qty: 0, overdueList: [], totalBox: 0 });
    }

    const data = factMap.get(fact)!;
    const qty = parseNumber(row["Qty"]);
    const overdue = parseNumber(row["Overdue WIP (Workdays)"]);

    data.qty += qty;
    data.totalBox += 1;
    if (overdue > 0) {
      data.overdueList.push(overdue);
    }
  });

  const result: WipSewingFactSummary[] = [];

  factMap.forEach((val, fact) => {
    const maxOverdue =
      val.overdueList.length > 0 ? Math.max(...val.overdueList) : 0;
    const avgOverdue =
      val.overdueList.length > 0
        ? Math.round(
            (val.overdueList.reduce((acc, curr) => acc + curr, 0) /
              val.overdueList.length) *
              10
          ) / 10
        : 0;

    result.push({
      fact,
      qty: val.qty,
      maxOverdue,
      avgOverdue,
      totalBox: val.totalBox,
      isCritical: val.qty > WIP_SEWING_THRESHOLD,
    });
  });

  // Urutkan A, F, K
  return result.sort((a, b) => a.fact.localeCompare(b.fact));
}

export async function getWipSewingSummary(): Promise<WipSewingFactSummary[]> {
  return fetchWipSewingSummary();
}

async function fetchWipSewingDetails(): Promise<WipSewingDetailItem[]> {
  const rows = await getNamedRangeData("WEBWIPSewing7Hari");
  const items: WipSewingDetailItem[] = [];

  rows.forEach((row) => {
    const fact = row["Fact"]?.trim().toUpperCase() || "-";
    const spo = row["SPO"]?.trim() || "-";

    items.push({
      coding: row["Coding"]?.trim() || "-",
      noBox: row["No Box"]?.trim() || "-",
      spo,
      style: row["Style"]?.trim() || "-",
      line: row["Line"]?.trim() || "-",
      fact,
      scanDst: row["Scan DST"]?.trim() || "-",
      size: row["Size"]?.trim() || "-",
      qty: parseNumber(row["Qty"]),
      qtyCumul: row["Qty Cumul"]?.trim() || "-",
      overdueWorkdays: parseNumber(row["Overdue WIP (Workdays)"]),
      timeRange: row["Time Range"]?.trim() || "-",
    });
  });

  return items;
}

export async function getWipSewingDetails(): Promise<WipSewingDetailItem[]> {
  return fetchWipSewingDetails();
}

