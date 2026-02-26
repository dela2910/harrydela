import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { google } from "googleapis";

const CSV_HEADERS = "firstName,lastName,contact,job,createdAt\n";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            body.firstName,
            body.lastName,
            body.contact,
            body.job,
            new Date().toISOString(),
          ],
        ],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

