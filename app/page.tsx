import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { LandingHero } from "@/components/landing/landing-hero";
import { AboutWhatWeDo } from "@/components/landing/about-what-we-do";
import { KpiSection } from "@/components/landing/kpi-section";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { TeamSection } from "@/components/landing/team-carousel";
import { FullPageScroll } from "@/components/landing/full-page-scroll";

export default function LandingPage() {
  return (
    <FullPageScroll>
      {/* 1. Hero */}
      <LandingHero />

      {/* 2. About Us + What We Do */}
      <AboutWhatWeDo />

      {/* 3. KPI */}
      <KpiSection />

      {/* 4. Dashboard Preview */}
      <DashboardPreview />

      {/* 5. Team */}
      <TeamSection />

      {/* 6. Footer */}
      <div className="flex h-full w-full flex-col items-center justify-center bg-background px-4">
        <div className="mx-auto w-full max-w-[900px]">
          <div className="text-center">
            <p className="text-base font-medium text-foreground">
              Waste Management Department
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Mengelola Limbah. Mengukur Dampak.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/contact" className="flex items-center gap-1 hover:text-foreground">
              <Mail className="h-3.5 w-3.5" />
              Contact
            </Link>
            <Link href="/login" className="flex items-center gap-1 hover:text-foreground">
              <Lock className="h-3.5 w-3.5" />
              Login
            </Link>
          </div>

          <p className="mt-8 text-center text-[11px] text-muted-foreground">
            © 2026 Waste Management Department, PT. Adira Semesta Industry
          </p>
        </div>
      </div>
    </FullPageScroll>
  );
}
