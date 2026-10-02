// Tipe data & konstanta murni WIP Sewing (tanpa dependency googleapis)
// Aman diimpor dari client component ("use client").

export const WIP_SEWING_THRESHOLD = 10000;

export interface WipSewingFactSummary {
  fact: string;
  qty: number;
  maxOverdue: number;
  avgOverdue: number;
  totalBox: number;
  isCritical: boolean;
}

export interface WipSewingDetailItem {
  coding: string;
  noBox: string;
  spo: string;
  style: string;
  line: string;
  fact: string;
  scanDst: string;
  size: string;
  qty: number;
  qtyCumul: string;
  overdueWorkdays: number;
  timeRange: string;
}

export interface WipSewingGroupedItem {
  key: string;
  fact: string;
  spo: string;
  style: string;
  size: string;
  totalQty: number;
  totalBox: number;
  scanDst: string;
  overdueWorkdays: number;
  lines: string[];
  boxList: string[];
}


