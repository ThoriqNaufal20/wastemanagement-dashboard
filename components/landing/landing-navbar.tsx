"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  ChevronDown,
  LayoutDashboard,
  ClipboardCheck,
} from "lucide-react";
import { Logo } from "@/components/dashboard/logo";
import { useFullPageScroll } from "@/components/landing/full-page-scroll";

const NAV_ITEMS = [
  { label: "Beranda", index: 0 },
  { label: "Tentang", index: 1 },
  { label: "KPI", index: 2 },
  { label: "Preview", index: 3 },
  { label: "Tim", index: 4 },
  { label: "Arsip", index: 5 },
  { label: "Kontak", index: 6 },
];

export function LandingNavbar() {
  const { goTo, activeIndex } = useFullPageScroll();
  const [appsOpen, setAppsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAppsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAppsOpen(false);
      }
    }

    if (appsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [appsOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex w-full max-w-[1440px] 2xl:max-w-[1760px] items-center justify-between px-6 py-3.5 sm:px-10 2xl:px-16 2xl:py-4">
        {/* Brand / Logo */}
        <div
          onClick={() => goTo(0)}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90 2xl:gap-3.5"
        >
          <Logo size={32} className="h-8 w-8 2xl:h-10 2xl:w-10" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-foreground 2xl:text-base">
              Waste Management
            </span>
            <span className="hidden text-[10px] text-muted-foreground sm:inline 2xl:text-xs">
              PT. Adira Semesta Industry
            </span>
          </div>
        </div>

        {/* Navigation Items (Sections) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeIndex === item.index;
            return (
              <button
                key={item.label}
                onClick={() => goTo(item.index)}
                className={`rounded-full px-3.5 py-1.5 text-xs 2xl:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Apps Dropdown Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setAppsOpen((prev) => !prev)}
            aria-expanded={appsOpen}
            aria-haspopup="true"
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs 2xl:text-sm font-semibold transition-all duration-200 shadow-xs ${
              appsOpen
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border/80 bg-card/90 text-foreground hover:border-primary/50 hover:bg-muted backdrop-blur-sm"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Apps</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                appsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Apps Dropdown Menu Panel */}
          {appsOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card/95 p-1.5 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
              <Link
                href="/dashboard"
                onClick={() => setAppsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs 2xl:text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/internal-audit"
                onClick={() => setAppsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs 2xl:text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <ClipboardCheck className="h-4 w-4 text-primary" />
                <span>Internal Audit</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

