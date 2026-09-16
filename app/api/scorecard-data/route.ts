import { NextResponse } from "next/server";
import { getAllScorecardData } from "@/lib/scorecard-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getAllScorecardData();
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

