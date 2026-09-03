import type { StatusLevel } from "@/components/dashboard/status-chip";
import {
  internalAuditRows,
  auditSupportiveDept,
  progressShipment,
  wipSewing,
  wipSewingThreshold,
  threeR,
} from "@/lib/mock-data";

export function isFriday(date: Date = new Date()): boolean {
  return date.getDay() === 5;
}

interface MetricStatus {
  status: StatusLevel | null; // null = hasData false, tidak muncul di grid
}

// ---------- Helper status generik untuk pola "late / on-progress / hidden" ----------
function taskStatus(lateCount: number, inProgressTotal: number): MetricStatus {
  if (lateCount > 0) return { status: "late" };
  if (inProgressTotal > 0) return { status: "on_progress" };
  return { status: null };
}

export function getUrgencyFlags(now: Date = new Date()) {
  // ---------- Internal Audit ----------
  // Proxy sementara: OTS finding > 0 dianggap "belum semua tervalidasi" → LATE.
  // Nanti begitu tabel temuan+validasi auditor tersedia, ganti logic ini
  // supaya baca status validasi per-temuan yang sebenarnya.
  const highestAuditRow = internalAuditRows.reduce((max, row) =>
    row.otsFinding > max.otsFinding ? row : max
  );
  const internalAudit = {
    row: highestAuditRow,
    status: (highestAuditRow.otsFinding > 0 ? "late" : null) as StatusLevel | null,
  };

  // ---------- Audit Supportive Dept ----------
  const auditSupportiveDeptStatus = taskStatus(
    auditSupportiveDept.overdue,
    auditSupportiveDept.inProgress
  );
  // Overdue pakai chip "overdue", bukan "late" — beda istilah, warna sama (merah)
  const auditSupportiveDeptFinal = {
    status:
      auditSupportiveDeptStatus.status === "late"
        ? ("overdue" as StatusLevel)
        : auditSupportiveDeptStatus.status,
  };

  // ---------- 3R ----------
  const threeRGloveActive = taskStatus(threeR.gloveActive.late, threeR.gloveActive.inProgressTotal);
  const threeRWipKulit = taskStatus(threeR.wipKulit.late, threeR.wipKulit.inProgressTotal);
  const threeRWipLogo = taskStatus(threeR.wipLogo.late, threeR.wipLogo.inProgressTotal);
  const threeRWipPola = taskStatus(threeR.wipPola.late, threeR.wipPola.inProgressTotal);
  const threeRWipGlove = taskStatus(threeR.wipGlove.late, threeR.wipGlove.inProgressTotal);
  const threeRWipPending = taskStatus(threeR.wipPending.late, threeR.wipPending.inProgressTotal);

  // ---------- WIP Sewing ----------
  // Late kalau qty > threshold, on_progress kalau qty > 0, hidden kalau qty = 0.
  const wipSewingLines = wipSewing.map((line) => ({
    ...line,
    status: (line.qty > wipSewingThreshold
      ? "late"
      : line.qty > 0
        ? "on_progress"
        : null) as StatusLevel | null,
  }));
  const wipSewingCritical = wipSewingLines.filter((w) => w.status === "late");

  // ---------- Progress Shipment ----------
  // Beda dari yang lain: bukan "late", tapi "attention" (kuning/oranye),
  // dan cuma relevan kalau sudah hari Jumat.
  const shipmentTotal = progressShipment.hutangProduksi + progressShipment.hutangCarton;
  const progressShipmentStatus: StatusLevel | null =
    shipmentTotal === 0 ? null : isFriday(now) ? "attention" : null;
  // Catatan: qty > 0 tapi belum Jumat = tidak muncul di Ringkasan Angka
  // (belum jadi "problem"), tapi tetap terlihat di chart section 2.

  return {
    internalAudit,
    auditSupportiveDept: auditSupportiveDeptFinal,
    threeRGloveActive,
    threeRWipKulit,
    threeRWipLogo,
    threeRWipPola,
    threeRWipGlove,
    threeRWipPending,
    wipSewing: {
      lines: wipSewingLines,
      criticalLines: wipSewingCritical,
    },
    progressShipment: {
      status: progressShipmentStatus,
      total: shipmentTotal,
    },
  };
}
