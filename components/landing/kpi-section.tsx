"use client";

import { useEffect, useRef, useState } from "react";

const KPIS = [
  { value: 12450, suffix: "", label: "Kg Waste Managed" },
  { value: 78, suffix: "%", label: "Recycled" },
  { value: 32, suffix: "%", label: "Waste Reduction" },
  { value: 24, suffix: "", label: "Projects" },
];

function CountUp({
  end,
  suffix = "",
  duration = 1800,
  start,
}: {
  end: number;
  suffix?: string;
  duration?: number;
  start: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Ease-out
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration, start]);

  return (
    <>
      {count.toLocaleString("en-US")}
      {suffix}
    </>
  );
}

export function KpiSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="flex h-full w-full flex-col items-center justify-center bg-background px-4"
    >
      <div className="mx-auto w-full max-w-[900px] 2xl:max-w-[1500px] text-center px-4 2xl:px-8">
        <p className="mb-3 2xl:mb-4 text-[11px] 2xl:text-base uppercase tracking-wide text-muted-foreground">
          Dampak yang terukur
        </p>

        <h2 className="text-xl sm:text-2xl 2xl:text-5xl font-medium 2xl:font-semibold text-foreground">
          Waste Management dalam Angka
        </h2>

        <div className="mt-8 2xl:mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 2xl:gap-8">
          {KPIS.map((kpi, index) => (
            <div
              key={kpi.label}
              className="rounded-2xl 2xl:rounded-3xl bg-card px-4 py-8 2xl:px-8 2xl:py-14 shadow-sm border border-border/40 transition-transform duration-200 hover:scale-[1.02]"
            >
              <p className="text-3xl sm:text-4xl 2xl:text-6xl font-semibold 2xl:font-bold text-primary tracking-tight">
                <CountUp
                  end={kpi.value}
                  suffix={kpi.suffix}
                  start={isVisible}
                  duration={1600 + index * 150}
                />
              </p>

              <p className="mt-2 2xl:mt-4 text-xs sm:text-sm 2xl:text-lg font-medium text-muted-foreground">
                {kpi.label}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 2xl:mt-8 text-[11px] 2xl:text-sm italic text-muted-foreground">
          Data contoh — akan diperbarui dengan angka aktual
        </p>
      </div>
    </div>
  );
}
