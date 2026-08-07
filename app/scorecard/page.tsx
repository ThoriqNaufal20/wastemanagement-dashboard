import { PageShell } from "@/components/dashboard/page-shell";
import { ScorecardDetailClient } from "@/components/dashboard/scorecard-detail-client";
import { getAllScorecardData } from "@/lib/scorecard-data";

export default async function ScorecardDetailPage() {
  const data = await getAllScorecardData();
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
