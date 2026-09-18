export interface ProgressShipmentChartItem {
  week: string;
  rawW: string;
  hutangProd: number;
  hutangCarton: number;
  totalHutang: number;
}

export interface ProgressShipmentSummary {
  totalHutangProd: number;
  totalHutangCarton: number;
  totalHutang: number;
  cartonShare: number;
  isAttention: boolean;
  totalInvoices: number;
}

export interface ProgressShipmentDetailItem {
  w: string;
  inv: string;
  buyer: string;
  qtyShipment: number;
  qtyCarton: number;
  hutangProd: number;
  hutangCarton: number;
  hutangEnvelope: number;
  filterWeek: string;
}

