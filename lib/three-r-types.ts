// Tipe data murni 3R (tanpa dependency googleapis)
// Aman diimpor dari client component ("use client").

// ---------- Glove Active ----------
export interface GloveActiveSummary {
  late: number;
  ok: number;
  onHold: number;
  totalInProgress: number;
}

export interface GloveActiveDetailItem {
  no: string;
  tanggalPermintaan: string;
  pic: string;
  peruntukan: string;
  namaBarang: string;
  size: string;
  qty: string;
  status: string;
  terlambat: string;
}

// ---------- Timbangan 3R ----------
export interface CategorySummary {
  late: number;
  total: number;
}

export interface Timbangan3RSummary {
  pola: CategorySummary;
  logo: CategorySummary;
  glove: CategorySummary;
  totalPending: number;
}

export interface Timbangan3RDetailItem {
  tanggal: string;
  tipe: string;
  dept: string;
  noSj: string;
  operator: string;
  kategori: string;
  barang: string;
  qty: number;
  uom: string;
  beratKg: string;
  status: string;
  note: string;
}

// ---------- WIP Kulit & Kelolosan ----------
export interface WipKulitSummary {
  late: number;
  total: number;
}

export interface WipKulitDetailItem {
  tanggal: string;
  tglCek3R: string;
  fact: string;
  spo: string;
  style: string;
  beratKiriman: number;
  beratSetelahCek: number;
  kelolosan: number;
  temuan: string;
  keterangan: string;
  status: string;
}

export interface KelolosanWeekPoint {
  week: string;
  [factLabel: string]: string | number;
}

