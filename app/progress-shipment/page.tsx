import { PageShell } from "@/components/dashboard/page-shell";
import { ProgressShipmentDetailClient } from "@/components/dashboard/progress-shipment-detail-client";
import { getAllProgressShipmentData } from "@/lib/progress-shipment-data";
import { headers } from "next/headers";
import type {
  ProgressShipmentChartItem,
  ProgressShipmentSummary,
  ProgressShipmentDetailItem,
} from "@/lib/progress-shipment-types";

export const dynamic = "force-dynamic";

async function loadProgressShipmentDirect() {
  return getAllProgressShipmentData();
}

export default async function ProgressShipmentDetailPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  let chartData: ProgressShipmentChartItem[] = [];
  let summary: ProgressShipmentSummary = {
    totalHutangProd: 0,
    totalHutangCarton: 0,
    totalHutang: 0,
    cartonShare: 0,
    isAttention: false,
    totalInvoices: 0,
  };
  let details: ProgressShipmentDetailItem[] = [];
  let loadedData: any = null;

  // Di Vercel / Production: gunakan direct call
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    try {
      loadedData = await loadProgressShipmentDirect();
    } catch (err) {
      console.error("[ProgressShipment] Direct load error on Vercel:", err);
    }
  }

  // Jika belum ada data (misal di local dev Windows): gunakan internal API
  if (!loadedData) {
    try {
      const res = await fetch(`${protocol}://${host}/api/progress-shipment-data`, {
        cache: "no-store",
      });
      if (res.ok) {
        loadedData = await res.json();
      }
    } catch (err) {
      console.error("[ProgressShipment] Internal API fetch failed:", err);
    }
  }

  // Fallback terakhir jika API route gagal
  if (!loadedData) {
    try {
      loadedData = await loadProgressShipmentDirect();
    } catch (err) {
      console.error("[ProgressShipment] Fallback direct load failed:", err);
    }
  }

  if (loadedData) {
    chartData = loadedData.chartData || [];
    summary = loadedData.summary || summary;
    details = loadedData.details || [];
  }

  return (
    <PageShell
      title="Progress Shipment Minggu Depan"
      description="Monitoring hutang produksi dan hutang carton per minggu pengiriman berdasarkan data spreadsheet WEBProgressShipment."
      maxWidth="max-w-[1360px]"
    >
      <ProgressShipmentDetailClient
        chartData={chartData}
        summary={summary}
        details={details}
      />
    </PageShell>
  );
}
