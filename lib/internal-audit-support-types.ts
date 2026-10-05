export interface InternalAuditSupportRow {
  period: string;
  fact: string;
  area: string;
  status: string;
  finding: string;
  image: string;
  supportiveDepartment: string;
  cap: string;
  imageImprovement: string;
  targetFin: string;
  actualFin: string;
  isOts: boolean;
}

export interface InternalAuditSupportFactSummary {
  fact: string;
  ots: number;
  total: number;
  done: number;
  shared: number;
}

export interface InternalAuditSupportData {
  rows: InternalAuditSupportRow[];
  factSummaries: InternalAuditSupportFactSummary[];
  totalOts: number;
  totalDone: number;
  totalShared: number;
  totalRows: number;
}

