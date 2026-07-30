import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { correctiveActionPlan } from "@/lib/mock-data";

export default function CorrectiveActionPlanDetailPage() {
  return (
    <PageShell
      title="Corrective action plan"
      description="Rasio historis kategori masalah (Material, Man, Method, Machine)."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {correctiveActionPlan.map((item) => (
          <Card key={item.name}>
            <CardContent className="flex items-center gap-2 pt-6">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <p className="text-xs text-muted-foreground">{item.name}</p>
                <p className="text-lg font-semibold text-foreground">
                  {item.value}%
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Status data:</p>
          <p className="mt-2">
            Saat ini masih versi historis (CAP yang sudah <em>done</em> saja),
            sesuai keputusan untuk menunda perubahan sampai pencatatan status
            "belum done" tersedia secara real-time.
          </p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
