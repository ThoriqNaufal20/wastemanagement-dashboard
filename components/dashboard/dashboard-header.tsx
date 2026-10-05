import { LiveClock } from "@/components/dashboard/live-clock";
import { CurrentQuarterBadge } from "@/components/dashboard/current-quarter-badge";
import { Logo } from "@/components/dashboard/logo";
import { companyInfo } from "@/lib/mock-data";

export function DashboardHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
      <div className="flex items-center gap-3">
        <Logo size={36} />
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {companyInfo.name}
          </p>
          <h1 className="text-base font-semibold text-foreground">
            {companyInfo.department}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LiveClock />
        <CurrentQuarterBadge />
      </div>
    </header>
  );
}
