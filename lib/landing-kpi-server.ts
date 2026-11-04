import "server-only";
import { getAllScorecardData } from "@/lib/scorecard-data";
import { computeTrend } from "@/lib/scorecard-types";
import {
  LANDING_KPI_SNAPSHOT,
  type LandingKpiData,
  type KpiScorecardAspect,
} from "@/lib/landing-kpi-data";

/**
 * Mengambil data scorecard departemen Waste Management secara aman di server side,
 * lalu men-transformasinya menjadi satu objek snapshot publik yang bersih.
 */
export async function getLandingKpiData(): Promise<LandingKpiData> {
  try {
    const allScorecards = await getAllScorecardData();
    const deptKeys = Object.keys(allScorecards);

    // Cari departemen Waste Management
    const wmKey = deptKeys.find(
      (k) =>
        k.toLowerCase().includes("waste management") ||
        k.toLowerCase() === "wm" ||
        k.toLowerCase().includes("waste")
    );

    if (!wmKey || !allScorecards[wmKey]) {
      return LANDING_KPI_SNAPSHOT;
    }

    const wmDept = allScorecards[wmKey];
    const trend = computeTrend(wmDept.averageSeries);

    const latestScore = trend.latest ?? LANDING_KPI_SNAPSHOT.scorecard.score;
    const latestQuarter =
      trend.latestQuarter ??
      wmDept.quarters[wmDept.quarters.length - 1] ??
      "Q3-2026";

    // Ambil indeks kuartal terbaru
    const qIndex = wmDept.quarters.indexOf(latestQuarter);

    const aspects: KpiScorecardAspect[] =
      wmDept.aspects.length > 0
        ? wmDept.aspects.map((asp) => {
            const rawVal = qIndex >= 0 ? asp.series[qIndex]?.value : null;
            const score = rawVal ?? 75.0;
            return {
              name: asp.label || asp.aspect,
              score,
              minPercent: Math.max(0, Math.round(score - 5)),
              targetPercent: score,
            };
          })
        : LANDING_KPI_SNAPSHOT.scorecard.aspects;

    return {
      ...LANDING_KPI_SNAPSHOT,
      scorecard: {
        department: "Waste Management",
        quarter: latestQuarter,
        score: latestScore,
        delta: trend.delta,
        direction: trend.direction,
        aspects,
        note: `Evaluasi ${latestQuarter} departemen Waste Management mencapai skor akhir ${latestScore.toFixed(
          1
        )}% dari baris skor akhir spreadsheet.`,
      },
    };
  } catch (error) {
    console.warn("[LandingKPI] Fallback ke snapshot statis:", error);
    return LANDING_KPI_SNAPSHOT;
  }
}

