import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const [updated] = await db.update(categories).set({ ...body, updatedAt: new Date() }).where(eq(categories.id, id)).returning();
    if (!updated) return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    return NextResponse.json(updated);
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning();
    if (!deleted) return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
