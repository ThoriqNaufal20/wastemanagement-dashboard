"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ExternalLink,
  CheckCircle2,
  Share2,
  AlertCircle,
  Building2,
  Image as ImageIcon,
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
import type { InternalAuditSupportData } from "@/lib/internal-audit-support-types";

interface AuditSupportViewProps {
  initialData: InternalAuditSupportData;
}

export function AuditSupportView({ initialData }: AuditSupportViewProps) {
  const [selectedFact, setSelectedFact] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const rows = initialData.rows || [];

  // Filtered rows
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      // Filter Fact
      if (selectedFact !== "ALL" && r.fact.toUpperCase() !== selectedFact.toUpperCase()) {
        return false;
      }

      // Filter Status
      if (selectedStatus === "OTS_ONLY") {
        if (!r.isOts) return false;
      } else if (selectedStatus === "DONE") {
        if (r.status.trim().toLowerCase() !== "done") return false;
      } else if (selectedStatus === "SHARED") {
        if (r.status.trim().replace(/\s+/g, " ").toLowerCase() !== "shared with team") {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchFinding = r.finding.toLowerCase().includes(q);
        const matchArea = r.area.toLowerCase().includes(q);
        const matchDept = r.supportiveDepartment.toLowerCase().includes(q);
        const matchCap = r.cap.toLowerCase().includes(q);
        const matchFact = r.fact.toLowerCase().includes(q);
        if (!matchFinding && !matchArea && !matchDept && !matchCap && !matchFact) {
          return false;
        }
      }

      return true;
    });
  }, [rows, selectedFact, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border border-border/50 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Total OTS Finding
              </span>
              <AlertCircle className="h-4 w-4 text-status-critical" />
            </div>
            <p className="mt-2 text-2xl font-bold text-status-critical sm:text-3xl">
              {initialData.totalOts}
            </p>
            <span className="mt-1 inline-block text-[11px] text-muted-foreground">
              Belum selesai / in progress
            </span>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Shared with Team
              </span>
              <Share2 className="h-4 w-4 text-sky-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-sky-500 sm:text-3xl">
              {initialData.totalShared}
            </p>
            <span className="mt-1 inline-block text-[11px] text-muted-foreground">
              Telah dikoordinasikan
            </span>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Selesai (Done)
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-500 sm:text-3xl">
              {initialData.totalDone}
            </p>
            <span className="mt-1 inline-block text-[11px] text-muted-foreground">
              Perbaikan telah terverifikasi
            </span>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Total Temuan
              </span>
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              {initialData.totalRows}
            </p>
            <span className="mt-1 inline-block text-[11px] text-muted-foreground">
              Dari semua pabrik
            </span>
          </CardContent>
        </Card>
      </div>

      {/* 2. Factory Breakdown Cards */}
      <div className="rounded-2xl border border-border/40 bg-card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Rangkuman Outstanding per Pabrik
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {initialData.factSummaries.map((f) => {
            const hasOts = f.ots > 0;
            const isSelected = selectedFact === f.fact;
            return (
              <button
                key={f.fact}
                onClick={() =>
                  setSelectedFact(isSelected ? "ALL" : f.fact)
                }
                className={`flex flex-col rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-xs"
                    : "border-border/60 bg-muted/30 hover:border-primary/40 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    Factory {f.fact}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Total: {f.total}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span
                    className={`text-xl font-bold ${
                      hasOts ? "text-status-critical" : "text-emerald-500"
                    }`}
                  >
                    {f.ots}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    OTS finding
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedFact("ALL")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              selectedFact === "ALL"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            Semua Pabrik
          </button>
          {initialData.factSummaries.map((f) => (
            <button
              key={f.fact}
              onClick={() => setSelectedFact(f.fact)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedFact === f.fact
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              Fact {f.fact} ({f.ots})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-muted/40 p-0.5">
            <button
              onClick={() => setSelectedStatus("ALL")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedStatus === "ALL"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setSelectedStatus("OTS_ONLY")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedStatus === "OTS_ONLY"
                  ? "bg-status-critical/15 text-status-critical shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Hanya OTS
            </button>
            <button
              onClick={() => setSelectedStatus("SHARED")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedStatus === "SHARED"
                  ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Shared
            </button>
            <button
              onClick={() => setSelectedStatus("DONE")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedStatus === "DONE"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Done
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari temuan / dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border/80 bg-card py-1.5 pl-8 pr-3 text-xs placeholder:text-muted-foreground/70 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* 4. Detail Table */}
      <div className="rounded-2xl border border-border/40 bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            Daftar Temuan Audit Support Team
          </p>
          <span className="text-xs text-muted-foreground">
            Menampilkan {filteredRows.length} dari {rows.length} data
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Period</TableHead>
                <TableHead className="w-16">Fact</TableHead>
                <TableHead className="min-w-[140px]">Area</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="min-w-[220px]">Temuan (Finding)</TableHead>
                <TableHead className="min-w-[140px]">Supportive Dept</TableHead>
                <TableHead className="min-w-[200px]">CAP (Action Plan)</TableHead>
                <TableHead className="w-24">Target Fin</TableHead>
                <TableHead className="w-24">Actual Fin</TableHead>
                <TableHead className="w-16 text-center">Foto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="py-10 text-center text-xs text-muted-foreground"
                  >
                    Tidak ada temuan yang cocok dengan filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row, i) => {
                  const s = row.status.trim().toLowerCase();
                  const isDone = s === "done";
                  const isShared = s === "shared with team";
                  const isOts = row.isOts;

                  let badgeColor = "bg-muted text-muted-foreground";
                  if (isDone) {
                    badgeColor = "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold";
                  } else if (isShared) {
                    badgeColor = "bg-sky-500/15 text-sky-600 dark:text-sky-400 font-semibold";
                  } else if (isOts) {
                    badgeColor = "bg-rose-500/15 text-rose-600 dark:text-rose-400 font-semibold";
                  }

                  return (
                    <TableRow key={i} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="text-xs text-muted-foreground">
                        {row.period}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {row.fact}
                      </TableCell>
                      <TableCell className="text-xs text-foreground font-medium">
                        {row.area}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] ${badgeColor}`}
                        >
                          {row.status || "No Status"}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-foreground">
                        {row.finding}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground">
                        {row.supportiveDepartment}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {row.cap || "-"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {row.targetFin || "-"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {row.actualFin || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.image ? (
                          <a
                            href={row.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-1 text-[10px] font-medium text-primary hover:bg-primary/10 transition-colors"
                            title="Buka foto temuan"
                          >
                            <ImageIcon className="h-3 w-3" />
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/60">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

