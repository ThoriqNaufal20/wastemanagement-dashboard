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
  period: string;
  area: string;
  aspect: string;
  auditPoint: string;
  photoUrl: string;
  findings: string;
  continuousImprovement: string;
  status: string; // "IN PROGRESS", "DONE", "HOLD", "OPEN"
  pic: string;
  cap: string;
  targetFin: string;
  actualFin: string;
  photoAfterUrl: string;
  ontime: string;
  validasiAuditor: string;
  note: string;
  isOts: boolean;
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

