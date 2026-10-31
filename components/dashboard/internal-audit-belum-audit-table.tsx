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
import { cn } from "@/lib/utils";
import type { InternalAuditBelumAuditRow } from "@/lib/internal-audit-types";

interface InternalAuditBelumAuditTableProps {
  data?: InternalAuditBelumAuditRow[];
  isNavigable?: boolean;
  className?: string;
}

export function InternalAuditBelumAuditTable({
  data = [],
  isNavigable = true,
  className,
}: InternalAuditBelumAuditTableProps) {
  const router = useRouter();

  const handleNavigate = () => {
    if (isNavigable) {
      router.push("/internal-audit");
    }
  };

  return (
    <div
      onClick={handleNavigate}
      className={cn(
        "group flex h-full flex-col rounded-2xl bg-card p-4 transition-all duration-200",
        isNavigable
          ? "cursor-pointer border border-border/40 hover:border-primary/40 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_4px_8px_rgba(16,24,40,0.08)]"
          : "",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          Audit Area Hari Ini
        </p>
        {isNavigable && (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>

      <div className="flex-1 overflow-x-auto max-h-[300px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow className="h-9">
              <TableHead className="w-[65px] text-[11px]">Pabrik</TableHead>
              <TableHead className="w-[110px] text-[11px]">Area / Seksi</TableHead>
              <TableHead className="min-w-[150px] text-[11px]">Poin Audit</TableHead>
              <TableHead className="w-[100px] text-[11px]">Jawaban PIC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-xs text-muted-foreground"
                >
                  Seluruh area pada factory yang aktif telah diaudit.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow
                  key={`${row.factory}-${row.area}-${row.section}-${idx}`}
                  className="h-9 hover:bg-muted/40 text-xs"
                >
                  <TableCell className="font-bold text-foreground">
                    {row.factory.toLowerCase().startsWith("fact")
                      ? row.factory
                      : `F-${row.factory}`}
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-foreground leading-tight">
                      {row.area}
                    </p>
                    {row.section && (
                      <span className="text-[10px] text-muted-foreground block">
                        {row.section}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <p
                      className="line-clamp-2 text-foreground/90 leading-snug"
                      title={row.poinAudit}
                    >
                      {row.poinAudit || "-"}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-[11px]">
                    {row.jawabanPic || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
