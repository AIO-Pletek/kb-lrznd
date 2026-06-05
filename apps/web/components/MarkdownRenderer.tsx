import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none
      prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
      prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
      prose-p:leading-relaxed prose-p:text-[var(--text-secondary)]
      prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline
      prose-code:text-sm prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:bg-[var(--bg-tertiary)]
      prose-pre:bg-[var(--bg-tertiary)] prose-pre:border prose-pre:border-[var(--border-color)]
      prose-img:rounded-[var(--radius-lg)]
      prose-blockquote:border-l-[var(--accent)] prose-blockquote:bg-[var(--accent-subtle)] prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-[var(--radius)]
      prose-ul:my-4 prose-ol:my-4
      prose-li:text-[var(--text-secondary)]
      prose-strong:text-[var(--text-primary)]
      prose-table:border prose-table:border-[var(--border-color)] prose-table:rounded-[var(--radius)]
      prose-th:bg-[var(--bg-secondary)] prose-th:px-4 prose-th:py-2
      prose-td:px-4 prose-td:py-2
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Generate IDs for headings for TOC
          h2: ({ children, ...props }) => {
            const text = extractText(children);
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-");
            return <h2 id={id} {...props}>{children}</h2>;
          },
          h3: ({ children, ...props }) => {
            const text = extractText(children);
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-");
            return <h3 id={id} {...props}>{children}</h3>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Helper: extract plain text from React children
function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.map(extractText).join("");
  }
  if (children && typeof children === "object" && "props" in children) {
    return extractText((children as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}
