import { PageShell } from "@/components/dashboard/page-shell";
import { DashboardDeptDetailClient } from "@/components/dashboard/dashboard-dept-detail-client";
import { getAllDashboardDeptData } from "@/lib/dashboard-dept-data";

export default async function DashboardDeptDetailPage() {
  const data = await getAllDashboardDeptData();
  const departments = Object.keys(data);

  return (
    <PageShell
      title="Dashboard departement"
      description="Rata-rata skor tiap departemen (dihitung dari seluruh aspek), dengan tren dan breakdown antar periode."
    >
      <DashboardDeptDetailClient
        data={data}
        departments={departments}
        defaultDepartment="Waste Management"
      />
    </PageShell>
  );
}
