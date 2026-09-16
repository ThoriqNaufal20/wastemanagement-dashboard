import Link from "next/link";
import { Mail, Phone, MapPin, Lock, ArrowRight } from "lucide-react";
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

      {/* 6. Contact & Footer */}
      <div className="flex h-full w-full flex-col items-center justify-center bg-background px-4 py-12">
        <div className="mx-auto w-full max-w-[850px] space-y-8 text-center">
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Hubungi Kami
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Waste Management Department
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              PT. Adira Semesta Industry · Mengelola Limbah. Mengukur Dampak.
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
            <a
              href="mailto:wastemanagement@adirasemesta.com"
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <p className="mt-3 text-xs font-medium text-muted-foreground">Email</p>
                <p className="mt-0.5 text-xs font-semibold text-foreground transition-colors group-hover:text-primary break-all">
                  wastemanagement@adirasemesta.com
                </p>
              </div>
              <span className="mt-3 text-[11px] text-muted-foreground group-hover:text-foreground">
                Kirim email &rarr;
              </span>
            </a>

            <a
              href="tel:+622100000000"
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Phone className="h-4 w-4" />
                </div>
                <p className="mt-3 text-xs font-medium text-muted-foreground">Telepon</p>
                <p className="mt-0.5 text-xs font-semibold text-foreground transition-colors group-hover:text-primary">
                  +62 21 0000 0000
                </p>
              </div>
              <span className="mt-3 text-[11px] text-muted-foreground group-hover:text-foreground">
                Hubungi via telepon &rarr;
              </span>
            </a>

            <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5">
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <p className="mt-3 text-xs font-medium text-muted-foreground">Alamat</p>
                <p className="mt-0.5 text-xs font-semibold text-foreground">
                  Jakarta, Indonesia
                </p>
              </div>
              <span className="mt-3 text-[11px] text-muted-foreground">
                PT. Adira Semesta Industry
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Buka Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-full border border-border bg-background px-5 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Lock className="h-3.5 w-3.5" />
              Login Admin
            </Link>
          </div>

          <p className="text-[11px] text-muted-foreground">
            © 2026 Waste Management Department, PT. Adira Semesta Industry. All rights reserved.
          </p>
        </div>
      </div>
    </FullPageScroll>
  );
}
