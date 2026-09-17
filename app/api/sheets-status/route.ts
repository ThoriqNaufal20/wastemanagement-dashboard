import { NextResponse } from "next/server";
import {
  cleanEnvValue,
  cleanPrivateKey,
  getSpreadsheetId,
  getNamedRangeData,
} from "@/lib/google-sheets";
import { google } from "googleapis";

export const dynamic = "force-dynamic";

export async function GET() {
  const email = cleanEnvValue(process.env.GOOGLE_SHEETS_CLIENT_EMAIL);
  const rawKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY || "";
  const cleanedKey = cleanPrivateKey(rawKey);
  const spreadsheetId = getSpreadsheetId();

  const status: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    isVercel: Boolean(process.env.VERCEL),
    checks: {
      clientEmail: {
        present: Boolean(email),
        value: email ? `${email.slice(0, 10)}...` : "MISSING",
      },
      spreadsheetId: {
        present: Boolean(spreadsheetId),
        length: spreadsheetId.length,
      },
      privateKey: {
        present: Boolean(rawKey),
        hasPemHeader: cleanedKey.includes("-----BEGIN PRIVATE KEY-----"),
        hasPemFooter: cleanedKey.includes("-----END PRIVATE KEY-----"),
      },
    },
  };

  // Test 1: JWT Auth handshake dengan Google API
  try {
    const auth = new google.auth.JWT({
      email,
      key: cleanedKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const token = await auth.authorize();
    status.auth = {
      success: true,
      tokenType: token.token_type,
    };
  } catch (err: any) {
    status.auth = {
      success: false,
      error: err?.message || String(err),
    };
    return NextResponse.json(status, { status: 500 });
  }

  // Test 2: Coba membaca data spreadsheet
  try {
    const rows = await getNamedRangeData("WEBScorecardDept");
    status.sheetsRead = {
      success: true,
      namedRange: "WEBScorecardDept",
      rowCount: rows.length,
    };
  } catch (err: any) {
    status.sheetsRead = {
      success: false,
      error: err?.message || String(err),
    };
    return NextResponse.json(status, { status: 500 });
  }

  return NextResponse.json(status);
}

