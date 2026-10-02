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
import { StatusChip } from "@/components/dashboard/status-chip";
import {
  type WipSewingFactSummary,
  WIP_SEWING_THRESHOLD,
} from "@/lib/wip-sewing-types";

interface WipSewingCardProps {
  data?: WipSewingFactSummary[];
}

export function WipSewingCard({ data }: WipSewingCardProps) {
  const chartData = (data && data.length > 0)
    ? data.map((d) => ({
        line: `Fact ${d.fact}`,
        fact: d.fact,
        qty: d.qty,
        maxOverdue: d.maxOverdue,
      }))
    : [
        { line: "Fact A", fact: "A", qty: 0, maxOverdue: 0 },
        { line: "Fact F", fact: "F", qty: 0, maxOverdue: 0 },
        { line: "Fact K", fact: "K", qty: 0, maxOverdue: 0 },
      ];

  const criticalFacts = chartData.filter((d) => d.qty > WIP_SEWING_THRESHOLD);
  const isLate = criticalFacts.length > 0;
  const maxQty = Math.max(...chartData.map((d) => d.qty), WIP_SEWING_THRESHOLD);

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
              {criticalFacts.map((f) => f.line).join(", ")}
            </span>{" "}
            di atas target {WIP_SEWING_THRESHOLD.toLocaleString("id-ID")} pcs
          </>
        ) : (
          "Semua factory masih di bawah target"
        )}
      </p>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 4, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="line"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            />
            <YAxis
              domain={[0, maxQty * 1.18]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
            />
            <Tooltip
              formatter={(value, name, item) => [
                `${Number(value).toLocaleString("id-ID")} pcs (${item.payload.maxOverdue} hari kerja)`,
                "Qty WIP",
              ]}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                fontSize: "11px",
              }}
            />
            <ReferenceLine
              y={WIP_SEWING_THRESHOLD}
              stroke="#64748b"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{
                value: "Target",
                position: "insideTopRight",
                fill: "#64748b",
                fontSize: 10,
              }}
            />
            <Bar dataKey="qty" radius={[4, 4, 0, 0]} maxBarSize={44}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.fact}
                  fill={
                    entry.qty > WIP_SEWING_THRESHOLD
                      ? "var(--color-status-critical)"
                      : "var(--color-primary)"
                  }
                />
              ))}
              <LabelList
                dataKey="qty"
                position="top"
                formatter={(val) => Number(val).toLocaleString("id-ID")}
                style={{ fill: "var(--color-foreground)", fontSize: 11 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Link>
  );
}

