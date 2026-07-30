import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardDeptScore } from "@/lib/mock-data";

const breakdown = [
  { label: "I. Visualisasi", value: 81 },
  { label: "II. Target & gap", value: 65 },
  { label: "III. Problem", value: 78 },
  { label: "IV. Validity", value: 93 },
  { label: "V. Performance", value: 71 },
  { label: "VI. Internal review", value: 66 },
  { label: "VII. Action plan", value: 65 },
  { label: "VIII. ASI software", value: 35 },
  { label: "IX. Data integration", value: 80 },
];

export default function DashboardDeptDetailPage() {
  return (
    <PageShell
      title="Dashboard departement"
      description={`Update per kuartal. Merah jika di bawah ${dashboardDeptScore.redBelow}%. Tidak masuk logika urgensi grid.`}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {breakdown.map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p
                className={`text-xl font-semibold ${
                  item.value < dashboardDeptScore.redBelow
                    ? "text-status-critical"
                    : "text-foreground"
                }`}
              >
                {item.value}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Rencana konten lanjutan:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>History penilaian antar-kuartal + perbandingan</li>
          </ul>
        </CardContent>
      </Card>
    </PageShell>
  );
}
