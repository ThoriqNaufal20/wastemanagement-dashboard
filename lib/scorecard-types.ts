// Tipe data & helper murni (tanpa dependency googleapis) — aman diimpor
// dari client component. Kode yang benar-benar fetch ke Google Sheets
// tetap di lib/scorecard-data.ts (server-only).

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
