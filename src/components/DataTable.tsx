import type { Cell } from "@/content/schema";
import { cn } from "@/lib/utils";

function fmt(c: Cell) {
  if (c === null) return "∅";
  if (typeof c === "number") return c.toLocaleString("en-US");
  return String(c);
}

export default function DataTable({ columns, rows, highlightRows = [], caption, compact }: { columns: string[]; rows: Cell[][]; highlightRows?: number[]; caption?: string | null; compact?: boolean }) {
  const hl = new Set(highlightRows);
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className={cn("w-full border-collapse font-mono text-xs", compact && "text-[11px]")}>
        {caption && <caption className="px-3 py-1.5 text-left text-xs text-muted-foreground">{caption}</caption>}
        <thead>
          <tr className="border-b border-border bg-card">
            {columns.map((c) => (
              <th key={c} scope="col" className="px-2.5 py-1 text-left text-[11px] font-medium tracking-wide text-muted-foreground">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={cn("border-b border-border/60 last:border-0", hl.has(i) && "bg-highlight-wash")}>
              {row.map((cell, j) => (
                <td key={j} className={cn("px-2.5 py-1", typeof cell === "number" && "text-right tabular-nums")}>
                  {fmt(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
