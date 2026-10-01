import "server-only";
import { getNamedRangeData } from "@/lib/google-sheets";
import { internalAuditRows as mockInternalAuditRows } from "@/lib/mock-data";
import type { InternalAuditRow } from "@/lib/internal-audit-types";

/**
 * Format average score:
 * - "0.8461" -> "84.61%"
 * - "84.61" -> "84.61%"
 * - "84.61%" -> "84.61%"
 */
function formatAvgScore(val: string | undefined): { text: string; num: number } {
  if (!val) return { text: "0.00%", num: 0 };
  const clean = val.trim();
  if (clean.endsWith("%")) {
    const n = parseFloat(clean.replace("%", "").trim());
    return { text: clean, num: isNaN(n) ? 0 : n };
  }
  const n = parseFloat(clean);
  if (isNaN(n)) return { text: clean, num: 0 };
  // Jika dalam skala 0..1 (desimal rasio)
  if (n <= 1.0 && n > 0) {
    const pct = n * 100;
    return { text: `${pct.toFixed(2)}%`, num: pct };
  }
  return { text: `${n.toFixed(2)}%`, num: n };
}

export async function getInternalAuditMainData(): Promise<InternalAuditRow[]> {
  try {
    const rows = await getNamedRangeData("WEBInternalAuditMain");
    if (!rows || rows.length === 0) {
      return mockInternalAuditRows.map((r) => ({
        ...r,
        avgScoreRaw: parseFloat(r.avgScore.replace("%", "")),
      }));
    }

    const items: InternalAuditRow[] = [];

    rows.forEach((row) => {
      // Normalisasi key (case-insensitive & trim)
      const cleanRow: Record<string, string> = {};
      Object.keys(row).forEach((k) => {
        cleanRow[k.trim().toUpperCase()] = (row[k] || "").trim();
      });

      const fact = cleanRow["FACT"] || "";
      if (!fact) return; // Lewati baris kosong

      const period =
        cleanRow["PERIOD (L)"] ||
        cleanRow["PERIOD"] ||
        cleanRow["PERIODE"] ||
        "";

      const otsFindingStr =
        cleanRow["OTS FINDING"] ||
        cleanRow["OTS_FINDING"] ||
        cleanRow["FINDING"] ||
        "0";
      const otsFinding = parseInt(otsFindingStr.replace(/[^0-9]/g, ""), 10) || 0;

      const rawAvgScore = cleanRow["AVG SCORE"] || cleanRow["AVG_SCORE"] || "";
      const { text: avgScore, num: avgScoreRaw } = formatAvgScore(rawAvgScore);

      const areaStr =
        cleanRow["AREA BELUM AUDIT"] ||
        cleanRow["AREA_BELUM_AUDIT"] ||
        cleanRow["AREA BELUM DI AUDIT"] ||
        "0";
      const areaBelumAudit = parseInt(areaStr.replace(/[^0-9]/g, ""), 10) || 0;

      const startDate =
        cleanRow["START DATE (L)"] ||
        cleanRow["START DATE"] ||
        cleanRow["START_DATE"] ||
        "";

      const endDate =
        cleanRow["END DATE (L)"] ||
        cleanRow["END DATE"] ||
        cleanRow["END_DATE"] ||
        "";

      items.push({
        fact,
        period,
        otsFinding,
        avgScore,
        avgScoreRaw,
        areaBelumAudit,
        startDate,
        endDate,
      });
    });

    return items.length > 0
      ? items
      : mockInternalAuditRows.map((r) => ({
          ...r,
          avgScoreRaw: parseFloat(r.avgScore.replace("%", "")),
        }));
  } catch (err) {
    console.error("[InternalAudit] Gagal memuat named range WEBInternalAuditMain:", err);
    return mockInternalAuditRows.map((r) => ({
      ...r,
      avgScoreRaw: parseFloat(r.avgScore.replace("%", "")),
    }));
  }
}

