import { Recycle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { companyInfo } from "@/lib/mock-data";
import { isFriday } from "@/lib/urgency";

export function DashboardHeader() {
  const today = new Date();
  const dayLabel = isFriday(today) ? "Jumat" : today.toLocaleDateString("id-ID", { weekday: "long" });

  return (
    <header className="flex items-center justify-between border-b border-border pb-4">
      <div className="flex items-center gap-3">
        {/*
          Ganti div di bawah dengan <Image src="/logo.png" .../> begitu
          logo perusahaan asli sudah ada. Taruh file di /public.
        */}
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Recycle className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {companyInfo.name}
          </p>
          <h1 className="text-base font-semibold text-foreground">
            {companyInfo.department}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {dayLabel}
        </span>
        <span className="rounded-full bg-secondary/40 px-3 py-1 text-xs font-medium text-primary">
          {companyInfo.period}
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
