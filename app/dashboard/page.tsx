import {
  ClipboardList,
  Users,
  Recycle,
  PauseCircle,
  Layers,
  Tag,
  Box,
  Hand,
  Clock,
  FileText,
  LayoutDashboard,
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
import { getGloveActiveSummary } from "@/lib/glove-3r-data";
import { getTimbangan3RSummary } from "@/lib/timbangan-3r-data";
import { computeTrend, buildAllDepartmentsAverage } from "@/lib/scorecard-types";
import type { StatusLevel } from "@/components/dashboard/status-chip";

const SEVERITY_WEIGHT: Record<string, number> = {
  late: 3,
  overdue: 3,
  attention: 2,
  on_progress: 1,
  pending: 1,
  none: 0,
};

// Helper dengan tipe balik eksplisit — mencegah TypeScript "melebarkan"
// literal "late"/"on_progress" jadi string biasa di dalam array literal.
function wipStatus(late: number, total: number): StatusLevel | undefined {
  if (total === 0) return undefined;
  return late > 0 ? "late" : "on_progress";
}

type RingkasanItem = {
  key: string;
  label: string;
  value: string | number;
  suffix?: string;
  status: StatusLevel | undefined;
  icon: typeof ClipboardList;
  href: string;
  hasData: boolean;
};

export default async function DashboardPage() {
  const urgency = getUrgencyFlags();

  const [scorecardData, dashboardDeptData, gloveActive, timbangan3R] = await Promise.all([
    getAllScorecardData(),
    getAllDashboardDeptData(),
    getGloveActiveSummary(),
    getTimbangan3RSummary(),
  ]);

  const scorecardAllDept = buildAllDepartmentsAverage(scorecardData);
  const dashboardDeptAllDept = buildAllDepartmentsAverage(dashboardDeptData);

  const scorecardTrend = scorecardAllDept ? computeTrend(scorecardAllDept.averageSeries) : null;
  const dashboardDeptTrend = dashboardDeptAllDept
    ? computeTrend(dashboardDeptAllDept.averageSeries)
    : null;

  const scorecardValue = scorecardTrend?.latest ?? null;
  const dashboardDeptValue = dashboardDeptTrend?.latest ?? null;

  const problemItems: RingkasanItem[] = [
    {
      key: "internal-audit",
      label: `Audit ${urgency.internalAudit.row.fact} · OTS finding`,
      value: urgency.internalAudit.row.otsFinding,
      suffix: undefined,
      status: urgency.internalAudit.status ?? undefined,
      icon: ClipboardList,
      href: "/internal-audit",
      hasData: urgency.internalAudit.status !== null,
    },
    {
      key: "audit-support",
      label: "Audit support · overdue",
      value: auditSupportiveDept.overdue,
      suffix: `/ ${auditSupportiveDept.inProgress} in-progress`,
      status: urgency.auditSupportiveDept.status ?? undefined,
      icon: Users,
      href: "/audit-supportive-dept",
      hasData: urgency.auditSupportiveDept.status !== null,
    },
    // ---------- 3R Glove Active — data ASLI dari WEBGlove3R (Opsi C: teks biasa, bukan pecahan) ----------
    {
      key: "3r-glove-active-late",
      label: "3R glove active",
      value: gloveActive.late,
      suffix: "permintaan telat",
      status: gloveActive.late > 0 ? "late" : undefined,
      icon: Recycle,
      href: "/three-r",
      hasData: gloveActive.late > 0,
    },
    {
      key: "3r-glove-active-pending",
      label: "3R glove active",
      value: gloveActive.onHold,
      suffix: "menunggu diproses",
      status: gloveActive.onHold > 0 ? "pending" : undefined,
      icon: PauseCircle,
      href: "/three-r",
      hasData: gloveActive.onHold > 0,
    },
    // ---------- Sisa 3R lain — masih data dummy, belum disambungkan ----------
    {
      key: "3r-wip-kulit",
      label: "3R WIP kulit · late",
      value: threeR.wipKulit.late,
      suffix: threeR.wipKulit.unit,
      status: urgency.threeRWipKulit.status ?? undefined,
      icon: Layers,
      href: "/three-r",
      hasData: urgency.threeRWipKulit.status !== null,
    },
    // ---------- 3R WIP Logo/Pola/Glove — data ASLI dari WEBTimbangan3R ----------
    // Tetap muncul selama ada aktivitas (total > 0), bukan cuma saat late.
    // Kalau late=0 tapi total>0 → status "on_progress" (netral, tanpa pulse).
    {
      key: "3r-wip-logo",
      label: "3R WIP logo · late",
      value: timbangan3R.logo.late,
      suffix: `/ ${timbangan3R.logo.total} in progress`,
      status: wipStatus(timbangan3R.logo.late, timbangan3R.logo.total),
      icon: Tag,
      href: "/three-r",
      hasData: timbangan3R.logo.total > 0,
    },
    {
      key: "3r-wip-pola",
      label: "3R WIP pola · late",
      value: timbangan3R.pola.late,
      suffix: `/ ${timbangan3R.pola.total} in progress`,
      status: wipStatus(timbangan3R.pola.late, timbangan3R.pola.total),
      icon: Box,
      href: "/three-r",
      hasData: timbangan3R.pola.total > 0,
    },
    {
      key: "3r-wip-glove",
      label: "3R WIP glove · late",
      value: timbangan3R.glove.late,
      suffix: `/ ${timbangan3R.glove.total} in progress`,
      status: wipStatus(timbangan3R.glove.late, timbangan3R.glove.total),
      icon: Hand,
      href: "/three-r",
      hasData: timbangan3R.glove.total > 0,
    },
    // WIP Pending — GABUNGAN Pola+Logo+Glove, 1 card, format Opsi C ("N pending")
    {
      key: "3r-wip-pending",
      label: "3R WIP pending",
      value: timbangan3R.totalPending,
      suffix: "pending",
      status: timbangan3R.totalPending > 0 ? "pending" : undefined,
      icon: Clock,
      href: "/three-r",
      hasData: timbangan3R.totalPending > 0,
    },
  ].filter((item) => item.hasData);

  const infoItems: RingkasanItem[] = [
    {
      key: "scorecard",
      label: "Scorecard",
      value: scorecardValue !== null ? `${scorecardValue}%` : "-",
      suffix: undefined,
      status: undefined,
      icon: FileText,
      href: "/scorecard",
      hasData: scorecardValue !== null,
    },
    {
      key: "dashboard-dept",
      label: "Dashboard dept",
      value: dashboardDeptValue !== null ? `${dashboardDeptValue}%` : "-",
      suffix: undefined,
      status: undefined,
      icon: LayoutDashboard,
      href: "/dashboard-departement",
      hasData: dashboardDeptValue !== null,
    },
  ].filter((item) => item.hasData);

  const ringkasanItems = [...problemItems, ...infoItems].sort(
    (a, b) => SEVERITY_WEIGHT[b.status ?? "none"] - SEVERITY_WEIGHT[a.status ?? "none"]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1440px] space-y-8 p-6 pb-28">
        <DashboardHeader />

        <section>
          <p className="mb-3 text-[11px] uppercase tracking-wide text-muted-foreground">
            Ringkasan angka
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
            {ringkasanItems.map((item) => (
              <MetricCard
                key={item.key}
                label={item.label}
                value={item.value}
                suffix={item.suffix}
                status={item.status}
                icon={item.icon}
                href={item.href}
              />
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 text-[11px] uppercase tracking-wide text-muted-foreground">
            Trend & distribusi
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
