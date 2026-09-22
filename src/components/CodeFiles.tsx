import { useState } from "react";
import type { CodeBlock as CodeBlockT } from "@/content/schema";
import CodeBlock from "./CodeBlock";
import { cn } from "@/lib/utils";

/**
 * Several code files for one step, shown one at a time behind a row of
 * filename tabs so they stay readable at recording size. A dot marks files
 * with highlighted lines. The first file opens by default; the parent passes a
 * `key` per step so the selection resets when the step changes.
 */
export default function CodeFiles({ blocks }: { blocks: CodeBlockT[] }) {
  const [index, setIndex] = useState(0);
  if (blocks.length === 0) return null;
  if (blocks.length === 1) return <CodeBlock block={blocks[0]} />;
  const current = blocks[Math.min(index, blocks.length - 1)];
  return (
    <div className="flex min-h-0 flex-col gap-1.5">
      <div role="tablist" aria-label="Files in this step" className="flex flex-wrap gap-1">
        {blocks.map((b, i) => {
          const active = i === index;
          const label = b.filename ?? `${b.language} ${i + 1}`;
          return (
            <button
              key={`${label}-${i}`}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[5px] border px-2 py-1 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "border-accent bg-highlight-wash text-foreground" : "border-border text-muted-foreground hover:text-foreground",
              )}
              title={b.caption ?? label}
            >
              {b.highlight_lines.length > 0 && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />}
              {label}
            </button>
          );
        })}
        <span className="ml-auto self-center text-[11px] text-muted-foreground">
          {index + 1} of {blocks.length} files
        </span>
      </div>
      <CodeBlock block={current} />
    </div>
  );
}
