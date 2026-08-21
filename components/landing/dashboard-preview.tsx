import Link from "next/link";
import { ClipboardList, Recycle, TrendingUp, ArrowRight } from "lucide-react";

export function DashboardPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto w-full max-w-[900px] text-center">
        <p className="mb-3 text-[11px] uppercase tracking-wide text-muted-foreground">
          Real-time monitoring
        </p>
        <h2 className="text-xl font-medium text-foreground sm:text-2xl">
          Lihat Waste Management dalam Angka Nyata
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Jelajahi dashboard kami untuk memantau performa, tren, dan dampak
          keberlanjutan secara langsung.
        </p>

        {/* Mockup visual — bukan screenshot data asli, murni ilustrasi */}
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-card p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:p-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary/[0.06] p-3 text-left">
              <ClipboardList className="h-4 w-4 text-primary" />
              <p className="mt-2 text-lg font-semibold text-foreground">102</p>
              <p className="text-[10px] text-muted-foreground">OTS Finding</p>
            </div>
            <div className="rounded-xl bg-status-success/10 p-3 text-left">
              <Recycle className="h-4 w-4 text-status-success" />
              <p className="mt-2 text-lg font-semibold text-foreground">2/3</p>
              <p className="text-[10px] text-muted-foreground">3R Active</p>
            </div>
            <div className="rounded-xl bg-status-warning/10 p-3 text-left">
              <TrendingUp className="h-4 w-4 text-status-warning" />
              <p className="mt-2 text-lg font-semibold text-foreground">78%</p>
              <p className="text-[10px] text-muted-foreground">Scorecard</p>
            </div>
          </div>
          <div className="mt-3 flex items-end gap-1.5 rounded-xl bg-muted p-3">
            {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/40"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>

        <Link
          href="/login"
          className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02] hover:opacity-90"
        >
          Buka Dashboard
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
