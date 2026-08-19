"use client";

import { useState } from "react";
import Link from "next/link";
import { Recycle, LineChart, ClipboardCheck, Leaf } from "lucide-react";
import { Logo } from "@/components/dashboard/logo";
import { ScrambleText } from "@/components/dashboard/scramble-text";

const CHIPS = [
  {
    label: "3R",
    icon: Recycle,
    colorClass: "text-status-success",
    position: "left-[6%] top-[28%] sm:left-[10%]",
    rotate: -8,
    delay: 0,
  },
  {
    label: "Analisa data",
    icon: LineChart,
    colorClass: "text-primary",
    position: "right-[8%] top-[20%] sm:right-[14%]",
    rotate: 6,
    delay: 150,
  },
  {
    label: "Audit",
    icon: ClipboardCheck,
    colorClass: "text-primary",
    position: "bottom-[14%] left-[10%] sm:left-[16%]",
    rotate: 5,
    delay: 300,
  },
  {
    label: "Berkelanjutan",
    icon: Leaf,
    colorClass: "text-status-warning",
    position: "bottom-[18%] right-[6%] sm:right-[12%]",
    rotate: -5,
    delay: 450,
  },
];

// Blob sekarang <div> bulat biasa (border-radius: 50%), posisi & ukuran
// pakai persen dari container — bukan lagi SVG viewBox. Ini yang
// memperbaiki blob "kepotong" waktu container jadi tinggi (1 layar penuh).
const BLOBS = [
  {
    className: "left-[-8%] bottom-[-15%] h-[45%] w-[26%]",
    color: "var(--color-primary)",
    opacity: 0.1,
    delay: "0s",
  },
  {
    className: "right-[-6%] top-[-10%] h-[55%] w-[30%]",
    color: "var(--color-secondary)",
    opacity: 0.5,
    delay: "1.5s",
  },
  {
    className: "right-[-4%] bottom-[-18%] h-[40%] w-[22%]",
    color: "var(--color-status-warning)",
    opacity: 0.12,
    delay: "3s",
  },
];

export function LandingHero() {
  const [scrambleSettled, setScrambleSettled] = useState(false);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Nav */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1100px] items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="text-sm font-medium text-foreground">
            Waste Management Dept
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <a href="#ruang-lingkup" className="hidden sm:inline hover:text-foreground">
            Tentang
          </a>
          <a href="#tim" className="hidden sm:inline hover:text-foreground">
            Tim
          </a>
          <Link
            href="/login"
            className="rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Lihat dashboard
          </Link>
        </div>
      </div>

      {/* Ilustrasi blob + headline — mengisi sisa ruang */}
      <div className="relative mx-auto w-full max-w-[1100px] flex-1 px-6 sm:px-10">
        {BLOBS.map((blob, i) => (
          <div
            key={i}
            className={`animate-blob-drift pointer-events-none absolute rounded-full ${blob.className}`}
            style={{
              backgroundColor: blob.color,
              opacity: blob.opacity,
              animationDelay: blob.delay,
            }}
            aria-hidden="true"
          />
        ))}

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h1
            className="animate-float-subtle text-3xl font-medium leading-snug text-primary sm:text-5xl"
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
            className="animate-float-subtle mt-5 text-sm italic text-muted-foreground"
            style={{ animationDelay: "1.1s" }}
          >
            "Tagline"
          </p>
        </div>

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
              className="animate-float flex items-center gap-2 rounded-xl bg-card px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              style={
                {
                  "--chip-rotate": `${chip.rotate}deg`,
                  transform: `rotate(${chip.rotate}deg)`,
                  animationDelay: `${chip.delay + 200}ms`,
                } as React.CSSProperties
              }
            >
              <chip.icon className={`h-4 w-4 ${chip.colorClass}`} />
              <span className="text-xs font-medium text-foreground">
                {chip.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
