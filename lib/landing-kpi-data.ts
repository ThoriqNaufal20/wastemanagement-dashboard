/**
 * Data Snapshot Terisolasi untuk Section KPI Landing Page.
 * Data ini terpisah dari database / Google Sheets internal
 * untuk menjaga performa (zero-latency) dan keamanan data asli (sanitized snapshot).
 */

export interface KpiScorecardAspect {
  name: string;
  score: number;
  delta?: number;
  direction?: "up" | "down" | "flat";
  minPercent: number;
  targetPercent: number;
}

export interface LandingKpiData {
  scorecard: {
    department: string;
    quarter: string;
    score: number;
    delta: number;
    direction: "up" | "down" | "flat";
    aspects: KpiScorecardAspect[];
    note: string;
  };
  recycled: {
    value: number;
    suffix: string;
    label: string;
  };
  reduction: {
    value: number;
    suffix: string;
    label: string;
  };
  projects: {
    value: number;
    suffix: string;
    label: string;
  };
}

export const LANDING_KPI_SNAPSHOT: LandingKpiData = {
  scorecard: {
    department: "Waste Management",
    quarter: "Q3-2026",
    score: 75.6,
    delta: -2.4,
    direction: "down",
    aspects: [
      { name: "I. Fungsi", score: 76.5, delta: 1.5, direction: "up", minPercent: 72, targetPercent: 76.5 },
      { name: "II. Strategi", score: 78.0, delta: 2.0, direction: "up", minPercent: 74, targetPercent: 78 },
      { name: "III. Information & System", score: 74.0, delta: -3.5, direction: "down", minPercent: 70, targetPercent: 74 },
      { name: "IV. Employee Capabilities", score: 73.5, delta: -4.0, direction: "down", minPercent: 69, targetPercent: 73.5 },
      { name: "V. Performance", score: 77.0, delta: 1.0, direction: "up", minPercent: 73, targetPercent: 77 },
      { name: "VI. Problem Solving", score: 74.8, delta: -2.2, direction: "down", minPercent: 70, targetPercent: 74.8 },
    ],
    note: "Evaluasi Q3 departemen Waste Management mencapai skor akhir 75.6% dengan fokus peningkatan pada efisiensi pemilahan dan kompetensi operasional.",
  },
  recycled: {
    value: 78,
    suffix: "%",
    label: "Recycled",
  },
  reduction: {
    value: 32,
    suffix: "%",
    label: "Waste Reduction",
  },
  projects: {
    value: 24,
    suffix: "",
    label: "Projects",
  },
};

