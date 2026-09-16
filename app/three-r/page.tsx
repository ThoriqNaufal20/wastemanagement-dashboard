import { PageShell } from "@/components/dashboard/page-shell";
import { ThreeRDetailClient } from "@/components/dashboard/three-r-detail-client";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

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

  try {
    const res = await fetch(`${protocol}://${host}/api/three-r-data`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      gloveSummary = json.gloveSummary || gloveSummary;
      gloveDetails = json.gloveDetails || [];
      timbanganSummary = json.timbanganSummary || timbanganSummary;
      timbanganDetails = json.timbanganDetails || [];
      wipKulitSummary = json.wipKulitSummary || wipKulitSummary;
      wipKulitDetails = json.wipKulitDetails || [];
    }
  } catch (err) {
    console.error("Failed to fetch three-r data via API:", err);
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

