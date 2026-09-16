import { PageShell } from "@/components/dashboard/page-shell";
import { DashboardDeptDetailClient } from "@/components/dashboard/dashboard-dept-detail-client";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function DashboardDeptDetailPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  let data: any = {};
  try {
    const res = await fetch(`${protocol}://${host}/api/dashboard-dept-data`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      data = json.data || {};
    }
  } catch (err) {
    console.error("Failed to fetch dashboard dept data via API:", err);
  }

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
