import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { threeR } from "@/lib/mock-data";

const items = [
  { label: "Glove active", data: threeR.gloveActive },
  { label: "WIP kulit", data: threeR.wipKulit },
  { label: "WIP logo", data: threeR.wipLogo },
  { label: "WIP pola", data: threeR.wipPola },
  { label: "WIP glove", data: threeR.wipGlove },
  { label: "WIP pending", data: threeR.wipPending },
];

export default function ThreeRDetailPage() {
  return (
    <PageShell
      title="3R"
      description="Gudang penyimpanan sementara barang reject, sampah kulit, dan glove yang diseleksi ulang."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p
                className={`text-2xl font-semibold ${
                  item.data.late > 0 ? "text-status-critical" : "text-foreground"
                }`}
              >
                {item.data.late}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  / {item.data.inProgressTotal} in-progress
                </span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Late, satuan {item.data.unit}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Rencana konten lanjutan:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Daftar detail per request (siapa yang minta, tanggal, status)</li>
            <li>Riwayat leadtime 1 hari per kategori</li>
            <li>Panel tanya AI kontekstual</li>
          </ul>
        </CardContent>
      </Card>
    </PageShell>
  );
}
