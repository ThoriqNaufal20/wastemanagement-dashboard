import { PageShell } from "@/components/dashboard/page-shell";
import { ThreeRDetailClient } from "@/components/dashboard/three-r-detail-client";
import { headers } from "next/headers";

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

async function loadThreeRDirect() {
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
  return {
    gloveSummary,
    gloveDetails,
    timbanganSummary,
    timbanganDetails,
    wipKulitSummary,
    wipKulitDetails,
  };
}

export default async function ThreeRDetailPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  let gloveSummary = { late: 0, ok: 0, onHold: 0, totalInProgress: 0 };
  let gloveDetails: any[] = [];
  let timbanganSummary = {
    pola: { late: 0, total: 0 },
    logo: { late: 0, total: 0 },
    glove: { late: 0, total: 0 },
    totalPending: 0,
  };
  let timbanganDetails: any[] = [];
  let wipKulitSummary = { late: 0, total: 0 };
  let wipKulitDetails: any[] = [];
  let loadedData: any = null;

  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    try {
      loadedData = await loadThreeRDirect();
    } catch (err) {
      console.error("[ThreeR] Direct load error on Vercel:", err);
    }
  }

  if (!loadedData) {
    try {
      const res = await fetch(`${protocol}://${host}/api/three-r-data`, {
        cache: "no-store",
      });
      if (res.ok) {
        loadedData = await res.json();
      }
    } catch (err) {
      console.error("[ThreeR] Internal API fetch failed:", err);
    }
  }

  if (!loadedData) {
    try {
      loadedData = await loadThreeRDirect();
    } catch (err) {
      console.error("[ThreeR] Fallback direct load failed:", err);
    }
  }

  if (loadedData) {
    gloveSummary = loadedData.gloveSummary || gloveSummary;
    gloveDetails = loadedData.gloveDetails || [];
    timbanganSummary = loadedData.timbanganSummary || timbanganSummary;
    timbanganDetails = loadedData.timbanganDetails || [];
    wipKulitSummary = loadedData.wipKulitSummary || wipKulitSummary;
    wipKulitDetails = loadedData.wipKulitDetails || [];
  }

  return (
    <PageShell
      title="3R (Reduce, Reuse, Recycle)"
      description="Gudang penyimpanan sementara barang reject, timbangan sampah kulit, dan glove active."
      maxWidth="max-w-[1360px]"
    >
      <ThreeRDetailClient
        gloveSummary={gloveSummary}
        gloveDetails={gloveDetails}
        timbanganSummary={timbanganSummary}
        timbanganDetails={timbanganDetails}
        wipKulitSummary={wipKulitSummary}
        wipKulitDetails={wipKulitDetails}
      />
    </PageShell>
  );
}

