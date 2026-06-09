import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, role, avatar } = await request.json();
    const [updated] = await db.update(authors).set({ name, role, avatar }).where(eq(authors.id, id)).returning();
    if (!updated) return NextResponse.json({ error: "Author tidak ditemukan" }, { status: 404 });
    return NextResponse.json(updated);
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [deleted] = await db.delete(authors).where(eq(authors.id, id)).returning();
    if (!deleted) return NextResponse.json({ error: "Author tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
