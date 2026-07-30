import { Recycle } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { LiveClock } from "@/components/dashboard/live-clock";
import { companyInfo } from "@/lib/mock-data";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border pb-4">
      <div className="flex items-center gap-3">        
        <Image src="/LOGO ADIRA.png" alt={companyInfo.name} width={40} height={40}/>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {companyInfo.name}
          </p>
          <h1 className="text-lg font-semibold text-foreground">
            {companyInfo.department}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LiveClock />
        <span className="rounded-full bg-secondary/40 px-3 py-1 text-xs font-medium text-primary">
          {companyInfo.period}
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
