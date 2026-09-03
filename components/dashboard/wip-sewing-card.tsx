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
  ReferenceLine,
} from "recharts";
import { wipSewing, wipSewingThreshold } from "@/lib/mock-data";
import { getUrgencyFlags } from "@/lib/urgency";
import { StatusChip } from "@/components/dashboard/status-chip";

const maxQty = Math.max(...wipSewing.map((d) => d.qty), wipSewingThreshold);

export function WipSewingCard() {
  const { wipSewing: urgency } = getUrgencyFlags();
  const criticalLines = urgency.criticalLines.map((l) => l.line);
  const isLate = criticalLines.length > 0;

  return (
    <Link
      href="/wip-sewing"
      className="group flex h-[300px] flex-col rounded-2xl bg-card p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)] transition-all duration-200 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_4px_8px_rgba(16,24,40,0.08)]"
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          WIP sewing &gt; 7 hari
        </span>
        <div className="flex items-center gap-1.5">
          {isLate && <StatusChip status="late" />}
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
        {isLate ? (
          <>
            <span className="font-medium text-status-critical">
              Line {criticalLines.join(", ")}
            </span>{" "}
            di atas target {wipSewingThreshold.toLocaleString("id-ID")} pcs
          </>
        ) : (
          "Semua line masih di bawah target"
        )}
      </p>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={wipSewing} margin={{ top: 20, right: 4, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="line"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            />
            <YAxis
              domain={[0, maxQty * 1.15]}
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
            <ReferenceLine
              y={wipSewingThreshold}
              stroke="var(--color-status-warning)"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{
                value: "Target",
                position: "insideTopRight",
                fill: "var(--color-status-warning)",
                fontSize: 10,
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
    </Link>
  );
}
