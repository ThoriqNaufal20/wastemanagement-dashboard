import { unstable_cache } from "next/cache";
import { getNamedRangeData } from "@/lib/google-sheets";

export interface GloveActiveSummary {
  late: number;
  ok: number;
  onHold: number;
  totalInProgress: number; // late + ok + onHold
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

export const getGloveActiveSummary = unstable_cache(
  fetchGloveActiveSummary,
  ["glove-3r-summary"],
  { revalidate: 120 }
);
