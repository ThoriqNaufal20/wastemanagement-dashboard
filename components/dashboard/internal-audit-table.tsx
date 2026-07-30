import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { internalAuditRows, internalAuditUrgentThreshold } from "@/lib/mock-data";

export function InternalAuditTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Internal audit — detail lengkap
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {internalAuditRows.map((row, i) => {
                const isUrgent = row.otsFinding > internalAuditUrgentThreshold;
                return (
                  <TableRow key={i}>
                    <TableCell className="text-muted-foreground">
                      {row.period}
                    </TableCell>
                    <TableCell className="font-medium">{row.fact}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        isUrgent ? "text-status-critical" : ""
                      }`}
                    >
                      {row.otsFinding}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.avgScore}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.areaBelumAudit}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.startDate}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.endDate}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
