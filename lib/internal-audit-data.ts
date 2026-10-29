import "server-only";
import {
  getNamedRangeData,
  getNamedRangeDataWithLinks,
  prefetchNamedRanges,
} from "@/lib/google-sheets";
import { internalAuditRows as mockInternalAuditRows } from "@/lib/mock-data";
import type {
  InternalAuditRow,
  OtsInternalAuditAreaRow,
  OtsInternalAuditDetailRow,
  InternalAuditFullData,
} from "@/lib/internal-audit-types";

/**
 * Format average score:
 * - "0.8461" -> "84.61%"
 * - "84.61" -> "84.61%"
 * - "84.61%" -> "84.61%"
 */
function formatAvgScore(val: string | undefined): { text: string; num: number } {
  if (!val) return { text: "0.00%", num: 0 };
  const clean = val.trim();
  if (clean.endsWith("%")) {
    const n = parseFloat(clean.replace("%", "").trim());
    return { text: clean, num: isNaN(n) ? 0 : n };
  }
  const n = parseFloat(clean);
  if (isNaN(n)) return { text: clean, num: 0 };
  if (n <= 1.0 && n > 0) {
    const pct = n * 100;
    return { text: `${pct.toFixed(2)}%`, num: pct };
  }
  return { text: `${n.toFixed(2)}%`, num: n };
}

/**
 * 1. Data Ringkasan Utama Per Pabrik (WEBInternalAuditMain)
 * Format Kolom: Factory | Period | OTS Finding | AVG Score | Area Belum Audit | Start Date | End Date
 */
export async function getInternalAuditMainData(): Promise<InternalAuditRow[]> {
  try {
    const rows = await getNamedRangeData("WEBInternalAuditMain");
    if (!rows || rows.length === 0) {
      return mockInternalAuditRows.map((r) => ({
        ...r,
        factory: r.fact,
        avgScoreRaw: parseFloat(r.avgScore.replace("%", "")),
      }));
    }

    const items: InternalAuditRow[] = [];

    rows.forEach((row) => {
      const cleanRow: Record<string, string> = {};
      Object.keys(row).forEach((k) => {
        cleanRow[k.trim().toUpperCase()] = (row[k] || "").trim();
      });

      const fact =
        cleanRow["FACTORY"] ||
        cleanRow["FACT"] ||
        cleanRow["FACT."] ||
        cleanRow["PABRIK"] ||
        "";
      if (!fact) return;

      const period =
        cleanRow["PERIOD"] ||
        cleanRow["PERIOD (L)"] ||
        cleanRow["PERIODE"] ||
        "";

      const otsFindingStr =
        cleanRow["OTS FINDING"] ||
        cleanRow["OTS_FINDING"] ||
        cleanRow["FINDING"] ||
        "0";
      const otsFinding = parseInt(otsFindingStr.replace(/[^0-9]/g, ""), 10) || 0;

      const rawAvgScore =
        cleanRow["AVG SCORE"] ||
        cleanRow["AVG_SCORE"] ||
        cleanRow["AVERAGE SCORE"] ||
        "";
      const { text: avgScore, num: avgScoreRaw } = formatAvgScore(rawAvgScore);

      const areaStr =
        cleanRow["AREA BELUM AUDIT"] ||
        cleanRow["AREA_BELUM_AUDIT"] ||
        cleanRow["AREA BELUM DI AUDIT"] ||
        "0";
      const areaBelumAudit = parseInt(areaStr.replace(/[^0-9]/g, ""), 10) || 0;

      const startDate =
        cleanRow["START DATE"] ||
        cleanRow["START DATE (L)"] ||
        cleanRow["START_DATE"] ||
        "";

      const endDate =
        cleanRow["END DATE"] ||
        cleanRow["END DATE (L)"] ||
        cleanRow["END_DATE"] ||
        "";

      items.push({
        fact,
        factory: fact,
        period,
        otsFinding,
        avgScore,
        avgScoreRaw,
        areaBelumAudit,
        startDate,
        endDate,
      });
    });

    return items.length > 0
      ? items
      : mockInternalAuditRows.map((r) => ({
          ...r,
          factory: r.fact,
          avgScoreRaw: parseFloat(r.avgScore.replace("%", "")),
        }));
  } catch (err) {
    console.error("[InternalAudit] Gagal memuat named range WEBInternalAuditMain:", err);
    return mockInternalAuditRows.map((r) => ({
      ...r,
      factory: r.fact,
      avgScoreRaw: parseFloat(r.avgScore.replace("%", "")),
    }));
  }
}

/**
 * 2. Data Rekap Per Area & PIC (WEBOTSInternalAudit)
 * Kolom: Period | Factory | Area | OTS Finding | In Progress | No CAP | Hold | PIC
 */
export async function getOtsInternalAuditAreaRows(): Promise<OtsInternalAuditAreaRow[]> {
  try {
    const rows = await getNamedRangeData("WEBOTSInternalAudit");
    if (!rows || rows.length === 0) return [];

    const items: OtsInternalAuditAreaRow[] = [];

    rows.forEach((row) => {
      const cleanRow: Record<string, string> = {};
      Object.keys(row).forEach((k) => {
        cleanRow[k.trim().toUpperCase()] = (row[k] || "").trim();
      });

      const period = cleanRow["PERIOD"] || "";
      const fact =
        cleanRow["FACTORY"] ||
        cleanRow["FACT."] ||
        cleanRow["FACT"] ||
        cleanRow["PABRIK"] ||
        "";
      const area = cleanRow["AREA"] || "";

      // Lewati baris kosong di Google Sheet
      if (!period || !fact || !area) return;

      const otsFinding =
        parseInt((cleanRow["OTS FINDING"] || "0").replace(/[^0-9]/g, ""), 10) || 0;
      const inProgress =
        parseInt(
          (cleanRow["IN PROGRESS"] || cleanRow["IN_PROGRESS"] || "0").replace(
            /[^0-9]/g,
            ""
          ),
          10
        ) || 0;
      const noCap =
        parseInt(
          (cleanRow["NO CAP"] || cleanRow["NO_CAP"] || "0").replace(/[^0-9]/g, ""),
          10
        ) || 0;
      const hold =
        parseInt((cleanRow["HOLD"] || "0").replace(/[^0-9]/g, ""), 10) || 0;
      const pic = cleanRow["PIC"] || "";

      items.push({
        period,
        fact,
        factory: fact,
        area,
        otsFinding,
        inProgress,
        noCap,
        hold,
        pic,
      });
    });

    return items;
  } catch (err) {
    console.error("[InternalAudit] Gagal memuat named range WEBOTSInternalAudit:", err);
    return [];
  }
}

/**
 * 3. Data Detail Rincian Temuan (WEBOTSInternalAuditDetail)
 * Kolom Baru:
 * Periode | Factory | Area | Section | No Poin | Poin Audit | Kategori | Status |
 * Deskripsi Temuan | Tgl Dibuat | CAP (Tindakan Perbaikan) | Target CAP | Tgl Selesai Aktual |
 * Team Support | Link Foto Temuan | Link Foto Perbaikan
 */
export async function getOtsInternalAuditDetailRows(): Promise<OtsInternalAuditDetailRow[]> {
  try {
    let rows: Record<string, string>[] = [];
    try {
      rows = await getNamedRangeDataWithLinks("WEBOTSInternalAuditDetail");
    } catch {
      rows = await getNamedRangeData("WEBOTSInternalAuditDetail");
    }
    if (!rows || rows.length === 0) return [];

    const items: OtsInternalAuditDetailRow[] = [];

    rows.forEach((row, idx) => {
      const cleanRow: Record<string, string> = {};
      Object.keys(row).forEach((k) => {
        cleanRow[k.trim().toUpperCase()] = (row[k] || "").trim();
      });

      const fact =
        cleanRow["FACTORY"] ||
        cleanRow["FACT."] ||
        cleanRow["FACT"] ||
        cleanRow["PABRIK"] ||
        "";
      const period =
        cleanRow["PERIODE"] ||
        cleanRow["PERIOD"] ||
        "";
      const area = cleanRow["AREA"] || "";

      // Lewati jika fact, period, dan area semuanya kosong
      if (!fact && !period && !area) return;

      const section = cleanRow["SECTION"] || cleanRow["SEKSI"] || "";
      const noPoin =
        cleanRow["NO POIN"] ||
        cleanRow["NO_POIN"] ||
        cleanRow["NO POINT"] ||
        cleanRow["NO."] ||
        "";

      const auditPoint =
        cleanRow["POIN AUDIT"] ||
        cleanRow["POIN_AUDIT"] ||
        cleanRow["AUDIT POINT"] ||
        cleanRow["AUDIT_POINT"] ||
        "";

      const aspect =
        cleanRow["KATEGORI"] ||
        cleanRow["CATEGORY"] ||
        cleanRow["ASPECT"] ||
        cleanRow["ASPEK"] ||
        "";

      const rawStatus = cleanRow["STATUS"] || "";
      const statusUpper = rawStatus.toUpperCase();
      let status = "OPEN";
      if (statusUpper.includes("PROG")) {
        status = "IN PROGRESS";
      } else if (statusUpper === "DONE") {
        status = "DONE";
      } else if (statusUpper === "HOLD") {
        status = "HOLD";
      } else if (statusUpper === "BLANK" || !statusUpper) {
        status = "OPEN";
      } else {
        status = rawStatus;
      }

      const findings =
        cleanRow["DESKRIPSI TEMUAN"] ||
        cleanRow["DESKRIPSI_TEMUAN"] ||
        cleanRow["TEMUAN"] ||
        cleanRow["FINDINGS"] ||
        "";

      const tglDibuat =
        cleanRow["TGL DIBUAT"] ||
        cleanRow["TGL_DIBUAT"] ||
        cleanRow["TANGGAL DIBUAT"] ||
        cleanRow["CREATED AT"] ||
        "";

      const cap =
        cleanRow["CAP (TINDAKAN PERBAIKAN)"] ||
        cleanRow["CAP"] ||
        cleanRow["TINDAKAN PERBAIKAN"] ||
        "";

      const targetFin =
        cleanRow["TARGET CAP"] ||
        cleanRow["TARGET_CAP"] ||
        cleanRow["TARGET FIN"] ||
        cleanRow["TARGET_FIN"] ||
        "";

      const actualFin =
        cleanRow["TGL SELESAI AKTUAL"] ||
        cleanRow["TGL_SELESAI_AKTUAL"] ||
        cleanRow["ACTUAL FIN"] ||
        cleanRow["ACTUAL_FIN"] ||
        "";

      const pic =
        cleanRow["TEAM SUPPORT"] ||
        cleanRow["TEAM_SUPPORT"] ||
        cleanRow["SUPPORT TEAM"] ||
        cleanRow["PIC"] ||
        "";

      const photoUrl =
        cleanRow["LINK FOTO TEMUAN"] ||
        cleanRow["LINK_FOTO_TEMUAN"] ||
        cleanRow["FOTO TEMUAN"] ||
        cleanRow["PHOTO"] ||
        cleanRow["FOTO"] ||
        "";

      const photoAfterUrl =
        cleanRow["LINK FOTO PERBAIKAN"] ||
        cleanRow["LINK_FOTO_PERBAIKAN"] ||
        cleanRow["FOTO PERBAIKAN"] ||
        cleanRow["PHOTO (AFTER)"] ||
        cleanRow["PHOTO AFTER"] ||
        cleanRow["FOTO SETELAH"] ||
        "";

      const continuousImprovement =
        cleanRow["CONTINUOUS IMPROVEMENT"] ||
        cleanRow["CONTINUOUS_IMPROVEMENT"] ||
        cleanRow["CI"] ||
        "";
      const ontime = cleanRow["ONTIME?"] || cleanRow["ONTIME"] || "";
      const validasiAuditor =
        cleanRow["VALIDASI AUDITOR"] || cleanRow["VALIDASI_AUDITOR"] || "";
      const note = cleanRow["NOTE"] || cleanRow["CATATAN"] || "";

      // Temuan dihitung OTS jika status bukan DONE
      const hasIssue = findings !== "" || continuousImprovement !== "" || cap !== "";
      const isOts =
        (hasIssue || status !== "DONE") &&
        status !== "DONE" &&
        (!validasiAuditor || validasiAuditor.toUpperCase() !== "OK");

      items.push({
        id: `${fact}-${period}-${area}-${idx}`,
        fact,
        factory: fact,
        period,
        area,
        section,
        noPoin,
        aspect,
        kategori: aspect,
        auditPoint,
        photoUrl,
        linkFotoTemuan: photoUrl,
        findings,
        deskripsiTemuan: findings,
        continuousImprovement,
        status,
        pic,
        teamSupport: pic,
        cap,
        tglDibuat,
        targetFin,
        targetCap: targetFin,
        actualFin,
        tglSelesaiAktual: actualFin,
        photoAfterUrl,
        linkFotoPerbaikan: photoAfterUrl,
        ontime,
        validasiAuditor,
        note,
        isOts,
      });
    });

    return items;
  } catch (err) {
    console.error("[InternalAudit] Gagal memuat named range WEBOTSInternalAuditDetail:", err);
    return [];
  }
}

/**
 * 4. Mengambil Seluruh Data Terkait Internal Audit Secara Batch
 */
export async function getInternalAuditFullData(): Promise<InternalAuditFullData> {
  await prefetchNamedRanges([
    "WEBInternalAuditMain",
    "WEBOTSInternalAudit",
    "WEBOTSInternalAuditDetail",
  ]);

  const [mainRows, areaRows, detailRows] = await Promise.all([
    getInternalAuditMainData(),
    getOtsInternalAuditAreaRows(),
    getOtsInternalAuditDetailRows(),
  ]);

  // Hitung KPI keseluruhan
  let totalOts = 0;
  let totalInProgress = 0;
  let totalNoCap = 0;
  let totalHold = 0;

  if (areaRows.length > 0) {
    areaRows.forEach((r) => {
      totalOts += r.otsFinding;
      totalInProgress += r.inProgress;
      totalNoCap += r.noCap;
      totalHold += r.hold;
    });
  } else {
    totalOts = detailRows.filter((d) => d.isOts).length;
    totalInProgress = detailRows.filter((d) => d.status === "IN PROGRESS").length;
    totalNoCap = detailRows.filter((d) => d.isOts && !d.cap).length;
    totalHold = detailRows.filter((d) => d.status === "HOLD").length;
  }

  const totalDone = detailRows.filter((d) => d.status === "DONE").length;
  const totalChecked = detailRows.length;

  return {
    mainRows,
    areaRows,
    detailRows,
    kpi: {
      totalOts,
      totalInProgress,
      totalNoCap,
      totalHold,
      totalDone,
      totalChecked,
    },
  };
}

