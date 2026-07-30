"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { correctiveActionPlan } from "@/lib/mock-data";

export function CorrectiveActionPlanCard() {
  return (
    <Card className="group relative overflow-hidden">
      <Link href="/corrective-action-plan" className="absolute inset-0 z-10" aria-label="Lihat detail Corrective Action Plan" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          Corrective Action Plan
        </CardTitle>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </CardHeader>
      <CardContent className="flex h-full items-center">
          <div className="flex items-center gap-4">
          <div className="h-36 w-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={correctiveActionPlan}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={20}
                  outerRadius={68}
                  strokeWidth={0}
                >
                  {correctiveActionPlan.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, ""]}
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
          <div className="flex flex-col gap-1.5">
            {correctiveActionPlan.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] text-muted-foreground">
                  {item.name}
                </span>
                <span className="text-[11px] font-medium text-foreground">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
