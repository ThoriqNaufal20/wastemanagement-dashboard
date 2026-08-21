import { Recycle, Trash2, ClipboardCheck, LineChart } from "lucide-react";

const CAPABILITIES = [
  {
    icon: Recycle,
    title: "3R",
    subtitle: "Reduce · Reuse · Recycle",
  },
  {
    icon: Trash2,
    title: "Waste Management",
    subtitle: "Collection · Processing · Monitoring",
  },
  {
    icon: ClipboardCheck,
    title: "Audit & Compliance",
    subtitle: "Monitoring · Evaluation · Improvement",
  },
  {
    icon: LineChart,
    title: "Data & Analytics",
    subtitle: "Tracking · Reporting · Decision Making",
  },
];

export function AboutWhatWeDo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto w-full max-w-[900px]">
        <p className="mb-3 text-[11px] uppercase tracking-wide text-muted-foreground">
          Tentang kami
        </p>
        <h2 className="max-w-2xl text-xl font-medium text-foreground sm:text-2xl">
          Mengubah Pengelolaan Limbah Menjadi Dampak yang Terukur
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Waste Management Department bertanggung jawab atas pengelolaan
          limbah produksi PT. Adira Semesta Industry secara menyeluruh — mulai
          dari kepatuhan terhadap audit internal &amp; eksternal, seleksi dan
          pemanfaatan kembali material reject (3R), hingga monitoring performa
          operasional berbasis data. Pendekatan kami memadukan disiplin
          operasional dengan komitmen jangka panjang terhadap keberlanjutan.
        </p>

        <p className="mb-3 mt-9 text-[11px] uppercase tracking-wide text-muted-foreground">
          Yang kami lakukan
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-card p-5 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-2.5 text-sm font-medium text-foreground">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
