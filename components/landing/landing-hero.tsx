"use client";

import { useState } from "react";
import Link from "next/link";
import { Recycle, LineChart, ClipboardCheck, Leaf, ArrowRight } from "lucide-react";
import { Logo } from "@/components/dashboard/logo";
import { ScrambleText } from "@/components/dashboard/scramble-text";
import { useFullPageGoTo } from "@/components/landing/full-page-scroll";

const CHIPS = [
  {
    label: "3R",
    icon: Recycle,
    colorClass: "text-status-success",
    position: "left-[5%] top-[24%] sm:left-[8%] 2xl:left-[6%] 2xl:top-[20%]",
    rotate: -8,
    delay: 0,
  },
  {
    label: "Analisa data",
    icon: LineChart,
    colorClass: "text-primary",
    position: "right-[6%] top-[16%] sm:right-[10%] 2xl:right-[7%] 2xl:top-[16%]",
    rotate: 6,
    delay: 150,
  },
  {
    label: "Audit",
    icon: ClipboardCheck,
    colorClass: "text-primary",
    position: "bottom-[18%] left-[8%] sm:left-[12%] 2xl:left-[10%] 2xl:bottom-[18%]",
    rotate: 5,
    delay: 300,
  },
  {
    label: "Berkelanjutan",
    icon: Leaf,
    colorClass: "text-status-warning",
    position: "bottom-[22%] right-[5%] sm:right-[10%] 2xl:right-[8%] 2xl:bottom-[20%]",
    rotate: -5,
    delay: 450,
  },
];

const BLOBS = [
  {
    className: "left-[-10%] bottom-[-20%] h-[50%] w-[30%]",
    gradient:
      "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
    opacity: 0.18,
    delay: "0s",
  },
  {
    className: "right-[-8%] top-[-15%] h-[60%] w-[34%]",
    gradient:
      "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)",
    opacity: 0.6,
    delay: "1.5s",
  },
  {
    className: "right-[-6%] bottom-[-22%] h-[42%] w-[24%]",
    gradient:
      "radial-gradient(circle, var(--color-status-warning) 0%, transparent 70%)",
    opacity: 0.2,
    delay: "3s",
  },
];

export function LandingHero() {
  const [scrambleSettled, setScrambleSettled] = useState(false);
  const goTo = useFullPageGoTo();

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Nav - Mengisi lebar layar TV dengan proporsi elegan */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1440px] 2xl:max-w-[1760px] items-center justify-between px-6 py-5 sm:px-10 2xl:px-16 2xl:py-8">
        <div className="flex items-center gap-2.5 2xl:gap-3.5">
          <Logo size={32} className="h-8 w-8 2xl:h-11 2xl:w-11" />
          <span className="text-sm font-medium text-foreground 2xl:text-lg">
            Waste Management Departement
          </span>
        </div>
        <div className="flex items-center gap-5 2xl:gap-8 text-sm 2xl:text-base text-muted-foreground">
          <button onClick={() => goTo(1)} className="hidden sm:inline hover:text-foreground">
            Tentang
          </button>
          <button onClick={() => goTo(4)} className="hidden sm:inline hover:text-foreground">
            Tim
          </button>
          <button onClick={() => goTo(5)} className="hidden sm:inline hover:text-foreground">
            Arsip
          </button>
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 2xl:px-6 2xl:py-3 font-medium text-primary-foreground transition-all hover:scale-[1.02] hover:opacity-90"
          >
            Dashboard
            <ArrowRight className="h-3.5 w-3.5 2xl:h-4 2xl:w-4" />
          </Link>
        </div>
      </div>

      {/* Ilustrasi blob + headline */}
      <div className="relative mx-auto w-full max-w-[1440px] 2xl:max-w-[1760px] flex-1 px-6 sm:px-10 2xl:px-16">
        {BLOBS.map((blob, i) => (
          <div
            key={i}
            className={`animate-blob-drift pointer-events-none absolute rounded-full blur-3xl ${blob.className}`}
            style={{
              background: blob.gradient,
              opacity: blob.opacity,
              animationDelay: blob.delay,
            }}
            aria-hidden="true"
          />
        ))}

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h1
            className="animate-float-subtle text-4xl font-medium leading-tight text-primary sm:text-6xl 2xl:text-7xl 3xl:text-8xl"
            style={{ animationDelay: "0.5s" }}
          >
            <span className="relative inline-block">
              <ScrambleText
                text="Waste Management"
                onSettled={() => setScrambleSettled(true)}
              />
              <svg
                width="280"
                height="12"
                viewBox="0 0 280 12"
                className="absolute -bottom-2 left-0 w-full"
                aria-hidden="true"
                style={{
                  opacity: scrambleSettled ? 1 : 0,
                  transition: "opacity 200ms ease",
                }}
              >
                <path
                  d="M2,7 Q50,0 100,7 T200,7 T278,7"
                  stroke="var(--color-primary)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="290"
                  strokeDashoffset={scrambleSettled ? 0 : 290}
                  style={{
                    transition: scrambleSettled
                      ? "stroke-dashoffset 450ms ease-out"
                      : "none",
                  }}
                />
              </svg>
            </span>
          </h1>

          <p
            className="animate-float-subtle mt-4 2xl:mt-6 text-sm 2xl:text-xl italic text-muted-foreground"
            style={{ animationDelay: "1.1s" }}
          >
            "The Grey Area Specialist"
          </p>

          <p className="mt-5 2xl:mt-7 max-w-md 2xl:max-w-2xl text-sm 2xl:text-xl leading-relaxed text-muted-foreground sm:text-base">
            Kami menggabungkan pengelolaan barang <em>reject</em> yang bertanggung jawab, audit
            berkelanjutan, dan monitoring berbasis data untuk menciptakan
            dampak lingkungan yang nyata dan terukur.
          </p>

          <div className="mt-7 2xl:mt-10 flex flex-wrap items-center justify-center gap-3 2xl:gap-5">
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 2xl:px-8 2xl:py-3.5 text-sm 2xl:text-base font-medium text-primary-foreground transition-all hover:scale-[1.02] hover:opacity-90 shadow-sm"
            >
              Lihat Dashboard
              <ArrowRight className="h-3.5 w-3.5 2xl:h-4 2xl:w-4" />
            </Link>
            <button
              onClick={() => goTo(1)}
              className="rounded-full border border-border px-6 py-2.5 2xl:px-8 2xl:py-3.5 text-sm 2xl:text-base font-medium text-foreground transition-colors hover:bg-muted"
            >
              Tentang Kami
            </button>
          </div>
        </div>

        {/* Floating Badges / Chips */}
        {CHIPS.map((chip) => (
          <div
            key={chip.label}
            className={`animate-chip-enter absolute ${chip.position} z-10`}
            style={
              {
                "--chip-rotate": `${chip.rotate}deg`,
                animationDelay: `${chip.delay}ms`,
              } as React.CSSProperties
            }
          >
            <div
              className="animate-float flex items-center gap-2.5 sm:gap-3 2xl:gap-4 rounded-xl sm:rounded-2xl bg-card px-4.5 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 shadow-[0_3px_12px_rgba(0,0,0,0.08)] 2xl:shadow-[0_6px_22px_rgba(0,0,0,0.12)] border border-border/50"
              style={
                {
                  "--chip-rotate": `${chip.rotate}deg`,
                  transform: `rotate(${chip.rotate}deg)`,
                  animationDelay: `${chip.delay + 200}ms`,
                } as React.CSSProperties
              }
            >
              <chip.icon className={`h-5 w-5 sm:h-5.5 sm:w-5.5 2xl:h-7 2xl:w-7 ${chip.colorClass}`} />
              <span className="text-sm sm:text-base 2xl:text-lg font-medium 2xl:font-semibold text-foreground">
                {chip.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
