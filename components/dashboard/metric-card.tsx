import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  isUrgent?: boolean;
  icon: LucideIcon;
  href: string;
}

export function MetricCard({
  label,
  value,
  suffix,
  isUrgent = false,
  icon: Icon,
  href,
}: MetricCardProps) {
  return (
    <Link
      href={href}
      className={`group flex flex-col justify-between gap-2 rounded-xl p-3 transition-colors ${
        isUrgent
          ? "border border-status-critical/40 bg-status-critical/10 hover:bg-status-critical/15"
          : "border border-transparent bg-card hover:bg-muted/60"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <Icon
            className={`h-3.5 w-3.5 shrink-0 ${
              isUrgent ? "text-status-critical" : "text-muted-foreground"
            }`}
          />
          <span
            className={`text-[11px] leading-tight ${
              isUrgent ? "text-status-critical" : "text-muted-foreground"
            }`}
          >
            {label}
          </span>
        </div>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <p
        className={`text-2xl font-semibold leading-none sm:text-3xl ${
          isUrgent ? "text-status-critical" : "text-foreground"
        }`}
      >
        {value}
        {suffix && (
          <span
            className={`ml-1.5 text-xs font-normal ${
              isUrgent ? "text-status-critical/80" : "text-muted-foreground"
            }`}
          >
            {suffix}
          </span>
        )}
      </p>
    </Link>
  );
}
