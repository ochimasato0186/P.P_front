import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "メールアドレスとパスワードを入力してください。" },
        { status: 400 }
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

    const user = users.find((u) => u.email === email);
    if (!user) {
      return NextResponse.json(
        { message: "メールアドレスまたはパスワードが間違っています。" },
        { status: 401 }
      );
    }

    // ハッシュ済みパスワード（hash:salt 形式）と平文の両方に対応
    let isValid = false;
    if (user.password && user.password.includes(":")) {
      const [storedHash, salt] = user.password.split(":");
      isValid = hashPassword(password, salt) === storedHash;
    } else {
      // 既存の平文パスワード（レガシー対応）
      isValid = user.password === password;
    }

    if (!isValid) {
      return NextResponse.json(
        { message: "メールアドレスまたはパスワードが間違っています。" },
        { status: 401 }
      );
    }

    const { password: _pw, ...userWithoutPassword } = user;

    return NextResponse.json({
      access_token: generateToken(),
      user: userWithoutPassword,
    });
  } catch {
    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
