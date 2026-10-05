import "server-only";
import { getNamedRangeData } from "@/lib/google-sheets";
import type {
  InternalAuditSupportRow,
  InternalAuditSupportFactSummary,
  InternalAuditSupportData,
} from "@/lib/internal-audit-support-types";

/**
 * Aturan status:
 * Status selain "Done" dan "Shared with team" adalah Late / In Progress (Outstanding).
 */
export function isStatusOts(status: string | undefined): boolean {
  if (!status) return true;
  const s = status.trim().replace(/\s+/g, " ").toLowerCase();
  if (s === "done" || s === "shared with team") {
    return false;
  }
  return true;
}

const FALLBACK_FACT_SUMMARIES: InternalAuditSupportFactSummary[] = [
  { fact: "A", ots: 13, total: 16, done: 3, shared: 0 },
  { fact: "B", ots: 12, total: 16, done: 1, shared: 3 },
  { fact: "F", ots: 8, total: 25, done: 9, shared: 8 },
  { fact: "K", ots: 15, total: 18, done: 0, shared: 3 },
];

export async function getInternalAuditSupportData(): Promise<InternalAuditSupportData> {
  try {
    const rawRows = await getNamedRangeData("WEBInternalAuditSupportTeam");
    if (!rawRows || rawRows.length === 0) {
      return {
        rows: [],
        factSummaries: FALLBACK_FACT_SUMMARIES,
        totalOts: FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.ots, 0),
        totalDone: FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.done, 0),
        totalShared: FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.shared, 0),
        totalRows: FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.total, 0),
      };
    }

    const rows: InternalAuditSupportRow[] = [];
    const factMap: Record<string, InternalAuditSupportFactSummary> = {};

    rawRows.forEach((r) => {
      // Normalisasi header
      const cleanRow: Record<string, string> = {};
      Object.keys(r).forEach((k) => {
        const cleanKey = k.trim().toUpperCase().replace(/[.:]/g, "");
        cleanRow[cleanKey] = (r[k] || "").trim();
      });

      const fact = cleanRow["FACT"] || cleanRow["FACTORY"] || "";
      if (!fact) return;

      const period = cleanRow["PERIOD"] || cleanRow["PERIODE"] || "";
      const area = cleanRow["AREA"] || "";
      const status = r["STATUS"] || cleanRow["STATUS"] || "";
      const finding = cleanRow["FINDING"] || cleanRow["FINDINGS"] || "";
      const image = r["IMAGE"] || cleanRow["IMAGE"] || "";
      const supportiveDepartment =
        cleanRow["SUPPORTIVE DEPARTMENT"] ||
        cleanRow["SUPPORTIVE DEPT"] ||
        cleanRow["DEPARTMENT"] ||
        "";
      const cap = cleanRow["CAP"] || "";
      const imageImprovement =
        cleanRow["IMAGE (IMPROVEMENT)"] || cleanRow["IMAGE IMPROVEMENT"] || "";
      const targetFin = cleanRow["TARGET FIN"] || "";
      const actualFin = cleanRow["ACTUAL FIN"] || "";

      const ots = isStatusOts(status);
      const isDone = status.trim().toLowerCase() === "done";
      const isShared = status.trim().replace(/\s+/g, " ").toLowerCase() === "shared with team";

      rows.push({
        period,
        fact,
        area,
        status,
        finding,
        image,
        supportiveDepartment,
        cap,
        imageImprovement,
        targetFin,
        actualFin,
        isOts: ots,
      });

      if (!factMap[fact]) {
        factMap[fact] = { fact, ots: 0, total: 0, done: 0, shared: 0 };
      }
      factMap[fact].total++;
      if (ots) factMap[fact].ots++;
      if (isDone) factMap[fact].done++;
      if (isShared) factMap[fact].shared++;
    });

    const factOrder = ["A", "B", "F", "K"];
    const factSummaries = Object.values(factMap).sort((a, b) => {
      const idxA = factOrder.indexOf(a.fact);
      const idxB = factOrder.indexOf(b.fact);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.fact.localeCompare(b.fact);
    });

    const totalOts = factSummaries.reduce((acc, f) => acc + f.ots, 0);
    const totalDone = factSummaries.reduce((acc, f) => acc + f.done, 0);
    const totalShared = factSummaries.reduce((acc, f) => acc + f.shared, 0);
    const totalRows = factSummaries.reduce((acc, f) => acc + f.total, 0);

    return {
      rows,
      factSummaries,
      totalOts,
      totalDone,
      totalShared,
      totalRows,
    };
  } catch (error) {
    console.error("Gagal membaca WEBInternalAuditSupportTeam:", error);
    return {
      rows: [],
      factSummaries: FALLBACK_FACT_SUMMARIES,
      totalOts: FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.ots, 0),
      totalDone: FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.done, 0),
      totalShared: FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.shared, 0),
      totalRows: FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.total, 0),
    };
  }
}

