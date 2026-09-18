"use client";

import { useEffect, useRef, useState } from "react";
import {
  Recycle,
  Trash2,
  ClipboardCheck,
  LineChart,
} from "lucide-react";

const CAPABILITIES = [
  {
    icon: Recycle,
    title: "3R",
    subtitle: "Reduce · Reuse · Recycle",
  },
  {
    icon: Trash2,
    title: "Waste Management",
    subtitle: "Collection · Processing · Monitoring",
  },
  {
    icon: ClipboardCheck,
    title: "Audit & Compliance",
    subtitle: "Monitoring · Evaluation · Improvement",
  },
  {
    icon: LineChart,
    title: "Data & Analytics",
    subtitle: "Tracking · Reporting · Decision Making",
  },
];

export function AboutWhatWeDo() {
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
      <div className="mx-auto w-full max-w-[900px] 2xl:max-w-[1500px]">

        {/* Tentang kami */}
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
          Tentang kami
        </p>

        {/* Heading */}
        <h2
          className={`
            max-w-2xl 2xl:max-w-4xl text-xl font-medium text-foreground sm:text-2xl 2xl:text-4xl 2xl:font-semibold
            transition-all duration-700 ease-out
            ${
              isVisible
                ? "translate-y-0 opacity-100 blur-0"
                : "translate-y-5 opacity-0 blur-[3px]"
            }
          `}
        >
          Mengubah Pengelolaan Limbah Menjadi Dampak yang Terukur
        </h2>

        {/* Description */}
        <p
          className={`
            mt-4 2xl:mt-6 max-w-2xl 2xl:max-w-4xl text-sm 2xl:text-xl leading-relaxed 2xl:leading-relaxed text-muted-foreground sm:text-base
            transition-all duration-700 ease-out
            delay-150
            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }
          `}
        >
          Waste Management Department bertanggung jawab atas pengelolaan
          limbah produksi PT. Adira Semesta Industry secara menyeluruh — mulai
          dari kepatuhan terhadap audit internal &amp; eksternal, seleksi dan
          pemanfaatan kembali material reject (3R), hingga monitoring performa
          operasional berbasis data. Pendekatan kami memadukan disiplin
          operasional dengan komitmen jangka panjang terhadap keberlanjutan.
        </p>

        {/* Yang kami lakukan */}
        <p
          className={`
            mb-3 mt-9 2xl:mb-5 2xl:mt-14 text-[11px] 2xl:text-base uppercase tracking-wide text-muted-foreground
            transition-all duration-500 ease-out
            delay-300
            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }
          `}
        >
          Yang kami lakukan
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:gap-6">
          {CAPABILITIES.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                style={{
                  transitionDelay: `${400 + index * 120}ms`,
                }}
                className={`
                  group rounded-2xl 2xl:rounded-3xl bg-card p-5 2xl:p-7 border border-border/40
                  transition-all duration-700 ease-out
                  hover:-translate-y-1 hover:shadow-md
                  ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-5 opacity-0"
                  }
                `}
              >
                {/* Icon */}
                <div
                  style={{
                    transitionDelay: `${550 + index * 120}ms`,
                  }}
                  className={`
                    flex h-9 w-9 2xl:h-14 2xl:w-14 items-center justify-center rounded-xl 2xl:rounded-2xl
                    bg-primary/10
                    transition-all duration-500
                    group-hover:scale-105
                    ${
                      isVisible
                        ? "scale-100 opacity-100"
                        : "scale-75 opacity-0"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 2xl:h-7 2xl:w-7 text-primary" />
                </div>

                {/* Title */}
                <p className="mt-2.5 2xl:mt-4 text-sm 2xl:text-lg font-medium 2xl:font-semibold text-foreground">
                  {item.title}
                </p>

                {/* Subtitle */}
                <p className="mt-1 2xl:mt-2 text-xs 2xl:text-sm text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}