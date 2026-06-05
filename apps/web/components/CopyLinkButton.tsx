"use client";

import { useState, useCallback } from "react";
import { Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyLinkButtonProps {
  url?: string;
  className?: string;
}

export function CopyLinkButton({ url, className }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const link = url || window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = link;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "btn-outline gap-2",
        copied && "!border-green-400 !text-green-600 dark:!text-green-400",
        className
      )}
      aria-label={copied ? "Tersalin" : "Salin tautan"}
    >
      {copied ? (
        <>
          <Check size={16} />
          <span>Tersalin</span>
        </>
      ) : (
        <>
          <Link2 size={16} />
          <span>Salin Tautan</span>
        </>
      )}
    </button>
  );
}
