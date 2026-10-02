/**
 * Helper utilitas untuk kalkulasi & perbandingan tanggal Internal Audit
 */

const MONTH_MAP: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  mei: 4,
  may: 4,
  jun: 5,
  jul: 6,
  agu: 7,
  agt: 7,
  aug: 7,
  sep: 8,
  okt: 9,
  oct: 9,
  nov: 10,
  des: 11,
  dec: 11,
};

/**
 * Parsing tanggal dari berbagai variasi format spreadsheet:
 * Contoh: "25-May-2026", "19-Jun-2026", "19-Mei-2026", "May 18, 2026", "2026-06-19"
 */
export function parseAuditDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const s = dateStr.trim();
  if (!s) return null;

  // Format dash / slash / space: e.g. "19-Jun-2026" atau "25-May-2026"
  const parts = s.split(/[-/\s]+/);
  if (parts.length === 3) {
    const p0 = parts[0].toLowerCase();
    const p1 = parts[1].toLowerCase();
    const p2 = parts[2].toLowerCase();

    // 1. Format DD-MMM-YYYY (e.g. 19-Jun-2026 / 19-Mei-2026)
    if (MONTH_MAP[p1] !== undefined) {
      const day = parseInt(p0, 10);
      const month = MONTH_MAP[p1];
      let year = parseInt(p2, 10);
      if (year < 100) year += 2000;
      if (!isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day, 23, 59, 59, 999);
      }
    }

    // 2. Format MMM-DD-YYYY (e.g. Jun-19-2026)
    if (MONTH_MAP[p0] !== undefined) {
      const month = MONTH_MAP[p0];
      const day = parseInt(p1, 10);
      let year = parseInt(p2, 10);
      if (year < 100) year += 2000;
      if (!isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day, 23, 59, 59, 999);
      }
    }

    // 3. Format numerik DD-MM-YYYY atau YYYY-MM-DD
    const n0 = parseInt(p0, 10);
    const n1 = parseInt(p1, 10);
    const n2 = parseInt(p2, 10);
    if (!isNaN(n0) && !isNaN(n1) && !isNaN(n2)) {
      if (n0 > 1000) {
        // YYYY-MM-DD
        return new Date(n0, n1 - 1, n2, 23, 59, 59, 999);
      } else {
        // DD-MM-YYYY
        let yr = n2 < 100 ? n2 + 2000 : n2;
        return new Date(yr, n1 - 1, n0, 23, 59, 59, 999);
      }
    }
  }

  // Format standard JavaScript / English text fallback
  const fallback = new Date(s);
  if (!isNaN(fallback.getTime())) {
    fallback.setHours(23, 59, 59, 999);
    return fallback;
  }

  return null;
}

/**
 * Aturan: "late adalah jika sudah melewati end date tetapi masih ada area yg belum di audit"
 */
export function isAuditLate(
  endDateStr: string,
  areaBelumAudit: number,
  now: Date = new Date()
): boolean {
  if (areaBelumAudit <= 0) return false;
  const parsed = parseAuditDate(endDateStr);
  if (!parsed) return false;
  return now.getTime() > parsed.getTime();
}

import type { StatusLevel } from "@/components/dashboard/status-chip";

/**
 * Aturan status baris Internal Audit di tabel:
 * - DONE: jika sudah tidak ada area yang belum diaudit (areaBelumAudit === 0)
 * - LATE: jika sudah melewati end date tetapi masih ada area yang belum diaudit (areaBelumAudit > 0 && now > endDate)
 * - ON PROGRESS: terdapat area yang belum diaudit tetapi belum melewati end date (areaBelumAudit > 0 && now <= endDate)
 */
export function getAuditRowStatus(
  endDateStr: string,
  areaBelumAudit: number,
  now: Date = new Date()
): StatusLevel {
  if (areaBelumAudit <= 0) {
    return "done";
  }

  const parsed = parseAuditDate(endDateStr);
  if (parsed && now.getTime() > parsed.getTime()) {
    return "late";
  }

  return "on_progress";
}


