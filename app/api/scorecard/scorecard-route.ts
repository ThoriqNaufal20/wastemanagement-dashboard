import { NextResponse } from "next/server";
import { getScorecardData } from "@/lib/scorecard-data";

export async function GET() {
  try {
    const data = await getScorecardData();

    if (!data) {
      return NextResponse.json(
        { error: "Data scorecard tidak ditemukan di named range WEBScorecardDept" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Gagal fetch data scorecard:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dari Google Sheets" },
      { status: 500 }
    );
  }
}
