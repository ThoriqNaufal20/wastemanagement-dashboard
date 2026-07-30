// ============================================================
// URGENCY LOGIC — pusat semua aturan "kapan sesuatu jadi urgent"
// Simpan semua logika di sini supaya gampang diubah begitu
// threshold resmi dari kamu sudah final, tanpa harus ubah komponen.
// ============================================================

import {
  internalAuditRows,
  internalAuditUrgentThreshold,
  auditSupportiveDept,
  progressShipment,
  wipSewing,
  wipSewingThreshold,
  threeR,
} from "@/lib/mock-data";

export function isFriday(date: Date = new Date()): boolean {
  return date.getDay() === 5; // 0 = Minggu, 5 = Jumat
}

export function getUrgencyFlags(now: Date = new Date()) {
  const highestAuditRow = internalAuditRows.reduce((max, row) =>
    row.otsFinding > max.otsFinding ? row : max
  );

  const wipSewingCritical = wipSewing.filter((w) => w.qty > wipSewingThreshold);

  const shipmentTotal =
    progressShipment.hutangProduksi + progressShipment.hutangCarton;
  const shipmentUrgent =
    isFriday(now) && shipmentTotal >= progressShipment.fridayThreshold;

  return {
    internalAudit: {
      isUrgent: highestAuditRow.otsFinding > internalAuditUrgentThreshold,
      row: highestAuditRow,
    },
    auditSupportiveDept: {
      isUrgent: auditSupportiveDept.overdue > 0,
    },
    progressShipment: {
      isUrgent: shipmentUrgent,
      total: shipmentTotal,
    },
    wipSewing: {
      isUrgent: wipSewingCritical.length > 0,
      criticalLines: wipSewingCritical,
    },
    threeRGloveActive: {
      isUrgent: threeR.gloveActive.late > 0,
    },
    threeRWipKulit: {
      isUrgent: threeR.wipKulit.late > 0,
    },
  };
}
