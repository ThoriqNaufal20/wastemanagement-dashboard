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
      className={`group flex flex-col justify-between gap-3 rounded-2xl p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)] transition-all duration-200 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_4px_8px_rgba(16,24,40,0.08)] ${
        isUrgent ? "bg-status-critical/[0.06]" : "bg-card"
      }`}
    >
      <div className="flex items-start justify-between">
        {/* Ikon "chip" — background bulat pastel di belakang ikon */}
        <div className="relative">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              isUrgent
                ? "bg-status-critical/15 text-status-critical"
                : "bg-primary/10 text-primary"
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
          {isUrgent && (
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-critical opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-status-critical" />
            </span>
          )}
        </div>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div>
        <p
          className={`mb-1 text-[11px] leading-tight ${
            isUrgent ? "text-status-critical" : "text-muted-foreground"
          }`}
        >
          {label}
        </p>
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
      </div>
    </Link>
  );
}
