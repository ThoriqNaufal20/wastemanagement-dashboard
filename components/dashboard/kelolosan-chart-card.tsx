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

// Warna yang kontras tinggi dan mudah dibedakan
const FACTORY_COLORS: Record<string, string> = {
  "Fact A": "#0d9488", // Teal
  "Fact B": "#f59e0b", // Amber/Orange — sebelumnya Indigo, terlalu mirip Violet
  "Fact F": "#ef4444", // Red — sebelumnya Violet, terlalu mirip Indigo
  "Fact K": "#2563eb", // Blue
};

const DEFAULT_SERIES_COLORS = [
  "#0d9488", // Teal
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#2563eb", // Blue
  "#8b5cf6", // Purple
  "#64748b", // Slate
];

function getKelolosanBarColor(key: string, index: number): string {
  return FACTORY_COLORS[key] || DEFAULT_SERIES_COLORS[index % DEFAULT_SERIES_COLORS.length];
}

/**
 * Hitung perubahan setiap factory antara minggu terakhir dan rata-rata minggu sebelumnya.
 * Return: factory dengan perubahan paling signifikan (prioritas kenaikan / merah).
 */
function computeMostSignificantChange(
  data: KelolosanWeekPoint[],
  seriesKeys: string[]
): { factKey: string; delta: number; direction: "up" | "down" } | null {
  if (data.length < 2 || seriesKeys.length === 0) return null;

  const latest = data[data.length - 1];

  // Rata-rata dari semua minggu sebelumnya (bukan hanya first)
  const previousWeeks = data.slice(0, -1);

  type FactChange = { factKey: string; delta: number; direction: "up" | "down" };
  const changes: FactChange[] = [];

  for (const key of seriesKeys) {
    const latestVal = Number(latest[key]) || 0;

    // Hitung rata-rata minggu sebelumnya
    let sum = 0;
    let count = 0;
    for (const w of previousWeeks) {
      const v = Number(w[key]);
      if (!isNaN(v) && v !== 0) {
        sum += v;
        count += 1;
      }
    }
    if (count === 0) continue;

    const avgPrev = sum / count;
    const delta = Math.round((latestVal - avgPrev) * 10) / 10;

    if (delta !== 0) {
      changes.push({
        factKey: key,
        delta,
        direction: delta > 0 ? "up" : "down",
      });
    }
  }

  if (changes.length === 0) return null;

  // Prioritas: kenaikan (up = buruk) didahulukan, urutkan berdasarkan delta terbesar
  const increases = changes.filter((c) => c.direction === "up").sort((a, b) => b.delta - a.delta);
  const decreases = changes.filter((c) => c.direction === "down").sort((a, b) => a.delta - b.delta);

  // Ambil yang paling signifikan: kenaikan dulu (karena lebih urgent), lalu penurunan
  if (increases.length > 0) return increases[0];
  if (decreases.length > 0) return decreases[0];

  return null;
}

export function KelolosanChartCard({ data }: KelolosanChartCardProps) {
  const seriesKeys =
    data.length > 0 ? Object.keys(data[0]).filter((k) => k !== "week") : [];

  const change = computeMostSignificantChange(data, seriesKeys);

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
        {change ? (
          <>
            {change.factKey}{" "}
            {change.direction === "up" ? (
              <>
                <span className="font-medium text-red-600 dark:text-red-400">
                  ↑ naik {Math.abs(change.delta)}%
                </span>
              </>
            ) : (
              <>
                <span className="font-medium text-green-600 dark:text-green-400">
                  ↓ turun {Math.abs(change.delta)}%
                </span>
              </>
            )}{" "}
            vs rata-rata minggu sebelumnya
          </>
        ) : seriesKeys.length > 0 ? (
          "Tidak ada perubahan signifikan"
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
