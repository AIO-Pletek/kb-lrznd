import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.select().from(categories).orderBy(asc(categories.sort), asc(categories.name));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, icon, sort } = body;
    if (!name || !slug) {
      return NextResponse.json({ error: "Nama dan slug wajib diisi" }, { status: 400 });
    }
    const [cat] = await db.insert(categories).values({ name, slug, description, icon, sort: sort || 0 }).returning();
    return NextResponse.json(cat, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
