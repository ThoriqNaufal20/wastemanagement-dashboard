import type {
  InternalAuditRow,
  InternalAuditBelumAuditRow,
} from "@/lib/internal-audit-types";

// ============================================================
// MOCK DATA — Waste Management Dashboard
// Struktur ini akan jadi acuan mapping kolom Google Sheets nanti.
// Ganti isi file ini dengan data asli setelah backend siap.
// ============================================================

export const companyInfo = {
  name: "PT. Adira Semesta Industry",
  department: "Waste Management Department",
  period: "Q-2 2026",
};

// ---------- Scorecard & Dashboard Departement ----------
// Update per kuartal. Breakdown per poin (I. Function, II. Strategy, dst)
// akan ditampilkan di drill-down modal — belum diimplementasi di versi ini.
export const scorecardScore = { value: 78, redBelow: 75 };
export const dashboardDeptScore = { value: 71, redBelow: 80 };

// ---------- Corrective Action Plan ----------
// Tetap versi historis (belum real-time status "belum done").
export const correctiveActionPlan = [
  { name: "Material", value: 57.8, color: "#2563eb" },
  { name: "Man", value: 27.3, color: "#0d9488" },
  { name: "Method", value: 12.1, color: "#6366f1" },
  { name: "Machine", value: 2.8, color: "#0891b2" },
];

// ---------- Internal Audit ----------
// Satuan: jumlah temuan. Urgensi grid dinamis dipicu oleh otsFinding tertinggi.
export const internalAuditRows: InternalAuditRow[] = [
  { period: "Q2-2026", fact: "F", factory: "F", otsFinding: 102, avgScore: "79.51%", areaBelumAudit: 0, startDate: "Apr 20, 2026", endDate: "May 18, 2026" },
  { period: "Q2-2026", fact: "B", factory: "B", otsFinding: 24, avgScore: "41.40%", areaBelumAudit: 0, startDate: "May 11, 2026", endDate: "May 22, 2026" },
  { period: "Q2-2026", fact: "A", factory: "A", otsFinding: 45, avgScore: "84.26%", areaBelumAudit: 0, startDate: "May 25, 2026", endDate: "Jun 19, 2026" },
  { period: "Q2-2026", fact: "K", factory: "K", otsFinding: 76, avgScore: "86.17%", areaBelumAudit: 0, startDate: "Jun 22, 2026", endDate: "Jul 17, 2026" },
];

// Threshold tentatif — sesuaikan begitu rules resmi diberikan
export const internalAuditUrgentThreshold = 80;

// ---------- Internal Audit Belum Diaudit ----------
export const internalAuditBelumAuditRows: InternalAuditBelumAuditRow[] = [
  {
    factory: "F",
    fact: "F",
    period: "Q4 2026",
    area: "Produksi",
    section: "Cutting",
    poinAudit: "Pembersihan sisa limbah kain per shift",
    jawabanPic: "Belum dijadwalkan inspeksi",
  },
  {
    factory: "F",
    fact: "F",
    period: "Q4 2026",
    area: "Gudang B3",
    section: "Storage",
    poinAudit: "Ketersediaan spill kit & simbol limbah",
    jawabanPic: "Menunggu jadwal auditor",
  },
  {
    factory: "A",
    fact: "A",
    period: "Q4 2026",
    area: "Sewing Line 1",
    section: "Sewing",
    poinAudit: "Tempat sampah terpilah di jalur produksi",
    jawabanPic: "Sedang dikoordinasikan",
  },
];

// ---------- Internal Audit Supportive Dept ----------
// Format: overdue / in-progress (bukan overdue/total keseluruhan)
export const auditSupportiveDept = {
  overdue: 4,
  inProgress: 28,
};

// ---------- Progress Shipment Minggu Depan ----------
// Satuan: qty (pcs). Urgent jika hari ini Jumat DAN qty >= threshold.
export const progressShipment = {
  hutangProduksi: 1800,
  hutangCarton: 4400,
  fridayThreshold: 5000, // tentatif, sesuai konfirmasi kamu
};

// ---------- WIP Sewing > 7 Hari ----------
// Satuan: qty (pcs). Urgent jika qty > threshold.
export const wipSewing = [
  { line: "A", qty: 3380 },
  { line: "F", qty: 3664 },
  { line: "K", qty: 19176 },
];
export const wipSewingThreshold = 10000; // tentatif

// ---------- 3R ----------
// Format: late / total in-progress. "OK" = in-progress & belum telat.
// Kalau late = 0 DAN inProgressTotal = 0, artinya tidak ada data sama sekali
// untuk periode ini — card ini akan disembunyikan dari Ringkasan Angka
// (perilaku "notifikasi": kalau tidak ada apa-apa, tidak usah muncul).
export const threeR = {
  gloveActive: { late: 2, inProgressTotal: 3, unit: "pcs" },
  wipKulit: { late: 3, inProgressTotal: 3, unit: "SF" },
  wipLogo: { late: 0, inProgressTotal: 2, unit: "pcs" }, // contoh: tidak ada data → hilang
  wipPola: { late: 0, inProgressTotal: 12, unit: "pcs" },
  wipGlove: { late: 0, inProgressTotal: 0, unit: "pcs" }, // ada data, tapi tidak late
  wipPending: { late: 2, inProgressTotal: 8, unit: "pcs" },
};

// ---------- % Kelolosan Sampah Kulit ----------
// Informatif, tidak masuk logika urgensi.
export const kelolosanSampahKulit = [
  { week: "Week 29", A: 0.3, K: 1.8 },
  { week: "Week 30", A: 0.3, K: 2.2 },
];
