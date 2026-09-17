import { PageShell } from "@/components/dashboard/page-shell";
import { ScorecardDetailClient } from "@/components/dashboard/scorecard-detail-client";
import { headers } from "next/headers";

import { getAllScorecardData } from "@/lib/scorecard-data";

export const dynamic = "force-dynamic";

export default async function ScorecardDetailPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  let data: any = null;

  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    try {
      data = await getAllScorecardData();
    } catch (err) {
      console.error("[Scorecard] Direct load error on Vercel:", err);
    }
  }

  if (!data) {
    try {
      const res = await fetch(`${protocol}://${host}/api/scorecard-data`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        data = json.data || {};
      }
    } catch (err) {
      console.error("[Scorecard] Internal API fetch failed:", err);
    }
  }

  if (!data) {
    try {
      data = await getAllScorecardData();
    } catch (err) {
      console.error("[Scorecard] Fallback direct load failed:", err);
      data = {};
    }
  }

  const departments = Object.keys(data);

  return (
    <PageShell
      title="Scorecard departement"
      description="Rata-rata skor departemen, dengan tren, dan breakdown antar kuartal."
    >
      <ScorecardDetailClient
        data={data}
        departments={departments}
        defaultDepartment="Waste Management"
      />
    </PageShell>
  );
}
