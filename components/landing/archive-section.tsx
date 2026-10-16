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
  Eye,
  Maximize2,
} from "lucide-react";
import {
  DEFAULT_ARCHIVE_ITEMS,
  ARCHIVE_CATEGORIES,
} from "@/lib/archive-constants";
import type { ArchiveCategory, ArchiveItem } from "@/lib/archive-types";

interface ArchiveSectionProps {
  initialItems?: ArchiveItem[];
}

/**
 * Mendapatkan URL embed interaktif (Google Drive preview, Google Slides embed, YouTube embed)
 */
function getEmbedUrl(url?: string): string | null {
  if (!url || url === "#") return null;

  // 1. Google Drive File (Video, Dokumen, PDF)
  const driveMatch =
    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }

  // 2. Google Slides Presentation
  const slidesMatch =
    url.match(/\/presentation\/[ud]\/(?:[0-9]+\/)?d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (slidesMatch && slidesMatch[1]) {
    return `https://docs.google.com/presentation/d/${slidesMatch[1]}/embed?start=false&loop=false&delayms=3000`;
  }

  // 3. YouTube Video
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
  }

  return null;
}

export function ArchiveSection({ initialItems }: ArchiveSectionProps) {
  const [items, setItems] = useState<ArchiveItem[]>(
    initialItems && initialItems.length > 0 ? initialItems : DEFAULT_ARCHIVE_ITEMS
  );
  const [activeCategory, setActiveCategory] = useState<ArchiveCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<ArchiveItem | null>(null);

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

  // Filter dan sorting (terbaru ke terlama)
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
        return { label: "Data Analytics", code: "DA", color: "bg-emerald-600 text-white" };
      case "slides":
        return { label: "Executive Deck", code: "EX", color: "bg-sky-600 text-white" };
      case "poster":
        return { label: "Campaign 3R", code: "3R", color: "bg-purple-600 text-white" };
      case "video":
        return { label: "Waste Management", code: "WM", color: "bg-teal-600 text-white" };
      default:
        return { label: "Waste Management", code: "WM", color: "bg-primary text-primary-foreground" };
    }
  };

  /**
   * Komponen Thumbnail Media Nyata
   * Menampilkan gambar thumbnail nyata dari Google Drive / Slides / Video,
   * dengan fallback mulus ke gradien bila gambar tidak tersedia.
   */
  const MediaThumbnail = ({
    item,
    isLarge = false,
    className = "",
    onOpenPreview,
  }: {
    item: ArchiveItem;
    isLarge?: boolean;
    className?: string;
    onOpenPreview?: () => void;
  }) => {
    const [imgFailed, setImgFailed] = useState(false);
    const hasImage = Boolean(item.thumbnailUrl && !imgFailed);

    return (
      <div
        onClick={onOpenPreview}
        className={`relative overflow-hidden rounded-xl 2xl:rounded-2xl cursor-pointer bg-muted flex items-center justify-center text-white select-none ${className}`}
      >
        {hasImage ? (
          <>
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgFailed(true)}
              loading="lazy"
            />
            {/* Dark vignette gradient for high contrast readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 group-hover:from-black/75 transition-colors" />
          </>
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${item.gradientClass} relative flex items-center justify-center`}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
          </div>
        )}

        {/* Format Badge Top-Left */}
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center gap-1 rounded-md bg-black/65 px-2 py-0.5 text-[10px] 2xl:text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md border border-white/10 shadow-sm">
            {item.category === "video" ? (
              <Play className="h-2.5 w-2.5 fill-white" />
            ) : (
              renderIcon(item.iconType, "h-2.5 w-2.5")
            )}
            {item.typeBadge}
          </span>
        </div>

        {/* Center Hover Action / Play Button */}
        <div
          className={`relative z-10 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/25 shadow-lg transition-all group-hover:scale-110 group-hover:bg-white/30 ${
            isLarge ? "h-12 w-12 2xl:h-14 2xl:w-14" : "h-8 w-8 2xl:h-9 2xl:w-9"
          }`}
        >
          {item.category === "video" ? (
            <Play className={`${isLarge ? "h-6 w-6 ml-0.5" : "h-4 w-4 ml-0.5"} fill-white`} />
          ) : (
            renderIcon(item.iconType, isLarge ? "h-6 w-6 text-white" : "h-4 w-4 text-white")
          )}
        </div>

        {/* File Meta / Duration Bottom-Right */}
        {item.fileMeta && (
          <div className="absolute bottom-2 right-2 z-10">
            <span className="rounded bg-black/65 px-1.5 py-0.5 text-[9px] 2xl:text-[10px] font-medium text-white/90 backdrop-blur-md border border-white/10">
              {item.fileMeta}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background px-4 sm:px-6 2xl:px-12 py-4 sm:py-6">
      <div className="mx-auto w-full max-w-[1140px] 2xl:max-w-[1600px] flex flex-col justify-center">

        {/* 1. Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 border-b border-border/60 pb-3 2xl:pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 2xl:px-4 2xl:py-1 text-xs 2xl:text-sm font-semibold uppercase tracking-wider text-primary border border-primary/20">
              <FolderArchive className="h-3.5 w-3.5 2xl:h-4 2xl:w-4" />
              Resource & Archive Center
            </div>
            <h2 className="mt-1.5 text-xl sm:text-2xl 2xl:text-3xl font-extrabold tracking-tight text-foreground">
              Gudang Arsip & Publikasi
            </h2>
            <p className="mt-0.5 text-xs 2xl:text-sm text-muted-foreground">
              Pusat penyimpanan laporan, rilis project, materi presentasi, dan video edukasi.
            </p>
          </div>

          {/* Quick Actions: Button Katalog Lengkap */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCatalogModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3.5 py-1.5 text-xs 2xl:text-sm font-semibold text-primary hover:bg-primary/10 transition active:scale-95 shadow-sm"
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
              className="w-full rounded-full border border-border bg-card py-1.5 2xl:py-2 pl-9 pr-3 text-xs 2xl:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition shadow-sm"
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
                      ? "bg-primary text-primary-foreground shadow-sm font-semibold"
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
            
            {/* SISI KIRI (Col 5): Featured Document #1 (Elegan, Selaras dengan Palette Navy-Teal) */}
            {featuredItem && (
              <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl 2xl:rounded-3xl border border-border/80 bg-card text-card-foreground shadow-sm hover:shadow-md transition-all relative overflow-hidden group p-4 sm:p-5 2xl:p-6">
                {/* Subtle refined accent glow */}
                <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full bg-primary/10 dark:bg-primary/20 blur-3xl pointer-events-none" />

                <div>
                  {/* Top Header inside Card */}
                  <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold text-[10px] 2xl:text-xs tracking-wider uppercase shadow-xs">
                      <Sparkles className="h-3 w-3" />
                      Sorotan Utama
                    </span>
                    <span className="text-[11px] 2xl:text-xs text-muted-foreground font-mono font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {featuredItem.date || featuredItem.periodOrDuration || "Terbaru"}
                    </span>
                  </div>

                  {/* Real Media Preview Thumbnail */}
                  <MediaThumbnail
                    item={featuredItem}
                    isLarge={true}
                    className="w-full aspect-[16/10] shadow-sm border border-border/40"
                    onOpenPreview={() => setPreviewItem(featuredItem)}
                  />

                  {/* Meta Source & Title */}
                  <div className="mt-3.5 2xl:mt-4">
                    <div className="flex items-center gap-2 text-[11px] 2xl:text-xs text-muted-foreground mb-1">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] ${getSourceBadge(featuredItem.category).color}`}>
                        {getSourceBadge(featuredItem.category).code}
                      </span>
                      <span className="font-semibold text-foreground/80">
                        {getSourceBadge(featuredItem.category).label}
                      </span>
                      <span>•</span>
                      <span className="text-primary font-mono font-medium">
                        {featuredItem.date || "Terbaru"}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {featuredItem.title}
                    </h3>

                    <p className="mt-1.5 text-xs 2xl:text-sm text-muted-foreground leading-relaxed line-clamp-2 2xl:line-clamp-3">
                      {featuredItem.description}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between gap-2">
                  <span className="text-[11px] 2xl:text-xs font-bold uppercase tracking-wider text-primary">
                    {featuredItem.categoryLabel}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Tombol Preview Cepat Interaktif */}
                    <button
                      onClick={() => setPreviewItem(featuredItem)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs 2xl:text-sm font-semibold bg-muted hover:bg-muted/80 text-foreground transition"
                      title="Preview langsung dokumen di layar"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>

                    {/* Tombol Akses URL */}
                    <a
                      href={featuredItem.externalUrl}
                      target={featuredItem.externalUrl !== "#" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs 2xl:text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition shadow-sm"
                    >
                      <span>{featuredItem.actionLabel}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* SISI KANAN (Col 7): Scrollable Feed dengan Media Thumbnail Nyata */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] 2xl:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Publikasi & Dokumen Lainnya ({feedItems.length} Arsip)
                </span>
                <span className="text-[11px] 2xl:text-xs text-muted-foreground">
                  Gulir untuk melihat lebih banyak &darr;
                </span>
              </div>

              {/* Scrollable Feed Container */}
              <div className="space-y-2.5 2xl:space-y-3.5 max-h-[380px] sm:max-h-[420px] 2xl:max-h-[580px] overflow-y-auto pr-1.5 [scrollbar-width:thin]">
                {feedItems.length > 0 ? (
                  feedItems.map((item) => {
                    const badge = getSourceBadge(item.category);
                    return (
                      <article
                        key={item.id}
                        className="group p-3 2xl:p-3.5 rounded-xl 2xl:rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-sm transition-all flex flex-col sm:flex-row gap-3 2xl:gap-4"
                      >
                        {/* Real Media Thumbnail */}
                        <MediaThumbnail
                          item={item}
                          isLarge={false}
                          className="w-full sm:w-32 2xl:w-40 h-24 2xl:h-28 shrink-0 shadow-xs border border-border/40"
                          onOpenPreview={() => setPreviewItem(item)}
                        />

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
                              <span className="font-mono text-primary font-medium">
                                {item.date || item.periodOrDuration || "Terbaru"}
                              </span>
                            </div>

                            {/* Title */}
                            <h4
                              onClick={() => setPreviewItem(item)}
                              className="text-xs sm:text-sm 2xl:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug cursor-pointer"
                            >
                              {item.title}
                            </h4>

                            {/* Excerpt */}
                            <p className="mt-1 text-[11px] 2xl:text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Footer Tag & Actions */}
                          <div className="mt-2 pt-1.5 border-t border-border/60 flex items-center justify-between text-[10px] 2xl:text-xs">
                            <span className="font-extrabold uppercase tracking-wide text-primary">
                              {item.categoryLabel}
                            </span>
                            <div className="flex items-center gap-2.5">
                              <button
                                onClick={() => setPreviewItem(item)}
                                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition font-medium"
                              >
                                <Eye className="h-3 w-3" />
                                <span>Preview</span>
                              </button>
                              <a
                                href={item.externalUrl}
                                target={item.externalUrl !== "#" ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline transition-colors"
                              >
                                <span>{item.actionLabel}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
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
              className="mt-3 rounded-full bg-primary/10 px-4 py-1.5 text-xs 2xl:text-sm font-medium text-primary hover:bg-primary/20 transition"
            >
              Reset Filter & Pencarian
            </button>
          </div>
        )}

      </div>

      {/* 4. MODAL DIALOG: PREVIEW LANGSUNG (Interactive Embed Player / Viewer) */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-background">
              <div className="pr-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px] uppercase">
                    {previewItem.typeBadge}
                  </span>
                  <span>•</span>
                  <span>{previewItem.date || previewItem.periodOrDuration}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-1">
                  {previewItem.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewItem.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-xs font-semibold inline-flex items-center gap-1 text-foreground transition"
                >
                  <span>Buka di Tab Baru</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="w-8 h-8 rounded-full border border-border bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition"
                  aria-label="Tutup preview"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Media Player / Embed Frame */}
            <div className="flex-1 bg-black aspect-video w-full flex items-center justify-center relative overflow-hidden">
              {getEmbedUrl(previewItem.externalUrl) ? (
                <iframe
                  src={getEmbedUrl(previewItem.externalUrl)!}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={previewItem.title}
                />
              ) : previewItem.thumbnailUrl ? (
                <img
                  src={previewItem.thumbnailUrl}
                  alt={previewItem.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-8 text-white">
                  <p className="text-sm font-semibold">Preview iframe tidak tersedia untuk dokumen ini.</p>
                  <a
                    href={previewItem.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
                  >
                    Buka Dokumen Asli <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer Description */}
            <div className="p-3.5 border-t border-border bg-background flex items-center justify-between text-xs text-muted-foreground">
              <span className="line-clamp-1">{previewItem.description}</span>
              <button
                onClick={() => setPreviewItem(null)}
                className="px-3 py-1 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition shrink-0 ml-4"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL DIALOG: KATALOG LENGKAP (Grid 4-Kolom Lengkap) */}
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
                  className="rounded-2xl border border-border bg-background p-3 flex flex-col justify-between hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Media Thumbnail */}
                    <MediaThumbnail
                      item={item}
                      isLarge={false}
                      className="aspect-video rounded-xl mb-2.5 shadow-xs"
                      onOpenPreview={() => {
                        setIsCatalogModalOpen(false);
                        setPreviewItem(item);
                      }}
                    />

                    {/* Date & Title */}
                    <div className="text-[10px] text-primary font-mono font-semibold">
                      {item.date || item.periodOrDuration || "Terbaru"}
                    </div>
                    <h5
                      onClick={() => {
                        setIsCatalogModalOpen(false);
                        setPreviewItem(item);
                      }}
                      className="text-xs sm:text-sm font-bold text-foreground mt-0.5 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h5>
                    <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[10px]">
                    <span className="font-extrabold uppercase text-primary">
                      {item.categoryLabel}
                    </span>
                    <a
                      href={item.externalUrl}
                      target={item.externalUrl !== "#" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="font-bold text-foreground hover:text-primary inline-flex items-center gap-0.5"
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
