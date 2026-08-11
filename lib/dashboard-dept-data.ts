import { unstable_cache } from "next/cache";
import { getNamedRangeData } from "@/lib/google-sheets";
import type {
  QuarterValue,
  ScorecardAspectSeries,
  ScorecardDepartmentData,
} from "@/lib/scorecard-types";

// Format sheet "WEBDashboardDept" (long format, beda dari WEBScorecardDept):
// Period | Departement | Aspect | Point | Score
// Satu baris = satu kombinasi periode + departemen + aspek.
// Tidak ada baris "Score Akhir" — dihitung otomatis di bawah sebagai
// rata-rata seluruh aspek per periode.

function parseNumber(value: string | undefined): number | null {
  if (!value || !value.trim()) return null;
  const num = parseFloat(value.trim());
  return Number.isNaN(num) ? null : num;
}

// Score di sheet berskala 0-1 (contoh: 1 = 100%, 0.6 = 60%). Convert ke persen.
function scoreToPercent(score: number | null): number | null {
  if (score === null) return null;
  return Math.round(score * 10) / 10; // 1 desimal
}

async function fetchAllDashboardDeptData(): Promise<
  Record<string, ScorecardDepartmentData>
> {
  const rows = await getNamedRangeData("WEBDashboardDept");
  if (rows.length === 0) return {};

  // Semua periode unik, urut ascending (Q1-2026 sebelum Q2-2026, dst)
  const periods = Array.from(
    new Set(rows.map((r) => r.Period?.trim()).filter(Boolean))
  ).sort();

  const departments = Array.from(
    new Set(rows.map((r) => r.Departement?.trim()).filter(Boolean))
  );

  const result: Record<string, ScorecardDepartmentData> = {};

  departments.forEach((dept) => {
    const deptRows = rows.filter((r) => r.Departement?.trim() === dept);

    // Daftar aspek unik untuk dept ini, urut sesuai kemunculan pertama di
    // sheet (mengikuti nomor 1-9 yang sudah ada di teks Aspect-nya).
    const aspectLabels: string[] = [];
    deptRows.forEach((r) => {
      const label = r.Aspect?.trim();
      if (label && !aspectLabels.includes(label)) aspectLabels.push(label);
    });

    const aspects: ScorecardAspectSeries[] = aspectLabels.map((label) => {
      const series: QuarterValue[] = periods.map((period) => {
        const row = deptRows.find(
          (r) => r.Period?.trim() === period && r.Aspect?.trim() === label
        );
        return {
          quarter: period,
          value: row ? scoreToPercent(parseNumber(row.Score)) : null,
        };
      });
      return { aspect: label, label, series };
    });

    // Score akhir = rata-rata seluruh aspek per periode (sheet tidak
    // menyediakan baris ini secara langsung).
    const averageSeries: QuarterValue[] = periods.map((period, i) => {
      const values = aspects
        .map((a) => a.series[i]?.value)
        .filter((v): v is number => v !== null && v !== undefined);
      const avg =
        values.length > 0
          ? Math.round(
              (values.reduce((s, v) => s + v, 0) / values.length) * 10
            ) / 10
          : null;
      return { quarter: period, value: avg };
    });

    result[dept] = {
      department: dept,
      quarters: periods,
      averageSeries,
      aspects,
    };
  });

  return result;
}

export const getAllDashboardDeptData = unstable_cache(
  fetchAllDashboardDeptData,
  ["dashboard-dept-data-all"],
  { revalidate: 120 }
);
