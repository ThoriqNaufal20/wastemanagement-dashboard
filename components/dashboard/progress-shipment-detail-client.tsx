"use client";

import { useState, useMemo } from "react";
import {
  Truck,
  Box,
  Layers,
  Search,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LabelList,
  Legend,
} from "recharts";
import { StatusChip } from "@/components/dashboard/status-chip";
import type {
  ProgressShipmentChartItem,
  ProgressShipmentSummary,
  ProgressShipmentDetailItem,
} from "@/lib/progress-shipment-types";

export interface ProgressShipmentDetailClientProps {
  chartData: ProgressShipmentChartItem[];
  summary: ProgressShipmentSummary;
  details: ProgressShipmentDetailItem[];
}

function formatCompact(val: any): string {
  const num = Number(val);
  if (isNaN(num) || num === 0) return "0";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
  return String(num);
}

export function ProgressShipmentDetailClient({
  chartData,
  summary,
  details,
}: ProgressShipmentDetailClientProps) {
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<string>("next week");
  const [searchQuery, setSearchQuery] = useState("");

  const isFridayToday = new Date().getDay() === 5;
  const prodBarColor = isFridayToday ? "#ef4444" : "#f97316";
  const cartonBarColor = isFridayToday ? "#ef4444" : "#eab308";

  // Filter items berdasarkan Filter Week & Search
  const filteredItems = useMemo(() => {
    return details.filter((item) => {
      // Filter Week
      if (selectedWeekFilter !== "all") {
        if (item.filterWeek.toLowerCase() !== selectedWeekFilter.toLowerCase()) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.inv.toLowerCase().includes(q) ||
          item.buyer.toLowerCase().includes(q) ||
          item.w.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [details, selectedWeekFilter, searchQuery]);

  // Aggregation dinamis untuk chart sesuai tab filter yang dipilih
  const dynamicChartData = useMemo(() => {
    const weekMap = new Map<
      string,
      { hutangProd: number; hutangCarton: number; totalHutang: number }
    >();

    filteredItems.forEach((row) => {
      const rawW = row.w.trim();
      if (!rawW) return;

      if (!weekMap.has(rawW)) {
        weekMap.set(rawW, { hutangProd: 0, hutangCarton: 0, totalHutang: 0 });
      }

      const data = weekMap.get(rawW)!;
      data.hutangProd += row.hutangProd;
      data.hutangCarton += row.hutangCarton;
      data.totalHutang += row.hutangProd + row.hutangCarton;
    });

    const result: ProgressShipmentChartItem[] = [];
    weekMap.forEach((val, rawW) => {
      const weekLabel = rawW.toLowerCase().startsWith("w")
        ? rawW.toUpperCase()
        : `W${rawW}`;
      result.push({
        week: weekLabel,
        rawW,
        hutangProd: val.hutangProd,
        hutangCarton: val.hutangCarton,
        totalHutang: val.totalHutang,
      });
    });

    return result.sort((a, b) => {
      const numA = parseInt(a.rawW.replace(/\D/g, ""), 10) || 0;
      const numB = parseInt(b.rawW.replace(/\D/g, ""), 10) || 0;
      return numA - numB;
    });
  }, [filteredItems]);

  const activeTotalProd = useMemo(
    () => filteredItems.reduce((acc, curr) => acc + curr.hutangProd, 0),
    [filteredItems]
  );
  const activeTotalCarton = useMemo(
    () => filteredItems.reduce((acc, curr) => acc + curr.hutangCarton, 0),
    [filteredItems]
  );
  const activeTotalHutang = activeTotalProd + activeTotalCarton;
  const activeCartonShare =
    activeTotalHutang > 0
      ? Math.round((activeTotalCarton / activeTotalHutang) * 100)
      : 0;

  const maxVal = Math.max(
    ...dynamicChartData.map((d) => Math.max(d.hutangProd, d.hutangCarton)),
    100
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Hutang Produksi
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Box className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {activeTotalProd.toLocaleString()}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">pcs</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Barang masih dalam proses produksi
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Hutang Carton
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <Layers className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {activeTotalCarton.toLocaleString()}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">pcs</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Porsi carton: <strong className="text-foreground">{activeCartonShare}%</strong>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Total Belum Kirim
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Truck className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {activeTotalHutang.toLocaleString()}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">pcs</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Total hutang prod + carton
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Jumlah Invoice
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Calendar className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {filteredItems.length}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">inv</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              {summary.isAttention ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500">
                  <AlertTriangle className="h-3 w-3" />
                  Perlu perhatian hari Jumat
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  Status termonitor
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Grafik Hutang Prod vs Carton per Week (W)
            </h3>
            <p className="text-xs text-muted-foreground">
              Sumbu X: Minggu pengiriman (W) · Batang: Hutang Produksi & Hutang Carton
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: prodBarColor }}
              />
              Hutang Prod
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: cartonBarColor }}
              />
              Hutang Packing
            </span>
            {isFridayToday && (
              <span className="text-[11px] font-semibold text-red-500">
                (Hari Jumat - Urgent)
              </span>
            )}
          </div>
        </div>

        <div className="h-[280px] w-full">
          {dynamicChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dynamicChartData}
                barGap={8}
                margin={{ top: 24, right: 16, left: 0, bottom: 8 }}
              >
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  domain={[0, Math.ceil(maxVal * 1.25)]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  tickFormatter={formatCompact}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${Number(value || 0).toLocaleString()} pcs`,
                    name === "hutangProd" ? "Hutang Produksi" : "Hutang Packing",
                  ]}
                  labelFormatter={(label) => `Minggu ${label}`}
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="hutangProd"
                  name="hutangProd"
                  fill={prodBarColor}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                >
                  <LabelList
                    dataKey="hutangProd"
                    position="top"
                    formatter={formatCompact}
                    style={{ fill: "var(--color-foreground)", fontSize: 11 }}
                  />
                </Bar>
                <Bar
                  dataKey="hutangCarton"
                  name="hutangCarton"
                  fill={cartonBarColor}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                >
                  <LabelList
                    dataKey="hutangCarton"
                    position="top"
                    formatter={formatCompact}
                    style={{ fill: "var(--color-foreground)", fontSize: 11 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Tidak ada data grafik untuk filter yang dipilih.
            </div>
          )}
        </div>
      </Card>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "next week", label: "Next Week" },
            { id: "this week", label: "This Week" },
            { id: "2 week", label: "2 Week" },
            { id: "all", label: "Semua Week" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedWeekFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedWeekFilter === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari Inv#, Buyer, atau W..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-1.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Detail Table */}
      <Card className="overflow-hidden border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-3 text-xs text-muted-foreground">
          Menampilkan <strong className="text-foreground">{filteredItems.length}</strong> data invoice
        </div>

        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
              <TableRow className="border-border">
                <TableHead className="w-16 font-semibold text-foreground">W</TableHead>
                <TableHead className="font-semibold text-foreground">Inv#</TableHead>
                <TableHead className="font-semibold text-foreground">Buyer</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Qty Shipment</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Qty Carton</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Hutang Prod</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Hutang Carton</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Hutang Envelope</TableHead>
                <TableHead className="w-24 text-center font-semibold text-foreground">Filter Week</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-xs text-muted-foreground">
                    Tidak ada data yang sesuai dengan pencarian atau filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item, idx) => {
                  const hasHutang = item.hutangProd > 0 || item.hutangCarton > 0;
                  return (
                    <TableRow
                      key={`${item.inv}-${idx}`}
                      className="border-border/60 hover:bg-muted/40"
                    >
                      <TableCell className="font-semibold text-foreground">
                        <span className="inline-flex rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                          W{item.w}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-foreground">
                        {item.inv}
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground" title={item.buyer}>
                        {item.buyer}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {item.qtyShipment.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {item.qtyCarton.toLocaleString()}
                      </TableCell>
                      <TableCell
                        className={`text-right text-xs font-medium ${
                          item.hutangProd > 0 ? "text-blue-500 font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        {item.hutangProd.toLocaleString()}
                      </TableCell>
                      <TableCell
                        className={`text-right text-xs font-medium ${
                          item.hutangCarton > 0 ? "text-amber-500 font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        {item.hutangCarton.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {item.hutangEnvelope.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            item.filterWeek === "next week"
                              ? "bg-amber-500/10 text-amber-500"
                              : item.filterWeek === "this week"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.filterWeek || "-"}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

