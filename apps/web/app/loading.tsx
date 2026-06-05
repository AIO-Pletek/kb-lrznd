export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[var(--border-color)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="text-sm text-[var(--text-muted)] animate-pulse">
          Memuat...
        </p>
      </div>
    </div>
  );
}
