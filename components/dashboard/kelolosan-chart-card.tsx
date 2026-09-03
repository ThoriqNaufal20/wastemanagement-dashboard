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
import { kelolosanSampahKulit } from "@/lib/mock-data";

const first = kelolosanSampahKulit[0];
const last = kelolosanSampahKulit[kelolosanSampahKulit.length - 1];
const deltaK = Math.round((last.K - first.K) * 10) / 10;

export function KelolosanChartCard() {
  return (
    <Link
      href="/kelolosan-sampah-kulit"
      className="group flex h-[300px] flex-col rounded-2xl bg-card p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)] transition-all duration-200 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_4px_8px_rgba(16,24,40,0.08)]"
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          % Kelolosan sampah kulit
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
        Fact K {deltaK >= 0 ? "naik" : "turun"}{" "}
        <span className="font-medium text-foreground">
          {Math.abs(deltaK)}%
        </span>{" "}
        vs {first.week}
      </p>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={kelolosanSampahKulit} barGap={10} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
            <Legend wrapperStyle={{ fontSize: "10px" }} />
            <Bar dataKey="A" name="Fact A" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="K" name="Fact K" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Link>
  );
}
