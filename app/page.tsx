import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { CorrectiveActionPlanCard } from "@/components/dashboard/corrective-action-plan-card";
import { KelolosanChartCard } from "@/components/dashboard/kelolosan-chart-card";
import { ProgressShipmentCard } from "@/components/dashboard/progress-shipment-card";
import { WipSewingCard } from "@/components/dashboard/wip-sewing-card";
import { InternalAuditTable } from "@/components/dashboard/internal-audit-table";
import {
  scorecardScore,
  dashboardDeptScore,
  auditSupportiveDept,
  threeR,
} from "@/lib/mock-data";
import { getUrgencyFlags } from "@/lib/urgency";

export default function DashboardPage() {
  const urgency = getUrgencyFlags();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1440px] space-y-6 p-6">
        <DashboardHeader />

        {/* Baris 1 — Ringkasan angka */}
        <section>
          <p className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
            Ringkasan angka
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <MetricCard
              label={`Audit ${urgency.internalAudit.row.fact} · OTS finding`}
              value={urgency.internalAudit.row.otsFinding}
              isUrgent={urgency.internalAudit.isUrgent}
            />
            <MetricCard
              label="Audit support · overdue"
              value={auditSupportiveDept.overdue}
              suffix={`/ ${auditSupportiveDept.inProgress} in-progress`}
              isUrgent={urgency.auditSupportiveDept.isUrgent}
            />
            <MetricCard
              label="3R glove · late"
              value={threeR.gloveActive.late}
              suffix={`/ ${threeR.gloveActive.inProgressTotal} in-progress`}
              isUrgent={urgency.threeRGloveActive.isUrgent}
            />
            <MetricCard
              label="3R WIP kulit · late"
              value={threeR.wipKulit.late}
              suffix={threeR.wipKulit.unit}
              isUrgent={urgency.threeRWipKulit.isUrgent}
            />
            <MetricCard label="Scorecard" value={`${scorecardScore.value}%`} />
            <MetricCard
              label="Dashboard dept"
              value={`${dashboardDeptScore.value}%`}
            />
          </div>
        </section>

        {/* Baris 2 — Grafik */}
        <section>
          <p className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
            Grafik
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <CorrectiveActionPlanCard />
            <KelolosanChartCard />
            <ProgressShipmentCard />
            <WipSewingCard />
          </div>
        </section>

        {/* Baris 3 — Tabel Internal Audit lengkap */}
        <section>
          <InternalAuditTable />
        </section>
      </div>
    </div>
  );
}
