import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const language = typeof body?.language === "string" ? body.language.trim() : "";

    if (!language) {
      return NextResponse.json(
        { message: "language is required" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "public", "myacount.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return NextResponse.json(
        { message: "account data is empty" },
        { status: 400 }
      );
    }

    parsed[0] = {
      ...parsed[0],
      language,
    };

    await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), "utf-8");

    return NextResponse.json({ ok: true, language });
  } catch {
    return NextResponse.json(
      { message: "failed to update language" },
      { status: 500 }
    );
  }
}
