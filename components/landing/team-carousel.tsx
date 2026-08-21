import { User } from "lucide-react";

// TODO: ganti "Nama" dan role dengan data tim asli begitu tersedia.
const TEAM = {
  head: { name: "Nama", role: "Kepala departemen" },
  members: [
    { name: "Nama", role: "Lead 3R" },
    { name: "Nama", role: "Lead internal audit" },
    { name: "Nama", role: "Data analyst" },
    { name: "Nama", role: "Staff operasional" },
  ],
};

// TODO: ganti dengan foto asli suasana kerja tim (via <Image src="..." />).
// Placeholder di-duplikasi 2x supaya animasi marquee terlihat menyambung
// tanpa putus.
const GALLERY_PLACEHOLDER_COUNT = 6;

export function TeamSection() {
  const galleryItems = Array.from({ length: GALLERY_PLACEHOLDER_COUNT });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mx-auto w-full max-w-[900px]">
        <p className="mb-5 text-[11px] uppercase tracking-wide text-muted-foreground">
          Struktur tim
        </p>

        <div className="inline-flex flex-col items-center gap-1.5">
          {/* TODO: ganti dengan <Image src="..." /> untuk foto asli */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <p className="mt-1 text-sm font-medium text-foreground">{TEAM.head.name}</p>
          <p className="text-xs text-muted-foreground">{TEAM.head.role}</p>
        </div>

        <div className="mx-auto mt-2 h-5 w-px bg-border" />
        <div className="mx-auto h-px max-w-[560px] bg-border" />

        <div className="mx-auto flex max-w-[600px] flex-wrap justify-center gap-4">
          {TEAM.members.map((member) => (
            <div key={member.role} className="flex w-[110px] flex-col items-center">
              <div className="h-5 w-px bg-border" />
              {/* TODO: ganti dengan <Image src="..." /> untuk foto asli */}
              <div className="mt-1 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-1.5 text-xs font-medium text-foreground">{member.name}</p>
              <p className="text-[10px] text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Carousel foto suasana kerja — auto-scroll, pause saat di-hover */}
        <div className="mt-8 w-full overflow-hidden">
          <p className="mb-2 text-[11px] text-muted-foreground">Momen tim kami</p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee flex w-max gap-3">
              {[...galleryItems, ...galleryItems].map((_, i) => (
                <div
                  key={i}
                  className="flex h-24 w-36 shrink-0 items-center justify-center rounded-xl bg-muted"
                >
                  <User className="h-6 w-6 text-muted-foreground/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
