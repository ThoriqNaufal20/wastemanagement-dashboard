export type ArchiveItemCategory =
  | "meeting"
  | "data"
  | "poster"
  | "slides"
  | "video";

export type ArchiveCategory = "all" | ArchiveItemCategory;

export interface ArchiveItem {
  id: string;
  title: string;
  category: ArchiveItemCategory;
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
