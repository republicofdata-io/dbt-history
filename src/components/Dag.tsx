import type { Diagram } from "@/content/schema";
import { cn } from "@/lib/utils";

/**
 * Small left-to-right DAG drawn in SVG. Layers are computed from the longest
 * path so every step's diagram lays itself out from content alone.
 */
export default function Dag({ diagram, title }: { diagram: Diagram; title?: string }) {
  const ids = diagram.nodes.map((n) => n.id);
  const preds = new Map<string, string[]>(ids.map((id) => [id, []]));
  for (const e of diagram.edges) preds.get(e.to)?.push(e.from);
  const depth = new Map<string, number>();
  const visit = (id: string, seen: Set<string>): number => {
    if (depth.has(id)) return depth.get(id)!;
    if (seen.has(id)) return 0;
    seen.add(id);
    const d = Math.max(0, ...(preds.get(id) ?? []).map((p) => visit(p, seen) + 1));
    depth.set(id, d);
    return d;
  };
  for (const id of ids) visit(id, new Set());
  const columns = new Map<number, string[]>();
  for (const id of ids) {
    const d = depth.get(id) ?? 0;
    columns.set(d, [...(columns.get(d) ?? []), id]);
  }
  const colCount = Math.max(...columns.keys()) + 1;
  const rowCount = Math.max(...[...columns.values()].map((c) => c.length));
  const W = 150, H = 34, GX = 44, GY = 12;
  const width = colCount * W + (colCount - 1) * GX;
  const height = rowCount * H + (rowCount - 1) * GY;
  const pos = new Map<string, { x: number; y: number }>();
  for (const [d, list] of columns) {
    const offset = (height - (list.length * H + (list.length - 1) * GY)) / 2;
    list.forEach((id, i) => pos.set(id, { x: d * (W + GX), y: offset + i * (H + GY) }));
  }
  const hl = new Set(diagram.highlight);
  return (
    <figure className="overflow-x-auto rounded-md bg-muted p-3">
      {title && <figcaption className="provenance mb-3 text-foreground/80">{title}</figcaption>}
      <svg viewBox={`-2 -2 ${width + 4} ${height + 4}`} width={width + 4} height={height + 4} className="mx-auto block max-w-full font-mono text-[11px]" role="img" aria-label={title ?? "Lineage diagram"}>
        <defs>
          <marker id="dag-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        {diagram.edges.map((e, i) => {
          const a = pos.get(e.from)!, b = pos.get(e.to)!;
          const x1 = a.x + W, y1 = a.y + H / 2, x2 = b.x, y2 = b.y + H / 2;
          const mx = (x1 + x2) / 2;
          return (
            <path key={i} d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`} fill="none" stroke="currentColor" className="text-muted-foreground" strokeWidth={1.25} markerEnd="url(#dag-arrow)" />
          );
        })}
        {diagram.nodes.map((n) => {
          const p = pos.get(n.id)!;
          const on = hl.has(n.id);
          return (
            <g key={n.id} transform={`translate(${p.x} ${p.y})`}>
              <rect width={W} height={H} rx={6} className={cn(on ? "fill-highlight-wash stroke-accent" : "fill-card stroke-border")} strokeWidth={on ? 1.5 : 1} />
              <text x={W / 2} y={H / 2} dominantBaseline="middle" textAnchor="middle" className={cn("fill-current", on ? "text-accent-bright" : "text-foreground")}>
                {n.label.length > 22 ? `${n.label.slice(0, 21)}…` : n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
