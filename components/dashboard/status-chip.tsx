export type StatusLevel =
  | "late"
  | "overdue"
  | "attention"
  | "on_progress"
  | "pending"
  | "done";

const STATUS_CONFIG: Record<StatusLevel, { label: string; className: string }> = {
  late: {
    label: "LATE",
    className: "bg-status-critical/10 text-status-critical",
  },
  overdue: {
    label: "OVERDUE",
    className: "bg-status-critical/10 text-status-critical",
  },
  attention: {
    label: "ATTENTION",
    className: "bg-status-warning/10 text-status-warning",
  },
  on_progress: {
    label: "ON PROGRESS",
    className: "bg-muted text-muted-foreground",
  },
  // Pending sekarang warning (oranye/kuning) — bukan netral abu-abu lagi.
  // Bukan urgent/critical, tapi tetap butuh perhatian (menunggu diproses).
  pending: {
    label: "PENDING",
    className: "bg-status-warning/10 text-status-warning",
  },
  done: {
    label: "DONE",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold",
  },
};

interface StatusChipProps {
  status: StatusLevel;
  className?: string;
}

export function StatusChip({ status, className = "" }: StatusChipProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}
