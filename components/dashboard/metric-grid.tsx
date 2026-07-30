interface Metric {
  label: string;
  value: number;
}

interface MetricGridProps {
  metrics: Metric[];
  columns?: 2 | 3;
}

/**
 * Menampilkan grid metrik persentase.
 *
 * Catatan warna: saat ini semua angka ditampilkan netral (text-foreground).
 * Setelah rules "kapan merah, kapan normal" ditentukan, logika warna
 * bisa ditambahkan di sini, misalnya:
 *
 *   const isCritical = value < 60; // contoh threshold, sesuaikan rules asli
 *   className={isCritical ? "text-status-critical" : "text-foreground"}
 */
export function MetricGrid({ metrics, columns = 3 }: MetricGridProps) {
  return (
    <div
      className={`grid gap-4 ${
        columns === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"
      }`}
    >
      {metrics.map((metric) => (
        <div key={metric.label} className="space-y-1">
          <p className="text-xs leading-tight text-muted-foreground">
            {metric.label}
          </p>
          <p className="text-2xl font-semibold text-foreground">
            {metric.value}%
          </p>
        </div>
      ))}
    </div>
  );
}
