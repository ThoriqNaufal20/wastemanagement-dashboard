import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { auditSupportiveDept } from "@/lib/mock-data";

export default function AuditSupportiveDeptDetailPage() {
  return (
    <PageShell
      title="Internal audit supportive dept"
      description="Kolaborasi antar departemen untuk menyelesaikan temuan audit."
    >
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Overdue</p>
            <p className="text-2xl font-semibold text-status-critical">
              {auditSupportiveDept.overdue}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Total in-progress</p>
            <p className="text-2xl font-semibold text-foreground">
              {auditSupportiveDept.inProgress}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Rencana konten lanjutan:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Breakdown per departemen (MF, HSE, MT, Quality, dst)</li>
            <li>Status detail: shared with team, on hold (pending), overdue</li>
            <li>Panel tanya AI kontekstual</li>
          </ul>
        </CardContent>
      </Card>
    </PageShell>
  );
}
