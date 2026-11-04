"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LANDING_KPI_SNAPSHOT, type LandingKpiData } from "@/lib/landing-kpi-data";

function CountUp({
  end,
  suffix = "",
  duration = 1800,
  start,
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  duration?: number;
  start: boolean;
  decimals?: number;
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

      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Ease-out
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(easedProgress * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration, start]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString("en-US");

  return (
    <>
      {formatted}
      {suffix}
    </>
  );
}

export function KpiSection({ initialData }: { initialData?: LandingKpiData } = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Keyboard shortcut ESC untuk menutup panel analisa
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAnalysisOpen(false);
      }
    };
    if (isAnalysisOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isAnalysisOpen]);

  const data = initialData || LANDING_KPI_SNAPSHOT;
  const { scorecard, recycled, reduction, projects } = data;

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
          
          {/* Kartu 1: Scorecard Dept (Waste Management) - Interaktif Klik */}
          <div
            onClick={() => setIsAnalysisOpen(true)}
            className="group rounded-2xl 2xl:rounded-3xl bg-card px-4 py-8 2xl:px-8 2xl:py-14 shadow-sm border border-border/40 transition-all duration-200 hover:scale-[1.02] cursor-pointer relative overflow-hidden select-none hover:border-primary/40"
          >
            <p className="text-3xl sm:text-4xl 2xl:text-6xl font-semibold 2xl:font-bold text-primary tracking-tight">
              <CountUp
                end={scorecard.score}
                suffix="%"
                decimals={1}
                start={isVisible}
                duration={1600}
              />
            </p>

            <p className="mt-2 2xl:mt-4 text-xs sm:text-sm 2xl:text-lg font-medium text-muted-foreground">
              Scorecard Dept
            </p>

            {/* Subtle indicator dot di pojok (tanpa teks berisik) */}
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
          </div>

          {/* Kartu 2: Recycled */}
          <div className="rounded-2xl 2xl:rounded-3xl bg-card px-4 py-8 2xl:px-8 2xl:py-14 shadow-sm border border-border/40 transition-transform duration-200 hover:scale-[1.02] select-none">
            <p className="text-3xl sm:text-4xl 2xl:text-6xl font-semibold 2xl:font-bold text-primary tracking-tight">
              <CountUp
                end={recycled.value}
                suffix={recycled.suffix}
                start={isVisible}
                duration={1750}
              />
            </p>

            <p className="mt-2 2xl:mt-4 text-xs sm:text-sm 2xl:text-lg font-medium text-muted-foreground">
              {recycled.label}
            </p>
          </div>

          {/* Kartu 3: Waste Reduction */}
          <div className="rounded-2xl 2xl:rounded-3xl bg-card px-4 py-8 2xl:px-8 2xl:py-14 shadow-sm border border-border/40 transition-transform duration-200 hover:scale-[1.02] select-none">
            <p className="text-3xl sm:text-4xl 2xl:text-6xl font-semibold 2xl:font-bold text-primary tracking-tight">
              <CountUp
                end={reduction.value}
                suffix={reduction.suffix}
                start={isVisible}
                duration={1900}
              />
            </p>

            <p className="mt-2 2xl:mt-4 text-xs sm:text-sm 2xl:text-lg font-medium text-muted-foreground">
              {reduction.label}
            </p>
          </div>

          {/* Kartu 4: Projects */}
          <div className="rounded-2xl 2xl:rounded-3xl bg-card px-4 py-8 2xl:px-8 2xl:py-14 shadow-sm border border-border/40 transition-transform duration-200 hover:scale-[1.02] select-none">
            <p className="text-3xl sm:text-4xl 2xl:text-6xl font-semibold 2xl:font-bold text-primary tracking-tight">
              <CountUp
                end={projects.value}
                suffix={projects.suffix}
                start={isVisible}
                duration={2050}
              />
            </p>

            <p className="mt-2 2xl:mt-4 text-xs sm:text-sm 2xl:text-lg font-medium text-muted-foreground">
              {projects.label}
            </p>
          </div>

        </div>

        <p className="mt-5 2xl:mt-8 text-[11px] 2xl:text-sm italic text-muted-foreground">
          
        </p>
      </div>

      {/* PANEL ANALISA SCORECARD (SIDE SHEET DRAWER DENGAN CSS BAR LOOPING) */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
              isAnalysisOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsAnalysisOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-sm sm:max-w-md h-full bg-card/95 backdrop-blur-2xl border-l border-border/80 p-6 sm:p-7 shadow-2xl flex flex-col justify-between transition-transform duration-500 ease-out overflow-y-auto ${
                isAnalysisOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div>
                {/* Header Side Sheet */}
                <div className="flex items-center justify-between pb-3.5 border-b border-border/60 mb-5">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Analisa Scorecard WM
                  </span>
                  <button
                    onClick={() => setIsAnalysisOpen(false)}
                    className="w-7 h-7 rounded-full bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center text-xs transition"
                    aria-label="Tutup panel analisa"
                  >
                    ✕
                  </button>
                </div>

                {/* Ringkasan Skor Utama */}
                <div className="flex items-baseline justify-between border-b border-border/40 pb-4 mb-5">
                  <div>
                    <span className="text-3xl font-bold text-foreground tracking-tight">
                      {scorecard.score.toFixed(1)}%
                    </span>
                    {scorecard.direction === "up" && (
                      <span className="ml-2 text-xs font-semibold text-emerald-500">
                        ↑ Naik +{Math.abs(scorecard.delta)}%
                      </span>
                    )}
                    {scorecard.direction === "down" && (
                      <span className="ml-2 text-xs font-semibold text-red-500">
                        ↓ Turun -{Math.abs(scorecard.delta)}%
                      </span>
                    )}
                    {scorecard.direction === "flat" && (
                      <span className="ml-2 text-xs font-medium text-muted-foreground">
                        Tetap 0%
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Periode {scorecard.quarter}
                  </span>
                </div>

                {/* 6 Bar Aspek dengan Animasi Looping Lambat (~4.2s) */}
                <div className="space-y-4">
                  {scorecard.aspects.map((aspect, idx) => (
                    <div key={aspect.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-foreground/90 font-medium">{aspect.name}</span>
                        <span className="font-mono text-muted-foreground font-semibold">
                          {aspect.score.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{
                            width: `${aspect.targetPercent}%`,
                            animation: `kpiBarBreathe 4.2s ease-in-out infinite`,
                            animationDelay: `${idx * -0.7}s`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Catatan Analisa Minimalis */}
                <div className="mt-6 pt-4 text-xs text-muted-foreground leading-relaxed border-t border-border/40">
                  {scorecard.note}
                </div>
              </div>

              {/* Footer Tombol Tutup */}
              <div className="pt-6 border-t border-border/40 mt-6 text-center">
                <button
                  onClick={() => setIsAnalysisOpen(false)}
                  className="w-full py-2 rounded-xl bg-muted/80 hover:bg-muted text-xs text-foreground font-medium transition"
                >
                  Tutup Analisa
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Global Style Keyframe Animation untuk Looping Bar Halus */}
      <style jsx global>{`
        @keyframes kpiBarBreathe {
          0%,
          100% {
            transform: scaleX(0.95);
            opacity: 0.85;
          }
          50% {
            transform: scaleX(1.02);
            opacity: 1;
            filter: drop-shadow(0 0 5px rgba(13, 148, 136, 0.45));
          }
        }
      `}</style>
    </div>
  );
}
