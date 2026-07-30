"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { progressShipment } from "@/lib/mock-data";
import { getUrgencyFlags } from "@/lib/urgency";

const chartData = [
  { label: "Hutang prod", qty: progressShipment.hutangProduksi },
  { label: "Hutang carton", qty: progressShipment.hutangCarton },
];

export function ProgressShipmentCard() {
  const { progressShipment: urgency } = getUrgencyFlags();

  return (
    <Card
      className={
        urgency.isUrgent
          ? "border-status-critical/40 bg-status-critical/10"
          : undefined
      }
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle
          className={`text-xs font-semibold ${
            urgency.isUrgent ? "text-status-critical" : "text-muted-foreground"
          }`}
        >
          Progress shipment
        </CardTitle>
        {urgency.isUrgent && (
          <span className="text-[10px] text-status-critical">
            urgent, Jumat
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 9 }}
              />
              <YAxis hide />
              <Tooltip
                formatter={(value: number) => [`${value} pcs`, ""]}
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
                maxBarSize={28}
                fill={
                  urgency.isUrgent
                    ? "var(--color-status-critical)"
                    : "var(--color-primary)"
                }
              >
                <LabelList
                  dataKey="qty"
                  position="top"
                  style={{ fill: "var(--color-foreground)", fontSize: 10 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
