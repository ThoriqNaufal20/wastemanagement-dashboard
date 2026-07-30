import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { progressShipment } from "@/lib/mock-data";
import { isFriday } from "@/lib/urgency";

export default function ProgressShipmentDetailPage() {
  const total = progressShipment.hutangProduksi + progressShipment.hutangCarton;

  return (
    <PageShell
      title="Progress shipment minggu depan"
      description="Barang yang masih diproduksi dan masih packing untuk shipment minggu depan."
    >
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Hutang produksi</p>
            <p className="text-2xl font-semibold text-foreground">
              {progressShipment.hutangProduksi} <span className="text-xs font-normal text-muted-foreground">pcs</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Hutang carton</p>
            <p className="text-2xl font-semibold text-foreground">
              {progressShipment.hutangCarton} <span className="text-xs font-normal text-muted-foreground">pcs</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Threshold Jumat</p>
            <p className="text-2xl font-semibold text-foreground">
              {progressShipment.fridayThreshold} <span className="text-xs font-normal text-muted-foreground">pcs</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <p>
            Total belum kirim saat ini: <strong className="text-foreground">{total} pcs</strong>.
            {isFriday()
              ? " Hari ini Jumat — status akan urgent jika total melebihi threshold."
              : " Hari ini bukan Jumat, sehingga status tidak urgent meski total tinggi."}
          </p>
          <p className="mt-3 font-medium text-foreground">Rencana konten lanjutan:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Breakdown per style/PO yang belum shipment</li>
            <li>Tren harian menjelang deadline shipment</li>
            <li>Panel tanya AI kontekstual</li>
          </ul>
        </CardContent>
      </Card>
    </PageShell>
  );
}
