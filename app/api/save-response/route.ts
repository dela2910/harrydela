import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CSV_HEADERS = "firstName,lastName,job,createdAt\n";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName = "", lastName = "", job = "" } = body ?? {};

    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "respuestas.csv");

    await fs.mkdir(dataDir, { recursive: true });

    let fileExists = true;
    try {
      await fs.access(filePath);
    } catch {
      fileExists = false;
    }

    const createdAt = new Date().toISOString();
    const sanitize = (value: string) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const line = [
      sanitize(firstName),
      sanitize(lastName),
      sanitize(job),
      sanitize(createdAt),
    ].join(",") + "\n";

    const content = (fileExists ? "" : CSV_HEADERS) + line;

    await fs.appendFile(filePath, content, { encoding: "utf8" });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error guardando CSV", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo guardar el CSV" },
      { status: 500 },
    );
  }
}

