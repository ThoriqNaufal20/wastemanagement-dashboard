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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { progressShipment } from "@/lib/mock-data";
import { getUrgencyFlags } from "@/lib/urgency";

const chartData = [
  { label: "Hutang prod", qty: progressShipment.hutangProduksi },
  { label: "Hutang carton", qty: progressShipment.hutangCarton },
];
const maxQty = Math.max(...chartData.map((d) => d.qty));

export function ProgressShipmentCard() {
  const { progressShipment: urgency } = getUrgencyFlags();

  return (
    <Card
      className={`group relative overflow-hidden ${
        urgency.isUrgent
          ? "border-status-critical/40 bg-status-critical/10"
          : ""
      }`}
    >
      <Link href="/progress-shipment" className="absolute inset-0 z-10" aria-label="Lihat detail Progress Shipment" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle
          className={`text-xs font-medium ${
            urgency.isUrgent ? "text-status-critical" : "text-muted-foreground"
          }`}
        >
          Progress Shipment Minggu Depan
        </CardTitle>
        <div className="flex items-center gap-1">
          {urgency.isUrgent && (
            <span className="text-[10px] text-status-critical">urgent, Jumat</span>
          )}
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 24, right: 8, left: -20, bottom: -10 }}>
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
                  urgency.isUrgent
                    ? "var(--color-status-critical)"
                    : "var(--color-primary)"
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
      </CardContent>
    </Card>
  );
}
