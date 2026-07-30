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
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { wipSewing, wipSewingThreshold } from "@/lib/mock-data";
import { getUrgencyFlags } from "@/lib/urgency";

const maxQty = Math.max(...wipSewing.map((d) => d.qty));

export function WipSewingCard() {
  const { wipSewing: urgency } = getUrgencyFlags();

  return (
    <Card
      className={`group relative overflow-hidden ${
        urgency.isUrgent
          ? "border-status-critical/40 bg-status-critical/10"
          : ""
      }`}
    >
      <Link href="/wip-sewing" className="absolute inset-0 z-10" aria-label="Lihat detail WIP Sewing" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle
          className={`text-xs font-medium ${
            urgency.isUrgent ? "text-status-critical" : "text-muted-foreground"
          }`}
        >
          WIP sewing &gt; 7 hari
        </CardTitle>
        <div className="flex items-center gap-1">
          {urgency.isUrgent && (
            <span className="text-[10px] text-status-critical">
              {urgency.criticalLines.map((l) => l.line).join(", ")} urgent
            </span>
          )}
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={wipSewing} margin={{ top: 24, right: 8, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="line"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
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
              <Bar dataKey="qty" radius={[4, 4, 0, 0]} maxBarSize={44}>
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
