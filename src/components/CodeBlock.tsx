import type { CodeBlock as CodeBlockT } from "@/content/schema";
import { cn } from "@/lib/utils";

/** Read-only code with line numbers and highlighted lines. No editing, no execution. */
export default function CodeBlock({ block }: { block: CodeBlockT }) {
  const lines = block.content.replace(/\n$/, "").split("\n");
  const highlighted = new Set(block.highlight_lines);
  return (
    <figure className="overflow-hidden rounded-md border border-border bg-card">
      {block.filename && (
        <figcaption className="flex items-center justify-between border-b border-border px-3 py-1.5">
          <span className="provenance text-foreground/80">{block.filename}</span>
          <span className="provenance">{block.language}</span>
        </figcaption>
      )}
      <pre className="overflow-x-auto py-2 font-mono text-[0.8rem] leading-6" tabIndex={0} aria-label={block.filename ?? `${block.language} code`}>
        <code>
          {lines.map((line, i) => {
            const n = i + 1;
            const hl = highlighted.has(n);
            return (
              <span key={n} className={cn("flex", hl && "bg-highlight-wash")} aria-current={hl ? "true" : undefined}>
                <span className="w-10 shrink-0 select-none pr-3 text-right text-muted-foreground/60" aria-hidden="true">
                  {n}
                </span>
                <span className={cn("shrink-0 pr-3", hl ? "text-accent-bright" : "text-transparent")} aria-hidden="true">
                  {hl ? "▶" : "·"}
                </span>
                <span className="whitespace-pre pr-4">{line || " "}</span>
              </span>
            );
          })}
        </code>
      </pre>
      {block.caption && <p className="border-t border-border px-3 py-1.5 text-xs text-muted-foreground">{block.caption}</p>}
    </figure>
  );
}
