import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { wipSewing, wipSewingThreshold } from "@/lib/mock-data";

export default function WipSewingDetailPage() {
  return (
    <PageShell
      title="WIP sewing > 7 hari"
      description="Barang di area sewing yang sudah lebih dari 7 hari tapi belum masuk gudang."
    >
      <div className="grid grid-cols-3 gap-3">
        {wipSewing.map((line) => (
          <Card key={line.line}>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">Line {line.line}</p>
              <p
                className={`text-2xl font-semibold ${
                  line.qty > wipSewingThreshold ? "text-status-critical" : "text-foreground"
                }`}
              >
                {line.qty} <span className="text-xs font-normal text-muted-foreground">pcs</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <p>
            Threshold urgent saat ini: <strong className="text-foreground">{wipSewingThreshold} pcs</strong> (tentatif).
          </p>
          <p className="mt-3 font-medium text-foreground">Rencana konten lanjutan:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Breakdown per style/PO yang menumpuk di line K</li>
            <li>Tren 7 hari terakhir per line</li>
            <li>Panel tanya AI kontekstual</li>
          </ul>
        </CardContent>
      </Card>
    </PageShell>
  );
}
