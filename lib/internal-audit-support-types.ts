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
  isLate: boolean;
}

export interface InternalAuditSupportFactSummary {
  fact: string;
  ots: number;
  late: number;
  inProgress: number;
  total: number;
  done: number;
  shared: number;
}

export interface InternalAuditSupportDeptSummary {
  department: string;
  late: number;
  inProgress: number;
  ots: number;
  total: number;
  done: number;
  shared: number;
}

export interface InternalAuditSupportData {
  rows: InternalAuditSupportRow[];
  factSummaries: InternalAuditSupportFactSummary[];
  deptSummaries: InternalAuditSupportDeptSummary[];
  totalOts: number;
  totalLate: number;
  totalInProgress: number;
  totalDone: number;
  totalShared: number;
  totalRows: number;
}

