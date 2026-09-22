import type { z } from "zod";
import { bounds, relation } from "./dates";
import type { Layer, Maturity, Milestone, Placement, Product, ProductEvent, Release, Relationship } from "./schema";

type MaturityT = z.infer<typeof Maturity>;
type RelationshipT = z.infer<typeof Relationship>;
type LayerT = z.infer<typeof Layer>;
type AccessT = NonNullable<ProductEvent["access"]>[number];

// ---------- Release anchor ----------

export interface Anchor {
  release: Release;
  milestone: Milestone;
  /** ISO day used to resolve the catalogue and ecosystem. */
  date: string;
}

/** The milestone a chapter opens on: its declared default, else its first published package. */
export function defaultMilestone(release: Release): Milestone {
  if (release.default_milestone) {
    const m = release.milestones.find((x) => x.id === release.default_milestone);
    if (m) return m;
  }
  return release.milestones.find((m) => m.kind === "package") ?? release.milestones[0];
}

export function resolveAnchor(release: Release, milestoneId?: string | null): Anchor {
  const milestone = (milestoneId && release.milestones.find((m) => m.id === milestoneId)) || defaultMilestone(release);
  // Imprecise milestone dates resolve to their latest bound so nothing dated inside the
  // interval is shown as not yet existing.
  return { release, milestone, date: bounds(milestone.date, milestone.precision).latest };
}

// ---------- Names and owners at a date ----------

function activeInterval<T extends { from: string; from_precision: "day" | "month" | "year"; to: string | null }>(
  intervals: T[],
  date: string,
): T | undefined {
  let match: T | undefined;
  for (const i of intervals) {
    const start = bounds(i.from, i.from_precision).earliest;
    const end = i.to ? bounds(i.to, "day").earliest : null;
    if (date >= start && (end === null || date < end)) match = i;
  }
  // Before any interval starts, fall back to the earliest name so a product still has a label.
  return match ?? (intervals.length ? [...intervals].sort((a, b) => a.from.localeCompare(b.from))[0] : undefined);
}

export function nameAt(product: Product, date: string): string {
  return activeInterval(product.names, date)?.name ?? product.id;
}

export function ownerAt(product: Product, date: string): string | null {
  return activeInterval(product.owners, date)?.owner ?? null;
}

// ---------- Catalogue ----------

export interface ProductState {
  product: Product;
  name: string;
  owner: string | null;
  maturity: MaturityT | null;
  access: AccessT[] | null;
  /** "qualified" when the anchor falls inside an uncertain event interval. */
  certainty: "certain" | "qualified";
  applied: ProductEvent[];
  qualified: ProductEvent[];
  latest: ProductEvent | null;
}

/**
 * The date the dbt–Fivetran merger closed, derived from the ledger rather than
 * hard-coded: the `merger_closed` event, or the closing event recorded on the
 * dbt Labs company entry with "merger" in its id.
 */
export function mergerClosedDate(events: ProductEvent[]): string | null {
  const e =
    events.find((x) => x.kind === "merger_closed") ??
    events.find((x) => x.kind === "acquisition_closed" && x.product === "dbt-labs" && (x.transaction_type === "merger" || /merger/.test(x.id)));
  return e ? bounds(e.date, e.precision).latest : null;
}

export function catalogueAt(date: string, products: Map<string, Product>, events: ProductEvent[]): ProductState[] {
  const merger = mergerClosedDate(events);
  const byProduct = new Map<string, ProductEvent[]>();
  for (const e of events) {
    if (!e.affects_catalogue) continue;
    const list = byProduct.get(e.product) ?? [];
    list.push(e);
    byProduct.set(e.product, list);
  }
  const states: ProductState[] = [];
  for (const [id, list] of byProduct) {
    const product = products.get(id);
    if (!product) throw new Error(`Event refers to unknown product ${id}`);
    if (product.catalogue_membership) {
      const m = product.catalogue_membership;
      if (date < bounds(m.from, "day").earliest) continue;
      if (m.to && date >= bounds(m.to, "day").earliest) continue;
    } else if (product.family === "fivetran" && (!merger || date < merger)) continue;
    const applied: ProductEvent[] = [];
    const qualified: ProductEvent[] = [];
    for (const e of list) {
      const r = relation(date, e.date, e.precision, e.uncertainty ?? undefined);
      if (r === "after") applied.push(e);
      else if (r === "within") qualified.push(e);
    }
    if (applied.length === 0 && qualified.length === 0) continue;
    const sorted = [...applied].sort((a, b) => a.date.localeCompare(b.date));
    const withMaturity = [...sorted].reverse().find((e) => e.maturity);
    const withAccess = [...sorted].reverse().find((e) => e.access && e.access.length);
    states.push({
      product,
      name: nameAt(product, date),
      owner: ownerAt(product, date),
      maturity: withMaturity?.maturity ?? null,
      access: withAccess?.access ?? null,
      certainty: qualified.length ? "qualified" : "certain",
      applied: sorted,
      qualified,
      latest: sorted.at(-1) ?? null,
    });
  }
  return states.sort((a, b) => a.name.localeCompare(b.name));
}

// ---------- Ecosystem ----------

export const FLOW_LAYERS: LayerT[] = ["sources", "ingestion", "warehouse", "transformation", "bi"];
export const BAND_LAYERS: LayerT[] = ["orchestration", "quality", "metadata", "semantics", "reverse-etl", "open-table-compute", "ai-context"];

export const LAYER_LABELS: Record<LayerT, string> = {
  sources: "Sources",
  ingestion: "Ingestion",
  warehouse: "Warehouse and compute",
  transformation: "Transformation",
  bi: "Analysis and BI",
  orchestration: "Orchestration",
  quality: "Quality and observability",
  metadata: "Metadata and discovery",
  semantics: "Semantics and metrics",
  "reverse-etl": "Activation (reverse ETL)",
  "open-table-compute": "Open-table compute",
  "ai-context": "AI context and agents",
};

export interface PlacementState {
  placement: Placement;
  product: Product;
  name: string;
  owner: string | null;
  relationship: RelationshipT;
  certainty: "certain" | "qualified";
}

export function ecosystemAt(
  date: string,
  placements: Placement[],
  products: Map<string, Product>,
  events: ProductEvent[],
): Map<LayerT, PlacementState[]> {
  const merger = mergerClosedDate(events);
  const out = new Map<LayerT, PlacementState[]>();
  for (const p of placements) {
    const product = products.get(p.product);
    if (!product) throw new Error(`Placement refers to unknown product ${p.product}`);
    const r = relation(date, p.from, p.from_precision);
    if (r === "before") continue;
    if (p.to && date >= bounds(p.to, "day").earliest) continue;
    let relationship = p.relationship;
    const owner = ownerAt(product, date);
    if (merger && date >= merger && (product.family === "fivetran" || product.family === "dbt")) {
      relationship = product.family === "dbt" ? "dbt-owned" : "combined-family";
    }
    const list = out.get(p.layer) ?? [];
    list.push({
      placement: p,
      product,
      name: nameAt(product, date),
      owner,
      relationship,
      certainty: r === "within" ? "qualified" : "certain",
    });
    out.set(p.layer, list);
  }
  for (const list of out.values()) {
    list.sort((a, b) => {
      const rank = (s: PlacementState) => (s.relationship === "dbt-owned" ? 0 : s.relationship === "combined-family" ? 1 : 2);
      return rank(a) - rank(b) || a.name.localeCompare(b.name);
    });
  }
  return out;
}
