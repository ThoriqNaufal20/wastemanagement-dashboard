import { User } from "lucide-react";

// TODO: ganti "Nama" dan role dengan data tim asli begitu tersedia.
const TEAM = {
  head: { name: "Caren Ryana Kosasih", role: "Manager Waste Management" },
  members: [
    { name: "Inas Arfieny Halimatus Nadiyah", role: "Staff Waste Management" },
    { name: "Joseph Johanes Aditya", role: "Staff 3R" },
    { name: "Dicky Abrian Setiyanto", role: "Staff Data Analyst" },
    { name: "Muhammad Thoriq Naufal", role: "Staff Data Analyst" },
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
      <div className="mx-auto w-full max-w-[900px] 2xl:max-w-[1500px]">
        <p className="mb-5 2xl:mb-8 text-[11px] 2xl:text-base uppercase tracking-wide text-muted-foreground">
          Struktur tim
        </p>

        {/* Head */}
        <div className="inline-flex flex-col items-center gap-1.5 2xl:gap-2.5">
          <div className="flex h-14 w-14 2xl:h-20 2xl:w-20 items-center justify-center rounded-full bg-primary/10 shadow-sm">
            <User className="h-6 w-6 2xl:h-10 2xl:w-10 text-primary" />
          </div>
          <p className="mt-1 text-sm 2xl:text-xl font-medium 2xl:font-semibold text-foreground">
            {TEAM.head.name}
          </p>
          <p className="text-xs 2xl:text-base text-muted-foreground">{TEAM.head.role}</p>
        </div>

        {/* Tree Members */}
        <div className="relative mx-auto mt-2 2xl:mt-4 w-fit">
          {/* Garis horizontal: dari tengah profile pertama sampai tengah profile terakhir */}
          <div className="absolute left-[90px] right-[90px] 2xl:left-[130px] 2xl:right-[130px] top-0 h-px bg-border" />

          <div className="flex gap-8 2xl:gap-12">
            {TEAM.members.map((member) => (
              <div
                key={member.name}
                className="flex w-[180px] 2xl:w-[260px] shrink-0 flex-col items-center"
              >
                {/* Garis vertikal menuju profile */}
                <div className="h-5 2xl:h-7 w-px bg-border" />

                <div className="mt-1 flex h-[48px] w-[48px] 2xl:h-[72px] 2xl:w-[72px] items-center justify-center rounded-full bg-primary/10 shadow-sm">
                  <User className="h-5 w-5 2xl:h-8 2xl:w-8 text-primary" />
                </div>

                <p className="mt-1.5 2xl:mt-2.5 text-xs 2xl:text-base font-medium 2xl:font-semibold text-foreground">
                  {member.name}
                </p>

                <p className="whitespace-nowrap text-[10px] 2xl:text-sm text-muted-foreground">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel foto suasana kerja — auto-scroll, pause saat di-hover */}
        <div className="mt-8 2xl:mt-14 w-full overflow-hidden">
          <p className="mb-2 2xl:mb-4 text-[11px] 2xl:text-base text-muted-foreground">
            Momen tim kami
          </p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee flex w-max gap-3 2xl:gap-5">
              {[...galleryItems, ...galleryItems].map((_, i) => (
                <div
                  key={i}
                  className="flex h-24 w-36 2xl:h-40 2xl:w-60 shrink-0 items-center justify-center rounded-xl 2xl:rounded-2xl bg-muted"
                >
                  <User className="h-6 w-6 2xl:h-10 2xl:w-10 text-muted-foreground/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
