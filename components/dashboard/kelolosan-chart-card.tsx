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
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { kelolosanSampahKulit } from "@/lib/mock-data";

export function KelolosanChartCard() {
  return (
    <Card className="group relative overflow-hidden">
      <Link href="/kelolosan-sampah-kulit" className="absolute inset-0 z-10" aria-label="Lihat detail Kelolosan Sampah Kulit" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          % Kelolosan sampah kulit
        </CardTitle>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kelolosanSampahKulit} barGap={10} margin={{ top: 8, right: 8, left: -20, bottom: -10 }}>
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, ""]}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }}/>
              <Bar
                dataKey="A"
                name="Fact A"
                fill="var(--color-secondary)"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="K"
                name="Fact K"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
