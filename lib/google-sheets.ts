import { google } from "googleapis";

// Singleton auth client agar tidak mengulang handshake JWT setiap pemanggilan
let sheetsClient: ReturnType<typeof google.sheets> | null = null;

function getSheetsClient() {
  if (!sheetsClient) {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    sheetsClient = google.sheets({ version: "v4", auth });
  }
  return sheetsClient;
}

interface CacheEntry {
  data: Record<string, string>[];
  timestamp: number;
}

// In-memory cache berdurasi 2 menit (120 detik)
const CACHE_TTL_MS = 120 * 1000;
const memoryCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<Record<string, string>[]>>();

function parseRowsToObjects(
  rows: (string | number)[][] | undefined | null
): Record<string, string>[] {
  if (!rows || rows.length === 0) return [];

  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map((h) => String(h).trim());

  return dataRows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] !== undefined && row[i] !== null ? String(row[i]) : "";
    });
    return obj;
  });
}

/**
 * Mengambil beberapa named ranges sekaligus dalam 1 request HTTP (batchGet).
 * Jauh lebih cepat (~3 detik dibanding 17 detik bila dipanggil terpisah).
 */
export async function prefetchNamedRanges(namedRanges: string[]): Promise<void> {
  const now = Date.now();
  const rangesToFetch = namedRanges.filter((r) => {
    const cached = memoryCache.get(r);
    return !cached || now - cached.timestamp >= CACHE_TTL_MS;
  });

  if (rangesToFetch.length === 0) return;

  try {
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      ranges: rangesToFetch,
    });

    const valueRanges = response.data.valueRanges || [];
    valueRanges.forEach((vr, i) => {
      const rangeName = rangesToFetch[i];
      const data = parseRowsToObjects(vr.values as (string | number)[][]);
      memoryCache.set(rangeName, { data, timestamp: Date.now() });
    });
  } catch (error) {
    console.error("Gagal batch prefetch Google Sheets:", error);
  }
}

/**
 * Baca satu named range dari spreadsheet, otomatis convert jadi
 * array of objects berdasarkan baris pertama sebagai header.
 * Dilengkapi dengan in-memory cache dan deduplikasi in-flight request.
 */
export async function getNamedRangeData(
  namedRange: string
): Promise<Record<string, string>[]> {
  const now = Date.now();
  const cached = memoryCache.get(namedRange);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Jika sedang ada request yang berjalan untuk named range ini, tunggu Promise yang sama
  if (inFlightRequests.has(namedRange)) {
    return inFlightRequests.get(namedRange)!;
  }

  const fetchPromise = (async () => {
    try {
      const sheets = getSheetsClient();
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
        range: namedRange,
      });

      const data = parseRowsToObjects(response.data.values as (string | number)[][]);
      memoryCache.set(namedRange, { data, timestamp: Date.now() });
      return data;
    } finally {
      inFlightRequests.delete(namedRange);
    }
  })();

  inFlightRequests.set(namedRange, fetchPromise);
  return fetchPromise;
}
