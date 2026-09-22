import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import EvidenceDrawer, { SourceList } from "@/components/EvidenceDrawer";
import { productEvents, products } from "@/content/load";
import { catalogueAt, eventLabel, intervalQualified, nameAt, type ProductState } from "@/content/derive";
import { formatDate } from "@/content/dates";
import type { ProductEvent } from "@/content/schema";
import type { HistoryState } from "./state";

const MATURITY: Record<string, { label: string; variant: "good" | "warn" | "accent" | "default" | "bad" }> = {
  ga: { label: "GA", variant: "good" },
  beta: { label: "Beta", variant: "warn" },
  preview: { label: "Preview", variant: "warn" },
  maintenance: { label: "Maintenance", variant: "default" },
  retiring: { label: "Retiring", variant: "bad" },
  retired: { label: "Retired", variant: "bad" },
};

const AVAILABILITY: Record<string, { label: string; variant: "warn" | "bad" | "default" }> = {
  "announced-not-available": { label: "Announced, not available", variant: "bad" },
  alpha: { label: "Alpha", variant: "warn" },
  "existing-installations-only": { label: "Existing installations only", variant: "warn" },
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
  { id: "platform", label: "Hosted platform and its capabilities", match: (s) => s.product.type === "platform" || s.product.type === "capability" },
  { id: "products", label: "Products and services", match: (s) => s.product.type === "product" || s.product.type === "service" },
  { id: "companies", label: "Companies and acquisitions", match: (s) => s.product.type === "company" },
];

function EventRow({ e, qualified }: { e: ProductEvent; qualified: boolean }) {
  return (
    <li className="border-l-2 border-border pl-3">
      <p className="font-mono text-xs text-muted-foreground">
        {formatDate(e.date, e.precision)} · {eventLabel(e)}
        {e.date_basis ? ` · ${e.date_basis}` : ""}
        {e.uncertainty ? ` · between ${formatDate(e.uncertainty.earliest)} and ${formatDate(e.uncertainty.latest)}` : ""}
        {qualified && " · anchor falls inside this event's date range"}
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

function Card({ s, date }: { s: ProductState; date: string }) {
  const m = s.maturity ? MATURITY[s.maturity] : null;
  const av = s.availability ? AVAILABILITY[s.availability] : null;
  const parent = s.product.parent ? products.get(s.product.parent) : null;
  const ownerQualified = intervalQualified(s.ownerInterval, date);
  const scopeLabel = s.availabilityScope && (s.maturity === "beta" || s.maturity === "preview") ? `${s.availabilityScope} ${MATURITY[s.maturity].label.toLowerCase()}` : null;
  return (
    <li className={"flex flex-col gap-2 rounded-lg border p-3 " + (s.pending ? "border-dashed border-warn/50" : s.product.family === "dbt" ? "border-border" : "border-dashed border-border")}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-semibold">{s.name}</h3>
          <p className="provenance">
            {s.product.type}
            {parent ? ` · part of ${nameAt(parent, date)}` : ""}
            {s.product.roles.length ? ` · ${s.product.roles.join(", ")}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {s.pending && <Badge variant="warn">pending, not yet in the catalogue</Badge>}
          {m && !scopeLabel && <Badge variant={m.variant}>{m.label}</Badge>}
          {scopeLabel && <Badge variant="warn">{scopeLabel}</Badge>}
          {s.maturityLabel && <Badge variant="warn">{s.maturityLabel}</Badge>}
          {av && <Badge variant={av.variant}>{av.label}</Badge>}
          {!m && !s.maturityLabel && !av && <Badge>maturity not established</Badge>}
          {s.certainty === "qualified" && <Badge variant="warn">date qualified</Badge>}
          {s.product.family === "fivetran" && <Badge>Fivetran lineage</Badge>}
        </div>
      </div>
      {s.product.description && <p className="text-sm text-muted-foreground">{s.product.description.trim()}</p>}
      {s.nameInterval?.note && <p className="text-xs text-muted-foreground">Name: {s.nameInterval.note}</p>}
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
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
          {ownerQualified && <Badge variant="warn" className="ml-1">qualified</Badge>}
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
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {s.latest ? (
            <>
              Latest event: {formatDate(s.latest.date, s.latest.precision)} · {eventLabel(s.latest)}
            </>
          ) : (
            "No dated event applied yet."
          )}
        </span>
        <EvidenceDrawer title={s.name} description={`Events on or before ${formatDate(date)}.`} trigger={<button type="button" className="shrink-0 underline-offset-4 hover:text-foreground hover:underline">Source</button>}>
          {s.product.ownership_note && <p className="text-xs text-muted-foreground">{s.product.ownership_note}</p>}
          {s.product.commercial_availability_note && <p className="text-xs text-muted-foreground">{s.product.commercial_availability_note}</p>}
          <ol className="flex flex-col gap-4 text-sm">
            {[...s.applied, ...s.qualified].map((e) => (
              <EventRow key={e.id} e={e} qualified={s.qualified.includes(e)} />
            ))}
          </ol>
          {s.product.sources.length > 0 && (
            <div>
              <p className="kicker mb-2">Identity sources</p>
              <SourceList sources={s.product.sources} />
            </div>
          )}
        </EvidenceDrawer>
      </div>
    </li>
  );
}

/** Products and capabilities at the anchor date, computed from the event ledger. */
export default function CatalogueTab({ state }: { state: HistoryState }) {
  const date = state.anchor.date;
  const states = useMemo(() => catalogueAt(date, products, productEvents), [date]);
  const company = states.find((s) => s.product.id === "dbt-labs");
  const members = states.filter((s) => !s.pending);
  const pending = states.filter((s) => s.pending);
  return (
    <div className="flex flex-col gap-6">
      <p className="text-base text-muted-foreground">
        What <span className="text-foreground">{company?.name ?? "the company"}</span> offered on{" "}
        <span className="text-foreground">{formatDate(date)}</span>, under the names and maturity of that day. Later launches and renames are not shown.
      </p>
      {GROUPS.map((g) => {
        const items = members.filter(g.match);
        if (!items.length) return null;
        return (
          <section key={g.id}>
            <h2 className="kicker mb-3">{g.label}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((s) => (
                <Card key={s.product.id} s={s} date={date} />
              ))}
            </ul>
          </section>
        );
      })}
      {pending.length > 0 && (
        <section>
          <h2 className="kicker mb-3">Announced or agreed, not yet part of the catalogue</h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {pending.map((s) => (
              <Card key={s.product.id} s={s} date={date} />
            ))}
          </ul>
        </section>
      )}
      <p className="provenance">
        Access, licence and maturity are separate dimensions; "not established" means the research did not settle it, not free or GA. "Date qualified" means the anchor falls inside a period whose exact day is not established.
      </p>
    </div>
  );
}
