import { NextResponse } from "next/server";
import { getAllDashboardDeptData } from "@/lib/dashboard-dept-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getAllDashboardDeptData();
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

