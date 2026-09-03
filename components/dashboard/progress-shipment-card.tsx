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
import { progressShipment } from "@/lib/mock-data";
import { getUrgencyFlags } from "@/lib/urgency";
import { StatusChip } from "@/components/dashboard/status-chip";

const chartData = [
  { label: "Hutang prod", qty: progressShipment.hutangProduksi },
  { label: "Hutang carton", qty: progressShipment.hutangCarton },
];
const maxQty = Math.max(...chartData.map((d) => d.qty));
const cartonShare = Math.round(
  (progressShipment.hutangCarton /
    (progressShipment.hutangProduksi + progressShipment.hutangCarton)) *
    100
);

export function ProgressShipmentCard() {
  const { progressShipment: urgency } = getUrgencyFlags();
  const isAttention = urgency.status === "attention";

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

      <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
        Carton berkontribusi <span className="font-medium text-foreground">{cartonShare}%</span> dari total shipment yang belum kirim
      </p>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 4, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
            />
            <YAxis
              domain={[0, maxQty * 1.2]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
            />
            <Tooltip
              formatter={(value) => [`${value} pcs`, ""]}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                fontSize: "11px",
              }}
            />
            <Bar
              dataKey="qty"
              radius={[4, 4, 0, 0]}
              maxBarSize={44}
              fill={
                isAttention ? "var(--color-status-warning)" : "var(--color-primary)"
              }
            >
              <LabelList
                dataKey="qty"
                position="top"
                style={{ fill: "var(--color-foreground)", fontSize: 11 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Link>
  );
}
