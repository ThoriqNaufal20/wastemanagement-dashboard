interface MetricCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  isUrgent?: boolean;
  urgentTag?: string;
}

export function MetricCard({
  label,
  value,
  suffix,
  isUrgent = false,
  urgentTag,
}: MetricCardProps) {
  return (
    <div
      className={`flex h-24 flex-col justify-between rounded-xl p-3 transition-colors ${
        isUrgent
          ? "border border-status-critical/40 bg-status-critical/10"
          : "border border-transparent bg-card"
      }`}
    >
      <span
        className={`text-[11px] ${
          isUrgent ? "text-status-critical" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
      <p
        className={`text-xl font-semibold leading-none ${
          isUrgent ? "text-status-critical" : "text-foreground"
        }`}
      >
        {value}
        {suffix && (
          <span
            className={`ml-1 text-xs font-normal ${
              isUrgent ? "text-status-critical/80" : "text-muted-foreground"
            }`}
          >
            {suffix}
          </span>
        )}
      </p>
      {urgentTag && isUrgent && (
        <span className="text-[10px] text-status-critical/80">
          {urgentTag}
        </span>
      )}
    </div>
  );
}
