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
import type { KelolosanWeekPoint } from "@/lib/three-r-types";

interface KelolosanChartCardProps {
  data: KelolosanWeekPoint[];
}

const FACTORY_COLORS: Record<string, string> = {
  "Fact A": "#0d9488", // Teal
  "Fact B": "#6366f1", // Indigo
  "Fact F": "#7c3aed", // Violet
  "Fact K": "#0284c7", // Sky / Deep Blue
};

const DEFAULT_SERIES_COLORS = [
  "#0d9488", // Teal
  "#0284c7", // Sky Blue
  "#6366f1", // Indigo
  "#7c3aed", // Violet
  "#0891b2", // Cyan
  "#64748b", // Slate
];

function getKelolosanBarColor(key: string, index: number): string {
  return FACTORY_COLORS[key] || DEFAULT_SERIES_COLORS[index % DEFAULT_SERIES_COLORS.length];
}

export function KelolosanChartCard({ data }: KelolosanChartCardProps) {
  const seriesKeys =
    data.length > 0 ? Object.keys(data[0]).filter((k) => k !== "week") : [];
  const first = data[0];
  const last = data[data.length - 1];
  const primaryKey = seriesKeys[seriesKeys.length - 1];
  const deltaPrimary =
    first && last && primaryKey
      ? Math.round((Number(last[primaryKey]) - Number(first[primaryKey])) * 10) / 10
      : 0;

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
        {primaryKey ? (
          <>
            {primaryKey} {deltaPrimary >= 0 ? "naik" : "turun"}{" "}
            <span className="font-medium text-foreground">{Math.abs(deltaPrimary)}%</span>{" "}
            vs {first?.week}
          </>
        ) : (
          "Belum ada data minggu terfilter"
        )}
      </p>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={10} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
            {seriesKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                name={key}
                fill={getKelolosanBarColor(key, i)}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Link>
  );
}
