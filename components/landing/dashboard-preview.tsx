"use client";

import { useEffect, useRef, useState } from "react";
import {
  ClipboardList,
  Recycle,
  TrendingUp,
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
    iconClass: "text-primary",
    bgClass: "bg-primary/10",
  },
];

const CHART_BARS = [40, 65, 50, 85, 75, 95, 70];

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
      <div className="mx-auto w-full max-w-[900px] 2xl:max-w-[1500px] text-center">

        {/* Label */}
        <p
          className={`
            mb-3 2xl:mb-4 text-[11px] 2xl:text-base uppercase tracking-wide text-muted-foreground
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
            text-xl sm:text-2xl 2xl:text-4xl font-medium 2xl:font-semibold text-foreground
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
            mx-auto mt-3 2xl:mt-5 max-w-md 2xl:max-w-xl text-sm 2xl:text-xl text-muted-foreground leading-relaxed
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
            mx-auto mt-8 2xl:mt-12 max-w-2xl 2xl:max-w-4xl rounded-2xl 2xl:rounded-3xl bg-card p-4
            shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-border/40
            sm:p-6 2xl:p-8
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
          <div className="grid grid-cols-3 gap-3 2xl:gap-5">
            {KPI_PREVIEW.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className={`
                    rounded-xl 2xl:rounded-2xl ${item.bgClass} p-3 2xl:p-5 text-left
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
                    <Icon className={`h-4 w-4 2xl:h-7 2xl:w-7 ${item.iconClass}`} />
                  </div>

                  <p className="mt-2 2xl:mt-3 text-lg 2xl:text-3xl font-semibold text-foreground tracking-tight">
                    {item.value}
                  </p>

                  <p className="text-[10px] 2xl:text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bar Chart */}
          <div className="mt-3 2xl:mt-5 flex h-[150px] 2xl:h-[220px] items-end gap-1.5 2xl:gap-3 rounded-xl 2xl:rounded-2xl bg-muted p-3 2xl:p-5">
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
                  height: isVisible ? `${height * 1.3}px` : "0px",
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${850 + index * 100}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}