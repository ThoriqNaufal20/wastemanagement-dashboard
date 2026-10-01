export interface InternalAuditRow {
  fact: string;
  period: string;
  otsFinding: number;
  avgScore: string;
  avgScoreRaw?: number;
  areaBelumAudit: number;
  startDate: string;
  endDate: string;
}

