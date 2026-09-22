import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import EvidenceDrawer, { SourceList } from "@/components/EvidenceDrawer";
import { productEvents, products, releases } from "@/content/load";
import { catalogueAt, diffCatalogue, eventLabel, nameAt, ownerAt, resolveAnchor, type CatalogueChange, type ProductState } from "@/content/derive";
import { formatDate } from "@/content/dates";
import type { ProductEvent } from "@/content/schema";
import type { HistoryState } from "./state";
import { cn } from "@/lib/utils";

const MATURITY: Record<string, { label: string; variant: "good" | "warn" | "accent" | "default" | "bad" }> = {
  ga: { label: "GA", variant: "good" },
  beta: { label: "beta", variant: "warn" },
  preview: { label: "preview", variant: "warn" },
  maintenance: { label: "maintenance", variant: "default" },
  retiring: { label: "retiring", variant: "bad" },
  retired: { label: "retired", variant: "bad" },
};

const AVAILABILITY: Record<string, { label: string; variant: "warn" | "bad" | "default" }> = {
  "announced-not-available": { label: "announced, not available", variant: "bad" },
  alpha: { label: "alpha", variant: "warn" },
  "existing-installations-only": { label: "existing installations only", variant: "warn" },
};

const ACCESS: Record<string, string> = {
  "free-local": "free local use",
  "open-source-apache": "Apache 2.0",
  "source-available": "source available",
  "requires-login": "requires login",
  "paid-plan": "paid plan",
  proprietary: "proprietary licence",
};

const GROUPS: { id: string; label: string; match: (s: ProductState) => boolean }[] = [
  { id: "engines", label: "Engines and distributions", match: (s) => s.product.type === "engine" || s.product.type === "distribution" },
  { id: "platform", label: "Hosted platform and capabilities", match: (s) => s.product.type === "platform" || s.product.type === "capability" },
  { id: "products", label: "Products and services", match: (s) => s.product.type === "product" || s.product.type === "service" },
  { id: "companies", label: "Companies and acquisitions", match: (s) => s.product.type === "company" },
];

/** The compact maturity/availability pill shown in the row; the drawer has the rest. */
function StatePill({ s }: { s: ProductState }) {
  const m = s.maturity ? MATURITY[s.maturity] : null;
  const av = s.availability ? AVAILABILITY[s.availability] : null;
  if (av) return <Badge variant={av.variant}>{av.label}</Badge>;
  if (m) return <Badge variant={m.variant}>{s.availabilityScope && (s.maturity === "beta" || s.maturity === "preview") ? `${s.availabilityScope} ${m.label}` : m.label}</Badge>;
  if (s.maturityLabel) return <Badge variant="warn">{s.maturityLabel.split(";")[0]}</Badge>;
  // No dated maturity claim in the research: show nothing rather than a research note.
  return null;
}

function EventRow({ e, qualified }: { e: ProductEvent; qualified: boolean }) {
  return (
    <li className="border-l-2 border-border pl-3">
      <p className="text-xs text-muted-foreground">
        {formatDate(e.date, e.precision)} · {eventLabel(e)}
        {e.date_basis ? ` · ${e.date_basis}` : ""}
        {e.uncertainty ? ` · between ${formatDate(e.uncertainty.earliest)} and ${formatDate(e.uncertainty.latest)}` : ""}
        {qualified && " · the exact day within this period is not established"}
      </p>
      <p className="mt-1">{e.summary.trim()}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {e.maturity && <Badge variant={MATURITY[e.maturity]?.variant ?? "default"}>{MATURITY[e.maturity]?.label ?? e.maturity}</Badge>}
        {e.state_override && <Badge variant="warn">override: {e.state_override.maturity ?? e.state_override.maturity_label ?? "none"}</Badge>}
        {e.maturity_label && !e.state_override && <Badge variant="warn">{e.maturity_label}</Badge>}
        {e.availability && <Badge variant={AVAILABILITY[e.availability]?.variant ?? "default"}>{AVAILABILITY[e.availability]?.label ?? e.availability}</Badge>}
        {e.availability_scope && <Badge>{e.availability_scope} scope</Badge>}
        {e.license && <Badge>licence: {e.license.name}</Badge>}
        {(e.access ?? []).map((a) => (
          <Badge key={a}>{ACCESS[a] ?? a}</Badge>
        ))}
        {e.price_change_asserted === false && <Badge>no price change asserted</Badge>}
      </div>
      {e.commercial_conditions.length > 0 && <p className="provenance mt-1">conditions: {e.commercial_conditions.join("; ")}</p>}
      <div className="mt-2">
        <SourceList sources={e.sources} />
      </div>
    </li>
  );
}

/** One compact row per product; everything else lives in its drawer. */
function ChangeBadge({ change }: { change?: CatalogueChange }) {
  if (!change) return null;
  return (
    <Badge variant={change.kind === "new" ? "accent" : "warn"} className={change.kind === "new" ? "bg-highlight-wash" : "bg-gold-wash"} title={change.notes.join("; ")}>
      {change.kind === "new" ? "new" : "changed"}
    </Badge>
  );
}

function ProductRow({ s, date, change }: { s: ProductState; date: string; change?: CatalogueChange }) {
  const parent = s.product.parent ? products.get(s.product.parent) : null;
  return (
    <li className="border-t border-border py-2 first:border-0 first:pt-0">
      <EvidenceDrawer
        title={s.name}
        description={`${s.product.type}${parent ? ` · part of ${nameAt(parent, date)}` : ""} · as of ${formatDate(date)}`}
        trigger={
          <button type="button" className="flex w-full items-start justify-between gap-2 text-left hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold leading-tight">{s.name}</span>
              {s.product.roles.length > 0 && <span className="provenance block truncate">{s.product.roles.join(", ")}</span>}
            </span>
            <span className="flex shrink-0 flex-wrap justify-end gap-1">
              <ChangeBadge change={change} />
              <StatePill s={s} />
              {s.pending && <Badge variant="warn">pending</Badge>}
            </span>
          </button>
        }
      >
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex flex-wrap gap-1">
            {change && <Badge variant={change.kind === "new" ? "accent" : "warn"}>{change.kind === "new" ? "new since the previous chapter" : `since the previous chapter: ${change.notes.join("; ")}`}</Badge>}
            <StatePill s={s} />
            {s.pending && <Badge variant="warn">announced or agreed, not yet in the catalogue</Badge>}
            {s.product.family === "fivetran" && <Badge>Fivetran lineage</Badge>}
          </div>
          {s.product.description && <p className="text-muted-foreground">{s.product.description.trim()}</p>}
          {s.nameInterval?.note && <p className="text-xs text-muted-foreground">Name: {s.nameInterval.note}</p>}
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
            <dt className="text-muted-foreground">Access</dt>
            <dd className="flex flex-wrap gap-1">{s.access?.length ? s.access.map((a) => <Badge key={a}>{ACCESS[a] ?? a}</Badge>) : <span className="text-muted-foreground">not established</span>}</dd>
            <dt className="text-muted-foreground">Licence</dt>
            <dd>{s.licence ? `${s.licence.name}${s.licence.category ? ` (${s.licence.category})` : ""}` : <span className="text-muted-foreground">not established</span>}</dd>
            {s.commercialConditions.length > 0 && (
              <>
                <dt className="text-muted-foreground">Conditions</dt>
                <dd>{s.commercialConditions.join("; ")}</dd>
              </>
            )}
            <dt className="text-muted-foreground">Owner</dt>
            <dd>
              {s.owner ?? <span className="text-muted-foreground">not established</span>}
              {s.ownerInterval?.note && <span className="block text-muted-foreground">{s.ownerInterval.note}</span>}
              {s.ownerInterval?.uncertainty && (
                <span className="block text-muted-foreground">
                  transition between {formatDate(s.ownerInterval.uncertainty.earliest)} and {formatDate(s.ownerInterval.uncertainty.latest)}
                </span>
              )}
            </dd>
            {s.plannedRetirement && (
              <>
                <dt className="text-muted-foreground">Retirement</dt>
                <dd>
                  planned {formatDate(s.plannedRetirement.date, s.plannedRetirement.precision)}
                  {s.plannedRetirement.status ? ` (${s.plannedRetirement.status.replace(/-/g, " ")})` : ""}
                </dd>
              </>
            )}
            {s.product.known_since_basis && (
              <>
                <dt className="text-muted-foreground">Known since</dt>
                <dd>{s.product.known_since_basis}</dd>
              </>
            )}
          </dl>
          {s.product.ownership_note && <p className="text-xs text-muted-foreground">{s.product.ownership_note}</p>}
          {s.product.commercial_availability_note && <p className="text-xs text-muted-foreground">{s.product.commercial_availability_note}</p>}
          <div>
            <p className="kicker mb-2">Dated events up to {formatDate(date)}</p>
            <ol className="flex flex-col gap-4">
              {[...s.applied, ...s.qualified].map((e) => (
                <EventRow key={e.id} e={e} qualified={s.qualified.includes(e)} />
              ))}
            </ol>
          </div>
          {s.product.sources.length > 0 && (
            <div>
              <p className="kicker mb-2">Identity sources</p>
              <SourceList sources={s.product.sources} />
            </div>
          )}
        </div>
      </EvidenceDrawer>
    </li>
  );
}

/** One product group column; wide groups split into two text columns so the panel still fits a screen. */
function Group({ id, items, date, dashed, label, columns = 1, changes }: { id: string; items: ProductState[]; date: string; dashed?: boolean; label?: string; columns?: 1 | 2 | 3; changes: Map<string, CatalogueChange> }) {
  return (
    <section className={cn("flex min-h-0 flex-col overflow-y-auto rounded-lg border border-border bg-card p-3.5", dashed && "border-dashed bg-transparent")}>
      <h3 className="mb-2.5 text-xs font-medium text-muted-foreground">{label ?? GROUPS.find((g) => g.id === id)?.label}</h3>
      <ul className={cn(columns === 2 && "columns-2 gap-x-5 [&>li]:break-inside-avoid", columns === 3 && "columns-3 gap-x-5 [&>li]:break-inside-avoid")}>
        {items.map((s) => (
          <ProductRow key={s.product.id} s={s} date={date} change={changes.get(s.product.id)} />
        ))}
      </ul>
    </section>
  );
}

/**
 * The catalogue panel from the concept: company bar, then product groups as
 * columns of compact rows. Details open in a drawer so the panel fits a screen.
 */
export default function CatalogueTab({ state }: { state: HistoryState }) {
  const date = state.anchor.date;
  const states = useMemo(() => catalogueAt(date, products, productEvents), [date]);
  // What is new or changed since the previous chapter opened.
  const previousRelease = state.index > 0 ? releases[state.index - 1] : null;
  const changes = useMemo(() => {
    if (!previousRelease) return new Map<string, CatalogueChange>();
    const prev = catalogueAt(resolveAnchor(previousRelease).date, products, productEvents);
    return diffCatalogue(prev, states);
  }, [previousRelease, states]);
  const newOnes = states.filter((s) => changes.get(s.product.id)?.kind === "new");
  const changedOnes = states.filter((s) => changes.get(s.product.id)?.kind === "changed");
  // Name the company from its name history so it reads correctly before its first dated event.
  const companyProduct = products.get("dbt-labs");
  const companyName = companyProduct ? nameAt(companyProduct, date) : "dbt Labs";
  const companyOwner = companyProduct ? ownerAt(companyProduct, date) : null;
  const currentName = companyProduct?.names.at(-1)?.name ?? "dbt Labs";
  const members = states.filter((s) => !s.pending);
  const pending = states.filter((s) => s.pending);
  const byId = Object.fromEntries(GROUPS.map((g) => [g.id, members.filter(g.match)])) as Record<string, ProductState[]>;
  // The platform group grows to 24 capabilities by 2026; split it so the panel still fits one screen.
  const platformColumns: 1 | 2 | 3 = byId.platform.length > 16 ? 3 : byId.platform.length > 8 ? 2 : 1;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5 rounded-lg bg-highlight-wash px-4 py-2.5 text-[13px]">
        <span>
          <strong>{companyName}</strong>
          <span className="text-muted-foreground">
            {" "}
            · the company behind dbt{companyName !== currentName ? `, later ${currentName}` : ""}
          </span>
        </span>
        <small className="text-[11px] text-muted-foreground">
          what it offered on {formatDate(date)}
          {companyOwner && companyOwner !== "Independent company before the merger" ? ` · ${companyOwner}` : ""}
        </small>
      </div>
      {previousRelease && (
        <p className="mb-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Since {previousRelease.label}:</span>{" "}
          {newOnes.length === 0 && changedOnes.length === 0 && "no change in the catalogue."}
          {newOnes.length > 0 && (
            <>
              new <span className="text-foreground">{newOnes.map((s) => s.name).join(", ")}</span>
              {changedOnes.length > 0 ? "; " : "."}
            </>
          )}
          {changedOnes.length > 0 && (
            <>
              changed <span className="text-foreground">{changedOnes.map((s) => `${s.name} (${changes.get(s.product.id)!.notes.join(", ")})`).join(", ")}</span>.
            </>
          )}
        </p>
      )}
      <div className={cn("grid min-h-0 flex-1 gap-3 overflow-y-auto sm:grid-cols-2", platformColumns === 3 ? "xl:grid-cols-[1fr_3fr_1fr]" : platformColumns === 2 ? "xl:grid-cols-[1fr_2fr_1fr]" : "xl:grid-cols-3")}>
        <div className="flex min-h-0 flex-col gap-3">
          {byId.engines.length > 0 && <Group id="engines" items={byId.engines} date={date} changes={changes} />}
          {byId.companies.length > 0 && <Group id="companies" items={byId.companies} date={date} changes={changes} />}
        </div>
        {byId.platform.length > 0 && <Group id="platform" items={byId.platform} date={date} columns={platformColumns} changes={changes} />}
        <div className="flex min-h-0 flex-col gap-3">
          {byId.products.length > 0 && <Group id="products" items={byId.products} date={date} changes={changes} />}
          {pending.length > 0 && <Group id="pending" items={pending} date={date} dashed label="Announced or agreed, not yet in the catalogue" changes={changes} />}
        </div>
      </div>
      <p className="mt-3 border-l-[3px] border-accent pl-3 text-[11px] text-muted-foreground">
        Names, maturity and access as of the selected date; later launches and renames are not shown. Select a product for its dated events and sources.
      </p>
    </div>
  );
}
