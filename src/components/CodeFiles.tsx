import type { CodeBlock as CodeBlockT } from "@/content/schema";
import CodeBlock from "./CodeBlock";
import { cn } from "@/lib/utils";

/**
 * Several code files for one step, shown one at a time behind a row of
 * filename tabs so they stay readable at recording size. A dot marks files
 * with highlighted lines. The parent owns the selected index so links in the
 * explanation can switch files too.
 */
export default function CodeFiles({ blocks, index, onSelect }: { blocks: CodeBlockT[]; index: number; onSelect: (i: number) => void }) {
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
              onClick={() => onSelect(i)}
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

/** The names a file can be referred to by in prose: full path, basename, and stem. */
export function fileAliases(block: CodeBlockT): string[] {
  const name = block.filename;
  if (!name) return [];
  const clean = name.replace(/\s*\(.*\)\s*$/, ""); // drop "(excerpt)"-style suffixes
  const base = clean.split("/").pop() ?? clean;
  const stem = base.replace(/\.[a-z]+$/i, "");
  const out = new Set<string>([clean, base]);
  if (stem.length >= 4 && !/^(commands|schema|models|profiles)$/i.test(stem)) out.add(stem);
  return [...out];
}

/**
 * Renders prose with any mention of one of the step's files turned into a
 * link that opens that file's tab. Matching is by whole word, longest alias
 * first, so "order_amounts" opens models/order_amounts.sql.
 */
export function LinkedText({ text, blocks, onSelect, className }: { text: string; blocks: CodeBlockT[]; onSelect: (i: number) => void; className?: string }) {
  const aliases: { alias: string; index: number }[] = [];
  blocks.forEach((b, i) => fileAliases(b).forEach((alias) => aliases.push({ alias, index: i })));
  aliases.sort((a, b) => b.alias.length - a.alias.length);
  if (aliases.length === 0 || blocks.length < 2) return <p className={className}>{text}</p>;
  const escaped = aliases.map((a) => a.alias.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&"));
  const re = new RegExp(`(?<![\\w/.])(${escaped.join("|")})(?![\\w/])`, "g");
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const hit = aliases.find((a) => a.alias === m![1]);
    if (!hit) continue;
    if (m.index > last) parts.push(text.slice(last, m.index));
    const idx = hit.index;
    parts.push(
      <button
        key={`${m.index}-${idx}`}
        type="button"
        onClick={() => onSelect(idx)}
        className="rounded-sm font-mono text-[0.92em] text-accent underline decoration-dotted underline-offset-2 hover:decoration-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        title={`Open ${blocks[idx].filename}`}
      >
        {m[1]}
      </button>,
    );
    last = m.index + m[1].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <p className={className}>{parts}</p>;
}
