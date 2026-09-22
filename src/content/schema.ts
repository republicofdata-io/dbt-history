import { z } from "zod";

/**
 * Content schema for the dbt history app.
 *
 * Content lives as YAML under documentation/content/ and is validated against
 * these schemas at load time and in tests. Field names are the contract shared
 * with the research agent (see documentation/09-content-authoring.md); rename
 * a field here only together with that document and the content files.
 */

// ---------- Dates ----------

/** "YYYY-MM-DD", "YYYY-MM" or "YYYY". Precision says how much of it is asserted. */
export const DateString = z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, "expected YYYY, YYYY-MM or YYYY-MM-DD");
export const Precision = z.enum(["day", "month", "year"]);
export const Uncertainty = z.object({ earliest: DateString, latest: DateString }).nullable().optional();

// ---------- Sources and evidence ----------

export const Source = z.object({
  id: z.string().optional(),
  title: z.string(),
  url: z.string().url(),
  retrieved: DateString.optional(),
  supports: z.string().optional(),
});
export type Source = z.infer<typeof Source>;

export const EvidenceStatus = z.enum(["illustration", "captured"]);

export const CapturedDetails = z.object({
  runtime: z.string().nullable().optional(),
  adapter: z.string().nullable().optional(),
  capture_date: DateString.nullable().optional(),
  artifact_ref: z.string().nullable().optional(),
  adaptations: z.string().nullable().optional(),
});

export const WalkthroughEvidence = z.object({
  status: EvidenceStatus,
  review_date: DateString.optional(),
  limitations: z.string().optional(),
  captured: CapturedDetails.nullable().optional(),
  sources: z.array(z.string()).optional(), // source ids from the chapter
  source_refs: z.array(z.string()).optional(), // alias used by authored content
});

// ---------- Waffle Shop dataset ----------

export const Cell = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export type Cell = z.infer<typeof Cell>;

export const DataTable = z.object({
  name: z.string(),
  description: z.string().optional(),
  columns: z.array(z.object({ name: z.string(), type: z.string().optional() })),
  rows: z.array(z.array(Cell)),
});

const ExpectedRevenue = z.object({
  columns: z.array(z.string()).optional(),
  rows: z.array(z.array(Cell)).optional(),
  total_cents: z.number().optional(),
  arithmetic: z.string().optional(),
});

export const DatasetVariant = z.object({
  id: z.string(),
  extends: z.string().default("base"),
  description: z.string().optional(),
  extra_rows: z.array(z.object({ table: z.string(), rows: z.array(z.array(Cell)) })).default([]),
  change_events: z.array(z.record(z.string(), z.unknown())).default([]),
  expected_revenue: ExpectedRevenue.optional(),
}).passthrough();

export const Dataset = z.object({
  id: z.string(),
  title: z.string().optional(),
  provenance: z
    .object({ kind: z.string(), authored_on: DateString.optional(), historical_claim: z.boolean().default(false), note: z.string().optional() })
    .optional(),
  recurring_question: z.string().optional(),
  business_rules: z.array(z.object({ id: z.string(), statement: z.string() })).default([]),
  tables: z.array(DataTable),
  expected_revenue: ExpectedRevenue.optional(),
  derived_relations: z.array(z.object({ name: z.string(), definition: z.string() })).default([]),
  variants: z.array(DatasetVariant).default([]),
});
export type Dataset = z.infer<typeof Dataset>;

// ---------- Walkthrough steps ----------

export const CodeBlock = z.object({
  language: z.enum(["sql", "yaml", "jinja", "shell", "python", "text", "json", "toml"]).default("text"),
  filename: z.string().nullable().optional(),
  content: z.string(),
  highlight_lines: z.array(z.number().int().positive()).default([]),
  caption: z.string().nullable().optional(),
  /** Authoring note on the block's status (e.g. "authored executable syntax; illustration only"). */
  purpose: z.string().nullable().optional(),
});
export type CodeBlock = z.infer<typeof CodeBlock>;

export const ResultStatus = z.enum(["pass", "fail", "warn", "info"]).nullable().optional();

export const Diagram = z.object({
  nodes: z.array(z.object({ id: z.string(), label: z.string(), kind: z.string().optional() })),
  edges: z.array(z.object({ from: z.string(), to: z.string(), label: z.string().optional() })),
  highlight: z.array(z.string()).default([]),
});
export type Diagram = z.infer<typeof Diagram>;

export const StepState = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("table"),
    title: z.string().optional(),
    columns: z.array(z.string()),
    rows: z.array(z.array(Cell)),
    highlight_rows: z.array(z.number().int().nonnegative()).default([]),
    caption: z.string().nullable().optional(),
    provenance: z.string().nullable().optional(),
  }),
  z.object({
    kind: z.literal("result"),
    title: z.string().optional(),
    result_status: ResultStatus,
    message: z.string().optional(),
    columns: z.array(z.string()).optional(),
    rows: z.array(z.array(Cell)).optional(),
    caption: z.string().nullable().optional(),
    provenance: z.string().nullable().optional(),
  }),
  z.object({
    kind: z.literal("diagram"),
    title: z.string().optional(),
    diagram: Diagram,
    caption: z.string().nullable().optional(),
    provenance: z.string().nullable().optional(),
  }),
  z.object({
    kind: z.literal("comparison"),
    title: z.string().optional(),
    columns: z.array(z.string()),
    rows: z.array(z.array(Cell)),
    caption: z.string().nullable().optional(),
    provenance: z.string().nullable().optional(),
  }),
]);
export type StepState = z.infer<typeof StepState>;

export const Step = z.object({
  id: z.string(),
  title: z.string(),
  explanation: z.string(),
  code: z.array(CodeBlock).default([]),
  state: StepState.nullable().optional(),
  takeaway: z.string().nullable().optional(),
  evidence: z.array(z.string()).default([]),
  /** Which fixture phase the step's data shows (existing tables versus newly arrived inputs). */
  data_context: z.object({ dataset_variant: z.string().optional(), phase: z.string().optional() }).nullable().optional(),
});
export type Step = z.infer<typeof Step>;

/** Authored first screen: what this version lets you do and what the scenario is about. */
export const WalkthroughIntro = z.object({
  can_now: z.array(z.string()).default([]), // plain-language capabilities unlocked by this version
  scenario: z.string(), // what the Waffle Shop scenario is about
  outcome: z.string().nullable().optional(), // what the visitor will have seen by the last step
});

export const Walkthrough = z.object({
  id: z.string(),
  title: z.string().optional(),
  learning_objective: z.string(),
  context: z.string(),
  intro: WalkthroughIntro.nullable().optional(),
  dataset_variant: z.string().default("base"),
  steps: z.array(Step).min(1),
  evidence: WalkthroughEvidence,
  prepared_relations: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type Walkthrough = z.infer<typeof Walkthrough>;

// ---------- Release chapters ----------

export const MilestoneKind = z.enum(["package", "github_release", "patch", "announcement", "product_event", "snapshot", "origin"]);

export const Milestone = z.object({
  id: z.string(),
  kind: MilestoneKind,
  date: DateString,
  precision: Precision.default("day"),
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  version: z.string().nullable().optional(),
  evidence: z.array(z.string()).default([]),
  note: z.string().nullable().optional(),
  date_basis: z.string().nullable().optional(),
});
export type Milestone = z.infer<typeof Milestone>;

export const FeatureClaim = z.object({
  id: z.string(),
  summary: z.string(),
  introduced_in: z.string().nullable().optional(),
  adapter_constraints: z.string().nullable().optional(),
  evidence: z.array(z.string()).default([]),
  confidence: z.enum(["high", "qualified"]).default("high"),
  known_present_in: z.string().nullable().optional(),
  introduction_uncertainty: z.string().nullable().optional(),
});

export const ReleaseStatus = z.enum(["skeleton", "draft", "reviewed"]);

export const Release = z.object({
  id: z.string(),
  label: z.string(),
  title: z.string(),
  status: ReleaseStatus.optional(),
  /** Marks a chapter to dwell on; the sidebar index highlights it. */
  featured: z.boolean().default(false),
  era: z.enum(["origin", "0.x", "1.x", "2.x"]).optional(),
  lead: z.string(),
  problem_then: z.string().nullable().optional(),
  what_changed: z.array(FeatureClaim).default([]),
  in_practice: z.string().nullable().optional(),
  technical_detail: z.string().nullable().optional(),
  caveats: z.array(z.string()).default([]),
  milestones: z.array(Milestone).min(1),
  default_milestone: z.string().nullable().optional(),
  sources: z.array(Source.required({ id: true })).default([]),
  narrative_evidence: z.array(z.string()).default([]),
  review_scope: z.string().nullable().optional(),
  walkthrough: Walkthrough.nullable().optional(),
  authoring_notes: z.record(z.string(), z.unknown()).optional(),
});
export type Release = z.infer<typeof Release>;

/** A chapter without an explicit status is a draft once it carries a walkthrough. */
export function releaseStatus(r: Release): z.infer<typeof ReleaseStatus> {
  return r.status ?? (r.walkthrough ? "draft" : "skeleton");
}

export function walkthroughSourceIds(w: Walkthrough): string[] {
  return [...(w.evidence.sources ?? []), ...(w.evidence.source_refs ?? [])];
}

// ---------- Product catalogue ----------

export const ProductType = z.enum(["engine", "distribution", "platform", "capability", "product", "service", "company"]);

export const Interval = z.object({
  from: DateString,
  from_precision: Precision.default("day"),
  to: DateString.nullable().default(null),
  to_precision: Precision.default("day"),
  // Qualifications authored on name and owner intervals. Rendered, never stripped.
  confidence: z.enum(["high", "qualified"]).nullable().optional(),
  note: z.string().nullable().optional(),
  date_basis: z.string().nullable().optional(),
  to_basis: z.string().nullable().optional(),
  uncertainty: Uncertainty,
  transition_uncertainty: Uncertainty,
});
export type Interval = z.infer<typeof Interval>;

export const Licence = z.object({ name: z.string(), category: z.string().nullable().optional() });
export type Licence = z.infer<typeof Licence>;

export const Product = z.object({
  id: z.string(),
  type: ProductType,
  parent: z.string().nullable().default(null),
  names: z.array(Interval.extend({ name: z.string() })).min(1),
  owners: z.array(Interval.extend({ owner: z.string() })).default([]),
  roles: z.array(z.string()).default([]),
  description: z.string().nullable().optional(),
  family: z.enum(["dbt", "fivetran", "external"]).default("external"),
  /** When set, the product is listed in the catalogue only inside this interval. */
  catalogue_membership: z
    .object({
      from: DateString,
      to: DateString.nullable().default(null),
      /** Announced acquisition or agreement that precedes membership; not completed ownership. */
      pending_from: DateString.nullable().optional(),
      uncertainty: Uncertainty,
    })
    .nullable()
    .optional(),
  sources: z.array(Source).default([]),
  license: Licence.nullable().optional(),
  commercial_availability_note: z.string().nullable().optional(),
  known_since_basis: z.string().nullable().optional(),
  ownership_note: z.string().nullable().optional(),
});
export type Product = z.infer<typeof Product>;

export const EventKind = z.enum([
  "launch",
  "rename",
  "maturity",
  "pricing",
  "licence",
  "acquisition_agreed",
  "acquisition_closed",
  "merger_announced",
  "merger_closed",
  "retirement_announced",
  "retired",
  "ownership",
  "note",
]);
export const Maturity = z.enum(["preview", "beta", "ga", "maintenance", "retiring", "retired"]);
export const Access = z.enum(["free-local", "open-source-apache", "source-available", "requires-login", "paid-plan", "proprietary"]);

export const ProductEvent = z.object({
  id: z.string(),
  product: z.string(),
  kind: EventKind,
  date: DateString,
  precision: Precision.default("day"),
  uncertainty: Uncertainty,
  maturity: Maturity.nullable().optional(),
  // Authored content may give one access category or a list; normalise to a list.
  access: z
    .union([z.array(Access), Access])
    .nullable()
    .optional()
    .transform((v) => (v == null ? v : Array.isArray(v) ? v : [v])),
  summary: z.string(),
  sources: z.array(Source).default([]),
  affects_catalogue: z.boolean().default(true),
  transaction_type: z.string().nullable().optional(),
  event_subtype: z.string().nullable().optional(),
  date_basis: z.string().nullable().optional(),
  // Qualifications kept separate from maturity and access.
  license: Licence.nullable().optional(),
  commercial_conditions: z.array(z.string()).default([]),
  availability: z.string().nullable().optional(), // e.g. announced-not-available | alpha | existing-installations-only
  availability_scope: z.enum(["public", "private"]).nullable().optional(),
  maturity_label: z.string().nullable().optional(),
  /** Replaces the carried maturity outright (e.g. the June 2026 engine alpha). */
  state_override: z.object({ maturity: Maturity.nullable(), maturity_label: z.string().nullable().optional() }).nullable().optional(),
  planned_retirement: z.object({ date: DateString, precision: Precision.default("day"), status: z.string().nullable().optional() }).nullable().optional(),
  price_change_asserted: z.boolean().nullable().optional(),
  ledger_records: z.array(z.string()).default([]),
});
export type ProductEvent = z.infer<typeof ProductEvent>;

// ---------- Ecosystem ----------

export const Layer = z.enum([
  "sources",
  "ingestion",
  "warehouse",
  "transformation",
  "bi",
  "orchestration",
  "quality",
  "metadata",
  "semantics",
  "reverse-etl",
  "open-table-compute",
  "ai-context",
]);
export type Layer = z.infer<typeof Layer>;

export const Relationship = z.enum(["complement", "partial-substitute", "integration", "infrastructure", "dbt-owned", "combined-family"]);

export const Placement = z.object({
  product: z.string(),
  layer: Layer,
  from: DateString,
  from_precision: Precision.default("day"),
  to: DateString.nullable().default(null),
  relationship: Relationship,
  rationale: z.string(),
  maturity: Maturity.nullable().optional(),
  sources: z.array(Source).default([]),
  /** External players may carry their product definition inline. */
  product_definition: z.lazy(() => Product).nullable().optional(),
});
export type Placement = z.infer<typeof Placement>;

/** Either { products, placements } or a bare list of placements (products then live in a separate file or the catalogue). */
export const Ecosystem = z
  .union([z.object({ products: z.array(Product).default([]), placements: z.array(Placement) }), z.array(Placement)])
  .transform((v) => (Array.isArray(v) ? { products: [], placements: v } : v));
