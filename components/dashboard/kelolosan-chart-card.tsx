"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { kelolosanSampahKulit } from "@/lib/mock-data";

export function KelolosanChartCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-semibold text-muted-foreground">
          % Kelolosan sampah kulit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kelolosanSampahKulit} barGap={6}>
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
              />
              <YAxis hide />
              <Tooltip
                formatter={(value: number) => [`${value}%`, ""]}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Bar
                dataKey="A"
                name="Line A"
                fill="var(--color-secondary)"
                radius={[4, 4, 0, 0]}
                maxBarSize={20}
              />
              <Bar
                dataKey="K"
                name="Line K"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
