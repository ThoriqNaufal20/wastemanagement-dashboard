import { google } from "googleapis";

// Auth pakai service account. Dipanggil di server saja — JANGAN pernah
// diimport dari komponen client ("use client"), karena private key
// akan ter-expose ke browser kalau begitu.
function getSheetsClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return google.sheets({ version: "v4", auth });
}

/**
 * Baca satu named range dari spreadsheet, otomatis convert jadi
 * array of objects berdasarkan baris pertama sebagai header.
 *
 * Contoh hasil untuk named range "WEBScorecardDept":
 * [
 *   { quarter: "Q2-2026", function: "78", strategy: "77", ... },
 * ]
 */
export async function getNamedRangeData(
  namedRange: string
): Promise<Record<string, string>[]> {
  const sheets = getSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: namedRange, // nama named range langsung dipakai sebagai range
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) return [];

  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map((h) => String(h).trim());

  return dataRows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] ?? "";
    });
    return obj;
  });
}
