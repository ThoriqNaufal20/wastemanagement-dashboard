"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Toggle dark/light global — satu-satunya kontrol tema di seluruh app
 * (landing + dashboard). Dipasang sekali di root layout, otomatis
 * muncul di semua halaman. Toggle yang dulu ada di dalam header
 * dashboard sudah dihapus, digantikan ini.
 */
export function FloatingThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-[0_4px_6px_rgba(16,24,40,0.06),0_10px_15px_rgba(16,24,40,0.1)] transition-transform hover:scale-105"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-primary" />
      ) : (
        <Moon className="h-4 w-4 text-primary" />
      )}
    </button>
  );
}
