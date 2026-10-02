"use client";

import { useState, useMemo } from "react";
import {
  Factory,
  Clock,
  Package,
  Search,
  AlertTriangle,
  CheckCircle2,
  Layers,
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
import { StatusChip } from "@/components/dashboard/status-chip";
import {
  type WipSewingFactSummary,
  type WipSewingDetailItem,
  type WipSewingGroupedItem,
  WIP_SEWING_THRESHOLD,
} from "@/lib/wip-sewing-types";

export interface WipSewingDetailClientProps {
  summary: WipSewingFactSummary[];
  details: WipSewingDetailItem[];
}

export function WipSewingDetailClient({
  summary,
  details,
}: WipSewingDetailClientProps) {
  const [selectedFact, setSelectedFact] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [overdueFilter, setOverdueFilter] = useState<"all" | "over14" | "over7">("all");
  const [viewMode, setViewMode] = useState<"rekap" | "box" | "both">("rekap");

  const totalQtyAll = useMemo(
    () => summary.reduce((acc, curr) => acc + curr.qty, 0),
    [summary]
  );

  const filteredItems = useMemo(() => {
    return details.filter((item) => {
      // Filter Factory
      if (selectedFact !== "ALL" && item.fact.toUpperCase() !== selectedFact) {
        return false;
      }

      // Filter Overdue
      if (overdueFilter === "over14" && item.overdueWorkdays <= 14) {
        return false;
      }
      if (overdueFilter === "over7" && item.overdueWorkdays <= 7) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.spo.toLowerCase().includes(q) ||
          item.style.toLowerCase().includes(q) ||
          item.noBox.toLowerCase().includes(q) ||
          item.line.toLowerCase().includes(q) ||
          item.scanDst.toLowerCase().includes(q) ||
          item.size.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [details, selectedFact, overdueFilter, searchQuery]);

  // Agregasi per Fact, SPO, Style, Size
  const groupedItems = useMemo<WipSewingGroupedItem[]>(() => {
    const map = new Map<
      string,
      {
        fact: string;
        spo: string;
        style: string;
        size: string;
        totalQty: number;
        totalBox: number;
        scanDstSet: Set<string>;
        overdueList: number[];
        linesSet: Set<string>;
        boxList: string[];
      }
    >();

    filteredItems.forEach((item) => {
      const fact = item.fact.trim().toUpperCase();
      const spo = item.spo.trim();
      const style = item.style.trim();
      const size = item.size.trim();
      const key = `${fact}__${spo}__${style}__${size}`;

      if (!map.has(key)) {
        map.set(key, {
          fact,
          spo,
          style,
          size,
          totalQty: 0,
          totalBox: 0,
          scanDstSet: new Set<string>(),
          overdueList: [],
          linesSet: new Set<string>(),
          boxList: [],
        });
      }

      const entry = map.get(key)!;
      entry.totalQty += item.qty;
      entry.totalBox += 1;
      if (item.scanDst && item.scanDst !== "-") {
        entry.scanDstSet.add(item.scanDst);
      }
      if (item.overdueWorkdays > 0) {
        entry.overdueList.push(item.overdueWorkdays);
      }
      if (item.line && item.line !== "-") {
        entry.linesSet.add(item.line);
      }
      if (item.noBox && item.noBox !== "-") {
        entry.boxList.push(item.noBox);
      }
    });

    const result: WipSewingGroupedItem[] = [];
    map.forEach((val, key) => {
      const scanDstArray = Array.from(val.scanDstSet);
      let scanDstDisplay = "-";
      if (scanDstArray.length === 1) {
        scanDstDisplay = scanDstArray[0];
      } else if (scanDstArray.length > 1) {
        scanDstDisplay = scanDstArray.join(", ");
      }

      const maxOverdue =
        val.overdueList.length > 0 ? Math.max(...val.overdueList) : 0;

      result.push({
        key,
        fact: val.fact,
        spo: val.spo,
        style: val.style,
        size: val.size,
        totalQty: val.totalQty,
        totalBox: val.totalBox,
        scanDst: scanDstDisplay,
        overdueWorkdays: maxOverdue,
        lines: Array.from(val.linesSet),
        boxList: val.boxList,
      });
    });

    return result.sort((a, b) => {
      if (b.overdueWorkdays !== a.overdueWorkdays) {
        return b.overdueWorkdays - a.overdueWorkdays;
      }
      return b.totalQty - a.totalQty;
    });
  }, [filteredItems]);

  const totalQtyFiltered = useMemo(
    () => filteredItems.reduce((acc, curr) => acc + curr.qty, 0),
    [filteredItems]
  );

  return (
    <div className="space-y-6">
      {/* Kartu Ringkasan Factory */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summary.map((factSummary) => {
          const isSelected = selectedFact === factSummary.fact;
          const isOverThreshold = factSummary.qty > WIP_SEWING_THRESHOLD;

          return (
            <Card
              key={factSummary.fact}
              onClick={() =>
                setSelectedFact(isSelected ? "ALL" : factSummary.fact)
              }
              className={`cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md ${
                isSelected
                  ? "ring-2 ring-primary border-primary bg-primary/[0.03]"
                  : "bg-card"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <Factory className="h-3.5 w-3.5 text-primary" />
                      Factory {factSummary.fact}
                    </span>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {factSummary.qty.toLocaleString("id-ID")}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        pcs
                      </span>
                    </p>
                  </div>
                  <StatusChip status={isOverThreshold ? "late" : "on_progress"} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                  <div>
                    <p className="text-[11px]">Maks Overdue</p>
                    <p className="mt-0.5 font-semibold text-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3 text-status-warning" />
                      {factSummary.maxOverdue} hari kerja
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px]">Total Box</p>
                    <p className="mt-0.5 font-semibold text-foreground flex items-center gap-1">
                      <Package className="h-3 w-3 text-primary" />
                      {factSummary.totalBox.toLocaleString("id-ID")} box
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-muted-foreground">
                  {isOverThreshold ? (
                    <span className="flex items-center gap-1 text-status-critical font-medium">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {(factSummary.qty - WIP_SEWING_THRESHOLD).toLocaleString(
                        "id-ID"
                      )}{" "}
                      pcs di atas target {WIP_SEWING_THRESHOLD.toLocaleString("id-ID")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-status-success font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Di bawah target {WIP_SEWING_THRESHOLD.toLocaleString("id-ID")} pcs
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Kontrol Filter & Search */}
      <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        {/* Factory Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedFact("ALL")}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
              selectedFact === "ALL"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Semua Factory ({details.length} box)
          </button>
          {summary.map((s) => (
            <button
              key={s.fact}
              onClick={() => setSelectedFact(s.fact)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                selectedFact === s.fact
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Fact {s.fact} ({s.totalBox} box)
            </button>
          ))}
        </div>

        {/* Filter Overdue & Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari SPO, style, no box, line..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={overdueFilter}
            onChange={(e) => setOverdueFilter(e.target.value as any)}
            aria-label="Filter overdue workdays"
            className="h-9 rounded-xl border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Semua Overdue</option>
            <option value="over14">&gt; 14 Hari Kerja</option>
            <option value="over7">&gt; 7 Hari Kerja</option>
          </select>
        </div>
      </div>

      {/* Switcher Tampilan Tabel */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-1">
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card p-1 shadow-xs">
          <button
            onClick={() => setViewMode("rekap")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "rekap"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Rekap (Per SPO & Style)
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                viewMode === "rekap"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {groupedItems.length}
            </span>
          </button>

          <button
            onClick={() => setViewMode("box")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "box"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Package className="h-3.5 w-3.5" />
            Detail Box (Per Box)
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                viewMode === "box"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {filteredItems.length}
            </span>
          </button>

          <button
            onClick={() => setViewMode("both")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "both"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Tampilkan Keduanya
          </button>
        </div>

        <div className="text-xs text-muted-foreground">
          Total WIP: <strong className="text-foreground">{totalQtyFiltered.toLocaleString("id-ID")} pcs</strong> ({filteredItems.length} box)
        </div>
      </div>

      {/* Tabel 1: Rekap WIP Sewing per Fact, SPO, Style, Size */}
      {(viewMode === "rekap" || viewMode === "both") && (
        <div className="rounded-2xl bg-card p-5 shadow-sm border border-border/50">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Rekap WIP Sewing per SPO & Style
                </h2>
                <p className="text-xs text-muted-foreground">
                  Menampilkan akumulasi quantity WIP sewing yang telah dijumlahkan dari box sejenis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                {totalQtyFiltered.toLocaleString("id-ID")} pcs
              </span>
              <span className="rounded-lg bg-muted px-2.5 py-1 text-muted-foreground font-medium">
                {groupedItems.length} grup SPO ({filteredItems.length} box)
              </span>
            </div>
          </div>

          {groupedItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Tidak ada data rekap yang sesuai dengan filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>Fact</TableHead>
                    <TableHead>SPO</TableHead>
                    <TableHead>Style</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Qty (pcs)</TableHead>
                    <TableHead className="text-center">Jml Box</TableHead>
                    <TableHead>Scan DST</TableHead>
                    <TableHead className="text-right">Overdue (Workdays)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedItems.map((item, index) => {
                    const isHighOverdue = item.overdueWorkdays >= 15;
                    return (
                      <TableRow
                        key={item.key}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <TableCell className="text-xs text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-primary">
                          {item.fact}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-semibold text-foreground whitespace-nowrap">
                          {item.spo}
                        </TableCell>
                        <TableCell
                          className="text-xs font-medium max-w-[240px] truncate"
                          title={item.style}
                        >
                          {item.style}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-foreground">
                          {item.size}
                        </TableCell>
                        <TableCell className="text-right text-xs font-bold text-foreground">
                          {item.totalQty.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-center text-xs">
                          <span
                            className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                            title={
                              item.boxList.length > 0
                                ? `No Box: ${item.boxList.join(", ")}`
                                : undefined
                            }
                          >
                            <Package className="h-3 w-3" />
                            {item.totalBox} box
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {item.scanDst}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold ${
                              isHighOverdue
                                ? "bg-status-critical/10 text-status-critical"
                                : "bg-status-warning/10 text-status-warning"
                            }`}
                          >
                            {item.overdueWorkdays} hari
                          </span>
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

      {/* Tabel 2: Detail Box Asli (Per Box) */}
      {(viewMode === "box" || viewMode === "both") && (
        <div className="rounded-2xl bg-card p-5 shadow-sm border border-border/50">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Daftar Box WIP Sewing &gt; 7 Hari (Per Box)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Rincian data per satuan nomor box fisik di line produksi
                </p>
              </div>
            </div>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {filteredItems.length} box ditampilkan
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Tidak ada data box yang sesuai dengan filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>No Box</TableHead>
                    <TableHead>Fact</TableHead>
                    <TableHead>Line</TableHead>
                    <TableHead>SPO</TableHead>
                    <TableHead>Style</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Qty (pcs)</TableHead>
                    <TableHead>Scan DST</TableHead>
                    <TableHead className="text-right">Overdue (Workdays)</TableHead>
                    <TableHead>Time Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item, index) => {
                    const isHighOverdue = item.overdueWorkdays >= 15;
                    return (
                      <TableRow key={`${item.noBox}-${index}`}>
                        <TableCell className="text-xs text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-medium text-foreground">
                          {item.noBox}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-primary">
                          {item.fact}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {item.line}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {item.spo}
                        </TableCell>
                        <TableCell className="text-xs font-medium max-w-[220px] truncate">
                          {item.style}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {item.size}
                        </TableCell>
                        <TableCell className="text-right text-xs font-semibold text-foreground">
                          {item.qty.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {item.scanDst}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold ${
                              isHighOverdue
                                ? "bg-status-critical/10 text-status-critical"
                                : "bg-status-warning/10 text-status-warning"
                            }`}
                          >
                            {item.overdueWorkdays} hari
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {item.timeRange}
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
    </div>
  );
}

