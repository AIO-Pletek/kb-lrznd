import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    // Security: prevent path traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const { readdir } = await import("fs/promises");
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const categories = ["images", "documents", "videos", "others"];

    // Find the file in all category folders
    let deleted = false;
    for (const cat of categories) {
      const catDir = path.join(uploadsDir, cat);
      const filePath = path.join(catDir, filename);
      try {
        await unlink(filePath);
        deleted = true;
        break;
      } catch {
        // File not in this category, check next
      }
    }

    if (!deleted) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json({ error: "Gagal menghapus file" }, { status: 500 });
  }
}
