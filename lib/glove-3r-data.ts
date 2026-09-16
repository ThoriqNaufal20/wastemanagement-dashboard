import { getNamedRangeData } from "@/lib/google-sheets";

export interface GloveActiveSummary {
  late: number;
  ok: number;
  onHold: number;
  totalInProgress: number; // late + ok + onHold
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

// Baca kolom TERLAMBAT saja. Nilai lain (kosong, atau sudah dikirim
// yang otomatis punya TERLAMBAT kosong) diabaikan/tidak dihitung.
async function fetchGloveActiveSummary(): Promise<GloveActiveSummary> {
  const rows = await getNamedRangeData("WEBGlove3R");

  let late = 0;
  let ok = 0;
  let onHold = 0;

  rows.forEach((row) => {
    const value = row.TERLAMBAT?.trim().toUpperCase();
    if (value === "LATE") late++;
    else if (value === "OK") ok++;
    else if (value === "ON HOLD") onHold++;
  });

  return {
    late,
    ok,
    onHold,
    totalInProgress: late + ok + onHold,
  };
}

export async function getGloveActiveSummary(): Promise<GloveActiveSummary> {
  return fetchGloveActiveSummary();
}

async function fetchGloveActiveDetails(): Promise<GloveActiveDetailItem[]> {
  const rows = await getNamedRangeData("WEBGlove3R");
  const items: GloveActiveDetailItem[] = [];

  rows.forEach((row) => {
    const terlambat = row.TERLAMBAT?.trim().toUpperCase() || "";
    const status = row.STATUS?.trim() || "";

    // Tampilkan yang memiliki status keterlambatan / sedang berjalan
    if (terlambat === "LATE" || terlambat === "OK" || terlambat === "ON HOLD" || (status && status.toLowerCase() !== "sudah dikirim" && terlambat)) {
      items.push({
        no: row.NO?.trim() || "-",
        tanggalPermintaan: row["TANGGAL PERMINTAAN"]?.trim() || "-",
        pic: row.PIC?.trim() || "-",
        peruntukan: row.PERUNTUKAN?.trim() || "-",
        namaBarang: row["NAMA BARANG"]?.trim() || "-",
        size: row.SIZE?.trim() || "-",
        qty: row.QTY?.trim() || "-",
        status: status || "-",
        terlambat: terlambat || "-",
      });
    }
  });

  return items;
}

export async function getGloveActiveDetails(): Promise<GloveActiveDetailItem[]> {
  return fetchGloveActiveDetails();
}

