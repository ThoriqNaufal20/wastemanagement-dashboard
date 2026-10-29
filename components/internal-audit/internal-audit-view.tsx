"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ExternalLink,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Building2,
  MapPin,
  Eye,
  FileSpreadsheet,
  ListFilter,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InternalAuditTable } from "@/components/dashboard/internal-audit-table";
import type {
  InternalAuditFullData,
  OtsInternalAuditAreaRow,
  OtsInternalAuditDetailRow,
} from "@/lib/internal-audit-types";

interface InternalAuditViewProps {
  initialData: InternalAuditFullData;
}

export function InternalAuditView({ initialData }: InternalAuditViewProps) {
  const [activeTab, setActiveTab] = useState<"area" | "detail" | "main">("area");
  const [selectedFact, setSelectedFact] = useState<string>("ALL");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDetailItem, setSelectedDetailItem] = useState<OtsInternalAuditDetailRow | null>(null);

  // Pagination untuk tab detail
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  // Sorting untuk tab Rekap Area
  const [sortField, setSortField] = useState<"otsFinding" | "area" | "inProgress" | "noCap">("otsFinding");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Dapatkan daftar unik Fact & Period
  const uniqueFacts = useMemo(() => {
    const set = new Set<string>();
    initialData.areaRows.forEach((r) => r.fact && set.add(r.fact));
    initialData.detailRows.forEach((r) => r.fact && set.add(r.fact));
    return Array.from(set).sort();
  }, [initialData]);

  const uniquePeriods = useMemo(() => {
    const set = new Set<string>();
    initialData.areaRows.forEach((r) => r.period && set.add(r.period));
    initialData.detailRows.forEach((r) => r.period && set.add(r.period));
    return Array.from(set).sort();
  }, [initialData]);

  // Filter Data Rekap Area
  const filteredAreaRows = useMemo(() => {
    return initialData.areaRows
      .filter((row) => {
        if (selectedFact !== "ALL" && row.fact.toUpperCase() !== selectedFact.toUpperCase()) {
          return false;
        }
        if (selectedPeriod !== "ALL" && row.period.toUpperCase() !== selectedPeriod.toUpperCase()) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchArea = row.area.toLowerCase().includes(q);
          const matchPic = row.pic.toLowerCase().includes(q);
          const matchFact = row.fact.toLowerCase().includes(q);
          if (!matchArea && !matchPic && !matchFact) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === "string") {
          return sortOrder === "asc"
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }
        return sortOrder === "asc"
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      });
  }, [initialData.areaRows, selectedFact, selectedPeriod, searchQuery, sortField, sortOrder]);

  // Filter Data Detail Temuan
  const filteredDetailRows = useMemo(() => {
    return initialData.detailRows.filter((row) => {
      if (selectedFact !== "ALL" && row.fact.toUpperCase() !== selectedFact.toUpperCase()) {
        return false;
      }
      if (selectedPeriod !== "ALL" && row.period.toUpperCase() !== selectedPeriod.toUpperCase()) {
        return false;
      }
      if (selectedStatus === "OTS_ONLY" && !row.isOts) {
        return false;
      }
      if (selectedStatus === "IN_PROGRESS" && row.status !== "IN PROGRESS") {
        return false;
      }
      if (selectedStatus === "NO_CAP" && (row.status === "DONE" || Boolean(row.cap))) {
        return false;
      }
      if (selectedStatus === "HOLD" && row.status !== "HOLD") {
        return false;
      }
      if (selectedStatus === "DONE" && row.status !== "DONE") {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchArea = row.area.toLowerCase().includes(q);
        const matchSection = (row.section || "").toLowerCase().includes(q);
        const matchNoPoin = (row.noPoin || "").toLowerCase().includes(q);
        const matchAspect = (row.aspect || "").toLowerCase().includes(q);
        const matchPoint = row.auditPoint.toLowerCase().includes(q);
        const matchFindings = row.findings.toLowerCase().includes(q);
        const matchCi = (row.continuousImprovement || "").toLowerCase().includes(q);
        const matchPic = (row.pic || row.teamSupport || "").toLowerCase().includes(q);
        const matchCap = row.cap.toLowerCase().includes(q);
        if (
          !matchArea &&
          !matchSection &&
          !matchNoPoin &&
          !matchAspect &&
          !matchPoint &&
          !matchFindings &&
          !matchCi &&
          !matchPic &&
          !matchCap
        ) {
          return false;
        }
      }
      return true;
    });
  }, [initialData.detailRows, selectedFact, selectedPeriod, selectedStatus, searchQuery]);

  // Pagination slice
  const totalPages = Math.ceil(filteredDetailRows.length / itemsPerPage) || 1;
  const paginatedDetailRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDetailRows.slice(start, start + itemsPerPage);
  }, [filteredDetailRows, currentPage, itemsPerPage]);

  // Kalkulasi KPI dinamis berdasarkan filter Fact & Period yang dipilih
  const dynamicKpi = useMemo(() => {
    let ots = 0;
    let inProgress = 0;
    let noCap = 0;
    let hold = 0;

    filteredAreaRows.forEach((r) => {
      ots += r.otsFinding;
      inProgress += r.inProgress;
      noCap += r.noCap;
      hold += r.hold;
    });

    const done = filteredDetailRows.filter((d) => d.status === "DONE").length;

    return {
      ots,
      inProgress,
      noCap,
      hold,
      done,
    };
  }, [filteredAreaRows, filteredDetailRows]);

  const handleDrilldownArea = (areaName: string) => {
    setSearchQuery(areaName);
    setActiveTab("detail");
    setCurrentPage(1);
  };

  const toggleSort = (field: "otsFinding" | "area" | "inProgress" | "noCap") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Baris Filter & Kontrol Global */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-card p-4 shadow-sm border border-border/50">
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Factory */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="font-medium">Factory:</span>
            <select
              value={selectedFact}
              onChange={(e) => {
                setSelectedFact(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">Semua Pabrik</option>
              {uniqueFacts.map((f) => (
                <option key={f} value={f}>
                  {f.toLowerCase().startsWith("fact") ? f : `Factory ${f}`}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Periode */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Periode:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">Semua Periode</option>
              {uniquePeriods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status (khusus tab detail) */}
          {activeTab === "detail" && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ListFilter className="h-4 w-4" />
              <span className="font-medium">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">Semua Status</option>
                <option value="OTS_ONLY">Hanya Temuan OTS</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="NO_CAP">Belum Ada CAP</option>
                <option value="HOLD">Hold</option>
                <option value="DONE">Done / Selesai</option>
              </select>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari area, temuan, PIC, CAP..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-border bg-background pl-8 pr-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Kartu Metrik Ringkasan (KPI Cards) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              OTS Finding
            </p>
            <p className="mt-1 text-2xl font-bold text-status-critical">
              {dynamicKpi.ots}
            </p>
            <p className="text-[10px] text-muted-foreground">Total temuan aktif</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              In Progress
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-500">
              {dynamicKpi.inProgress}
            </p>
            <p className="text-[10px] text-muted-foreground">Sedang diperbaiki</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              No CAP
            </p>
            <p className="mt-1 text-2xl font-bold text-orange-600">
              {dynamicKpi.noCap}
            </p>
            <p className="text-[10px] text-muted-foreground">Belum ada rencana CAP</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Hold
            </p>
            <p className="mt-1 text-2xl font-bold text-muted-foreground">
              {dynamicKpi.hold}
            </p>
            <p className="text-[10px] text-muted-foreground">Ditunda sementara</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Done / Valid
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-500">
              {dynamicKpi.done}
            </p>
            <p className="text-[10px] text-muted-foreground">Telah selesai</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Tab Switcher Navigation */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("area")}
          className={`relative pb-3 pt-2 text-sm font-semibold transition-colors ${
            activeTab === "area"
              ? "text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Rekap per Area & PIC ({filteredAreaRows.length})
        </button>

        <button
          onClick={() => setActiveTab("detail")}
          className={`relative ml-6 pb-3 pt-2 text-sm font-semibold transition-colors ${
            activeTab === "detail"
              ? "text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Rincian Temuan Masalah ({filteredDetailRows.length})
        </button>

        <button
          onClick={() => setActiveTab("main")}
          className={`relative ml-6 pb-3 pt-2 text-sm font-semibold transition-colors ${
            activeTab === "main"
              ? "text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Ringkasan Pabrik (Main)
        </button>
      </div>

      {/* 4. Tab 1: Rekap per Area (WEBOTSInternalAudit) */}
      {activeTab === "area" && (
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Rekapitulasi Temuan per Area Kerja
              </h2>
              <p className="text-xs text-muted-foreground">
                Sumber named range: <code className="text-[11px] font-mono">WEBOTSInternalAudit</code>
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              Menampilkan {filteredAreaRows.length} area
            </span>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Periode</TableHead>
                  <TableHead className="w-[80px]">Pabrik</TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort("area")}
                      className="flex items-center gap-1 font-semibold hover:text-foreground"
                    >
                      Area / Section
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button
                      onClick={() => toggleSort("otsFinding")}
                      className="inline-flex items-center gap-1 font-semibold hover:text-foreground ml-auto"
                    >
                      OTS Finding
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button
                      onClick={() => toggleSort("inProgress")}
                      className="inline-flex items-center gap-1 font-semibold hover:text-foreground ml-auto"
                    >
                      In Progress
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button
                      onClick={() => toggleSort("noCap")}
                      className="inline-flex items-center gap-1 font-semibold hover:text-foreground ml-auto"
                    >
                      No CAP
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Hold</TableHead>
                  <TableHead>PIC</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAreaRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-28 text-center text-muted-foreground">
                      Tidak ada data area yang sesuai dengan filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAreaRows.map((row, idx) => {
                    const hasOts = row.otsFinding > 0;
                    return (
                      <TableRow key={`${row.fact}-${row.period}-${row.area}-${idx}`} className="hover:bg-muted/40">
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {row.period}
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          {row.fact.toLowerCase().startsWith("fact") ? row.fact : `Fact ${row.fact}`}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {row.area}
                        </TableCell>
                        <TableCell
                          className={`text-right font-bold ${
                            hasOts ? "text-status-critical" : "text-muted-foreground"
                          }`}
                        >
                          {row.otsFinding}
                        </TableCell>
                        <TableCell className="text-right font-medium text-amber-500">
                          {row.inProgress}
                        </TableCell>
                        <TableCell className="text-right font-medium text-orange-600">
                          {row.noCap}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {row.hold}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {row.pic || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDrilldownArea(row.area)}
                            className="h-7 text-xs text-primary hover:text-primary/80"
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            Lihat Temuan
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Rincian Temuan Masalah (WEBOTSInternalAuditDetail) */}
      {activeTab === "detail" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Daftar Detail Temuan & Tindakan Perbaikan (CAP)
              </h2>
              <p className="text-xs text-muted-foreground">
                Sumber named range: <code className="text-[11px] font-mono">WEBOTSInternalAuditDetail</code> ·
                Menampilkan {filteredDetailRows.length} item
              </p>
            </div>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="h-7 text-xs"
              >
                Hapus filter area/kata kunci ({searchQuery})
              </Button>
            )}
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[90px]">Pabrik/Per.</TableHead>
                  <TableHead className="w-[180px]">Area, Seksi & Aspek</TableHead>
                  <TableHead className="min-w-[260px]">Temuan (Findings)</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[110px]">Team Support</TableHead>
                  <TableHead className="min-w-[220px]">Tindakan (CAP)</TableHead>
                  <TableHead className="w-[110px] text-center">Dokumentasi</TableHead>
                  <TableHead className="w-[100px]">Validasi</TableHead>
                  <TableHead className="w-[80px] text-center">Rincian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDetailRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                      Tidak ditemukan data temuan yang cocok dengan filter pencarian.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDetailRows.map((item) => {
                    const isDone = item.status === "DONE";
                    const isInProgress = item.status === "IN PROGRESS";
                    const isHold = item.status === "HOLD";
                    const isOpen = !isDone && !isInProgress && !isHold;

                    return (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="align-top font-mono text-xs">
                          <span className="font-bold text-foreground">F-{item.fact}</span>
                          <span className="block text-[10px] text-muted-foreground">{item.period}</span>
                        </TableCell>

                        <TableCell className="align-top text-xs">
                          <p className="font-semibold text-foreground">{item.area}</p>
                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                            {item.section && (
                              <span className="inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                {item.section}
                              </span>
                            )}
                            {item.aspect && (
                              <span className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                {item.aspect}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="align-top text-xs">
                          <p className="font-medium text-foreground line-clamp-2" title={item.findings}>
                            {item.findings || <span className="italic text-muted-foreground">Tidak ada temuan spesifik</span>}
                          </p>
                          {item.continuousImprovement && (
                            <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                              <span className="font-semibold text-primary">CI:</span> {item.continuousImprovement}
                            </p>
                          )}
                        </TableCell>

                        <TableCell className="align-top">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isDone
                                ? "bg-emerald-500/10 text-emerald-500"
                                : isInProgress
                                ? "bg-amber-500/10 text-amber-500"
                                : isHold
                                ? "bg-muted text-muted-foreground"
                                : "bg-status-critical/10 text-status-critical"
                            }`}
                          >
                            {item.status}
                          </span>
                        </TableCell>

                        <TableCell className="align-top text-xs text-foreground font-medium">
                          {item.teamSupport || item.pic || "-"}
                        </TableCell>

                        <TableCell className="align-top text-xs">
                          <p className="text-muted-foreground line-clamp-2" title={item.cap}>
                            {item.cap || <span className="italic text-muted-foreground/60">Belum ada CAP</span>}
                          </p>
                          {(item.targetCap || item.targetFin) && (
                            <span className="mt-1 block text-[10px] text-muted-foreground">
                              Target: {item.targetCap || item.targetFin}
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="align-top text-center">
                          <div className="flex flex-col items-center gap-1">
                            {item.photoUrl ? (
                              <a
                                href={item.photoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded bg-muted/80 px-2 py-1 text-[10px] font-medium text-primary hover:bg-muted"
                                title="Buka foto temuan"
                              >
                                <Camera className="h-3 w-3" />
                                <span>Foto</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            ) : null}
                            {item.photoAfterUrl ? (
                              <a
                                href={item.photoAfterUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-600 hover:bg-emerald-500/20"
                                title="Buka foto setelah perbaikan"
                              >
                                <Check className="h-3 w-3" />
                                <span>After</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            ) : null}
                            {!item.photoUrl && !item.photoAfterUrl && (
                              <span className="text-[10px] text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="align-top text-xs">
                          {item.validasiAuditor?.toUpperCase() === "OK" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                              <CheckCircle2 className="h-3 w-3" />
                              OK
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                              {item.validasiAuditor || "Pending"}
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="align-top text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDetailItem(item)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, filteredDetailRows.length)} dari{" "}
                {filteredDetailRows.length} item
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="h-8 px-2 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Sebelumnya
                </Button>
                <span className="px-2 font-medium text-foreground">
                  Halaman {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="h-8 px-2 text-xs"
                >
                  Berikutnya
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Tab 3: Ringkasan Pabrik (WEBInternalAuditMain) */}
      {activeTab === "main" && (
        <div className="space-y-4">
          <InternalAuditTable data={initialData.mainRows} isNavigable={false} />
        </div>
      )}

      {/* 7. Modal Detail Dialog untuk Menampilkan Temuan Lengkap */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setSelectedDetailItem(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-border pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  Factory {selectedDetailItem.fact}
                </span>
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                  {selectedDetailItem.period}
                </span>
                {selectedDetailItem.section && (
                  <span className="rounded bg-primary/5 px-2 py-0.5 text-xs font-semibold text-primary">
                    Seksi: {selectedDetailItem.section}
                  </span>
                )}
                {selectedDetailItem.noPoin && (
                  <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                    No. Poin: {selectedDetailItem.noPoin}
                  </span>
                )}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    selectedDetailItem.status === "DONE"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : selectedDetailItem.status === "IN PROGRESS"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-status-critical/10 text-status-critical"
                  }`}
                >
                  {selectedDetailItem.status}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-foreground">
                {selectedDetailItem.area}
              </h3>
              {selectedDetailItem.aspect && (
                <p className="text-xs text-muted-foreground">
                  Kategori / Aspek: <span className="font-semibold text-foreground">{selectedDetailItem.aspect}</span>
                </p>
              )}
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Standar Audit Point */}
              {selectedDetailItem.auditPoint && (
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="font-semibold text-foreground">Standar / Audit Point:</p>
                  <p className="mt-1 whitespace-pre-line text-muted-foreground leading-relaxed">
                    {selectedDetailItem.auditPoint}
                  </p>
                </div>
              )}

              {/* Temuan Masalah */}
              <div>
                <p className="font-semibold text-foreground">Temuan Masalah (Findings):</p>
                <p className="mt-1 rounded-lg border border-border bg-background p-3 text-status-critical font-medium leading-relaxed">
                  {selectedDetailItem.findings || "Tidak ada rincian temuan tertulis."}
                </p>
              </div>

              {/* Usulan CI */}
              {selectedDetailItem.continuousImprovement && (
                <div>
                  <p className="font-semibold text-foreground">Continuous Improvement:</p>
                  <p className="mt-1 rounded-lg border border-border bg-background p-3 text-muted-foreground leading-relaxed">
                    {selectedDetailItem.continuousImprovement}
                  </p>
                </div>
              )}

              {/* Rencana Tindakan Perbaikan (CAP) */}
              <div>
                <p className="font-semibold text-foreground">Rencana Tindakan Penyelesaian (CAP):</p>
                <p className="mt-1 rounded-lg border border-border bg-background p-3 text-foreground leading-relaxed">
                  {selectedDetailItem.cap || "Belum ada tindakan CAP yang didaftarkan."}
                </p>
              </div>

              {/* Grid Team Support & Jadwal */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl bg-muted/30 p-3">
                <div>
                  <p className="text-muted-foreground text-[11px]">Team Support</p>
                  <p className="font-semibold text-foreground">
                    {selectedDetailItem.teamSupport || selectedDetailItem.pic || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Tgl Dibuat</p>
                  <p className="font-semibold text-foreground">
                    {selectedDetailItem.tglDibuat || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Target CAP</p>
                  <p className="font-semibold text-foreground">
                    {selectedDetailItem.targetCap || selectedDetailItem.targetFin || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Selesai Aktual</p>
                  <p className="font-semibold text-foreground">
                    {selectedDetailItem.tglSelesaiAktual || selectedDetailItem.actualFin || selectedDetailItem.validasiAuditor || "-"}
                  </p>
                </div>
              </div>

              {/* Link Foto */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {selectedDetailItem.photoUrl && (
                  <a
                    href={selectedDetailItem.photoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
                  >
                    <Camera className="h-4 w-4" />
                    Buka Foto Temuan (Sebelum)
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {selectedDetailItem.photoAfterUrl && (
                  <a
                    href={selectedDetailItem.photoAfterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700"
                  >
                    <Check className="h-4 w-4" />
                    Buka Foto Realisasi (Setelah)
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {/* Catatan Tambahan (Note) */}
              {selectedDetailItem.note && (
                <div className="border-t border-border pt-3">
                  <p className="font-semibold text-foreground">Catatan / Note:</p>
                  <p className="mt-1 text-muted-foreground italic">
                    {selectedDetailItem.note}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

