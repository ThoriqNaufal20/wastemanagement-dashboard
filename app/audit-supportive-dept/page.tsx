import { PageShell } from "@/components/dashboard/page-shell";
import { getInternalAuditSupportData } from "@/lib/internal-audit-support-data";
import { AuditSupportView } from "@/components/audit-support/audit-support-view";

export const dynamic = "force-dynamic";

export default async function AuditSupportiveDeptDetailPage() {
  const data = await getInternalAuditSupportData();

  return (
    <PageShell
      title="Internal Audit — Support Team"
      description="Rangkuman temuan audit dan perbaikan (CAP) yang dikoordinasikan dengan Supportive Department antar pabrik."
      maxWidth="max-w-[1440px]"
    >
      <AuditSupportView initialData={data} />
    </PageShell>
  );
}
