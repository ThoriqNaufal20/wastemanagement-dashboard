import Link from "next/link";
import {
  ClipboardCheck,
  Recycle,
  LineChart,
  Table2,
  ArrowRight,
  Mail,
  Lock,
  User,
} from "lucide-react";
import { LandingHero } from "@/components/landing/landing-hero";
import { FullPageScroll } from "@/components/landing/full-page-scroll";

const SCOPE_ITEMS = [
  {
    icon: ClipboardCheck,
    title: "Internal audit",
    description: "Kesiapan menghadapi audit eksternal",
  },
  {
    icon: Recycle,
    title: "3R",
    description: "Reduce, reuse, recycle material reject",
  },
  {
    icon: LineChart,
    title: "Monitoring dan analisa data",
    description: "Pantau performa dan tren operasional",
  },
  {
    icon: Table2,
    title: "Spreadsheet training",
    description: "Pelatihan pencatatan data untuk tim",
  },
];

// TODO: ganti "Nama" dan role di bawah dengan data tim asli begitu tersedia.
const TEAM = {
  head: { name: "Nama", role: "Kepala departemen" },
  members: [
    { name: "Nama", role: "Lead 3R" },
    { name: "Nama", role: "Lead internal audit" },
    { name: "Nama", role: "Data analyst" },
    { name: "Nama", role: "Staff operasional" },
  ],
};

export default function LandingPage() {
  return (
    <div>
      <FullPageScroll>
        {/* Section 1 — Hero */}
        <LandingHero />

        {/* Section 2 — Ruang lingkup kerja */}
        <div className="flex h-full w-full flex-col items-center justify-center bg-background px-4">
          <div className="mx-auto w-full max-w-[900px]">
            <p className="mb-3 text-[11px] uppercase tracking-wide text-muted-foreground">
              Ruang lingkup kerja
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SCOPE_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-card p-5 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2.5 text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3 — Struktur tim */}
        <div className="flex h-full w-full flex-col items-center justify-center bg-background px-4 text-center">
          <div className="mx-auto w-full max-w-[900px]">
            <p className="mb-5 text-[11px] uppercase tracking-wide text-muted-foreground">
              Struktur tim
            </p>

            <div className="inline-flex flex-col items-center gap-1.5">
              {/* TODO: ganti dengan <Image src="..." /> untuk foto asli */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-7 w-7 text-primary" />
              </div>
              <p className="mt-1 text-sm font-medium text-foreground">{TEAM.head.name}</p>
              <p className="text-xs text-muted-foreground">{TEAM.head.role}</p>
            </div>

            <div className="mx-auto mt-3 h-6 w-px bg-border" />
            <div className="mx-auto h-px max-w-[560px] bg-border" />

            <div className="mx-auto mt-0 flex max-w-[600px] flex-wrap justify-center gap-5">
              {TEAM.members.map((member) => (
                <div key={member.role} className="flex w-[120px] flex-col items-center">
                  <div className="h-6 w-px bg-border" />
                  {/* TODO: ganti dengan <Image src="..." /> untuk foto asli */}
                  <div className="mt-1 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-2 text-xs font-medium text-foreground">{member.name}</p>
                  <p className="text-[11px] text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4 — CTA + Footer */}
        <div className="flex h-full w-full flex-col items-center justify-center bg-background px-4">
          <div className="mx-auto w-full max-w-[900px]">
            <div className="rounded-2xl bg-primary/[0.06] px-6 py-10 text-center">
              <p className="text-base font-medium text-foreground sm:text-lg">
                Pantau performa departemen secara real-time
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Audit, WIP, 3R, dan scorecard dalam satu dashboard
              </p>
              <Link
                href="/login"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02] hover:opacity-90"
              >
                Masuk ke dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border py-6">
              <div>
                <p className="text-xs font-medium text-foreground">
                  PT. Adira Semesta Industry
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Waste management department
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Link href="/contact" className="flex items-center gap-1 hover:text-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  Contact us
                </Link>
                <Link href="/login" className="flex items-center gap-1 hover:text-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  Login
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </FullPageScroll>
    </div>
  );
}
