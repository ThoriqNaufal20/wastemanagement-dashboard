import {
  ClipboardList,
  Users,
  Recycle,
  Layers,
  Tag,
  Box,
  Hand,
  Clock,
  FileText,
  LayoutDashboard,
  Truck,
  Package,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ScrollReveal } from "@/components/dashboard/scroll-reveal";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ProgressShipmentCard } from "@/components/dashboard/progress-shipment-card";
import { WipSewingCard } from "@/components/dashboard/wip-sewing-card";
import { KelolosanChartCard } from "@/components/dashboard/kelolosan-chart-card";
import { CorrectiveActionPlanCard } from "@/components/dashboard/corrective-action-plan-card";
import { InternalAuditTable } from "@/components/dashboard/internal-audit-table";
import { auditSupportiveDept, threeR } from "@/lib/mock-data";
import { getUrgencyFlags } from "@/lib/urgency";
import { getAllScorecardData } from "@/lib/scorecard-data";
import { getAllDashboardDeptData } from "@/lib/dashboard-dept-data";
import { computeTrend, buildAllDepartmentsAverage } from "@/lib/scorecard-types";

export default async function DashboardPage() {
  const urgency = getUrgencyFlags();

  const [scorecardData, dashboardDeptData] = await Promise.all([
    getAllScorecardData(),
    getAllDashboardDeptData(),
  ]);

  const scorecardAllDept = buildAllDepartmentsAverage(scorecardData);
  const dashboardDeptAllDept = buildAllDepartmentsAverage(dashboardDeptData);

  const scorecardTrend = scorecardAllDept ? computeTrend(scorecardAllDept.averageSeries) : null;
  const dashboardDeptTrend = dashboardDeptAllDept
    ? computeTrend(dashboardDeptAllDept.averageSeries)
    : null;

  const scorecardValue = scorecardTrend?.latest ?? null;
  const dashboardDeptValue = dashboardDeptTrend?.latest ?? null;

  const ringkasanItems = [
    {
      key: "internal-audit",
      label: `Audit ${urgency.internalAudit.row.fact} · OTS finding`,
      value: urgency.internalAudit.row.otsFinding,
      suffix: undefined,
      isUrgent: urgency.internalAudit.isUrgent,
      icon: ClipboardList,
      href: "/internal-audit",
      hasData: true,
    },
    {
      key: "audit-support",
      label: "Audit support · overdue",
      value: auditSupportiveDept.overdue,
      suffix: `/ ${auditSupportiveDept.inProgress} in-progress`,
      isUrgent: urgency.auditSupportiveDept.isUrgent,
      icon: Users,
      href: "/audit-supportive-dept",
      hasData: true,
    },
    {
      key: "3r-glove-active",
      label: "3R glove active · late",
      value: threeR.gloveActive.late,
      suffix: `/ ${threeR.gloveActive.inProgressTotal} in-progress`,
      isUrgent: urgency.threeRGloveActive.isUrgent,
      icon: Recycle,
      href: "/three-r",
      hasData: threeR.gloveActive.inProgressTotal > 0 || threeR.gloveActive.late > 0,
    },
    {
      key: "3r-wip-kulit",
      label: "3R WIP kulit · late",
      value: threeR.wipKulit.late,
      suffix: threeR.wipKulit.unit,
      isUrgent: urgency.threeRWipKulit.isUrgent,
      icon: Layers,
      href: "/three-r",
      hasData: threeR.wipKulit.inProgressTotal > 0 || threeR.wipKulit.late > 0,
    },
    {
      key: "3r-wip-logo",
      label: "3R WIP logo · late",
      value: threeR.wipLogo.late,
      suffix: `/ ${threeR.wipLogo.inProgressTotal} in-progress`,
      isUrgent: urgency.threeRWipLogo.isUrgent,
      icon: Tag,
      href: "/three-r",
      hasData: threeR.wipLogo.inProgressTotal > 0 || threeR.wipLogo.late > 0,
    },
    {
      key: "3r-wip-pola",
      label: "3R WIP pola · late",
      value: threeR.wipPola.late,
      suffix: `/ ${threeR.wipPola.inProgressTotal} in-progress`,
      isUrgent: urgency.threeRWipPola.isUrgent,
      icon: Box,
      href: "/three-r",
      hasData: threeR.wipPola.inProgressTotal > 0 || threeR.wipPola.late > 0,
    },
    {
      key: "3r-wip-glove",
      label: "3R WIP glove · late",
      value: threeR.wipGlove.late,
      suffix: `/ ${threeR.wipGlove.inProgressTotal} in-progress`,
      isUrgent: urgency.threeRWipGlove.isUrgent,
      icon: Hand,
      href: "/three-r",
      hasData: threeR.wipGlove.inProgressTotal > 0 || threeR.wipGlove.late > 0,
    },
    {
      key: "3r-wip-pending",
      label: "3R WIP pending · late",
      value: threeR.wipPending.late,
      suffix: `/ ${threeR.wipPending.inProgressTotal} in-progress`,
      isUrgent: urgency.threeRWipPending.isUrgent,
      icon: Clock,
      href: "/three-r",
      hasData: threeR.wipPending.inProgressTotal > 0 || threeR.wipPending.late > 0,
    },
    {
      key: "scorecard",
      label: "Scorecard",
      value: scorecardValue !== null ? `${scorecardValue}%` : "-",
      suffix: undefined,
      isUrgent: false,
      icon: FileText,
      href: "/scorecard",
      hasData: scorecardValue !== null,
    },
    {
      key: "dashboard-dept",
      label: "Dashboard dept",
      value: dashboardDeptValue !== null ? `${dashboardDeptValue}%` : "-",
      suffix: undefined,
      isUrgent: false,
      icon: LayoutDashboard,
      href: "/dashboard-departement",
      hasData: dashboardDeptValue !== null,
    },
    ...(urgency.progressShipment.isUrgent
      ? [
          {
            key: "progress-shipment-urgent",
            label: "Shipment belum kirim",
            value: urgency.progressShipment.total,
            suffix: "pcs",
            isUrgent: true,
            icon: Truck,
            href: "/progress-shipment",
            hasData: true,
          },
        ]
      : []),
    ...urgency.wipSewing.criticalLines.map((line) => ({
      key: `wip-sewing-urgent-${line.line}`,
      label: `WIP sewing line ${line.line}`,
      value: line.qty,
      suffix: "pcs",
      isUrgent: true,
      icon: Package,
      href: "/wip-sewing",
      hasData: true,
    })),
  ]
    .filter((item) => item.hasData)
    .sort((a, b) => Number(b.isUrgent) - Number(a.isUrgent));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1440px] space-y-6 p-6 pb-28">
        <DashboardHeader />

        <section>
          <p className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
            Ringkasan angka
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
            {ringkasanItems.map((item) => (
              <MetricCard
                key={item.key}
                label={item.label}
                value={item.value}
                suffix={item.suffix}
                isUrgent={item.isUrgent}
                icon={item.icon}
                href={item.href}
              />
            ))}
          </div>
        </section>

        <section>
          <p className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
            Grafik
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ScrollReveal>
              <ProgressShipmentCard />
            </ScrollReveal>
            <ScrollReveal>
              <WipSewingCard />
            </ScrollReveal>
            <ScrollReveal>
              <KelolosanChartCard />
            </ScrollReveal>
            <ScrollReveal>
              <CorrectiveActionPlanCard />
            </ScrollReveal>
          </div>
        </section>

        <section>
          <InternalAuditTable />
        </section>
      </div>
    </div>
  );
}
