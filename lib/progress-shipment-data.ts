import { getNamedRangeData } from "@/lib/google-sheets";
import { isFriday } from "@/lib/urgency";
import type {
  ProgressShipmentChartItem,
  ProgressShipmentSummary,
  ProgressShipmentDetailItem,
} from "@/lib/progress-shipment-types";

export type {
  ProgressShipmentChartItem,
  ProgressShipmentSummary,
  ProgressShipmentDetailItem,
};

function parseNumber(value: string | undefined): number {
  if (!value) return 0;
  const num = parseFloat(value.replace(/,/g, "").trim());
  return Number.isNaN(num) ? 0 : num;
}

export async function getProgressShipmentChartData(
  filterWeekTarget: string = "next week"
): Promise<ProgressShipmentChartItem[]> {
  const rows = await getNamedRangeData("WEBProgressShipment");
  if (rows.length === 0) {
    return [];
  }

  const target = filterWeekTarget.trim().toLowerCase();
  const filteredRows = rows.filter((row) => {
    const fw = (row["Filter Week"] || "").trim().toLowerCase();
    return target === "all" ? true : fw === target;
  });

  const weekMap = new Map<
    string,
    { hutangProd: number; hutangCarton: number; totalHutang: number }
  >();

  filteredRows.forEach((row) => {
    const rawW = (row["W"] || "").trim();
    if (!rawW) return;

    if (!weekMap.has(rawW)) {
      weekMap.set(rawW, { hutangProd: 0, hutangCarton: 0, totalHutang: 0 });
    }

    const data = weekMap.get(rawW)!;
    const hp = parseNumber(row["Hutang Prod"]);
    const hc = parseNumber(row["Hutang Carton"]);

    data.hutangProd += hp;
    data.hutangCarton += hc;
    // Total beban adalah hutang prod + hutang pack (carton)
    data.totalHutang += hp + hc;
  });

  const result: ProgressShipmentChartItem[] = [];

  weekMap.forEach((val, rawW) => {
    const weekLabel = rawW.toLowerCase().startsWith("w")
      ? rawW.toUpperCase()
      : `W${rawW}`;

    result.push({
      week: weekLabel,
      rawW,
      hutangProd: val.hutangProd,
      hutangCarton: val.hutangCarton,
      totalHutang: val.totalHutang,
    });
  });

  // Urutkan berdasarkan nomor W
  return result.sort((a, b) => {
    const numA = parseInt(a.rawW.replace(/\D/g, ""), 10) || 0;
    const numB = parseInt(b.rawW.replace(/\D/g, ""), 10) || 0;
    return numA - numB;
  });
}

export async function getProgressShipmentSummary(
  filterWeekTarget: string = "next week"
): Promise<ProgressShipmentSummary> {
  const chartData = await getProgressShipmentChartData(filterWeekTarget);
  const rows = await getNamedRangeData("WEBProgressShipment");

  const target = filterWeekTarget.trim().toLowerCase();
  const matchingRows = rows.filter((row) => {
    const fw = (row["Filter Week"] || "").trim().toLowerCase();
    return target === "all" ? true : fw === target;
  });

  const totalHutangProd = chartData.reduce((acc, curr) => acc + curr.hutangProd, 0);
  const totalHutangCarton = chartData.reduce((acc, curr) => acc + curr.hutangCarton, 0);
  // Total beban shipment adalah hutang prod + hutang pack (carton)
  const totalHutang = totalHutangProd + totalHutangCarton;
  const cartonShare = totalHutang > 0 ? Math.round((totalHutangCarton / totalHutang) * 100) : 0;
  const prodShare = totalHutang > 0 ? Math.round((totalHutangProd / totalHutang) * 100) : 0;
  const isAttention = totalHutang > 0 && isFriday();

  return {
    totalHutangProd,
    totalHutangCarton,
    totalHutang,
    cartonShare,
    prodShare,
    isAttention,
    totalInvoices: matchingRows.length,
  };
}

export async function getProgressShipmentDetails(): Promise<ProgressShipmentDetailItem[]> {
  const rows = await getNamedRangeData("WEBProgressShipment");

  return rows.map((row) => ({
    w: (row["W"] || "").trim(),
    inv: (row["Inv#"] || "").trim(),
    buyer: (row["Buyer"] || "").trim(),
    qtyShipment: parseNumber(row["Qty Shipment"]),
    qtyCarton: parseNumber(row["Qty Carton"]),
    hutangProd: parseNumber(row["Hutang Prod"]),
    hutangCarton: parseNumber(row["Hutang Carton"]),
    hutangEnvelope: parseNumber(row["Hutang Envelope"]),
    filterWeek: (row["Filter Week"] || "").trim().toLowerCase(),
  }));
}

export async function getAllProgressShipmentData() {
  const [chartData, summary, details] = await Promise.all([
    getProgressShipmentChartData("next week"),
    getProgressShipmentSummary("next week"),
    getProgressShipmentDetails(),
  ]);

  return {
    chartData,
    summary,
    details,
  };
}

