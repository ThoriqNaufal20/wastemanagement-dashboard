import { PageShell } from "@/components/dashboard/page-shell";
import { getInternalAuditFullData } from "@/lib/internal-audit-data";
import { InternalAuditView } from "@/components/internal-audit/internal-audit-view";

export const dynamic = "force-dynamic";

export default async function InternalAuditDetailPage() {
  const fullData = await getInternalAuditFullData();

  return (
    <PageShell
      title="Internal Audit — Rekap & Detail Temuan"
      description="Rekapitulasi outstanding finding per area/section serta rincian checklist temuan audit dan perbaikan (CAP)."
      maxWidth="max-w-[1440px]"
    >
      <InternalAuditView initialData={fullData} />
    </PageShell>
  );
}


