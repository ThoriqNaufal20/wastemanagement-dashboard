import { NextResponse } from "next/server";
import { getAllProgressShipmentData } from "@/lib/progress-shipment-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getAllProgressShipmentData();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[API ProgressShipment] Error:", err);
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

