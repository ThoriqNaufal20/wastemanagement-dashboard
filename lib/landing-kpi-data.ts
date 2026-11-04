/**
 * Data Snapshot Terisolasi untuk Section KPI Landing Page.
 * Data ini terpisah dari database / Google Sheets internal
 * untuk menjaga performa (zero-latency) dan keamanan data asli (sanitized snapshot).
 */

export interface KpiScorecardAspect {
  name: string;
  score: number;
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
    score: 84.5,
    delta: 3.2,
    direction: "up",
    aspects: [
      { name: "I. Fungsi", score: 85.0, minPercent: 80, targetPercent: 85 },
      { name: "II. Strategi", score: 88.0, minPercent: 82, targetPercent: 88 },
      { name: "III. Information & System", score: 82.5, minPercent: 78, targetPercent: 82.5 },
      { name: "IV. Employee Capabilities", score: 80.0, minPercent: 76, targetPercent: 80 },
      { name: "V. Performance", score: 89.0, minPercent: 83, targetPercent: 89 },
      { name: "VI. Problem Solving", score: 83.0, minPercent: 78, targetPercent: 83 },
    ],
    note: "Pencapaian Q3 didorong oleh optimalisasi pilar Performance dan efisiensi strategi digitalisasi monitoring sampah.",
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

