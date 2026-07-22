import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const language =
      typeof body?.language === "string" ? body.language.trim() : "";

    if (!name || !email || !password || !language) {
      return NextResponse.json(
        { message: "全ての項目を入力・選択してください。" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "正しいメールアドレスを入力してください。" },
        { status: 422 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "パスワードは8文字以上で入力してください。" },
        { status: 422 }
      );
    }

    const filePath = path.join(process.cwd(), "public", "myacount.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const users: Record<string, string>[] = JSON.parse(raw);

    if (!Array.isArray(users)) {
      return NextResponse.json(
        { message: "データエラーが発生しました。" },
        { status: 500 }
      );
    }

    const exists = users.some((u) => u.email === email);
    if (exists) {
      return NextResponse.json(
        { message: "このメールアドレスは既に使用されています。" },
        { status: 422 }
      );
    }

    const { hash, salt } = hashPassword(password);
    const newUser = {
      name,
      email,
      password: `${hash}:${salt}`,
      language,
      date: "0",
    };

    users.push(newUser);
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");

    const { password: _pw, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      access_token: generateToken(),
      user: userWithoutPassword,
      message: "登録が完了しました。",
    });
  } catch {
    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
