import "server-only";
import { getNamedRangeData } from "@/lib/google-sheets";
import type {
  InternalAuditSupportRow,
  InternalAuditSupportFactSummary,
  InternalAuditSupportDeptSummary,
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

/**
 * Parsing tanggal target finish:
 * Format sheet umumnya: D-MMM-YYYY (e.g. 9-Feb-2026, 31-Mar-2026), DD/MM/YYYY, dsb.
 */
export function parseTargetDate(dateStr: string | undefined): Date | null {
  if (!dateStr || !dateStr.trim()) return null;
  const s = dateStr.trim();
  const parts = s.split(/[-/.\s]+/);
  if (parts.length === 3) {
    const [p0, p1, p2] = parts;
    const MONTH_MAP: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
      mei: 4, agu: 7, ags: 7, okt: 9, des: 11,
    };
    const mKey = p1.toLowerCase();
    if (MONTH_MAP[mKey] !== undefined) {
      const day = parseInt(p0, 10);
      const month = MONTH_MAP[mKey];
      let year = parseInt(p2, 10);
      if (year < 100) year += 2000;
      if (!isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day, 23, 59, 59, 999);
      }
    }
    if (p0.length === 4) {
      const year = parseInt(p0, 10);
      const month = parseInt(p1, 10) - 1;
      const day = parseInt(p2, 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day, 23, 59, 59, 999);
      }
    }
    const day = parseInt(p0, 10);
    const month = parseInt(p1, 10) - 1;
    let year = parseInt(p2, 10);
    if (year < 100) year += 2000;
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day, 23, 59, 59, 999);
    }
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Late adalah data dengan status selain done / shared with team
 * yang tgl target finish-nya melewati tgl hari ini.
 */
export function isTargetLate(targetFin: string | undefined, now: Date = new Date()): boolean {
  const targetDate = parseTargetDate(targetFin);
  if (!targetDate) return false;
  return targetDate.getTime() < now.getTime();
}

const FALLBACK_FACT_SUMMARIES: InternalAuditSupportFactSummary[] = [
  { fact: "F", ots: 8, late: 0, inProgress: 8, total: 25, done: 9, shared: 8 },
  { fact: "B", ots: 12, late: 0, inProgress: 12, total: 16, done: 1, shared: 3 },
  { fact: "A", ots: 13, late: 0, inProgress: 13, total: 16, done: 3, shared: 0 },
  { fact: "K", ots: 15, late: 0, inProgress: 15, total: 18, done: 0, shared: 3 },
];

const FALLBACK_DEPT_SUMMARIES: InternalAuditSupportDeptSummary[] = [
  { department: "Maintenance Facility", late: 0, inProgress: 20, ots: 20, done: 10, shared: 8, total: 38 },
  { department: "MT", late: 0, inProgress: 13, ots: 13, done: 0, shared: 1, total: 14 },
  { department: "Quality", late: 0, inProgress: 6, ots: 6, done: 0, shared: 2, total: 8 },
  { department: "HSE Compliance", late: 0, inProgress: 3, ots: 3, done: 3, shared: 3, total: 9 },
  { department: "HR", late: 0, inProgress: 4, ots: 4, done: 0, shared: 0, total: 4 },
  { department: "IT", late: 0, inProgress: 1, ots: 1, done: 0, shared: 0, total: 1 },
];

export async function getInternalAuditSupportData(): Promise<InternalAuditSupportData> {
  const now = new Date();
  try {
    const rawRows = await getNamedRangeData("WEBInternalAuditSupportTeam");
    if (!rawRows || rawRows.length === 0) {
      const totalOts = FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.ots, 0);
      const totalLate = FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.late, 0);
      const totalInProgress = totalOts;
      return {
        rows: [],
        factSummaries: FALLBACK_FACT_SUMMARIES,
        deptSummaries: FALLBACK_DEPT_SUMMARIES,
        totalOts,
        totalLate,
        totalInProgress,
        totalDone: FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.done, 0),
        totalShared: FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.shared, 0),
        totalRows: FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.total, 0),
      };
    }

    const rows: InternalAuditSupportRow[] = [];
    const factMap: Record<string, InternalAuditSupportFactSummary> = {};
    const deptMap: Record<string, InternalAuditSupportDeptSummary> = {};

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
      const late = ots && isTargetLate(targetFin, now);
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
        isLate: late,
      });

      if (!factMap[fact]) {
        factMap[fact] = {
          fact,
          ots: 0,
          late: 0,
          inProgress: 0,
          total: 0,
          done: 0,
          shared: 0,
        };
      }
      factMap[fact].total++;
      if (ots) {
        factMap[fact].ots++;
        if (late) {
          factMap[fact].late++;
        } else {
          factMap[fact].inProgress++;
        }
      }
      if (isDone) factMap[fact].done++;
      if (isShared) factMap[fact].shared++;

      // Agregasi per Departemen Support
      const deptName = supportiveDepartment || "Lainnya";
      if (!deptMap[deptName]) {
        deptMap[deptName] = {
          department: deptName,
          late: 0,
          inProgress: 0,
          ots: 0,
          total: 0,
          done: 0,
          shared: 0,
        };
      }
      deptMap[deptName].total++;
      if (ots) {
        deptMap[deptName].ots++;
        if (late) {
          deptMap[deptName].late++;
        } else {
          deptMap[deptName].inProgress++;
        }
      }
      if (isDone) deptMap[deptName].done++;
      if (isShared) deptMap[deptName].shared++;
    });

    // Urutkan pabrik sesuai urutan tabel audit utama: F, B, A, K
    const factOrder = ["F", "B", "A", "K"];
    const factSummaries = Object.values(factMap).sort((a, b) => {
      const idxA = factOrder.indexOf(a.fact);
      const idxB = factOrder.indexOf(b.fact);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.fact.localeCompare(b.fact);
    });

    // Urutkan dept: yang late terbanyak dulu, lalu ots terbanyak, lalu total
    const deptSummaries = Object.values(deptMap).sort((a, b) => {
      if (b.late !== a.late) return b.late - a.late;
      if (b.ots !== a.ots) return b.ots - a.ots;
      return b.total - a.total;
    });

    const totalOts = factSummaries.reduce((acc, f) => acc + f.ots, 0);
    const totalLate = factSummaries.reduce((acc, f) => acc + f.late, 0);
    const totalInProgress = totalOts;
    const totalDone = factSummaries.reduce((acc, f) => acc + f.done, 0);
    const totalShared = factSummaries.reduce((acc, f) => acc + f.shared, 0);
    const totalRows = factSummaries.reduce((acc, f) => acc + f.total, 0);

    return {
      rows,
      factSummaries,
      deptSummaries,
      totalOts,
      totalLate,
      totalInProgress,
      totalDone,
      totalShared,
      totalRows,
    };
  } catch (error) {
    console.error("Gagal membaca WEBInternalAuditSupportTeam:", error);
    const totalOts = FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.ots, 0);
    const totalLate = FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.late, 0);
    const totalInProgress = totalOts;
    return {
      rows: [],
      factSummaries: FALLBACK_FACT_SUMMARIES,
      deptSummaries: FALLBACK_DEPT_SUMMARIES,
      totalOts,
      totalLate,
      totalInProgress,
      totalDone: FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.done, 0),
      totalShared: FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.shared, 0),
      totalRows: FALLBACK_FACT_SUMMARIES.reduce((acc, f) => acc + f.total, 0),
    };
  }
}

