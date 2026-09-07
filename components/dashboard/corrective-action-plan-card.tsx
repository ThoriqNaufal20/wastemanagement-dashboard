"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { correctiveActionPlan } from "@/lib/mock-data";

export function CorrectiveActionPlanCard() {
  const topCategory = correctiveActionPlan.reduce((max, c) =>
    c.value > max.value ? c : max
  );

  return (
    <Link
      href="/corrective-action-plan"
      className="group flex h-[300px] flex-col rounded-2xl bg-card p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)] transition-all duration-200 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_4px_8px_rgba(16,24,40,0.08)]"
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Corrective action plan
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{topCategory.name}</span> jadi kontributor terbesar
      </p>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <div className="h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={correctiveActionPlan}
                dataKey="value"
                nameKey="name"
                innerRadius={0}
                outerRadius={72}
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
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
    {correctiveActionPlan.map((item) => (
      <div
        key={item.name}
        className="flex items-center gap-1.5"
      >
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
    </Link>
  );
}
