import { FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MetricGrid } from "@/components/dashboard/metric-grid";
import { scorecardMetrics } from "@/lib/mock-data";

export function ScorecardCard() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold">
            Scorecard Departement
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <MetricGrid metrics={scorecardMetrics} columns={3} />
      </CardContent>
    </Card>
  );
}
