import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Max file size: 50MB
const MAX_SIZE = 50 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_TYPES: Record<string, { category: string; extensions: string[] }> = {
  // Images
  "image/jpeg":   { category: "images", extensions: [".jpg", ".jpeg"] },
  "image/png":    { category: "images", extensions: [".png"] },
  "image/gif":    { category: "images", extensions: [".gif"] },
  "image/webp":   { category: "images", extensions: [".webp"] },
  "image/svg+xml":{ category: "images", extensions: [".svg"] },
  // Documents
  "application/pdf":          { category: "documents", extensions: [".pdf"] },
  "application/msword":       { category: "documents", extensions: [".doc"] },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { category: "documents", extensions: [".docx"] },
  "application/vnd.ms-excel": { category: "documents", extensions: [".xls"] },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { category: "documents", extensions: [".xlsx"] },
  "application/vnd.ms-powerpoint": { category: "documents", extensions: [".ppt"] },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { category: "documents", extensions: [".pptx"] },
  "text/csv":                 { category: "documents", extensions: [".csv"] },
  "text/plain":               { category: "documents", extensions: [".txt"] },
  "application/json":         { category: "documents", extensions: [".json"] },
  "application/zip":          { category: "documents", extensions: [".zip"] },
  "application/x-rar-compressed": { category: "documents", extensions: [".rar"] },
  // Video
  "video/mp4":  { category: "videos", extensions: [".mp4"] },
  "video/webm": { category: "videos", extensions: [".webm"] },
  "video/ogg":  { category: "videos", extensions: [".ogg"] },
  "video/quicktime": { category: "videos", extensions: [".mov"] },
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const rawFiles = formData.getAll("files") as File[];

    if (!rawFiles || rawFiles.length === 0) {
      return NextResponse.json({ error: "Tidak ada file yang diupload" }, { status: 400 });
    }

    const uploaded: { name: string; url: string; type: string; size: number; category: string }[] = [];

    for (const file of rawFiles) {
      // Validate size
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" terlalu besar (max 50MB)` },
          { status: 400 }
        );
      }

      // Detect file type
      const typeConfig = ALLOWED_TYPES[file.type];
      let ext: string;
      let category: string;

      if (typeConfig) {
        ext = typeConfig.extensions[0];
        category = typeConfig.category;
      } else {
        // Unknown type — use original extension, categorize as "others"
        ext = path.extname(file.name) || ".bin";
        category = "others";
      }

      const uploadDir = path.join(process.cwd(), "public", "uploads", category);
      await mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      uploaded.push({
        name: file.name,
        url: `/uploads/${category}/${filename}`,
        type: file.type,
        size: file.size,
        category,
      });
    }

    return NextResponse.json({ files: uploaded }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Gagal upload file" }, { status: 500 });
  }
}

// GET — list uploaded files
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterCategory = searchParams.get("category") || "";

    const { readdir, stat } = await import("fs/promises");
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const categories = ["images", "documents", "videos", "others"];

    const files: { name: string; url: string; size: number; category: string; modified: string }[] = [];

    for (const cat of categories) {
      if (filterCategory && cat !== filterCategory) continue;

      const catDir = path.join(uploadsDir, cat);
      try {
        const entries = await readdir(catDir);
        for (const entry of entries) {
          const filePath = path.join(catDir, entry);
          const st = await stat(filePath);
          if (st.isFile()) {
            files.push({
              name: entry,
              url: `/uploads/${cat}/${entry}`,
              size: st.size,
              category: cat,
              modified: st.mtime.toISOString(),
            });
          }
        }
      } catch {
        // Category folder doesn't exist yet — skip
      }
    }

    // Sort by newest first
    files.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

    return NextResponse.json({ files });
  } catch (error) {
    console.error("File list error:", error);
    return NextResponse.json({ files: [] });
  }
}
