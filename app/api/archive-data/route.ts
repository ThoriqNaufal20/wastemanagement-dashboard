import { NextResponse } from "next/server";
import { getArchiveItems } from "@/lib/archive-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await getArchiveItems();
    return NextResponse.json({ items });
  } catch (err: any) {
    console.error("[API ArchiveData] Error:", err);
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

