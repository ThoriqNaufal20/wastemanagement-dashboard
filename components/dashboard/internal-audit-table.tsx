import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { internalAuditRows } from "@/lib/mock-data";
import { StatusChip } from "@/components/dashboard/status-chip";

export function InternalAuditTable() {
  return (
    <div className="rounded-2xl bg-card p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">
        Internal audit — detail lengkap
      </p>
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
            {internalAuditRows.map((row, i) => {
              const isLate = row.otsFinding > 0;
              return (
                <TableRow key={i}>
                  <TableCell className="text-muted-foreground">{row.period}</TableCell>
                  <TableCell className="font-medium">{row.fact}</TableCell>
                  <TableCell
                    className={`text-right font-medium ${isLate ? "text-status-critical" : ""}`}
                  >
                    {row.otsFinding}
                  </TableCell>
                  <TableCell className="text-right">{row.avgScore}</TableCell>
                  <TableCell className="text-right">{row.areaBelumAudit}</TableCell>
                  <TableCell className="text-muted-foreground">{row.startDate}</TableCell>
                  <TableCell className="text-muted-foreground">{row.endDate}</TableCell>
                  <TableCell>
                    <StatusChip status={isLate ? "late" : "on_progress"} />
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
