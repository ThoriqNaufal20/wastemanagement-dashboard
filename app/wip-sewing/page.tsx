import { PageShell } from "@/components/dashboard/page-shell";
import { WipSewingDetailClient } from "@/components/dashboard/wip-sewing-detail-client";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function WipSewingDetailPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  let summary: any[] = [];
  let details: any[] = [];

  try {
    const res = await fetch(`${protocol}://${host}/api/wip-sewing-data`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      summary = json.summary || [];
      details = json.details || [];
    }
  } catch (err) {
    console.error("Failed to fetch wip sewing data via API:", err);
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

