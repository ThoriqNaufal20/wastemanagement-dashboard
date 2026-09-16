import { NextResponse } from "next/server";
import { prefetchNamedRanges } from "@/lib/google-sheets";
import { getGloveActiveSummary, getGloveActiveDetails } from "@/lib/glove-3r-data";
import { getTimbangan3RSummary, getTimbangan3RDetails } from "@/lib/timbangan-3r-data";
import { getWipKulitSummary, getWipKulitDetails } from "@/lib/timbangan-3r-kulit-data";

export const dynamic = "force-dynamic";

const THREE_R_NAMED_RANGES = [
  "WEBGlove3R",
  "WEBTimbangan3R",
  "WEBTimbangan3RKulit",
];

export async function GET() {
  try {
    await prefetchNamedRanges(THREE_R_NAMED_RANGES);
    const [
      gloveSummary,
      gloveDetails,
      timbanganSummary,
      timbanganDetails,
      wipKulitSummary,
      wipKulitDetails,
    ] = await Promise.all([
      getGloveActiveSummary(),
      getGloveActiveDetails(),
      getTimbangan3RSummary(),
      getTimbangan3RDetails(),
      getWipKulitSummary(),
      getWipKulitDetails(),
    ]);
    return NextResponse.json({
      gloveSummary,
      gloveDetails,
      timbanganSummary,
      timbanganDetails,
      wipKulitSummary,
      wipKulitDetails,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

