import { getNamedRangeData } from "@/lib/google-sheets";
import type {
  QuarterValue,
  ScorecardAspectSeries,
  ScorecardDepartmentData,
} from "@/lib/scorecard-types";

const ASPECT_LABELS: Record<string, string> = {
  FUNGSI: "I. Fungsi",
  STRATEGI: "II. Strategi",
  "INFORMATION & SYSTEM CAPABILITY": "III. Information & system capability",
  "EMPLOYEE CAPABILITIES": "IV. Employee capabilities",
  PERFORMANCE: "V. Performance",
  "PROBLEM SOLVING": "VI. Problem solving",
};

function isFinalScoreAspect(aspect: string | undefined): boolean {
  if (!aspect) return false;
  const a = aspect.trim().toUpperCase();
  return (
    a === "SCORE AKHIR" ||
    a === "SKOR AKHIR" ||
    a === "FINAL SCORE" ||
    a === "TOTAL SCORE" ||
    a.includes("SCORE AKHIR")
  );
}

function parsePercent(value: string | undefined): number | null {
  if (!value || !value.trim()) return null;
  const clean = value.replace("%", "").replace(",", ".").trim();
  const num = parseFloat(clean);
  if (Number.isNaN(num)) return null;
  // Jika formatnya desimal (misal 0.785), konversi ke persen 78.5
  if (num > 0 && num <= 1.0 && !value.includes("%")) {
    return Math.round(num * 1000) / 10;
  }
  return Math.round(num * 10) / 10;
}

function parseQuarterOrder(q: string): number {
  const match = q.match(/Q[-_ ]?(\d)[-_ ]?(\d{4})/i);
  if (match) {
    const quarterNum = parseInt(match[1], 10);
    const year = parseInt(match[2], 10);
    return year * 10 + quarterNum;
  }
  return 0;
}

function getQuarterColumns(headers: string[]): string[] {
  return headers
    .map((h) => h.trim())
    .filter((h) => /^Q[-_ ]?\d[-_ ]?\d{4}$/i.test(h))
    .sort((a, b) => parseQuarterOrder(a) - parseQuarterOrder(b));
}

function getQuarterValue(row: Record<string, string>, quarterCol: string): string | undefined {
  if (row[quarterCol] !== undefined) return row[quarterCol];
  const target = quarterCol.replace(/[-_ ]/g, "").toUpperCase();
  for (const k of Object.keys(row)) {
    if (k.trim().replace(/[-_ ]/g, "").toUpperCase() === target) {
      return row[k];
    }
  }
  return undefined;
}

async function fetchAllScorecardData(): Promise<
  Record<string, ScorecardDepartmentData>
> {
  const rows = await getNamedRangeData("WEBScorecardDept");
  if (rows.length === 0) return {};

  const headers = Object.keys(rows[0]);
  const quarters = getQuarterColumns(headers);

  const departments = Array.from(
    new Set(
      rows
        .map((r) => (r.DEPT || r.DEPARTMENT || r.DEPARTEMEN || "")?.trim())
        .filter(Boolean)
    )
  );

  const result: Record<string, ScorecardDepartmentData> = {};

  departments.forEach((dept) => {
    const deptRows = rows.filter(
      (r) => (r.DEPT || r.DEPARTMENT || r.DEPARTEMEN || "")?.trim() === dept
    );

    const averageRow = deptRows.find((r) => isFinalScoreAspect(r.ASPECT));
    const averageSeries: QuarterValue[] = quarters.map((q) => ({
      quarter: q,
      value: averageRow ? parsePercent(getQuarterValue(averageRow, q)) : null,
    }));

    const aspects: ScorecardAspectSeries[] = deptRows
      .filter((r) => !isFinalScoreAspect(r.ASPECT))
      .map((r) => {
        const aspectKey = r.ASPECT?.trim().toUpperCase() ?? "";
        return {
          aspect: aspectKey,
          label: ASPECT_LABELS[aspectKey] ?? r.ASPECT,
          series: quarters.map((q) => ({
            quarter: q,
            value: parsePercent(getQuarterValue(r, q)),
          })),
        };
      });

    result[dept] = { department: dept, quarters, averageSeries, aspects };
  });

  return result;
}

export async function getAllScorecardData(): Promise<
  Record<string, ScorecardDepartmentData>
> {
  return fetchAllScorecardData();
}
