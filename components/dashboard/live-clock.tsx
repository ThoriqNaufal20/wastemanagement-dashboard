"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000 * 30); // update tiap 30 detik
    return () => clearInterval(interval);
  }, []);

  // Hindari mismatch hydration — belum render apa-apa sebelum mounted
  if (!now) {
    return <span className="text-xs text-muted-foreground">&nbsp;</span>;
  }

  const dateLabel = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeLabel = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <span className="text-xs text-muted-foreground">
      {dateLabel} · {timeLabel} WIB
    </span>
  );
}
