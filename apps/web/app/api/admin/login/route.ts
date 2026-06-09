import { login } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const success = await login(username, password);

    if (!success) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true, username });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
