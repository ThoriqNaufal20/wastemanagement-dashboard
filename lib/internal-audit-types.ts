export interface InternalAuditRow {
  fact: string;
  factory?: string;
  period: string;
  otsFinding: number;
  avgScore: string;
  avgScoreRaw?: number;
  areaBelumAudit: number;
  startDate: string;
  endDate: string;
}

export interface OtsInternalAuditAreaRow {
  period: string;
  fact: string;
  factory?: string;
  area: string;
  otsFinding: number;
  inProgress: number;
  noCap: number;
  hold: number;
  pic: string;
}

export interface OtsInternalAuditDetailRow {
  id: string;
  fact: string;
  factory?: string;
  period: string;
  area: string;
  section?: string;
  noPoin?: string;
  aspect: string;
  kategori?: string;
  auditPoint: string;
  photoUrl: string;
  linkFotoTemuan?: string;
  findings: string;
  deskripsiTemuan?: string;
  continuousImprovement?: string;
  status: string; // "IN PROGRESS", "DONE", "HOLD", "OPEN"
  pic: string;
  teamSupport?: string;
  cap: string;
  tglDibuat?: string;
  targetFin: string;
  targetCap?: string;
  actualFin: string;
  tglSelesaiAktual?: string;
  photoAfterUrl: string;
  linkFotoPerbaikan?: string;
  ontime?: string;
  validasiAuditor?: string;
  note?: string;
  isOts: boolean;
}

export interface InternalAuditBelumAuditRow {
  factory: string;
  fact: string;
  period: string;
  area: string;
  section: string;
  poinAudit: string;
  jawabanPic: string;
}

export interface InternalAuditFullData {
  mainRows: InternalAuditRow[];
  areaRows: OtsInternalAuditAreaRow[];
  detailRows: OtsInternalAuditDetailRow[];
  kpi: {
    totalOts: number;
    totalInProgress: number;
    totalNoCap: number;
    totalHold: number;
    totalDone: number;
    totalChecked: number;
  };
}

