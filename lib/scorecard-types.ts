// Tipe data & helper murni (tanpa dependency googleapis) — aman diimpor
// dari client component. Kode yang benar-benar fetch ke Google Sheets
// tetap di lib/scorecard-data.ts dan lib/dashboard-dept-data.ts (server-only).

export interface QuarterValue {
  quarter: string;
  value: number | null;
}

export interface ScorecardAspectSeries {
  aspect: string;
  label: string;
  series: QuarterValue[];
}

export interface ScorecardDepartmentData {
  department: string;
  quarters: string[];
  averageSeries: QuarterValue[];
  aspects: ScorecardAspectSeries[];
}

export interface Trend {
  direction: "up" | "down" | "flat";
  delta: number;
  latest: number | null;
}

export function computeTrend(series: QuarterValue[]): Trend {
  const filled = series.filter((s) => s.value !== null);
  if (filled.length < 2) {
    return { direction: "flat", delta: 0, latest: filled[0]?.value ?? null };
  }
  const latest = filled[filled.length - 1].value as number;
  const previous = filled[filled.length - 2].value as number;
  const delta = Math.round((latest - previous) * 10) / 10;
  return {
    direction: delta > 0 ? "up" : delta < 0 ? "down" : "flat",
    delta,
    latest,
  };
}

function averageValues(values: (number | null | undefined)[]): number | null {
  const filled = values.filter((v): v is number => v !== null && v !== undefined);
  if (filled.length === 0) return null;
  return Math.round((filled.reduce((s, v) => s + v, 0) / filled.length) * 10) / 10;
}

/**
 * Gabungkan data semua departemen jadi satu rata-rata gabungan
 * ("Semua departemen"). Dipakai di halaman utama (ringkasan) dan
 * sebagai opsi default di halaman detail Scorecard/Dashboard Dept.
 */
export function buildAllDepartmentsAverage(
  data: Record<string, ScorecardDepartmentData>
): ScorecardDepartmentData | null {
  const depts = Object.values(data);
  if (depts.length === 0) return null;

  const quarters = depts[0].quarters;

  const averageSeries: QuarterValue[] = quarters.map((quarter, i) => ({
    quarter,
    value: averageValues(depts.map((d) => d.averageSeries[i]?.value)),
  }));

  const aspectKeys = depts[0].aspects.map((a) => a.aspect);
  const aspects: ScorecardAspectSeries[] = aspectKeys.map((aspectKey, idx) => {
    const label = depts[0].aspects[idx].label;
    const series: QuarterValue[] = quarters.map((quarter, i) => ({
      quarter,
      value: averageValues(
        depts.map((d) => d.aspects.find((a) => a.aspect === aspectKey)?.series[i]?.value)
      ),
    }));
    return { aspect: aspectKey, label, series };
  });

  return { department: "Semua departemen", quarters, averageSeries, aspects };
}
