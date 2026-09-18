"use client";

import { useState, useRef, useMemo } from "react";
import {
  FileText,
  BarChart3,
  Image as ImageIcon,
  Presentation,
  Video,
  Play,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderArchive,
} from "lucide-react";
import {
  ARCHIVE_ITEMS,
  ARCHIVE_CATEGORIES,
} from "@/lib/archive-data";
import type { ArchiveCategory, ArchiveItem } from "@/lib/archive-types";

export function ArchiveSection() {
  const [activeCategory, setActiveCategory] = useState<ArchiveCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    return ARCHIVE_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleScroll = (direction: "prev" | "next") => {
    if (!carouselRef.current) return;
    const scrollAmount = direction === "prev" ? -350 : 350;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const renderIcon = (type: ArchiveItem["iconType"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 2xl:h-7 2xl:w-7 text-white" />;
      case "sheets":
        return <BarChart3 className="h-5 w-5 2xl:h-7 2xl:w-7 text-white" />;
      case "image":
        return <ImageIcon className="h-5 w-5 2xl:h-7 2xl:w-7 text-white" />;
      case "presentation":
        return <Presentation className="h-5 w-5 2xl:h-7 2xl:w-7 text-white" />;
      case "video":
        return <Video className="h-5 w-5 2xl:h-7 2xl:w-7 text-white" />;
      default:
        return <FileText className="h-5 w-5 2xl:h-7 2xl:w-7 text-white" />;
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background px-4 sm:px-6 2xl:px-12 py-6">
      <div className="mx-auto w-full max-w-[1100px] 2xl:max-w-[1600px] flex flex-col justify-center">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-4 2xl:pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 2xl:px-4 2xl:py-1.5 text-xs 2xl:text-sm font-semibold uppercase tracking-wider text-primary">
              <FolderArchive className="h-3.5 w-3.5 2xl:h-4 2xl:w-4" />
              Resource & Archive Center
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl 2xl:text-4xl font-bold tracking-tight text-foreground">
              Gudang Arsip & Publikasi
            </h2>
            <p className="mt-1 text-xs sm:text-sm 2xl:text-base text-muted-foreground">
              Pusat penyimpanan laporan rapat, project data-driven, materi awareness, slides, dan video edukasi.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll("prev")}
              className="flex h-9 w-9 sm:h-10 sm:w-10 2xl:h-12 2xl:w-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-muted active:scale-95"
              aria-label="Geser arsip ke kiri"
            >
              <ChevronLeft className="h-4 w-4 2xl:h-6 2xl:w-6" />
            </button>
            <button
              onClick={() => handleScroll("next")}
              className="flex h-9 w-9 sm:h-10 sm:w-10 2xl:h-12 2xl:w-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-muted active:scale-95"
              aria-label="Geser arsip ke kanan"
            >
              <ChevronRight className="h-4 w-4 2xl:h-6 2xl:w-6" />
            </button>
          </div>
        </div>

        {/* Controls: Search Bar & Filter Categories */}
        <div className="mt-4 2xl:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80 2xl:w-96">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 2xl:h-5 2xl:w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari artikel, laporan, atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-card py-2 2xl:py-2.5 pl-10 pr-4 text-xs sm:text-sm 2xl:text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 2xl:gap-2 overflow-x-auto py-1">
            {ARCHIVE_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-3.5 py-1.5 2xl:px-5 2xl:py-2 text-xs 2xl:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Scrollable Carousel */}
        <div className="relative mt-4 2xl:mt-6">
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-5 2xl:gap-6 overflow-x-auto scroll-smooth pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="group flex w-[280px] sm:w-[320px] 2xl:w-[380px] shrink-0 flex-col overflow-hidden rounded-2xl 2xl:rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md"
              >
                {/* Visual Cover Banner */}
                <div
                  className={`relative h-40 sm:h-44 2xl:h-52 w-full bg-gradient-to-br ${item.gradientClass} p-4 2xl:p-5 flex flex-col justify-between text-white overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md ${item.badgeColorClass} px-2 py-0.5 2xl:px-3 2xl:py-1 text-[10px] 2xl:text-xs font-bold uppercase tracking-wider backdrop-blur-sm`}
                    >
                      {item.typeBadge}
                    </span>
                    {item.periodOrDuration && (
                      <span className="text-[11px] 2xl:text-xs font-medium text-white/90">
                        {item.periodOrDuration}
                      </span>
                    )}
                  </div>

                  <div className="relative z-10">
                    <div className="flex h-10 w-10 2xl:h-14 2xl:w-14 items-center justify-center rounded-xl 2xl:rounded-2xl bg-white/15 backdrop-blur-sm shadow-sm transition-transform group-hover:scale-110">
                      {item.category === "video" ? (
                        <Play className="h-5 w-5 2xl:h-7 2xl:w-7 fill-white text-white ml-0.5" />
                      ) : (
                        renderIcon(item.iconType)
                      )}
                    </div>
                  </div>
                </div>

                {/* Article Body */}
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 2xl:p-6">
                  <div>
                    <p className="text-[11px] 2xl:text-xs font-semibold uppercase tracking-wider text-primary">
                      {item.categoryLabel}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-sm sm:text-base 2xl:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs 2xl:text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Footer & Action Button */}
                  <div className="mt-4 2xl:mt-6 flex items-center justify-between border-t border-border pt-3 2xl:pt-4">
                    <span className="text-[11px] 2xl:text-xs text-muted-foreground">
                      {item.fileMeta || "Tersedia"}
                    </span>
                    <a
                      href={item.externalUrl}
                      target={item.externalUrl !== "#" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs 2xl:text-sm font-semibold text-primary hover:underline"
                    >
                      {item.actionLabel}
                      <ExternalLink className="h-3.5 w-3.5 2xl:h-4 2xl:w-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm 2xl:text-base font-semibold text-foreground">
              Arsip tidak ditemukan
            </p>
            <p className="mt-1 text-xs 2xl:text-sm text-muted-foreground">
              Coba kata kunci lain atau pilih kategori &quot;Semua&quot;.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="mt-3 rounded-full bg-primary/10 px-4 py-1.5 text-xs 2xl:text-sm font-medium text-primary hover:bg-primary/20 transition"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 text-[11px] 2xl:text-xs text-muted-foreground">
          <span>💡 Geser barisan kartu ke kiri/kanan menggunakan mouse, sentuhan, atau tombol panah.</span>
          <span className="font-medium text-foreground">
            {filteredItems.length} Arsip Ditampilkan
          </span>
        </div>

      </div>
    </div>
  );
}

