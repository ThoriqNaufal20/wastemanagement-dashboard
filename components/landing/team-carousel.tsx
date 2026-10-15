"use client";

import { useState, useEffect, useMemo } from "react";
import { User, X, Maximize2 } from "lucide-react";

// Tipe data anggota tim
export interface TeamMember {
  name: string;
  role: string;
  avatar?: string; // Opsional: letakkan file foto profil di public/team/ (misal: "/team/caren.jpg")
}

// TODO: ganti "Nama", role, atau avatar dengan data tim asli begitu tersedia.
const TEAM: { head: TeamMember; members: TeamMember[] } = {
  head: { name: "Caren Ryana Kosasih", role: "Manager Waste Management" },
  members: [
    { name: "Inas Arfieny Halimatus Nadiyah", role: "Staff Waste Management" },
    { name: "Joseph Johanes Aditya", role: "Staff 3R" },
    { name: "Dicky Abrian Setiyanto", role: "Staff Data Analyst" },
    { name: "Muhammad Thoriq Naufal", role: "Staff Data Analyst" },
  ],
};

// Tipe foto untuk carousel momen tim
export interface TeamPhoto {
  src: string;
  alt?: string;
}

// ============================================================================
// DAFTAR FOTO CAROUSEL MOMEN TIM
// Simpan file foto Anda di folder: public/team/ (contoh: public/team/foto-1.jpg)
// lalu daftarkan path-nya di array berikut:
// ============================================================================
export const TEAM_PHOTOS: TeamPhoto[] = [
  { src: "/team/1.jpeg", alt: "Yearly Photo Waste Management" },
  { src: "/team/2.jpeg", alt: "Yearly Photo Waste Management" },
  { src: "/team/3.jpeg", alt: "Yearly Photo Waste Management" },
];

const GALLERY_PLACEHOLDER_COUNT = 6;

export function TeamSection() {
  const [selectedPhoto, setSelectedPhoto] = useState<TeamPhoto | null>(null);

  const hasPhotos = TEAM_PHOTOS.length > 0;

  // Tutup modal dengan tombol Esc dan nonaktifkan scroll saat modal terbuka
  useEffect(() => {
    if (selectedPhoto) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setSelectedPhoto(null);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
  }, [selectedPhoto]);

  // Ulangi daftar foto jika jumlah foto < 6 agar efek marquee berputar mulus tanpa jeda kosong
  const itemsToLoop = useMemo(() => {
    if (!hasPhotos) {
      const placeholders = Array.from({ length: GALLERY_PLACEHOLDER_COUNT }).map((_, i) => ({
        src: "",
        alt: `Placeholder ${i + 1}`,
      }));
      return [...placeholders, ...placeholders];
    }
    let list = [...TEAM_PHOTOS];
    while (list.length < 8) {
      list = [...list, ...TEAM_PHOTOS];
    }
    return [...list, ...list];
  }, [hasPhotos]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mx-auto w-full max-w-[1000px] 2xl:max-w-[1500px]">
        <p className="mb-4 2xl:mb-8 text-[11px] 2xl:text-base uppercase tracking-wide text-muted-foreground">
          Struktur tim
        </p>

        {/* Head */}
        <div className="inline-flex flex-col items-center gap-1.5 2xl:gap-2.5">
          <div className="flex h-14 w-14 2xl:h-20 2xl:w-20 items-center justify-center overflow-hidden rounded-full bg-primary/10 shadow-sm">
            {TEAM.head.avatar ? (
              <img
                src={TEAM.head.avatar}
                alt={TEAM.head.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 2xl:h-10 2xl:w-10 text-primary" />
            )}
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

                <div className="mt-1 flex h-[48px] w-[48px] 2xl:h-[72px] 2xl:w-[72px] items-center justify-center overflow-hidden rounded-full bg-primary/10 shadow-sm">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 2xl:h-8 2xl:w-8 text-primary" />
                  )}
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

        {/* Carousel foto suasana kerja — auto-scroll, pause saat di-hover, klik untuk perbesar */}
        <div className="mt-6 sm:mt-8 2xl:mt-14 w-full overflow-hidden">
          <div className="mb-2 2xl:mb-4 flex items-center justify-center gap-2">
            <p className="text-[11px] 2xl:text-base text-muted-foreground">
              Momen tim kami
            </p>
            <span className="text-[10px] 2xl:text-xs text-muted-foreground/70">
              · Klik foto untuk memperbesar
            </span>
          </div>

          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="animate-marquee flex w-max gap-4 2xl:gap-6 py-2">
              {itemsToLoop.map((item, i) => (
                <div
                  key={i}
                  onClick={() => item.src && setSelectedPhoto(item)}
                  className={`group/photo relative flex h-28 w-44 sm:h-28 sm:w-48 2xl:h-44 2xl:w-64 shrink-0 items-center justify-center overflow-hidden rounded-xl 2xl:rounded-2xl bg-muted shadow-sm ring-1 ring-border/60 transition-all duration-300 hover:shadow-lg hover:ring-primary/40 ${
                    item.src ? "cursor-pointer" : ""
                  }`}
                  title={item.src ? "Klik untuk melihat ukuran penuh" : undefined}
                >
                  {item.src ? (
                    <>
                      <img
                        src={item.src}
                        alt={item.alt || `Momen tim ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover/photo:scale-105"
                        loading="lazy"
                      />
                      {/* Hover Overlay Hint */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover/photo:opacity-100">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
                          <Maximize2 className="h-3.5 w-3.5" />
                          <span>Perbesar</span>
                        </span>
                      </div>
                    </>
                  ) : (
                    <User className="h-8 w-8 2xl:h-12 2xl:w-12 text-muted-foreground/40" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal Fullscreen */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Close button in top-right */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95"
            aria-label="Tutup pratinjau foto"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image & Caption Container */}
          <div
            className="relative flex max-h-[88vh] max-w-[88vw] flex-col items-center overflow-hidden rounded-2xl bg-card/10 p-2 sm:p-3 shadow-2xl ring-1 ring-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt || "Momen Tim Waste Management"}
              className="max-h-[75vh] max-w-[85vw] rounded-xl object-contain shadow-2xl"
            />
            {selectedPhoto.alt && (
              <div className="mt-3 px-4 pb-1 text-center">
                <p className="text-sm sm:text-base font-semibold text-white">
                  {selectedPhoto.alt}
                </p>
                <p className="text-[11px] text-white/60">
                  Tekan Esc atau klik di luar untuk menutup
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
