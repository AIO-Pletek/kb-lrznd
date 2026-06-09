import { logout } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
