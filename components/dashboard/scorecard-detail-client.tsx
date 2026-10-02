"use client";

import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/dashboard/scroll-reveal";
import { AiAgentPanel } from "@/components/dashboard/ai-agent-panel";
import {
  type ScorecardDepartmentData,
  computeTrend,
  buildAllDepartmentsAverage,
} from "@/lib/scorecard-types";

interface ScorecardDetailClientProps {
  data: Record<string, ScorecardDepartmentData>;
  departments: string[];
  defaultDepartment: string;
}

const ALL_DEPT_KEY = "__ALL__";

const ASPECT_COLORS = [
  "#2563EB", // Royal Blue
  "#0D9488", // Teal
  "#6366F1", // Indigo
  "#0EA5E9", // Sky Blue
  "#8B5CF6", // Violet
  "#14B8A6", // Mint Teal
  "#64748B", // Slate
];

function TrendBadge({
  delta,
  direction,
}: {
  delta: number;
  direction: "up" | "down" | "flat";
}) {
  if (direction === "flat") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Minus className="h-3.5 w-3.5" />
        Tidak ada perubahan
      </span>
    );
  }
  const isUp = direction === "up";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isUp ? "text-status-success" : "text-status-critical"
      }`}
    >
      {isUp ? (
        <TrendingUp className="h-3.5 w-3.5" />
      ) : (
        <TrendingDown className="h-3.5 w-3.5" />
      )}
      {isUp ? "+" : ""}
      {delta}% vs kuartal lalu
    </span>
  );
}

export function ScorecardDetailClient({
  data,
  departments,
}: ScorecardDetailClientProps) {
  const [selectedDept, setSelectedDept] = useState(ALL_DEPT_KEY);
  // Aspek yang lagi "diisolasi" di chart. Kosong = tampilkan semua garis.
  const [selectedAspects, setSelectedAspects] = useState<Set<string>>(new Set());

  const allDeptData = useMemo(() => buildAllDepartmentsAverage(data), [data]);
  const dept = selectedDept === ALL_DEPT_KEY ? allDeptData : data[selectedDept];

  function handleDeptChange(value: string) {
    setSelectedDept(value);
    setSelectedAspects(new Set()); // reset pilihan aspek saat ganti departemen
  }

  function toggleAspect(aspectKey: string) {
    setSelectedAspects((prev) => {
      const next = new Set(prev);
      if (next.has(aspectKey)) {
        next.delete(aspectKey);
      } else {
        next.add(aspectKey);
      }
      return next;
    });
  }

  const chartData = useMemo(() => {
    if (!dept) return [];
    return dept.quarters.map((quarter, i) => {
      const row: Record<string, string | number | null> = { quarter };
      dept.aspects.forEach((aspect) => {
        row[aspect.aspect] = aspect.series[i]?.value ?? null;
      });
      return row;
    });
  }, [dept]);

  if (!dept) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          Data belum tersedia.
        </CardContent>
      </Card>
    );
  }

  const averageTrend = computeTrend(dept.averageSeries);
  const hasSelection = selectedAspects.size > 0;

  return (
    <div className="space-y-4">
      {/* Filter departemen */}
      <div className="flex items-center gap-2">
        <label htmlFor="dept-filter" className="text-xs text-muted-foreground">
          Departemen
        </label>
        <select
          id="dept-filter"
          value={selectedDept}
          onChange={(e) => handleDeptChange(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground"
        >
          <option value={ALL_DEPT_KEY}>Semua departemen</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Skor rata-rata + tren */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <div>
            <p className="text-xs text-muted-foreground">
              Score akhir · {dept.department} · {dept.quarters[dept.quarters.length - 1]}
            </p>
            <p className="text-3xl font-semibold text-foreground">
              {averageTrend.latest ?? "-"}%
            </p>
          </div>
          <TrendBadge delta={averageTrend.delta} direction={averageTrend.direction} />
        </CardContent>
      </Card>

      {/* Line chart tren antar kuartal */}
      <ScrollReveal minHeight={340}>
        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                Tren skor per kuartal
              </p>
              {hasSelection && (
                <button
                  onClick={() => setSelectedAspects(new Set())}
                  className="text-[11px] text-primary hover:underline"
                >
                  Tampilkan semua
                </button>
              )}
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="quarter"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                    padding={{
                      left: Math.max(20, 140 - dept.quarters.length * 30),
                      right: Math.max(20, 140 - dept.quarters.length * 30),
                    }}
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
                  <Legend
                    wrapperStyle={{ fontSize: "11px", cursor: "pointer" }}
                    onClick={(e) => {
                      if (typeof e.dataKey === "string") toggleAspect(e.dataKey);
                    }}
                  />
                  {dept.aspects.map((aspect, i) => {
                    const isActive = !hasSelection || selectedAspects.has(aspect.aspect);
                    return (
                      <Line
                        key={aspect.aspect}
                        type="monotone"
                        dataKey={aspect.aspect}
                        name={aspect.label}
                        stroke={ASPECT_COLORS[i % ASPECT_COLORS.length]}
                        strokeWidth={1.5}
                        dot={{ r: 3 }}
                        connectNulls
                        hide={!isActive}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Breakdown per aspek — klik card untuk isolasi di chart (multi-select) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {dept.aspects.map((aspect) => {
          const trend = computeTrend(aspect.series);
          const isSelected = selectedAspects.has(aspect.aspect);
          const isDimmed = hasSelection && !isSelected;
          return (
            <button
              key={aspect.aspect}
              onClick={() => toggleAspect(aspect.aspect)}
              className={`text-left transition-opacity ${isDimmed ? "opacity-40" : "opacity-100"}`}
            >
              <Card
                className={isSelected ? "ring-2 ring-primary" : undefined}
              >
                <CardContent className="pt-6">
                  <p className="text-xs text-muted-foreground">{aspect.label}</p>
                  <p className="text-xl font-semibold text-foreground">
                    {trend.latest ?? "-"}%
                  </p>
                  <div className="mt-1">
                    <TrendBadge delta={trend.delta} direction={trend.direction} />
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Panel AI drill-down */}
      <AiAgentPanel context={`Scorecard — ${dept.department}`} />
    </div>
  );
}
