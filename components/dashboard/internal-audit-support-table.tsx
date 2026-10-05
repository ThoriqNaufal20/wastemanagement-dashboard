"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InternalAuditSupportFactSummary } from "@/lib/internal-audit-support-types";

interface InternalAuditSupportTableProps {
  summaries?: InternalAuditSupportFactSummary[];
  totalOts?: number;
  totalRows?: number;
  isNavigable?: boolean;
}

export function InternalAuditSupportTable({
  summaries = [],
  totalOts,
  totalRows,
  isNavigable = true,
}: InternalAuditSupportTableProps) {
  const router = useRouter();

  const handleNavigate = () => {
    if (isNavigable) {
      router.push("/audit-supportive-dept");
    }
  };

  const computedTotalOts =
    totalOts ?? summaries.reduce((acc, s) => acc + s.ots, 0);
  const computedTotalRows =
    totalRows ?? summaries.reduce((acc, s) => acc + s.total, 0);

  return (
    <div
      onClick={handleNavigate}
      className={`group flex h-full flex-col justify-between rounded-2xl bg-card p-4 transition-all duration-200 ${
        isNavigable
          ? "cursor-pointer border border-border/40 hover:border-primary/40 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_4px_8px_rgba(16,24,40,0.08)]"
          : ""
      }`}
    >
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              Internal audit — support team
            </p>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              Rekap Support
            </span>
          </div>
          {isNavigable && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-primary">
              <span>Lihat detail</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fact</TableHead>
                <TableHead className="text-right">OTS finding</TableHead>
                <TableHead className="text-right">Total temuan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-6 text-center text-xs text-muted-foreground"
                  >
                    Tidak ada data support team.
                  </TableCell>
                </TableRow>
              ) : (
                summaries.map((row) => {
                  const hasOts = row.ots > 0;
                  return (
                    <TableRow
                      key={row.fact}
                      className={
                        isNavigable
                          ? "cursor-pointer transition-colors hover:bg-muted/50"
                          : ""
                      }
                    >
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
                        {row.ots}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {row.total}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
            {summaries.length > 0 && (
              <TableFooter>
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell className="font-semibold text-foreground">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold text-status-critical">
                    {computedTotalOts}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {computedTotalRows}
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </div>
    </div>
  );
}

