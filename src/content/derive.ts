import type { z } from "zod";
import { bounds, relation } from "./dates";
import type { Interval, Layer, Licence, Maturity, Milestone, Placement, Product, ProductEvent, Release, Relationship } from "./schema";

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

export function nameIntervalAt(product: Product, date: string): (Interval & { name: string }) | undefined {
  return activeInterval(product.names, date);
}

export function ownerAt(product: Product, date: string): string | null {
  return activeInterval(product.owners, date)?.owner ?? null;
}

export function ownerIntervalAt(product: Product, date: string): (Interval & { owner: string }) | undefined {
  return activeInterval(product.owners, date);
}

/** True when an interval's own qualification covers the date (its start is uncertain around the anchor). */
export function intervalQualified(i: Interval | undefined, date: string): boolean {
  if (!i) return false;
  if (i.confidence === "qualified") return true;
  const u = i.uncertainty ?? i.transition_uncertainty;
  if (u && date >= u.earliest && date < u.latest) return true;
  return relation(date, i.from, i.from_precision) === "within";
}

// ---------- Catalogue ----------

export interface ProductState {
  product: Product;
  name: string;
  nameInterval?: Interval & { name: string };
  owner: string | null;
  ownerInterval?: Interval & { owner: string };
  maturity: MaturityT | null;
  /** Free-text maturity qualification (e.g. "alpha", or an explicit "not established"). */
  maturityLabel: string | null;
  /** announced-not-available | alpha | existing-installations-only | null (no claim). */
  availability: string | null;
  availabilityScope: "public" | "private" | null;
  access: AccessT[] | null;
  licence: Licence | null;
  commercialConditions: string[];
  plannedRetirement: NonNullable<ProductEvent["planned_retirement"]> | null;
  /** "qualified" when the anchor falls inside an uncertain event interval. */
  certainty: "certain" | "qualified";
  /** Product is announced or agreed but not yet a member of the catalogue. */
  pending: boolean;
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
    let pending = false;
    if (product.catalogue_membership) {
      const m = product.catalogue_membership;
      const start = bounds(m.from, "day").earliest;
      if (date < start) {
        // Announced or agreed, not yet a member: shown separately, never as owned.
        if (m.pending_from && date >= bounds(m.pending_from, "day").earliest) pending = true;
        else continue;
      }
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

    // Walk events in order. A null maturity leaves the carried value unchanged;
    // an explicit state_override replaces it; labels and availability carry the same way.
    let maturity: MaturityT | null = null;
    let maturityLabel: string | null = null;
    let availability: string | null = null;
    let availabilityScope: "public" | "private" | null = null;
    let access: AccessT[] | null = null;
    let licence: Licence | null = null;
    let commercialConditions: string[] = [];
    let plannedRetirement: ProductState["plannedRetirement"] = null;
    for (const e of sorted) {
      if (e.state_override) {
        maturity = e.state_override.maturity;
        maturityLabel = e.state_override.maturity_label ?? null;
      } else if (e.maturity) {
        maturity = e.maturity;
        maturityLabel = e.maturity_label ?? null;
      } else if (e.maturity_label) {
        maturityLabel = e.maturity_label;
      }
      if (e.availability !== undefined && e.availability !== null) availability = e.availability;
      else if (e.maturity) availability = null; // a dated maturity supersedes an earlier "announced" state
      if (e.availability_scope) availabilityScope = e.availability_scope;
      if (e.access && e.access.length) access = e.access;
      if (e.license) licence = e.license;
      if (e.commercial_conditions.length) commercialConditions = e.commercial_conditions;
      if (e.planned_retirement) plannedRetirement = e.planned_retirement;
    }
    const nameInterval = nameIntervalAt(product, date);
    const ownerInterval = ownerIntervalAt(product, date);
    const membershipQualified =
      !!product.catalogue_membership?.uncertainty &&
      date >= product.catalogue_membership.uncertainty.earliest &&
      date < product.catalogue_membership.uncertainty.latest;
    states.push({
      product,
      name: nameInterval?.name ?? product.id,
      nameInterval,
      owner: ownerInterval?.owner ?? null,
      ownerInterval,
      maturity,
      maturityLabel,
      availability,
      availabilityScope,
      access,
      licence: licence ?? product.license ?? null,
      commercialConditions,
      plannedRetirement,
      certainty: qualified.length || membershipQualified || intervalQualified(ownerInterval, date) ? "qualified" : "certain",
      pending,
      applied: sorted,
      qualified,
      latest: sorted.at(-1) ?? null,
    });
  }
  return states.sort((a, b) => a.name.localeCompare(b.name));
}

/** Human label for an event, honouring subtype and transaction type over the generic kind. */
export function eventLabel(e: ProductEvent): string {
  if (e.kind === "acquisition_closed" && e.transaction_type === "merger") return "merger completed";
  if (e.kind === "acquisition_agreed" && e.transaction_type === "merger") return "merger announced";
  if (e.kind === "pricing" && e.event_subtype === "licence-change") return "licence change";
  if (e.event_subtype) return e.event_subtype.replace(/-/g, " ");
  return e.kind.replace(/_/g, " ");
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

// ---------- What changed since the previous chapter ----------

export interface CatalogueChange {
  kind: "new" | "changed";
  notes: string[];
}

/** Products new or changed since an earlier catalogue snapshot, keyed by product id. */
export function diffCatalogue(previous: ProductState[], current: ProductState[]): Map<string, CatalogueChange> {
  const before = new Map(previous.map((s) => [s.product.id, s]));
  const out = new Map<string, CatalogueChange>();
  for (const s of current) {
    const p = before.get(s.product.id);
    if (!p) {
      out.set(s.product.id, { kind: "new", notes: [s.pending ? "announced or agreed" : "enters the catalogue"] });
      continue;
    }
    const notes: string[] = [];
    if (p.name !== s.name) notes.push(`was ${p.name}`);
    if (p.maturity !== s.maturity && s.maturity) notes.push(`now ${s.maturity === "ga" ? "GA" : s.maturity}`);
    if (p.availability !== s.availability && s.availability) notes.push(s.availability.replace(/-/g, " "));
    if (p.owner !== s.owner && s.owner) notes.push(`owner ${s.owner}`);
    if (p.pending && !s.pending) notes.push("now in the catalogue");
    if (notes.length) out.set(s.product.id, { kind: "changed", notes });
  }
  return out;
}

export interface EcosystemChange {
  added: PlacementState[];
  removed: PlacementState[];
  renamed: { now: PlacementState; from: string }[];
}

/** Players added to, removed from, or renamed on the chart since an earlier snapshot. */
export function diffEcosystem(previous: Map<LayerT, PlacementState[]>, current: Map<LayerT, PlacementState[]>): EcosystemChange {
  const key = (s: PlacementState) => `${s.placement.layer}/${s.product.id}`;
  const before = new Map([...previous.values()].flat().map((s) => [key(s), s]));
  const now = new Map([...current.values()].flat().map((s) => [key(s), s]));
  const added = [...now.values()].filter((s) => !before.has(key(s)));
  const removed = [...before.values()].filter((s) => !now.has(key(s)));
  const renamed = [...now.values()].filter((s) => before.has(key(s)) && before.get(key(s))!.name !== s.name).map((s) => ({ now: s, from: before.get(key(s))!.name }));
  return { added, removed, renamed };
}
