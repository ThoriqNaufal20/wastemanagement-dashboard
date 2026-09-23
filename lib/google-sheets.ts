import { google } from "googleapis";

// Helper untuk membersihkan private key dari berbagai format paste di Vercel / .env
export function cleanPrivateKey(rawKey: string | undefined): string {
  if (!rawKey) return "";
  let key = rawKey.trim();
  // Hapus kutip ganda atau tunggal di awal & akhir jika user copy-paste bersama kutipnya di Vercel
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }
  // Normalisasi karakter newline: \r\n, literal \n, dsb.
  key = key.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
  return key;
}

export function cleanEnvValue(val: string | undefined): string {
  if (!val) return "";
  let v = val.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

export function getSpreadsheetId(): string {
  return cleanEnvValue(process.env.GOOGLE_SHEETS_SPREADSHEET_ID);
}

// Singleton auth client agar tidak mengulang handshake JWT setiap pemanggilan
let sheetsClient: ReturnType<typeof google.sheets> | null = null;

export function getSheetsClient() {
  if (!sheetsClient) {
    const email = cleanEnvValue(process.env.GOOGLE_SHEETS_CLIENT_EMAIL);
    const key = cleanPrivateKey(process.env.GOOGLE_SHEETS_PRIVATE_KEY);

    if (!email || !key) {
      console.error("[GoogleSheets] Kredensial tidak lengkap:", {
        hasEmail: Boolean(email),
        hasKey: Boolean(key),
        hasSpreadsheetId: Boolean(getSpreadsheetId()),
      });
    }

    const auth = new google.auth.JWT({
      email,
      key,
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
      spreadsheetId: getSpreadsheetId(),
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
        spreadsheetId: getSpreadsheetId(),
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

/**
 * Membaca named range dengan metadata kaya: otomatis mengekstrak URL asli dari
 * Google Smart Chips (richLinkProperties.uri), cell hyperlink, maupun teks biasa.
 */
export async function getNamedRangeDataWithLinks(
  namedRange: string
): Promise<Record<string, string>[]> {
  const cacheKey = `${namedRange}_links`;
  const now = Date.now();
  const cached = memoryCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)!;
  }

  const fetchPromise = (async () => {
    try {
      const sheets = getSheetsClient();
      const response = await sheets.spreadsheets.get({
        spreadsheetId: getSpreadsheetId(),
        ranges: [namedRange],
        fields:
          "sheets(data(rowData(values(formattedValue,hyperlink,chipRuns,textFormatRuns))))",
      });

      const sheet = response.data.sheets?.[0];
      const rowData = sheet?.data?.[0]?.rowData;
      if (!rowData || rowData.length === 0) return [];

      const headers =
        rowData[0].values?.map((v) => (v.formattedValue || "").trim()) || [];
      if (headers.length === 0) return [];

      const data = rowData.slice(1).map((r) => {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          const cell = r.values ? r.values[i] : null;
          if (!cell) {
            obj[h] = "";
            return;
          }

          // Prioritas 1: Smart Chips Google Drive (richLinkProperties.uri)
          const chipUri =
            cell.chipRuns?.[0]?.chip?.richLinkProperties?.uri || "";

          // Prioritas 2: Cell hyperlink langsung
          const cellLink = cell.hyperlink || "";

          // Prioritas 3: Text format run link
          const textRunLink =
            cell.textFormatRuns?.[0]?.format?.link?.uri || "";

          const text = cell.formattedValue || "";

          const isLinkColumn =
            h.toLowerCase().includes("link") ||
            h.toLowerCase().includes("url");

          if (isLinkColumn) {
            obj[h] = chipUri || cellLink || textRunLink || text;
          } else {
            obj[h] = text;
          }
        });
        return obj;
      });

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}
