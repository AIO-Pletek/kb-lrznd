import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authors } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.select().from(authors).orderBy(asc(authors.name));
    return NextResponse.json(result);
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, avatar } = body;
    if (!name) return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
    const [author] = await db.insert(authors).values({ name, role, avatar }).returning();
    return NextResponse.json(author, { status: 201 });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
