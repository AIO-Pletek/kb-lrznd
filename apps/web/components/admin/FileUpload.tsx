"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Film, ImageIcon, File } from "lucide-react";

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
  category: string;
}

interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return ImageIcon;
  if (mimeType.startsWith("video/")) return Film;
  if (mimeType.startsWith("application/pdf")) return FileText;
  if (mimeType.startsWith("application/")) return FileText;
  if (mimeType.startsWith("text/")) return FileText;
  return File;
}

export function FileUpload({
  onUpload,
  accept,
  multiple = true,
  label = "Upload File",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList) => {
      setError("");
      setUploading(true);

      const formData = new FormData();
      for (const file of Array.from(files)) {
        formData.append("files", file);
      }

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const d = await res.json();
          setError(d.error || "Upload gagal");
          return;
        }

        const data = await res.json();
        onUpload(data.files);
      } catch {
        setError("Terjadi kesalahan saat upload");
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`
          cursor-pointer border-2 border-dashed rounded-[var(--radius)] p-8 text-center
          transition-all duration-200
          ${dragOver
            ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
            : "border-[var(--border-color)] hover:border-[var(--text-muted)]"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[var(--border-color)] border-t-[var(--accent)] rounded-full animate-spin" />
            <p className="text-sm text-[var(--text-muted)]">Mengupload...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
              <Upload size={22} className="text-[var(--text-muted)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Drag & drop atau klik untuk pilih file
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Max 50MB — Gambar, PDF, DOC, Excel, Video
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

// Preview grid component
export function FilePreview({
  files,
  onRemove,
  compact,
}: {
  files: UploadedFile[];
  onRemove?: (url: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={`grid ${compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"} gap-3 mt-3`}>
      {files.map((file) => {
        const Icon = getIcon(file.type);
        const isImage = file.type.startsWith("image/");

        return (
          <div
            key={file.url}
            className="relative group rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden"
          >
            {isImage ? (
              <div className="aspect-video bg-[var(--bg-tertiary)]">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video bg-[var(--bg-tertiary)] flex items-center justify-center">
                <Icon size={28} className="text-[var(--text-muted)]" />
              </div>
            )}

            <div className="p-2">
              <p className="text-xs text-[var(--text-primary)] truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-[10px] text-[var(--text-muted)]">
                {formatSize(file.size)}
              </p>
            </div>

            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(file.url)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
