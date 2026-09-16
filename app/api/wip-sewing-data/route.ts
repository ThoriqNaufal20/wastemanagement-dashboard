import { NextResponse } from "next/server";
import { getWipSewingSummary, getWipSewingDetails } from "@/lib/wip-sewing-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [summary, details] = await Promise.all([
      getWipSewingSummary(),
      getWipSewingDetails(),
    ]);
    return NextResponse.json({ summary, details });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

