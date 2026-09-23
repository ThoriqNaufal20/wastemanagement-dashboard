"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  FileSpreadsheet,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CapItem, CapClassificationSummary } from "@/lib/cap-types";
import {
  CAP_CLASSIFICATION_COLORS,
  DEFAULT_CAP_COLORS,
} from "@/lib/cap-types";

interface CapDetailClientProps {
  initialItems: CapItem[];
}

export function CapDetailClient({ initialItems }: CapDetailClientProps) {
  // Filter States
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedClassification, setSelectedClassification] =
    useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal / Expanded detail row state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Dapatkan daftar tahun unik yang tersedia
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    initialItems.forEach((item) => {
      if (item.year) years.add(item.year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [initialItems]);

  // Dapatkan daftar klasifikasi unik
  const availableClassifications = useMemo(() => {
    const set = new Set<string>();
    initialItems.forEach((item) => {
      if (item.klasifikasiMasalah) {
        const name =
          item.klasifikasiMasalah.charAt(0).toUpperCase() +
          item.klasifikasiMasalah.slice(1).toLowerCase();
        set.add(name);
      }
    });
    return Array.from(set).sort();
  }, [initialItems]);

  // Logika Filter Data
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      // 1. Filter Tahun (jika tidak pilih "all" dan tidak set range tanggal custom)
      if (selectedYear !== "all" && !startDate && !endDate) {
        if (item.year !== parseInt(selectedYear, 10)) {
          return false;
        }
      }

      // 2. Filter Rentang Tanggal Custom
      if (startDate && item.isoDate && item.isoDate < startDate) {
        return false;
      }
      if (endDate && item.isoDate && item.isoDate > endDate) {
        return false;
      }

      // 3. Filter Klasifikasi Masalah
      if (selectedClassification !== "all") {
        if (
          item.klasifikasiMasalah.toLowerCase() !==
          selectedClassification.toLowerCase()
        ) {
          return false;
        }
      }

      // 4. Filter Status
      if (selectedStatus !== "all") {
        if (item.status.toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }
      }

      // 5. Filter Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          item.temuanMasalah.toLowerCase().includes(q) ||
          item.order.toLowerCase().includes(q) ||
          item.spo.toLowerCase().includes(q) ||
          item.dibuatOleh.toLowerCase().includes(q) ||
          item.ditujukanUntuk.toLowerCase().includes(q) ||
          item.penyebabMasalah.toLowerCase().includes(q) ||
          item.tindakanPenyelesaian.toLowerCase().includes(q);

        if (!match) return false;
      }

      return true;
    });
  }, [
    initialItems,
    selectedYear,
    startDate,
    endDate,
    selectedClassification,
    selectedStatus,
    searchQuery,
  ]);

  // Distribusi Klasifikasi Terhitung Dinamis berdasarkan filteredItems
  const classificationSummary = useMemo<CapClassificationSummary[]>(() => {
    const counts: Record<string, number> = {};
    let total = 0;

    filteredItems.forEach((item) => {
      const raw = (item.klasifikasiMasalah || "Lainnya").trim();
      const formatted =
        raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
      counts[formatted] = (counts[formatted] || 0) + 1;
      total++;
    });

    if (total === 0) return [];

    const sortedNames = Object.keys(counts).sort(
      (a, b) => counts[b] - counts[a]
    );

    return sortedNames.map((name, idx) => {
      const count = counts[name];
      const value = Math.round((count / total) * 1000) / 10;
      const colorKey = name.toLowerCase();
      const color =
        CAP_CLASSIFICATION_COLORS[colorKey] ||
        DEFAULT_CAP_COLORS[idx % DEFAULT_CAP_COLORS.length];

      return {
        name,
        count,
        value,
        color,
      };
    });
  }, [filteredItems]);

  // KPI Metrics
  const totalCases = filteredItems.length;
  const doneCases = filteredItems.filter(
    (item) => item.status.toLowerCase() === "done"
  ).length;
  const donePercentage =
    totalCases > 0 ? Math.round((doneCases / totalCases) * 100) : 0;
  const topContributor =
    classificationSummary.length > 0 ? classificationSummary[0] : null;

  // Pagination slice
  const totalPages = Math.ceil(totalCases / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setSelectedYear("2026");
    setStartDate("");
    setEndDate("");
    setSelectedClassification("all");
    setSelectedStatus("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* 1. Filter Section Card */}
      <Card className="border border-border bg-card/60 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Filter Periode & Tanggal
                </h3>
                <p className="text-xs text-muted-foreground">
                  Pilih tahun atau tentukan rentang tanggal temuan CAP
                </p>
              </div>
            </div>

            {(selectedYear !== "2026" ||
              startDate ||
              endDate ||
              selectedClassification !== "all" ||
              selectedStatus !== "all" ||
              searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline self-start sm:self-auto"
              >
                <X className="h-3.5 w-3.5" />
                Reset Semua Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Quick Year Selection */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Tahun Temuan
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    setSelectedYear("all");
                    setStartDate("");
                    setEndDate("");
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    selectedYear === "all" && !startDate && !endDate
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  Semua
                </button>
                {availableYears.map((yr) => {
                  const yrStr = String(yr);
                  const isSelected =
                    selectedYear === yrStr && !startDate && !endDate;
                  return (
                    <button
                      key={yr}
                      onClick={() => {
                        setSelectedYear(yrStr);
                        setStartDate("");
                        setEndDate("");
                        setCurrentPage(1);
                      }}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      }`}
                    >
                      {yr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Date Range */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Rentang Tanggal Custom
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                  title="Tanggal Awal"
                />
                <span className="text-xs text-muted-foreground">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                  title="Tanggal Akhir"
                />
              </div>
            </div>

            {/* Klasifikasi Masalah Filter */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Klasifikasi Masalah
              </label>
              <select
                value={selectedClassification}
                onChange={(e) => {
                  setSelectedClassification(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">Semua Klasifikasi</option>
                {availableClassifications.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Box */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Cari Kasus / Order / Temuan
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Ketik kata kunci..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-border bg-card py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Temuan */}
        <Card className="border border-border">
          <CardContent className="p-4 sm:p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Total Temuan Kasus
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {totalCases}
              </span>
              <span className="text-xs text-muted-foreground">kasus</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {startDate || endDate
                ? "Berdasarkan rentang tanggal"
                : selectedYear === "all"
                ? "Seluruh periode historis"
                : `Tahun ${selectedYear}`}
            </p>
          </CardContent>
        </Card>

        {/* Status Selesai (Done) */}
        <Card className="border border-border">
          <CardContent className="p-4 sm:p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Status Selesai (Done)
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {donePercentage}%
              </span>
              <span className="text-xs text-muted-foreground">
                ({doneCases}/{totalCases})
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Tindakan pencegahan terekam
            </p>
          </CardContent>
        </Card>

        {/* Kontributor Terbesar */}
        <Card className="border border-border">
          <CardContent className="p-4 sm:p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Kontributor Terbesar
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-foreground truncate">
                {topContributor?.name || "-"}
              </span>
              {topContributor && (
                <span className="text-xs font-semibold text-primary">
                  {topContributor.value}%
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {topContributor
                ? `${topContributor.count} dari ${totalCases} temuan`
                : "Tidak ada data"}
            </p>
          </CardContent>
        </Card>

        {/* Klasifikasi Aktif */}
        <Card className="border border-border">
          <CardContent className="p-4 sm:p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Kategori Terdeteksi
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {classificationSummary.length}
              </span>
              <span className="text-xs text-muted-foreground">klasifikasi</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Material, Man, Method, Machine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Distribution Pie Chart & Breakdown */}
      <Card className="border border-border">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Distribusi Klasifikasi Masalah
              </h3>
              <p className="text-xs text-muted-foreground">
                Persentase porsi penyebab masalah untuk periode yang dipilih
              </p>
            </div>
            <Badge variant="outline" className="self-start sm:self-auto text-xs">
              {totalCases} Kasus Terfilter
            </Badge>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
            {/* Pie Chart Component */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              {classificationSummary.length > 0 ? (
                <div className="h-56 sm:h-64 w-full max-w-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={classificationSummary}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={95}
                        paddingAngle={2}
                        strokeWidth={0}
                      >
                        {classificationSummary.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val, name, entry: any) => [
                          `${val}% (${entry.payload.count} kasus)`,
                          name,
                        ]}
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-56 items-center justify-center text-xs text-muted-foreground">
                  Tidak ada data untuk grafik pada filter ini
                </div>
              )}
            </div>

            {/* Legend Breakdown List */}
            <div className="lg:col-span-6 space-y-3">
              {classificationSummary.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-3 transition hover:bg-muted/60"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-foreground">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.count} kasus temuan
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-bold text-foreground">
                      {item.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Detailed Data Table */}
      <Card className="border border-border">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Daftar Temuan Masalah & Tindakan CAP
              </h3>
              <p className="text-xs text-muted-foreground">
                Klik pada salah satu baris untuk melihat analisa lengkap dan tindakan pencegahan
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              Menampilkan {paginatedItems.length} dari {totalCases} data
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3.5 py-3">Tanggal</th>
                  <th className="px-3.5 py-3">Klasifikasi</th>
                  <th className="px-3.5 py-3">Order / SPO</th>
                  <th className="px-3.5 py-3">Dept</th>
                  <th className="px-3.5 py-3 min-w-[220px]">Temuan Masalah</th>
                  <th className="px-3.5 py-3 min-w-[200px]">Tindakan Pencegahan</th>
                  <th className="px-3.5 py-3">Status</th>
                  <th className="px-3.5 py-3 text-center">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => {
                    const isExpanded = expandedId === item.id;
                    const colorKey = item.klasifikasiMasalah.toLowerCase();
                    const badgeColor =
                      CAP_CLASSIFICATION_COLORS[colorKey] || "#64748b";

                    return (
                      <>
                        <tr
                          key={item.id}
                          onClick={() =>
                            setExpandedId(isExpanded ? null : item.id)
                          }
                          className="cursor-pointer transition hover:bg-muted/40"
                        >
                          <td className="whitespace-nowrap px-3.5 py-3 font-medium text-foreground">
                            {item.tanggal || "-"}
                          </td>
                          <td className="whitespace-nowrap px-3.5 py-3">
                            <span
                              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold text-white"
                              style={{ backgroundColor: badgeColor }}
                            >
                              {item.klasifikasiMasalah}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3.5 py-3 text-muted-foreground">
                            {item.order || item.spo || "-"}
                          </td>
                          <td className="whitespace-nowrap px-3.5 py-3 text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {item.ditujukanUntuk || "-"}
                            </span>
                            {item.dibuatOleh && (
                              <span className="block text-[10px] text-muted-foreground">
                                dari {item.dibuatOleh}
                              </span>
                            )}
                          </td>
                          <td className="px-3.5 py-3 text-foreground line-clamp-2">
                            {item.temuanMasalah || "-"}
                          </td>
                          <td className="px-3.5 py-3 text-muted-foreground line-clamp-2">
                            {item.tindakanPenyelesaian || "-"}
                          </td>
                          <td className="whitespace-nowrap px-3.5 py-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" />
                              {item.status || "Done"}
                            </span>
                          </td>
                          <td className="px-3.5 py-3 text-center text-muted-foreground">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 inline" />
                            ) : (
                              <ChevronDown className="h-4 w-4 inline" />
                            )}
                          </td>
                        </tr>

                        {/* Expanded details */}
                        {isExpanded && (
                          <tr className="bg-muted/20">
                            <td colSpan={8} className="p-4 sm:p-5">
                              <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-inner">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                      Analisa Masalah:
                                    </p>
                                    <p className="mt-0.5 text-xs text-foreground leading-relaxed">
                                      {item.analisaMasalah || "-"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                      Penyebab Masalah:
                                    </p>
                                    <p className="mt-0.5 text-xs text-foreground leading-relaxed">
                                      {item.penyebabMasalah || "-"}
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 border-t border-border/60 pt-3">
                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                      Evaluasi Permasalahan:
                                    </p>
                                    <p className="mt-0.5 text-xs text-foreground leading-relaxed">
                                      {item.evaluasiPermasalahan || "-"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                      Tindakan Pencegahan Lengkap:
                                    </p>
                                    <p className="mt-0.5 text-xs text-foreground leading-relaxed">
                                      {item.tindakanPenyelesaian || "-"}
                                    </p>
                                  </div>
                                </div>

                                {item.tanggalDiselesaikan && (
                                  <div className="border-t border-border/60 pt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                    <span>
                                      Tanggal Diselesaikan:{" "}
                                      <strong className="text-foreground">
                                        {item.tanggalDiselesaikan}
                                      </strong>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 text-center text-xs text-muted-foreground"
                    >
                      Tidak ada temuan masalah yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">
                Halaman {currentPage} dari {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-foreground disabled:opacity-40 transition hover:bg-muted"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-foreground disabled:opacity-40 transition hover:bg-muted"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

