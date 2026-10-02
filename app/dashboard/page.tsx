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
  type LucideIcon,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ScrollReveal } from "@/components/dashboard/scroll-reveal";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ProgressShipmentCard } from "@/components/dashboard/progress-shipment-card";
import { WipSewingCard } from "@/components/dashboard/wip-sewing-card";
import { KelolosanChartCard } from "@/components/dashboard/kelolosan-chart-card";
import { CorrectiveActionPlanCard } from "@/components/dashboard/corrective-action-plan-card";
import { InternalAuditTable } from "@/components/dashboard/internal-audit-table";
import { auditSupportiveDept } from "@/lib/mock-data";
import { getUrgencyFlags } from "@/lib/urgency";
import { computeTrend, buildAllDepartmentsAverage } from "@/lib/scorecard-types";
import type { StatusLevel } from "@/components/dashboard/status-chip";
import { headers } from "next/headers";

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

function statusOrUndefined(condition: boolean, status: StatusLevel): StatusLevel | undefined {
  return condition ? status : undefined;
}

type RingkasanItem = {
  key: string;
  label: string;
  value: string | number;
  suffix?: string;
  status: StatusLevel | undefined;
  icon: LucideIcon;
  href: string;
  hasData: boolean;
};

import { getAllScorecardData } from "@/lib/scorecard-data";
import { getAllDashboardDeptData } from "@/lib/dashboard-dept-data";
import { getGloveActiveSummary } from "@/lib/glove-3r-data";
import { getTimbangan3RSummary } from "@/lib/timbangan-3r-data";
import { getWipKulitSummary, getKelolosanChartData } from "@/lib/timbangan-3r-kulit-data";
import { getWipSewingSummary } from "@/lib/wip-sewing-data";
import {
  getProgressShipmentChartData,
  getProgressShipmentSummary,
} from "@/lib/progress-shipment-data";
import type {
  ProgressShipmentChartItem,
  ProgressShipmentSummary,
} from "@/lib/progress-shipment-types";
import { getCapDashboardData } from "@/lib/cap-data";
import type { CapDashboardData } from "@/lib/cap-types";
import { getInternalAuditMainData } from "@/lib/internal-audit-data";
import type { InternalAuditRow } from "@/lib/internal-audit-types";
import { prefetchNamedRanges } from "@/lib/google-sheets";

const DASHBOARD_NAMED_RANGES = [
  "WEBScorecardDept",
  "WEBDashboardDept",
  "WEBGlove3R",
  "WEBTimbangan3R",
  "WEBTimbangan3RKulit",
  "WEBWIPSewing7Hari",
  "WEBProgressShipment",
  "WEBCAP",
  "WEBInternalAuditMain",
];

async function loadDashboardDataDirect() {
  await prefetchNamedRanges(DASHBOARD_NAMED_RANGES);
  const [
    scorecardData,
    dashboardDeptData,
    gloveActive,
    timbangan3R,
    wipKulit,
    kelolosanData,
    wipSewingData,
    progressShipmentChart,
    progressShipmentSummary,
    capData,
    internalAuditData,
  ] = await Promise.all([
    getAllScorecardData(),
    getAllDashboardDeptData(),
    getGloveActiveSummary(),
    getTimbangan3RSummary(),
    getWipKulitSummary(),
    getKelolosanChartData(),
    getWipSewingSummary(),
    getProgressShipmentChartData("next week"),
    getProgressShipmentSummary("next week"),
    getCapDashboardData(2026),
    getInternalAuditMainData(),
  ]);

  return {
    scorecardData,
    dashboardDeptData,
    gloveActive,
    timbangan3R,
    wipKulit,
    kelolosanData,
    wipSewingData,
    progressShipmentChart,
    progressShipmentSummary,
    capData,
    internalAuditData,
  };
}

export default async function DashboardPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  let scorecardData: any = {};
  let dashboardDeptData: any = {};
  let gloveActive = { late: 0, ok: 0, onHold: 0, totalInProgress: 0 };
  let timbangan3R = {
    pola: { late: 0, total: 0 },
    logo: { late: 0, total: 0 },
    glove: { late: 0, total: 0 },
    totalPending: 0,
  };
  let wipKulit = { late: 0, total: 0 };
  let kelolosanData: any[] = [];
  let wipSewingData: any[] = [];
  let progressShipmentChart: ProgressShipmentChartItem[] = [];
  let progressShipmentSummary: ProgressShipmentSummary | undefined = undefined;
  let capData: CapDashboardData | undefined = undefined;
  let internalAuditData: InternalAuditRow[] = [];

  let loadedData: any = null;

  // Di Vercel / Production: gunakan direct call (cepat, serverless-native, bebas blokir proteksi Vercel)
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    try {
      loadedData = await loadDashboardDataDirect();
    } catch (err) {
      console.error("[Dashboard] Direct load error on Vercel:", err);
    }
  }

  // Jika belum ada data (misal di local dev Windows): gunakan internal API
  if (!loadedData) {
    try {
      const res = await fetch(`${protocol}://${host}/api/dashboard-data`, {
        cache: "no-store",
      });
      if (res.ok) {
        loadedData = await res.json();
      }
    } catch (err) {
      console.error("[Dashboard] Internal API fetch failed:", err);
    }
  }

  // Fallback terakhir jika API route gagal
  if (!loadedData) {
    try {
      loadedData = await loadDashboardDataDirect();
    } catch (err) {
      console.error("[Dashboard] Fallback direct load failed:", err);
    }
  }

  if (loadedData) {
    scorecardData = loadedData.scorecardData || {};
    dashboardDeptData = loadedData.dashboardDeptData || {};
    gloveActive = loadedData.gloveActive || gloveActive;
    timbangan3R = loadedData.timbangan3R || timbangan3R;
    wipKulit = loadedData.wipKulit || wipKulit;
    kelolosanData = loadedData.kelolosanData || [];
    wipSewingData = loadedData.wipSewingData || [];
    progressShipmentChart = loadedData.progressShipmentChart || [];
    progressShipmentSummary = loadedData.progressShipmentSummary || undefined;
    capData = loadedData.capData || undefined;
    internalAuditData = loadedData.internalAuditData || [];
  }

  const urgency = getUrgencyFlags(new Date(), internalAuditData);

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
      label: "Internal audit · OTS finding",
      value: urgency.internalAudit.totalOts,
      suffix: undefined,
      status: urgency.internalAudit.status ?? undefined,
      icon: ClipboardList,
      href: "/internal-audit",
      hasData: urgency.internalAudit.totalOts > 0,
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
      status: statusOrUndefined(gloveActive.late > 0, "late"),
      icon: Recycle,
      href: "/three-r?tab=glove-active",
      hasData: gloveActive.late > 0,
    },
    {
      key: "3r-glove-active-pending",
      label: "3R glove active",
      value: gloveActive.onHold,
      suffix: "menunggu diproses",
      status: statusOrUndefined(gloveActive.onHold > 0, "pending"),
      icon: PauseCircle,
      href: "/three-r?tab=glove-active",
      hasData: gloveActive.onHold > 0,
    },
    // ---------- 3R WIP Kulit — data ASLI dari WEBTimbangan3RKulit ----------
    // Sekarang jumlah KG (dari BERAT KIRIMAN), bukan jumlah baris.
    // Tetap muncul selama ada aktivitas (total > 0), sama seperti WIP lain.
    {
      key: "3r-wip-kulit",
      label: "3R WIP kulit · late",
      value: wipKulit.late,
      suffix: `/ ${wipKulit.total} KG`,
      status: wipStatus(wipKulit.late, wipKulit.total),
      icon: Layers,
      href: "/three-r?tab=wip-kulit",
      hasData: wipKulit.total > 0,
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
      href: "/three-r?tab=wip-logo",
      hasData: timbangan3R.logo.total > 0,
    },
    {
      key: "3r-wip-pola",
      label: "3R WIP pola · late",
      value: timbangan3R.pola.late,
      suffix: `/ ${timbangan3R.pola.total} in progress`,
      status: wipStatus(timbangan3R.pola.late, timbangan3R.pola.total),
      icon: Box,
      href: "/three-r?tab=wip-pola",
      hasData: timbangan3R.pola.total > 0,
    },
    {
      key: "3r-wip-glove",
      label: "3R WIP glove · late",
      value: timbangan3R.glove.late,
      suffix: `/ ${timbangan3R.glove.total} in progress`,
      status: wipStatus(timbangan3R.glove.late, timbangan3R.glove.total),
      icon: Hand,
      href: "/three-r?tab=wip-glove",
      hasData: timbangan3R.glove.total > 0,
    },
    // WIP Pending — GABUNGAN Pola+Logo+Glove, 1 card, format Opsi C ("N pending")
    {
      key: "3r-wip-pending",
      label: "3R WIP pending",
      value: timbangan3R.totalPending,
      suffix: "pending",
      status: statusOrUndefined(timbangan3R.totalPending > 0, "pending"),
      icon: Clock,
      href: "/three-r?tab=wip-pending",
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
              <ProgressShipmentCard
                data={progressShipmentChart}
                summary={progressShipmentSummary}
              />
            </ScrollReveal>
            <ScrollReveal>
              <WipSewingCard data={wipSewingData} />
            </ScrollReveal>
            <ScrollReveal>
              <KelolosanChartCard data={kelolosanData} />
            </ScrollReveal>
            <ScrollReveal>
              <CorrectiveActionPlanCard data={capData} />
            </ScrollReveal>
          </div>
        </section>

        <section>
          <InternalAuditTable data={internalAuditData} />
        </section>
      </div>
    </div>
  );
}
