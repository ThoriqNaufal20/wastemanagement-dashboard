import { NextResponse } from "next/server";
import { prefetchNamedRanges } from "@/lib/google-sheets";
import { getAllScorecardData } from "@/lib/scorecard-data";
import { getAllDashboardDeptData } from "@/lib/dashboard-dept-data";
import { getGloveActiveSummary } from "@/lib/glove-3r-data";
import { getTimbangan3RSummary } from "@/lib/timbangan-3r-data";
import { getWipKulitSummary, getKelolosanChartData } from "@/lib/timbangan-3r-kulit-data";
import { getWipSewingSummary } from "@/lib/wip-sewing-data";
import {
  getProgressShipmentChartData,
  getProgressShipmentSummary,
} from "@/lib/progress-shipment-data";
import { getCapDashboardData } from "@/lib/cap-data";

export const dynamic = "force-dynamic";

const DASHBOARD_NAMED_RANGES = [
  "WEBScorecardDept",
  "WEBDashboardDept",
  "WEBGlove3R",
  "WEBTimbangan3R",
  "WEBTimbangan3RKulit",
  "WEBWIPSewing7Hari",
  "WEBProgressShipment",
  "WEBCAP",
];

export async function GET() {
  try {
    await prefetchNamedRanges(DASHBOARD_NAMED_RANGES);

    const [
      scorecardData,
      dashboardDeptData,
      gloveActive,
      timbangan3R,
      wipKulit,
      kelolosanData,
      wipSewingData,
      progressShipmentChart,
      progressShipmentSummary,
      capData,
    ] = await Promise.all([
      getAllScorecardData(),
      getAllDashboardDeptData(),
      getGloveActiveSummary(),
      getTimbangan3RSummary(),
      getWipKulitSummary(),
      getKelolosanChartData(),
      getWipSewingSummary(),
      getProgressShipmentChartData("next week"),
      getProgressShipmentSummary("next week"),
      getCapDashboardData(2026),
    ]);

    return NextResponse.json({
      scorecardData,
      dashboardDeptData,
      gloveActive,
      timbangan3R,
      wipKulit,
      kelolosanData,
      wipSewingData,
      progressShipmentChart,
      progressShipmentSummary,
      capData,
    });
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

