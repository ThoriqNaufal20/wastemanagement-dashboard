"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { internalAuditRows } from "@/lib/mock-data";
import { StatusChip } from "@/components/dashboard/status-chip";
import { getAuditRowStatus } from "@/lib/internal-audit-utils";
import type { InternalAuditRow } from "@/lib/internal-audit-types";

interface InternalAuditTableProps {
  data?: InternalAuditRow[];
  isNavigable?: boolean;
}

export function InternalAuditTable({
  data,
  isNavigable = true,
}: InternalAuditTableProps) {
  const router = useRouter();
  const rows = data && data.length > 0 ? data : internalAuditRows;

  const handleNavigate = () => {
    if (isNavigable) {
      router.push("/internal-audit");
    }
  };

  return (
    <div
      onClick={handleNavigate}
      className={`group rounded-2xl bg-card p-4 transition-all duration-200 ${
        isNavigable
          ? "cursor-pointer border border-border/40 hover:border-primary/40 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_4px_8px_rgba(16,24,40,0.08)]"
          : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">
            Internal audit — rekap
          </p>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            Rekap Pabrik
          </span>
        </div>
        {isNavigable && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-primary">
            <span>Lihat detail & temuan</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Fact</TableHead>
              <TableHead className="text-right">OTS finding</TableHead>
              <TableHead className="text-right">Avg score</TableHead>
              <TableHead className="text-right">Area belum audit</TableHead>
              <TableHead>Start date</TableHead>
              <TableHead>End date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => {
              // Status aturan:
              // - DONE: sudah tidak ada area yg belum audit (areaBelumAudit === 0)
              // - ON PROGRESS: terdapat area yg belum audit tetapi belum melewati end date
              // - LATE: sudah melewati end date tetapi masih ada area yg belum diaudit
              const status = getAuditRowStatus(row.endDate, row.areaBelumAudit);
              const hasOts = row.otsFinding > 0;

              return (
                <TableRow
                  key={i}
                  className={
                    isNavigable
                      ? "cursor-pointer transition-colors hover:bg-muted/50"
                      : ""
                  }
                >
                  <TableCell className="text-muted-foreground">
                    {row.period}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {row.fact}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      hasOts
                        ? "font-bold text-status-critical"
                        : "text-muted-foreground"
                    }`}
                  >
                    {row.otsFinding}
                  </TableCell>
                  <TableCell className="text-right">{row.avgScore}</TableCell>
                  <TableCell
                    className={`text-right ${
                      row.areaBelumAudit > 0
                        ? "font-semibold text-amber-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {row.areaBelumAudit}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.startDate}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.endDate}
                  </TableCell>
                  <TableCell>
                    <StatusChip status={status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

