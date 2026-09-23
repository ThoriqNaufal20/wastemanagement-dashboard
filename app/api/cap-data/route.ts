import { NextResponse } from "next/server";
import { getAllCapItems, getCapDashboardData } from "@/lib/cap-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");

    if (yearParam) {
      const year = parseInt(yearParam, 10);
      const dashboardData = await getCapDashboardData(year);
      return NextResponse.json(dashboardData);
    }

    const items = await getAllCapItems();
    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("[API CAP] Error fetching CAP data:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch CAP data" },
      { status: 500 }
    );
  }
}

