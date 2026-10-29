import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { StatusChip, type StatusLevel } from "@/components/dashboard/status-chip";

interface MetricCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  status?: StatusLevel; // kosong = card informatif, tanpa chip/pulse
  icon: LucideIcon;
  href: string;
  note?: string;
}

const CARD_TINT: Record<StatusLevel, string> = {
  late: "bg-status-critical/[0.06]",
  overdue: "bg-status-critical/[0.06]",
  attention: "bg-status-warning/[0.06]",
  on_progress: "bg-card",
  // Pending sekarang tint warning juga, konsisten sama chip-nya.
  pending: "bg-status-warning/[0.06]",
  done: "bg-card",
  not_started: "bg-card",
};

const ICON_CHIP_TINT: Record<StatusLevel, string> = {
  late: "bg-status-critical/15 text-status-critical",
  overdue: "bg-status-critical/15 text-status-critical",
  attention: "bg-status-warning/15 text-status-warning",
  on_progress: "bg-primary/10 text-primary",
  pending: "bg-status-warning/15 text-status-warning",
  done: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  not_started: "bg-muted text-muted-foreground",
};

const PULSE_COLOR: Record<StatusLevel, string> = {
  late: "bg-status-critical",
  overdue: "bg-status-critical",
  attention: "bg-status-warning",
  on_progress: "",
  pending: "",
  done: "",
  not_started: "",
};

// Cuma status yang benar-benar "butuh perhatian aktif" yang pulse.
// pending TETAP tidak pulse (tidak urgent), walau warnanya sekarang warning.
const PULSING_STATUSES: StatusLevel[] = ["late", "overdue", "attention"];

export function MetricCard({
  label,
  value,
  suffix,
  status,
  icon: Icon,
  href,
  note,
}: MetricCardProps) {
  const shouldPulse = status ? PULSING_STATUSES.includes(status) : false;
  const cardTint = status ? CARD_TINT[status] : "bg-card";
  const iconTint = status ? ICON_CHIP_TINT[status] : "bg-primary/10 text-primary";

  return (
    <Link
      href={href}
      className={`group flex flex-col justify-between gap-3 rounded-2xl p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)] transition-all duration-200 hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_4px_8px_rgba(16,24,40,0.08)] ${cardTint}`}
    >
      <div className="flex items-start justify-between">
        <div className="relative">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconTint}`}>
            <Icon className="h-4 w-4" />
          </div>
          {shouldPulse && status && (
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${PULSE_COLOR[status]}`}
              />
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${PULSE_COLOR[status]}`}
              />
            </span>
          )}
        </div>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div>
        <p className="mb-1 text-[11px] leading-tight text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold leading-none text-foreground sm:text-3xl">
          {value}
          {suffix && (
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              {suffix}
            </span>
          )}
        </p>
      </div>

      {status && <StatusChip status={status} />}
      {!status && note && (
        <p className="text-[10px] leading-tight text-muted-foreground">
          {note}
        </p>
      )}
    </Link>
  );
}
