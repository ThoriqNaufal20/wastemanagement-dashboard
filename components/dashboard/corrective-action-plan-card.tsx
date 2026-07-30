"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { correctiveActionPlan } from "@/lib/mock-data";

export function CorrectiveActionPlanCard() {
  const topCategory = correctiveActionPlan.reduce((max, c) =>
    c.value > max.value ? c : max
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-semibold text-muted-foreground">
          Corrective action plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={correctiveActionPlan}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={0}
                  outerRadius={32}
                  strokeWidth={0}
                >
                  {correctiveActionPlan.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, ""]}
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {topCategory.name} {topCategory.value}%
            </p>
            <p className="text-[11px] text-muted-foreground">
              Kategori terbesar, historis
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
