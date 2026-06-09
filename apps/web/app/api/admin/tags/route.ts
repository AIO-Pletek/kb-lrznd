import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.select().from(tags).orderBy(asc(tags.name));
    return NextResponse.json(result);
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug } = body;
    if (!name || !slug) return NextResponse.json({ error: "Nama dan slug wajib diisi" }, { status: 400 });
    const [tag] = await db.insert(tags).values({ name, slug }).returning();
    return NextResponse.json(tag, { status: 201 });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
