import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { kelolosanSampahKulit } from "@/lib/mock-data";

export default function KelolosanDetailPage() {
  return (
    <PageShell
      title="% Kelolosan sampah kulit"
      description="Kulit yang lolos seleksi, dibandingkan 2 minggu terakhir."
    >
      <div className="grid grid-cols-2 gap-3">
        {kelolosanSampahKulit.map((row) => (
          <Card key={row.week}>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">{row.week}</p>
              <p className="mt-1 text-sm text-foreground">
                Fact A: <strong>{row.A}%</strong>
              </p>
              <p className="text-sm text-foreground">
                Fact K: <strong>{row.K}%</strong>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Rencana konten lanjutan:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Tren mingguan lebih panjang (bukan cuma 2 minggu)</li>
            <li>Breakdown per jenis kulit / kategori reject</li>
          </ul>
        </CardContent>
      </Card>
    </PageShell>
  );
}
