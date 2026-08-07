"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Mail } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Contact Us", href: "/contact", icon: Mail },
];

export function FloatingNav() {
  const pathname = usePathname();

  // Sembunyikan di halaman login — tidak relevan sebelum user masuk.
  if (pathname === "/login") return null;

  return (
    <nav
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-500"
      aria-label="Navigasi utama"
    >
      <div className="flex items-center gap-1 rounded-full bg-card p-1.5 shadow-[0_4px_6px_rgba(16,24,40,0.06),0_10px_15px_rgba(16,24,40,0.1)]">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
