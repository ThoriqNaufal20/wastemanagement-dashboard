import { PageShell } from "@/components/dashboard/page-shell";
import { WipSewingDetailClient } from "@/components/dashboard/wip-sewing-detail-client";
import { headers } from "next/headers";

import { getWipSewingSummary, getWipSewingDetails } from "@/lib/wip-sewing-data";

export const dynamic = "force-dynamic";

async function loadWipSewingDirect() {
  const [summary, details] = await Promise.all([
    getWipSewingSummary(),
    getWipSewingDetails(),
  ]);
  return { summary, details };
}

export default async function WipSewingDetailPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  let summary: any[] = [];
  let details: any[] = [];
  let loadedData: any = null;

  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    try {
      loadedData = await loadWipSewingDirect();
    } catch (err) {
      console.error("[WipSewing] Direct load error on Vercel:", err);
    }
  }

  if (!loadedData) {
    try {
      const res = await fetch(`${protocol}://${host}/api/wip-sewing-data`, {
        cache: "no-store",
      });
      if (res.ok) {
        loadedData = await res.json();
      }
    } catch (err) {
      console.error("[WipSewing] Internal API fetch failed:", err);
    }
  }

  if (!loadedData) {
    try {
      loadedData = await loadWipSewingDirect();
    } catch (err) {
      console.error("[WipSewing] Fallback direct load failed:", err);
    }
  }

  if (loadedData) {
    summary = loadedData.summary || [];
    details = loadedData.details || [];
  }

  return (
    <PageShell
      title="WIP Sewing > 7 Hari"
      description="Monitoring barang di area sewing yang sudah lebih dari 7 hari kerja berdasarkan data spreadsheet WEBWIPSewing7Hari."
      maxWidth="max-w-[1360px]"
    >
      <WipSewingDetailClient summary={summary} details={details} />
    </PageShell>
  );
}

