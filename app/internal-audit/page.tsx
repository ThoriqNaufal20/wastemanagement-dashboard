import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { internalAuditRows, internalAuditUrgentThreshold } from "@/lib/mock-data";

export default function InternalAuditDetailPage() {
  return (
    <PageShell
      title="Internal audit"
      description="Detail outstanding finding per factory, seluruh periode."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {internalAuditRows.map((row) => (
          <Card key={row.fact}>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">Factory {row.fact}</p>
              <p
                className={`text-2xl font-semibold ${
                  row.otsFinding > internalAuditUrgentThreshold
                    ? "text-status-critical"
                    : "text-foreground"
                }`}
              >
                {row.otsFinding}
              </p>
              <p className="text-[11px] text-muted-foreground">OTS finding</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Rencana konten lanjutan:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Breakdown temuan per area/kategori masalah</li>
            <li>Tren outstanding finding antar periode audit</li>
            <li>Panel tanya AI kontekstual (akan diaktifkan setelah sumber data detail final)</li>
          </ul>
        </CardContent>
      </Card>
    </PageShell>
  );
}
