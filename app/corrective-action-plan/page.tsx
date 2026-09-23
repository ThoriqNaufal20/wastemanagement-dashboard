import { PageShell } from "@/components/dashboard/page-shell";
import { CapDetailClient } from "@/components/dashboard/cap-detail-client";
import { getAllCapItems } from "@/lib/cap-data";

export const dynamic = "force-dynamic";

export default async function CorrectiveActionPlanDetailPage() {
  const capItems = await getAllCapItems();

  return (
    <PageShell
      title="Corrective Action Plan (CAP)"
      description="Database temuan masalah, analisa penyebab, tindakan pencegahan, dan rasio klasifikasi kategori (Material, Man, Method, Machine)."
    >
      <CapDetailClient initialItems={capItems} />
    </PageShell>
  );
}
