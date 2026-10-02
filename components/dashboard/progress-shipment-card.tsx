"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from "recharts";
import { getUrgencyFlags } from "@/lib/urgency";
import { StatusChip } from "@/components/dashboard/status-chip";
import type {
  ProgressShipmentChartItem,
  ProgressShipmentSummary,
} from "@/lib/progress-shipment-types";

interface ProgressShipmentCardProps {
  data?: ProgressShipmentChartItem[];
  summary?: ProgressShipmentSummary;
}

function formatCompact(val: any): string {
  const num = Number(val);
  if (isNaN(num) || num === 0) return "0";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
  return String(num);
}

export function ProgressShipmentCard({
  data = [],
  summary,
}: ProgressShipmentCardProps) {
  const { progressShipment: urgency } = getUrgencyFlags();
  const isAttention = summary?.isAttention ?? urgency.status === "attention";

  // Aturan warna: Hutang Produksi = ORANYE (#f97316 / attention), Hutang Packing = KUNING (#eab308)
  const prodBarColor = "#f97316";
  const cartonBarColor = "#eab308";

  const chartData = data.length > 0
    ? data
    : [
        {
          week: "W39",
          rawW: "39",
          hutangProd: 0,
          hutangCarton: 0,
          totalHutang: 0,
        },
      ];

  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d.hutangProd, d.hutangCarton)),
    100
  );

  const totalProd = summary?.totalHutangProd ?? chartData.reduce((acc, d) => acc + d.hutangProd, 0);
  const totalCarton = summary?.totalHutangCarton ?? chartData.reduce((acc, d) => acc + d.hutangCarton, 0);
  const totalAll = totalProd + totalCarton;
  const cartonShare = summary?.cartonShare ?? (totalAll > 0 ? Math.round((totalCarton / totalAll) * 100) : 0);

  return (
    <Link
      href="/progress-shipment"
      className="group flex h-[300px] flex-col rounded-2xl bg-card p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)] transition-all duration-200 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_4px_8px_rgba(16,24,40,0.08)]"
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Progress shipment
        </span>
        <div className="flex items-center gap-1.5">
          {isAttention && <StatusChip status="attention" />}
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      <p className="mb-1.5 line-clamp-2 text-xs text-muted-foreground">
        Packing berkontribusi{" "}
        <span className="font-medium text-foreground">{cartonShare}%</span> dari
        total shipment yang belum kirim
      </p>

      {/* Mini Legend */}
      <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: prodBarColor }}
            />
            Hutang prod
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: cartonBarColor }}
            />
            Hutang packing
          </span>
        </div>
        {isAttention && (
          <span className="text-[10px] font-semibold text-amber-500">
            Next week (Attention)
          </span>
        )}
      </div>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barGap={6}
            margin={{ top: 20, right: 8, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            />
            <YAxis
              domain={[0, Math.ceil(maxVal * 1.25)]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
              tickFormatter={formatCompact}
            />
            <Tooltip
              formatter={(value: any, name: any) => [
                `${Number(value || 0).toLocaleString()} pcs`,
                name === "hutangProd" ? "Hutang Produksi" : "Hutang Packing",
              ]}
              labelFormatter={(label) => `Minggu ${label}`}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                fontSize: "11px",
              }}
            />
            <Bar
              dataKey="hutangProd"
              name="hutangProd"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
              fill={prodBarColor}
            >
              <LabelList
                dataKey="hutangProd"
                position="top"
                formatter={formatCompact}
                style={{ fill: "var(--color-foreground)", fontSize: 10 }}
              />
            </Bar>
            <Bar
              dataKey="hutangCarton"
              name="hutangCarton"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
              fill={cartonBarColor}
            >
              <LabelList
                dataKey="hutangCarton"
                position="top"
                formatter={formatCompact}
                style={{ fill: "var(--color-foreground)", fontSize: 10 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Link>
  );
}
