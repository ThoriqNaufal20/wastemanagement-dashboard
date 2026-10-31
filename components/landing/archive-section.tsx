"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FileText,
  BarChart3,
  Image as ImageIcon,
  Presentation,
  Video,
  Play,
  Search,
  ExternalLink,
  X,
  LayoutGrid,
  Eye,
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const renderIcon = (type: ArchiveItem["iconType"], className = "h-3.5 w-3.5") => {
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

  /**
   * Komponen Thumbnail Media
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
        className={`relative overflow-hidden rounded-xl cursor-pointer bg-muted/60 flex items-center justify-center text-white select-none ${className}`}
      >
        {hasImage ? (
          <>
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgFailed(true)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity group-hover:opacity-80" />
          </>
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${item.gradientClass} relative flex items-center justify-center`}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          </div>
        )}

        {/* Format Badge Top-Left */}
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-md px-1.5 py-0.5 text-[9px] 2xl:text-[10px] font-medium uppercase tracking-wider text-white border border-white/10">
            {item.category === "video" ? (
              <Play className="h-2 w-2 fill-white" />
            ) : (
              renderIcon(item.iconType, "h-2 w-2")
            )}
            {item.typeBadge}
          </span>
        </div>

        {/* Center Hover Action / Play Button */}
        <div
          className={`relative z-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-md transition-all duration-200 opacity-80 group-hover:opacity-100 group-hover:scale-110 ${
            isLarge ? "h-11 w-11" : "h-7 w-7"
          }`}
        >
          {item.category === "video" ? (
            <Play className={`${isLarge ? "h-4 w-4 ml-0.5" : "h-3 w-3 ml-0.5"} fill-white`} />
          ) : (
            renderIcon(item.iconType, isLarge ? "h-4 w-4 text-white" : "h-3 w-3 text-white")
          )}
        </div>

        {/* File Meta / Duration Bottom-Right */}
        {item.fileMeta && (
          <div className="absolute bottom-1.5 right-1.5 z-10">
            <span className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white/90 backdrop-blur-md border border-white/10">
              {item.fileMeta}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-background px-4 sm:px-6 2xl:px-12 pt-20 pb-8 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1140px] 2xl:max-w-[1500px] flex flex-col justify-center">

        {/* 1. Minimal Top Toolbar: Search + Categories Filter + Catalog Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64 2xl:w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari arsip atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border/60 bg-card py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none transition shadow-2xs"
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

          {/* Filter Pills + Catalog Button */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {ARCHIVE_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-2.5 py-1 text-[11px] 2xl:text-xs transition-colors shrink-0 ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground font-normal"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}

            <button
              onClick={() => setIsCatalogModalOpen(true)}
              className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card hover:bg-muted/60 px-2.5 py-1 text-[11px] 2xl:text-xs font-medium text-muted-foreground hover:text-foreground transition shrink-0 ml-1"
              title="Buka katalog lengkap"
            >
              <LayoutGrid className="h-3 w-3" />
              <span>Katalog ({items.length})</span>
            </button>
          </div>
        </div>

        {/* 2. Main Content Layout */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 2xl:gap-4 items-stretch">

            {/* SISI KIRI: Featured Document */}
            {featuredItem && (
              <div
                onClick={() => setPreviewItem(featuredItem)}
                className="lg:col-span-5 group flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-3.5 2xl:p-4 transition-all duration-200 hover:border-border hover:shadow-xs cursor-pointer relative"
              >
                <div>
                  <MediaThumbnail
                    item={featuredItem}
                    isLarge={true}
                    className="w-full aspect-video shadow-2xs border border-border/30"
                    onOpenPreview={() => setPreviewItem(featuredItem)}
                  />

                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
                      <span className="font-semibold uppercase tracking-wider text-primary">
                        {featuredItem.categoryLabel}
                      </span>
                      <span>•</span>
                      <span>{featuredItem.date || "Terbaru"}</span>
                    </div>

                    <h3 className="text-sm 2xl:text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {featuredItem.title}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {featuredItem.description}
                    </p>
                  </div>
                </div>

                {/* Minimal Footer */}
                <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="text-[11px]">{featuredItem.typeBadge}</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] group-hover:text-foreground transition-colors">
                      <Eye className="h-3 w-3" />
                      Preview
                    </span>
                    <a
                      href={featuredItem.externalUrl}
                      target={featuredItem.externalUrl !== "#" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                      title="Buka dokumen asli"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* SISI KANAN: List Dokumen Lainnya */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="space-y-2 max-h-[380px] 2xl:max-h-[480px] overflow-y-auto pr-1 [scrollbar-width:thin]">
                {feedItems.length > 0 ? (
                  feedItems.map((item) => (
                    <article
                      key={item.id}
                      onClick={() => setPreviewItem(item)}
                      className="group p-2.5 rounded-xl border border-border/60 bg-card hover:border-border hover:shadow-2xs transition-all duration-200 flex items-center gap-3 cursor-pointer"
                    >
                      <MediaThumbnail
                        item={item}
                        isLarge={false}
                        className="w-24 sm:w-28 h-16 sm:h-18 shrink-0 shadow-2xs border border-border/30"
                        onOpenPreview={() => setPreviewItem(item)}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-0.5">
                          <span className="font-semibold text-primary uppercase tracking-wider">
                            {item.categoryLabel}
                          </span>
                          <span>•</span>
                          <span>{item.date || "Terbaru"}</span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {item.title}
                        </h4>

                        <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={item.externalUrl}
                          target={item.externalUrl !== "#" ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          title="Buka dokumen asli"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="p-8 text-center rounded-xl border border-dashed border-border/50 bg-card/40">
                    <p className="text-xs text-muted-foreground">
                      Hanya terdapat 1 arsip pada kategori ini.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* Empty State */
          <div className="mt-6 py-12 text-center rounded-2xl border border-dashed border-border/60 bg-card/40">
            <p className="text-xs font-semibold text-foreground">
              Arsip tidak ditemukan
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tidak ada arsip yang cocok dengan pencarian &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="mt-3 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition"
            >
              Reset Filter
            </button>
          </div>
        )}

      </div>

      {/* 3. MODAL DIALOG: PREVIEW LANGSUNG */}
      {mounted &&
        previewItem &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="p-3.5 border-b border-border flex items-center justify-between bg-background">
                <div className="pr-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
                    <span className="font-semibold text-primary uppercase text-[10px]">
                      {previewItem.categoryLabel}
                    </span>
                    <span>•</span>
                    <span className="font-mono">{previewItem.date || previewItem.periodOrDuration}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground line-clamp-1">
                    {previewItem.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={previewItem.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-semibold inline-flex items-center gap-1 text-foreground transition"
                  >
                    <span>Buka Dokumen</span>
                    <ExternalLink className="h-3 w-3" />
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
                    <p className="text-sm font-semibold">Preview langsung tidak tersedia untuk format ini.</p>
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
              <div className="p-3 border-t border-border bg-background flex items-center justify-between text-xs text-muted-foreground">
                <span className="line-clamp-1">{previewItem.description}</span>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-3 py-1 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition shrink-0 ml-4 font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 4. MODAL DIALOG: KATALOG LENGKAP */}
      {mounted &&
        isCatalogModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-5xl max-h-[85vh] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-background">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Katalog Lengkap Arsip
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Daftar seluruh dokumen dan materi Waste Management.
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
              <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setIsCatalogModalOpen(false);
                      setPreviewItem(item);
                    }}
                    className="rounded-xl border border-border/60 bg-background p-3 flex flex-col justify-between hover:border-border hover:shadow-2xs transition-all cursor-pointer group"
                  >
                    <div>
                      <MediaThumbnail
                        item={item}
                        isLarge={false}
                        className="aspect-video rounded-lg mb-2 shadow-2xs"
                        onOpenPreview={() => {
                          setIsCatalogModalOpen(false);
                          setPreviewItem(item);
                        }}
                      />

                      <div className="text-[10px] text-muted-foreground">
                        {item.date || "Terbaru"}
                      </div>
                      <h5 className="text-xs font-semibold text-foreground mt-0.5 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h5>
                      <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="font-semibold text-primary uppercase">
                        {item.categoryLabel}
                      </span>
                      <span className="inline-flex items-center gap-0.5 group-hover:text-foreground transition-colors">
                        <Eye className="h-3 w-3" />
                        Preview
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t border-border bg-background flex items-center justify-between text-xs text-muted-foreground">
                <span>{filteredItems.length} arsip</span>
                <button
                  onClick={() => setIsCatalogModalOpen(false)}
                  className="px-3.5 py-1 rounded-full bg-muted font-medium hover:bg-muted/80 text-foreground transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

    </div>
  );
}
