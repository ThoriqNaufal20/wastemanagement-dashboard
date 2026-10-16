"use client";

import { useState, useMemo, useEffect } from "react";
import {
  FileText,
  BarChart3,
  Image as ImageIcon,
  Presentation,
  Video,
  Play,
  Search,
  ExternalLink,
  FolderArchive,
  Sparkles,
  Calendar,
  X,
  LayoutGrid,
} from "lucide-react";
import {
  DEFAULT_ARCHIVE_ITEMS,
  ARCHIVE_CATEGORIES,
} from "@/lib/archive-constants";
import type { ArchiveCategory, ArchiveItem } from "@/lib/archive-types";

interface ArchiveSectionProps {
  initialItems?: ArchiveItem[];
}

export function ArchiveSection({ initialItems }: ArchiveSectionProps) {
  const [items, setItems] = useState<ArchiveItem[]>(
    initialItems && initialItems.length > 0 ? initialItems : DEFAULT_ARCHIVE_ITEMS
  );
  const [activeCategory, setActiveCategory] = useState<ArchiveCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  // Background fetch data live dari API
  useEffect(() => {
    let isMounted = true;
    fetch("/api/archive-data")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.items && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch((err) => {
        console.warn("[ArchiveSection] Gagal memuat data live dari API, memakai data awal:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter dan sorting (terbaru ke terlama / paling baru di posisi pertama)
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const typeLower = item.typeBadge.toLowerCase();
        const matchesCategory =
          activeCategory === "all" ||
          item.category === activeCategory ||
          (activeCategory === "video" && (item.iconType === "video" || typeLower.includes("video"))) ||
          (activeCategory === "slides" &&
            (item.iconType === "presentation" ||
              typeLower.includes("slide") ||
              typeLower.includes("ppt"))) ||
          (activeCategory === "poster" &&
            (item.iconType === "image" ||
              typeLower.includes("canva") ||
              typeLower.includes("poster"))) ||
          (activeCategory === "meeting" &&
            (item.iconType === "pdf" || typeLower.includes("pdf"))) ||
          (activeCategory === "data" &&
            (item.category === "data" ||
              item.iconType === "sheets" ||
              typeLower.includes("sheet") ||
              typeLower.includes("project")));

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.categoryLabel.toLowerCase().includes(q) ||
          item.typeBadge.toLowerCase().includes(q) ||
          (item.date && item.date.toLowerCase().includes(q)) ||
          (item.periodOrDuration && item.periodOrDuration.toLowerCase().includes(q));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
  }, [items, activeCategory, searchQuery]);

  const featuredItem = filteredItems[0];
  const feedItems = filteredItems.slice(1);

  const renderIcon = (type: ArchiveItem["iconType"], className = "h-4 w-4") => {
    switch (type) {
      case "pdf":
        return <FileText className={className} />;
      case "sheets":
        return <BarChart3 className={className} />;
      case "image":
        return <ImageIcon className={className} />;
      case "presentation":
        return <Presentation className={className} />;
      case "video":
        return <Video className={className} />;
      default:
        return <FileText className={className} />;
    }
  };

  const getSourceBadge = (category: string) => {
    switch (category) {
      case "data":
        return { label: "Data Analytics", code: "DA", color: "bg-emerald-500 text-white" };
      case "slides":
        return { label: "Executive Deck", code: "EX", color: "bg-amber-500 text-slate-950 font-bold" };
      case "poster":
        return { label: "Campaign 3R", code: "3R", color: "bg-purple-500 text-white" };
      case "video":
        return { label: "Waste Management", code: "WM", color: "bg-rose-500 text-white" };
      default:
        return { label: "Waste Management", code: "WM", color: "bg-blue-600 text-white" };
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background px-4 sm:px-6 2xl:px-12 py-4 sm:py-6">
      <div className="mx-auto w-full max-w-[1140px] 2xl:max-w-[1600px] flex flex-col justify-center">

        {/* 1. Header Section (Clean News Header) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 border-b border-border/60 pb-3 2xl:pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 dark:bg-rose-500/20 px-3 py-0.5 2xl:px-4 2xl:py-1 text-xs 2xl:text-sm font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              <FolderArchive className="h-3.5 w-3.5 2xl:h-4 2xl:w-4" />
              Resource & Archive Center
            </div>
            <h2 className="mt-1.5 text-xl sm:text-2xl 2xl:text-3xl font-extrabold tracking-tight text-foreground">
              Gudang Arsip & Publikasi
            </h2>
            <p className="mt-0.5 text-xs 2xl:text-sm text-muted-foreground">
              Rilis project, presentasi eksekutif, video dokumentasi, dan materi awareness terbaru.
            </p>
          </div>

          {/* Quick Actions: Button Katalog Lengkap */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCatalogModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs 2xl:text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition active:scale-95 shadow-sm"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Katalog Lengkap ({items.length})</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        {/* 2. Controls Bar: Search & Filter Pills */}
        <div className="mt-3 2xl:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative w-full sm:w-72 2xl:w-80">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 2xl:h-4 2xl:w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari arsip, topik, atau tanggal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-card py-1.5 2xl:py-2 pl-9 pr-3 text-xs 2xl:text-sm text-foreground placeholder:text-muted-foreground focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {ARCHIVE_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-3 py-1 2xl:px-4 2xl:py-1.5 text-xs 2xl:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-rose-600 text-white shadow-sm font-semibold"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Main Split Screen Body (Layout B1) */}
        {filteredItems.length > 0 ? (
          <div className="mt-3 2xl:mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 2xl:gap-6 items-stretch">
            
            {/* SISI KIRI (Col 5): Featured Document #1 (Newest / Editor's Pick) */}
            {featuredItem && (
              <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl 2xl:rounded-3xl bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white p-4 2xl:p-6 shadow-xl relative overflow-hidden group">
                {/* Glow accent */}
                <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />

                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] 2xl:text-xs tracking-wider uppercase shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      EDITOR&apos;S PICK
                    </span>
                    <span className="text-[11px] 2xl:text-xs text-rose-400 font-mono font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {featuredItem.date || featuredItem.periodOrDuration || "Terbaru"}
                    </span>
                  </div>

                  {/* Featured Visual Cover */}
                  <div
                    className={`relative w-full aspect-[16/10] rounded-xl 2xl:rounded-2xl overflow-hidden bg-gradient-to-br ${featuredItem.gradientClass} shadow-md flex items-center justify-center`}
                  >
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                    {/* Format Badge Top-Left */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] 2xl:text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-md">
                        {featuredItem.category === "video" ? (
                          <Play className="h-3 w-3 fill-white" />
                        ) : (
                          renderIcon(featuredItem.iconType, "h-3 w-3")
                        )}
                        {featuredItem.typeBadge}
                      </span>
                    </div>

                    {/* Big Center Play / Open Icon */}
                    <div className="relative z-10 flex h-12 w-12 2xl:h-16 2xl:w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-lg transition-transform group-hover:scale-110">
                      {featuredItem.category === "video" ? (
                        <Play className="h-6 w-6 2xl:h-8 2xl:w-8 fill-white ml-0.5" />
                      ) : (
                        renderIcon(featuredItem.iconType, "h-6 w-6 2xl:h-8 2xl:w-8 text-white")
                      )}
                    </div>

                    {/* Meta Info Bottom-Right */}
                    {featuredItem.fileMeta && (
                      <div className="absolute bottom-2.5 right-2.5 z-10">
                        <span className="px-2 py-0.5 rounded text-[10px] 2xl:text-xs font-medium bg-black/60 backdrop-blur-md text-white">
                          {featuredItem.fileMeta}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Meta Source & Title */}
                  <div className="mt-3.5 2xl:mt-4">
                    <div className="flex items-center gap-2 text-[11px] 2xl:text-xs text-slate-400 mb-1">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] ${getSourceBadge(featuredItem.category).color}`}>
                        {getSourceBadge(featuredItem.category).code}
                      </span>
                      <span className="font-semibold text-slate-200">
                        {getSourceBadge(featuredItem.category).label}
                      </span>
                      <span>•</span>
                      <span className="text-rose-400 font-mono">
                        {featuredItem.date || "Terbaru"}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-white group-hover:text-rose-400 transition-colors leading-snug line-clamp-2">
                      {featuredItem.title}
                    </h3>

                    <p className="mt-1.5 text-xs 2xl:text-sm text-slate-300 leading-relaxed line-clamp-2 2xl:line-clamp-3">
                      {featuredItem.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] 2xl:text-xs text-slate-400 font-medium">
                    {featuredItem.categoryLabel}
                  </span>
                  <a
                    href={featuredItem.externalUrl}
                    target={featuredItem.externalUrl !== "#" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs 2xl:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white transition shadow-sm"
                  >
                    {featuredItem.actionLabel}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            {/* SISI KANAN (Col 7): Scrollable Feed of All Other Items */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] 2xl:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Publikasi & Dokumen Lainnya ({feedItems.length} Arsip)
                </span>
                <span className="text-[11px] 2xl:text-xs text-muted-foreground">
                  Gulir untuk melihat lebih banyak &darr;
                </span>
              </div>

              {/* Scrollable Feed Container (Pas di viewport, tidak meluap) */}
              <div className="space-y-2.5 2xl:space-y-3.5 max-h-[380px] sm:max-h-[420px] 2xl:max-h-[580px] overflow-y-auto pr-1.5 [scrollbar-width:thin]">
                {feedItems.length > 0 ? (
                  feedItems.map((item) => {
                    const badge = getSourceBadge(item.category);
                    return (
                      <article
                        key={item.id}
                        className="group p-3 2xl:p-4 rounded-xl 2xl:rounded-2xl border border-border/80 bg-card hover:border-rose-500/40 hover:shadow-md transition-all flex flex-col sm:flex-row gap-3 2xl:gap-4"
                      >
                        {/* Thumbnail Cover */}
                        <div
                          className={`w-full sm:w-32 2xl:w-40 h-24 2xl:h-28 rounded-lg 2xl:rounded-xl overflow-hidden shrink-0 relative bg-gradient-to-br ${item.gradientClass} flex items-center justify-center text-white shadow-inner`}
                        >
                          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />

                          {/* Center Icon */}
                          <div className="relative z-10 flex h-8 w-8 2xl:h-10 2xl:w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white transition-transform group-hover:scale-110">
                            {item.category === "video" ? (
                              <Play className="h-4 w-4 2xl:h-5 2xl:w-5 fill-white ml-0.5" />
                            ) : (
                              renderIcon(item.iconType, "h-4 w-4 2xl:h-5 2xl:w-5 text-white")
                            )}
                          </div>

                          {/* Top-Left Format Pill */}
                          <div className="absolute top-1.5 left-1.5 z-10">
                            <span className="px-1.5 py-0.5 rounded text-[9px] 2xl:text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur-sm">
                              {item.typeBadge}
                            </span>
                          </div>

                          {/* Bottom-Right Meta */}
                          {item.fileMeta && (
                            <div className="absolute bottom-1.5 right-1.5 z-10">
                              <span className="px-1.5 py-0.5 rounded text-[9px] 2xl:text-[10px] font-medium bg-black/70 text-white backdrop-blur-sm">
                                {item.fileMeta}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Article Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            {/* Meta Author / Source line */}
                            <div className="flex items-center gap-1.5 text-[10px] 2xl:text-[11px] text-muted-foreground mb-1">
                              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[7px] ${badge.color}`}>
                                {badge.code}
                              </span>
                              <span className="font-semibold text-foreground/80">
                                {badge.label}
                              </span>
                              <span>•</span>
                              <span className="font-mono text-rose-600 dark:text-rose-400 font-medium">
                                {item.date || item.periodOrDuration || "Terbaru"}
                              </span>
                            </div>

                            {/* Title (Bold News Style) */}
                            <h4 className="text-xs sm:text-sm 2xl:text-base font-bold text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-1 leading-snug">
                              {item.title}
                            </h4>

                            {/* Excerpt */}
                            <p className="mt-1 text-[11px] 2xl:text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Footer Tag & Action */}
                          <div className="mt-2 pt-1.5 border-t border-border/60 flex items-center justify-between text-[10px] 2xl:text-xs">
                            <span className="font-extrabold uppercase tracking-wide text-rose-600 dark:text-rose-400">
                              {item.categoryLabel}
                            </span>
                            <a
                              href={item.externalUrl}
                              target={item.externalUrl !== "#" ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors hover:underline"
                            >
                              <span>{item.actionLabel}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card/50">
                    <p className="text-xs 2xl:text-sm text-muted-foreground">
                      Hanya terdapat 1 arsip yang cocok dengan pencarian / filter ini.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Note of Right Side */}
              <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] 2xl:text-xs text-muted-foreground">
                <span>💡 Diurutkan otomatis: Dokumen terbaru selalu di posisi paling atas</span>
                <span className="font-medium text-foreground">
                  {filteredItems.length} Arsip Ditampilkan
                </span>
              </div>

            </div>

          </div>
        ) : (
          /* Empty State if Search Finds Nothing */
          <div className="mt-8 py-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
            <p className="text-sm 2xl:text-base font-semibold text-foreground">
              Arsip tidak ditemukan
            </p>
            <p className="mt-1 text-xs 2xl:text-sm text-muted-foreground">
              Tidak ada arsip yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="mt-3 rounded-full bg-rose-600/10 px-4 py-1.5 text-xs 2xl:text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-600/20 transition"
            >
              Reset Filter & Pencarian
            </button>
          </div>
        )}

      </div>

      {/* 4. MODAL DIALOG: KATALOG LENGKAP (Grid 4-Kolom Lengkap) */}
      {isCatalogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[85vh] rounded-3xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-background">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Katalog Lengkap Arsip & Publikasi
                </h3>
                <p className="text-xs text-muted-foreground">
                  Semua materi presentasi, sheet data, laporan, dan video edukasi Waste Management.
                </p>
              </div>
              <button
                onClick={() => setIsCatalogModalOpen(false)}
                className="w-8 h-8 rounded-full border border-border bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition"
                aria-label="Tutup katalog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-background p-3 flex flex-col justify-between hover:border-rose-500/50 hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Thumbnail */}
                    <div
                      className={`relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br ${item.gradientClass} flex items-center justify-center text-white mb-2.5`}
                    >
                      <div className="absolute inset-0 bg-black/25" />
                      <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white">
                        {item.category === "video" ? (
                          <Play className="h-4 w-4 fill-white ml-0.5" />
                        ) : (
                          renderIcon(item.iconType, "h-4 w-4 text-white")
                        )}
                      </div>
                      <div className="absolute top-1.5 left-1.5 z-10">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-black/70 text-white">
                          {item.typeBadge}
                        </span>
                      </div>
                    </div>

                    {/* Date & Title */}
                    <div className="text-[10px] text-rose-600 dark:text-rose-400 font-mono font-semibold">
                      {item.date || item.periodOrDuration || "Terbaru"}
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-foreground mt-0.5 line-clamp-2 group-hover:text-rose-600 transition-colors">
                      {item.title}
                    </h5>
                    <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[10px]">
                    <span className="font-extrabold uppercase text-rose-600 dark:text-rose-400">
                      {item.categoryLabel}
                    </span>
                    <a
                      href={item.externalUrl}
                      target={item.externalUrl !== "#" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="font-bold text-foreground hover:text-rose-600 inline-flex items-center gap-0.5"
                    >
                      Buka <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-border bg-background flex items-center justify-between text-xs text-muted-foreground">
              <span>Menampilkan {filteredItems.length} arsip terurut tanggal terbaru</span>
              <button
                onClick={() => setIsCatalogModalOpen(false)}
                className="px-4 py-1.5 rounded-full bg-muted font-medium hover:bg-muted/80 text-foreground transition"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
