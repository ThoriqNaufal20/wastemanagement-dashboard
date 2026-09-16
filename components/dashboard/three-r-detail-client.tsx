"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Recycle,
  Layers,
  Tag,
  Box,
  Hand,
  Clock,
  Search,
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
import { StatusChip, type StatusLevel } from "@/components/dashboard/status-chip";
import type {
  GloveActiveSummary,
  GloveActiveDetailItem,
  Timbangan3RSummary,
  Timbangan3RDetailItem,
  WipKulitSummary,
  WipKulitDetailItem,
} from "@/lib/three-r-types";

export interface ThreeRDetailClientProps {
  gloveSummary: GloveActiveSummary;
  timbanganSummary: Timbangan3RSummary;
  wipKulitSummary: WipKulitSummary;
  gloveDetails: GloveActiveDetailItem[];
  timbanganDetails: Timbangan3RDetailItem[];
  wipKulitDetails: WipKulitDetailItem[];
}

type TabKey =
  | "all"
  | "glove-active"
  | "wip-kulit"
  | "wip-logo"
  | "wip-pola"
  | "wip-glove"
  | "wip-pending";

function ThreeRDetailContent({
  gloveSummary,
  timbanganSummary,
  wipKulitSummary,
  gloveDetails,
  timbanganDetails,
  wipKulitDetails,
}: ThreeRDetailClientProps) {
  const searchParams = useSearchParams();
  const paramTab = searchParams.get("tab") as TabKey | null;

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "late" | "pending" | "progress">("all");

  useEffect(() => {
    if (paramTab && ["all", "glove-active", "wip-kulit", "wip-logo", "wip-pola", "wip-glove", "wip-pending"].includes(paramTab)) {
      setActiveTab(paramTab);
    }
  }, [paramTab]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    if (tab === "all") {
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("tab", tab);
    }
    window.history.replaceState({}, "", url.toString());
  };

  // Group timbangan details by category
  const logoItems = useMemo(
    () => timbanganDetails.filter((item) => item.kategori.toUpperCase().includes("LOGO")),
    [timbanganDetails]
  );
  const polaItems = useMemo(
    () => timbanganDetails.filter((item) => item.kategori.toUpperCase().includes("POLA")),
    [timbanganDetails]
  );
  const gloveTimbanganItems = useMemo(
    () => timbanganDetails.filter((item) => item.kategori.toUpperCase().includes("GLOVE")),
    [timbanganDetails]
  );
  const pendingItems = useMemo(
    () => timbanganDetails.filter((item) => item.status.toUpperCase() === "PENDING"),
    [timbanganDetails]
  );

  // Filtered Glove Details
  const filteredGlove = useMemo(() => {
    return gloveDetails.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        item.namaBarang.toLowerCase().includes(q) ||
        item.pic.toLowerCase().includes(q) ||
        item.peruntukan.toLowerCase().includes(q) ||
        item.no.includes(q);

      if (!matchSearch) return false;

      if (statusFilter === "late") return item.terlambat.toUpperCase() === "LATE";
      if (statusFilter === "pending") return item.terlambat.toUpperCase() === "ON HOLD";
      if (statusFilter === "progress") return item.terlambat.toUpperCase() === "OK";
      return true;
    });
  }, [gloveDetails, searchQuery, statusFilter]);

  // Filtered WIP Kulit
  const filteredKulit = useMemo(() => {
    return wipKulitDetails.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        item.fact.toLowerCase().includes(q) ||
        item.spo.toLowerCase().includes(q) ||
        item.style.toLowerCase().includes(q) ||
        item.keterangan.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (statusFilter === "late") return item.status.toUpperCase() === "LATE";
      if (statusFilter === "pending") return false;
      if (statusFilter === "progress") return item.status.toUpperCase() === "WIP";
      return true;
    });
  }, [wipKulitDetails, searchQuery, statusFilter]);

  // Generic filter for Timbangan items
  const filterTimbanganItems = (items: Timbangan3RDetailItem[]) => {
    return items.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        item.barang.toLowerCase().includes(q) ||
        item.dept.toLowerCase().includes(q) ||
        item.operator.toLowerCase().includes(q) ||
        item.noSj.toLowerCase().includes(q) ||
        item.note.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (statusFilter === "late") return item.status.toUpperCase() === "LATE";
      if (statusFilter === "pending") return item.status.toUpperCase() === "PENDING";
      if (statusFilter === "progress") return item.status.toUpperCase() === "DALAM PROSES";
      return true;
    });
  };

  const filteredLogo = useMemo(() => filterTimbanganItems(logoItems), [logoItems, searchQuery, statusFilter]);
  const filteredPola = useMemo(() => filterTimbanganItems(polaItems), [polaItems, searchQuery, statusFilter]);
  const filteredGloveTimbangan = useMemo(
    () => filterTimbanganItems(gloveTimbanganItems),
    [gloveTimbanganItems, searchQuery, statusFilter]
  );
  const filteredPending = useMemo(
    () => filterTimbanganItems(pendingItems),
    [pendingItems, searchQuery, statusFilter]
  );

  const totalActiveCount =
    gloveDetails.length +
    wipKulitDetails.length +
    timbanganDetails.length;

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: totalActiveCount },
    { key: "glove-active", label: "Glove Active", count: gloveDetails.length },
    { key: "wip-kulit", label: "WIP Kulit", count: wipKulitDetails.length },
    { key: "wip-logo", label: "WIP Logo", count: logoItems.length },
    { key: "wip-pola", label: "WIP Pola", count: polaItems.length },
    { key: "wip-glove", label: "WIP Glove", count: gloveTimbanganItems.length },
    { key: "wip-pending", label: "Pending", count: pendingItems.length },
  ];

  return (
    <div className="space-y-6">
      {/* 6 Metrik Kartu Ringkasan (Live Google Sheets) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* 1. Glove Active */}
        <Card
          onClick={() => handleTabChange("glove-active")}
          className={`cursor-pointer transition-all hover:border-primary/50 ${
            activeTab === "glove-active" ? "ring-2 ring-primary border-primary bg-primary/[0.03]" : "bg-card"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Glove Active</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Recycle className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {gloveSummary.late > 0 ? (
                <span className="text-status-critical">{gloveSummary.late}</span>
              ) : (
                gloveSummary.late
              )}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                / {gloveSummary.totalInProgress} in-progress
              </span>
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              {gloveSummary.late > 0 ? (
                <StatusChip status="late" />
              ) : gloveSummary.onHold > 0 ? (
                <StatusChip status="pending" />
              ) : (
                <StatusChip status="on_progress" />
              )}
              {gloveSummary.onHold > 0 && (
                <span className="text-[10px] text-muted-foreground">
                  ({gloveSummary.onHold} hold)
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 2. WIP Kulit */}
        <Card
          onClick={() => handleTabChange("wip-kulit")}
          className={`cursor-pointer transition-all hover:border-primary/50 ${
            activeTab === "wip-kulit" ? "ring-2 ring-primary border-primary bg-primary/[0.03]" : "bg-card"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">WIP Kulit</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layers className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {wipKulitSummary.late > 0 ? (
                <span className="text-status-critical">{wipKulitSummary.late}</span>
              ) : (
                wipKulitSummary.late
              )}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                / {wipKulitSummary.total} KG
              </span>
            </p>
            <div className="mt-2 flex items-center">
              <StatusChip status={wipKulitSummary.late > 0 ? "late" : "on_progress"} />
            </div>
          </CardContent>
        </Card>

        {/* 3. WIP Logo */}
        <Card
          onClick={() => handleTabChange("wip-logo")}
          className={`cursor-pointer transition-all hover:border-primary/50 ${
            activeTab === "wip-logo" ? "ring-2 ring-primary border-primary bg-primary/[0.03]" : "bg-card"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">WIP Logo</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Tag className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {timbanganSummary.logo.late > 0 ? (
                <span className="text-status-critical">{timbanganSummary.logo.late}</span>
              ) : (
                timbanganSummary.logo.late
              )}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                / {timbanganSummary.logo.total} req
              </span>
            </p>
            <div className="mt-2 flex items-center">
              <StatusChip status={timbanganSummary.logo.late > 0 ? "late" : "on_progress"} />
            </div>
          </CardContent>
        </Card>

        {/* 4. WIP Pola */}
        <Card
          onClick={() => handleTabChange("wip-pola")}
          className={`cursor-pointer transition-all hover:border-primary/50 ${
            activeTab === "wip-pola" ? "ring-2 ring-primary border-primary bg-primary/[0.03]" : "bg-card"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">WIP Pola</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Box className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {timbanganSummary.pola.late > 0 ? (
                <span className="text-status-critical">{timbanganSummary.pola.late}</span>
              ) : (
                timbanganSummary.pola.late
              )}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                / {timbanganSummary.pola.total} req
              </span>
            </p>
            <div className="mt-2 flex items-center">
              <StatusChip status={timbanganSummary.pola.late > 0 ? "late" : "on_progress"} />
            </div>
          </CardContent>
        </Card>

        {/* 5. WIP Glove */}
        <Card
          onClick={() => handleTabChange("wip-glove")}
          className={`cursor-pointer transition-all hover:border-primary/50 ${
            activeTab === "wip-glove" ? "ring-2 ring-primary border-primary bg-primary/[0.03]" : "bg-card"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">WIP Glove</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Hand className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {timbanganSummary.glove.late > 0 ? (
                <span className="text-status-critical">{timbanganSummary.glove.late}</span>
              ) : (
                timbanganSummary.glove.late
              )}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                / {timbanganSummary.glove.total} req
              </span>
            </p>
            <div className="mt-2 flex items-center">
              <StatusChip status={timbanganSummary.glove.late > 0 ? "late" : "on_progress"} />
            </div>
          </CardContent>
        </Card>

        {/* 6. WIP Pending */}
        <Card
          onClick={() => handleTabChange("wip-pending")}
          className={`cursor-pointer transition-all hover:border-primary/50 ${
            activeTab === "wip-pending" ? "ring-2 ring-primary border-primary bg-primary/[0.03]" : "bg-card"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">WIP Pending</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-status-warning/15 text-status-warning">
                <Clock className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {timbanganSummary.totalPending}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                item pending
              </span>
            </p>
            <div className="mt-2 flex items-center">
              <StatusChip status={timbanganSummary.totalPending > 0 ? "pending" : "on_progress"} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kontrol & Filter Section */}
      <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === tab.key
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Status Filters */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari item, PIC, SPO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filter status item"
            className="h-9 rounded-xl border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Semua Status</option>
            <option value="late">LATE (Terlambat)</option>
            <option value="pending">PENDING / HOLD</option>
            <option value="progress">DALAM PROSES</option>
          </select>
        </div>
      </div>

      {/* TABEL DATA AKTIF */}
      <div className="space-y-6">
        {/* TAB: Glove Active */}
        {(activeTab === "all" || activeTab === "glove-active") && (
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Recycle className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Glove Active — Permintaan Aktif
                </h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {filteredGlove.length} item
                </span>
              </div>
            </div>

            {filteredGlove.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Tidak ada data Glove Active yang sesuai dengan filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">No</TableHead>
                      <TableHead>Tgl Permintaan</TableHead>
                      <TableHead>PIC</TableHead>
                      <TableHead>Peruntukan</TableHead>
                      <TableHead>Nama Barang</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">QTY</TableHead>
                      <TableHead>Status Permintaan</TableHead>
                      <TableHead>Keterlambatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGlove.map((item, i) => {
                      const terlambatUpper = item.terlambat.toUpperCase();
                      const statusBadge: StatusLevel =
                        terlambatUpper === "LATE"
                          ? "late"
                          : terlambatUpper === "ON HOLD"
                          ? "pending"
                          : "on_progress";

                      return (
                        <TableRow key={i}>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {item.no}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {item.tanggalPermintaan}
                          </TableCell>
                          <TableCell className="font-medium text-xs">
                            {item.pic}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {item.peruntukan}
                          </TableCell>
                          <TableCell className="font-medium text-xs">
                            {item.namaBarang}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {item.size}
                          </TableCell>
                          <TableCell className="text-right font-medium text-xs">
                            {item.qty}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground capitalize">
                            {item.status}
                          </TableCell>
                          <TableCell>
                            <StatusChip status={statusBadge} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* TAB: WIP Kulit */}
        {(activeTab === "all" || activeTab === "wip-kulit") && (
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  WIP Kulit — Timbangan & Cek 3R Aktif
                </h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {filteredKulit.length} item
                </span>
              </div>
            </div>

            {filteredKulit.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Tidak ada data WIP Kulit yang sesuai dengan filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tgl Masuk</TableHead>
                      <TableHead>Fact</TableHead>
                      <TableHead>SPO</TableHead>
                      <TableHead>Style</TableHead>
                      <TableHead className="text-right">Berat Kirim (KG)</TableHead>
                      <TableHead className="text-right">Cek 3R (KG)</TableHead>
                      <TableHead className="text-right">% Lolos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Keterangan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKulit.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {item.tanggal}
                        </TableCell>
                        <TableCell className="font-semibold text-xs text-foreground">
                          {item.fact}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {item.spo}
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                          {item.style}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-xs">
                          {item.beratKiriman}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {item.beratSetelahCek || "-"}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {item.kelolosan ? `${item.kelolosan}%` : "-"}
                        </TableCell>
                        <TableCell>
                          <StatusChip
                            status={item.status.toUpperCase() === "LATE" ? "late" : "on_progress"}
                          />
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {item.keterangan !== "-" ? item.keterangan : item.temuan}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* TAB: WIP Logo / Pola / Glove / Pending (Timbangan 3R) */}
        {(activeTab === "all" ||
          activeTab === "wip-logo" ||
          activeTab === "wip-pola" ||
          activeTab === "wip-glove" ||
          activeTab === "wip-pending") && (
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  {activeTab === "wip-logo"
                    ? "WIP Logo Reject"
                    : activeTab === "wip-pola"
                    ? "WIP Pola Reject"
                    : activeTab === "wip-glove"
                    ? "WIP Glove Reject"
                    : activeTab === "wip-pending"
                    ? "Timbangan 3R — Status Pending"
                    : "Timbangan 3R (Logo, Pola, Glove & Pending)"}
                </h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {activeTab === "wip-logo"
                    ? filteredLogo.length
                    : activeTab === "wip-pola"
                    ? filteredPola.length
                    : activeTab === "wip-glove"
                    ? filteredGloveTimbangan.length
                    : activeTab === "wip-pending"
                    ? filteredPending.length
                    : filteredLogo.length + filteredPola.length + filteredGloveTimbangan.length} item
                </span>
              </div>
            </div>

            {(() => {
              const displayItems =
                activeTab === "wip-logo"
                  ? filteredLogo
                  : activeTab === "wip-pola"
                  ? filteredPola
                  : activeTab === "wip-glove"
                  ? filteredGloveTimbangan
                  : activeTab === "wip-pending"
                  ? filteredPending
                  : [...filteredLogo, ...filteredPola, ...filteredGloveTimbangan];

              if (displayItems.length === 0) {
                return (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    Tidak ada data timbangan yang sesuai dengan filter.
                  </div>
                );
              }

              return (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Barang</TableHead>
                        <TableHead>Dept / Tujuan</TableHead>
                        <TableHead>No SJ</TableHead>
                        <TableHead>Operator</TableHead>
                        <TableHead className="text-right">QTY</TableHead>
                        <TableHead>UOM</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Note</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayItems.map((item, i) => {
                        const s = item.status.toUpperCase();
                        const statusBadge: StatusLevel =
                          s === "LATE" ? "late" : s === "PENDING" ? "pending" : "on_progress";

                        return (
                          <TableRow key={i}>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {item.tanggal}
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-foreground">
                              {item.kategori}
                            </TableCell>
                            <TableCell className="text-xs font-medium">
                              {item.barang}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {item.dept}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {item.noSj}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {item.operator}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-xs">
                              {item.qty}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {item.uom}
                            </TableCell>
                            <TableCell>
                              <StatusChip status={statusBadge} />
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                              {item.note}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export function ThreeRDetailClient(props: ThreeRDetailClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">
          Memuat data 3R dari Google Sheets...
        </div>
      }
    >
      <ThreeRDetailContent {...props} />
    </Suspense>
  );
}

