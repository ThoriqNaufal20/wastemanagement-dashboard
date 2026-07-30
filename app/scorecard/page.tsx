import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { scorecardScore } from "@/lib/mock-data";

const breakdown = [
  { label: "I. Function", value: 78 },
  { label: "II. Strategy", value: 77 },
  { label: "III. Information & system cap", value: 77 },
  { label: "IV. Employee cap", value: 75 },
  { label: "V. Performance", value: 80 },
  { label: "VI. Problem solving", value: 92 },
];

export default function ScorecardDetailPage() {
  return (
    <PageShell
      title="Scorecard departement"
      description={`Update per kuartal. Merah jika di bawah ${scorecardScore.redBelow}%.`}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {breakdown.map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p
                className={`text-xl font-semibold ${
                  item.value < scorecardScore.redBelow
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
            <li>History skor antar-kuartal + perbandingan</li>
          </ul>
        </CardContent>
      </Card>
    </PageShell>
  );
}
