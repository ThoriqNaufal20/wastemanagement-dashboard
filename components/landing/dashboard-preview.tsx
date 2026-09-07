"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Recycle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const KPI_PREVIEW = [
  {
    value: "102",
    label: "OTS Finding",
    icon: ClipboardList,
    iconClass: "text-primary",
    bgClass: "bg-primary/[0.06]",
  },
  {
    value: "2/3",
    label: "3R Active",
    icon: Recycle,
    iconClass: "text-status-success",
    bgClass: "bg-status-success/10",
  },
  {
    value: "78%",
    label: "Scorecard",
    icon: TrendingUp,
    iconClass: "text-status-warning",
    bgClass: "bg-status-warning/10",
  },
];

const CHART_BARS = [50, 75, 60, 105, 95, 125, 70];

export function DashboardPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="flex h-full w-full flex-col items-center justify-center bg-background px-4"
    >
      <div className="mx-auto w-full max-w-[900px] text-center">

        {/* Label */}
        <p
          className={`
            mb-3 text-[11px] uppercase tracking-wide text-muted-foreground
            transition-all duration-500 ease-out
            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }
          `}
        >
          Real-time monitoring
        </p>

        {/* Heading */}
        <h2
          className={`
            text-xl font-medium text-foreground sm:text-2xl
            transition-all duration-700 ease-out
            ${
              isVisible
                ? "translate-y-0 opacity-100 blur-0"
                : "translate-y-5 opacity-0 blur-[3px]"
            }
          `}
        >
          Lihat Waste Management dalam Angka Nyata
        </h2>

        {/* Description */}
        <p
          className={`
            mx-auto mt-3 max-w-md text-sm text-muted-foreground
            transition-all duration-700 ease-out
            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }
          `}
          style={{
            transitionDelay: "150ms",
          }}
        >
          Jelajahi dashboard kami untuk memantau performa, tren, dan dampak
          keberlanjutan secara langsung.
        </p>

        {/* Dashboard Mockup */}
        <div
          className={`
            mx-auto mt-8 max-w-2xl rounded-2xl bg-card p-4
            shadow-[0_8px_24px_rgba(0,0,0,0.06)]
            sm:p-6
            transition-all duration-800 ease-out
            ${
              isVisible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-7 scale-[0.98] opacity-0"
            }
          `}
          style={{
            transitionDelay: "300ms",
          }}
        >
          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-3">
            {KPI_PREVIEW.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className={`
                    rounded-xl ${item.bgClass} p-3 text-left
                    transition-all duration-600 ease-out
                    ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }
                  `}
                  style={{
                    transitionDelay: `${500 + index * 120}ms`,
                  }}
                >
                  {/* Icon */}
                  <div
                    className={`
                      transition-all duration-500
                      ${
                        isVisible
                          ? "scale-100 opacity-100"
                          : "scale-75 opacity-0"
                      }
                    `}
                    style={{
                      transitionDelay: `${600 + index * 120}ms`,
                    }}
                  >
                    <Icon className={`h-4 w-4 ${item.iconClass}`} />
                  </div>

                  <p className="mt-2 text-lg font-semibold text-foreground">
                    {item.value}
                  </p>

                  <p className="text-[10px] text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bar Chart */}
          <div className="mt-3 flex h-[150px] items-end gap-1.5 rounded-xl bg-muted p-3">
            {CHART_BARS.map((height, index) => (
              <div
                key={index}
                className={`
                  flex-1 rounded-t bg-primary/40
                  transition-[height,opacity]
                  duration-1000
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                `}
                style={{
                  height: isVisible ? `${height}px` : "0px",
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${850 + index * 100}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Button */}
        <Link
          href="/login"
          className={`
  group mt-7 inline-flex items-center gap-1.5 rounded-full
  bg-primary px-6 py-2.5 text-sm font-medium
  text-primary-foreground
  transition-all duration-300
  hover:scale-[1.02] hover:opacity-90
  ${
    isVisible
      ? "translate-y-0 opacity-100"
      : "translate-y-4 opacity-0"
  }
`}
          style={{
            transitionDelay: "1500ms",
          }}
        >
          Buka Dashboard

          <ArrowRight
            className="
              h-3.5 w-3.5
              transition-transform duration-300
              group-hover:translate-x-0.5
            "
          />
        </Link>
      </div>
    </div>
  );
}