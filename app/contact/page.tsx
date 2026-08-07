import { Mail, Phone, MapPin } from "lucide-react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { companyInfo } from "@/lib/mock-data";

// TODO: ganti detail kontak di bawah dengan data asli perusahaan.
const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "wastemanagement@adirasemesta.com" },
  { icon: Phone, label: "Telepon", value: "+62 21 0000 0000" },
  { icon: MapPin, label: "Alamat", value: "Jakarta, Indonesia" },
];

export default function ContactPage() {
  return (
    <PageShell
      title="Contact us"
      description={`Hubungi tim ${companyInfo.department} kalau ada pertanyaan atau kendala terkait dashboard ini.`}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {CONTACT_INFO.map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <item.icon className="mb-2 h-5 w-5 text-primary" />
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium text-foreground">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
