"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LabelList,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { wipSewing, wipSewingThreshold } from "@/lib/mock-data";
import { getUrgencyFlags } from "@/lib/urgency";

export function WipSewingCard() {
  const { wipSewing: urgency } = getUrgencyFlags();

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
          WIP sewing &gt; 7 hari
        </CardTitle>
        {urgency.isUrgent && (
          <span className="text-[10px] text-status-critical">
            {urgency.criticalLines.map((l) => l.line).join(", ")} urgent
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={wipSewing}>
              <XAxis
                dataKey="line"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
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
              <Bar dataKey="qty" radius={[4, 4, 0, 0]} maxBarSize={28}>
                {wipSewing.map((entry) => (
                  <Cell
                    key={entry.line}
                    fill={
                      entry.qty > wipSewingThreshold
                        ? "var(--color-status-critical)"
                        : "var(--color-primary)"
                    }
                  />
                ))}
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
