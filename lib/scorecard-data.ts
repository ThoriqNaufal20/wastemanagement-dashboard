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

const FINAL_SCORE_ASPECT = "SCORE AKHIR";

function parsePercent(value: string | undefined): number | null {
  if (!value || !value.trim()) return null;
  const num = parseFloat(value.replace("%", "").trim());
  return Number.isNaN(num) ? null : num;
}

function getQuarterColumns(headers: string[]): string[] {
  return headers.filter((h) => /^Q\d-\d{4}$/.test(h)).sort();
}

async function fetchAllScorecardData(): Promise<
  Record<string, ScorecardDepartmentData>
> {
  const rows = await getNamedRangeData("WEBScorecardDept");
  if (rows.length === 0) return {};

  const headers = Object.keys(rows[0]);
  const quarters = getQuarterColumns(headers);

  const departments = Array.from(
    new Set(rows.map((r) => r.DEPT?.trim()).filter(Boolean))
  );

  const result: Record<string, ScorecardDepartmentData> = {};

  departments.forEach((dept) => {
    const deptRows = rows.filter((r) => r.DEPT?.trim() === dept);

    const averageRow = deptRows.find(
      (r) => r.ASPECT?.trim().toUpperCase() === FINAL_SCORE_ASPECT
    );
    const averageSeries: QuarterValue[] = quarters.map((q) => ({
      quarter: q,
      value: averageRow ? parsePercent(averageRow[q]) : null,
    }));

    const aspects: ScorecardAspectSeries[] = deptRows
      .filter((r) => r.ASPECT?.trim().toUpperCase() !== FINAL_SCORE_ASPECT)
      .map((r) => {
        const aspectKey = r.ASPECT?.trim().toUpperCase() ?? "";
        return {
          aspect: aspectKey,
          label: ASPECT_LABELS[aspectKey] ?? r.ASPECT,
          series: quarters.map((q) => ({
            quarter: q,
            value: parsePercent(r[q]),
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
