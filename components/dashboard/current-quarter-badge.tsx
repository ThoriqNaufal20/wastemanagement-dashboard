"use client";

import { useEffect, useState } from "react";

function getRealtimeQuarter(): string {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  const year = now.getFullYear();
  return `Q${quarter} ${year}`;
}

export function CurrentQuarterBadge() {
  const [period, setPeriod] = useState<string>(() => getRealtimeQuarter());

  useEffect(() => {
    // Sinkronisasi realtime dengan waktu browser lokal
    setPeriod(getRealtimeQuarter());
    // Interval update setiap 10 menit jika melewati pergantian kuartal
    const interval = setInterval(() => {
      setPeriod(getRealtimeQuarter());
    }, 1000 * 60 * 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="rounded-full bg-secondary/40 px-3 py-1 text-xs font-medium text-primary">
      {period}
    </span>
  );
}
