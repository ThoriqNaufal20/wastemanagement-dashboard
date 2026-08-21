// TODO: ganti semua angka di bawah dengan data asli begitu tersedia.
// Sengaja masih dummy — format visual sudah final, tinggal isi angkanya.
const KPIS = [
  { value: "+12,450", label: "Kg Waste Managed" },
  { value: "78%", label: "Recycled" },
  { value: "32%", label: "Waste Reduction" },
  { value: "24", label: "Projects" },
];

export function KpiSection() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto w-full max-w-[900px] text-center">
        <p className="mb-3 text-[11px] uppercase tracking-wide text-muted-foreground">
          Dampak yang terukur
        </p>
        <h2 className="text-xl font-medium text-foreground sm:text-2xl">
          Waste Management dalam Angka
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {KPIS.map((kpi) => (
            <div key={kpi.label} className="rounded-2xl bg-card px-4 py-8">
              <p className="text-3xl font-semibold text-primary sm:text-4xl">
                {kpi.value}
              </p>
              <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                {kpi.label}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[11px] italic text-muted-foreground">
          Data contoh — akan diperbarui dengan angka aktual
        </p>
      </div>
    </div>
  );
}
