export type ArchiveCategory =
  | "all"
  | "meeting"
  | "data"
  | "poster"
  | "slides"
  | "video";

export interface ArchiveItem {
  id: string;
  title: string;
  category: "meeting" | "data" | "poster" | "slides" | "video";
  categoryLabel: string;
  typeBadge: string;
  badgeColorClass: string;
  periodOrDuration?: string;
  description: string;
  gradientClass: string;
  iconType: "pdf" | "sheets" | "image" | "presentation" | "video";
  fileMeta?: string;
  externalUrl: string;
  actionLabel: string;
}

