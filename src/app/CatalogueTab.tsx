import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import EvidenceDrawer, { SourceList } from "@/components/EvidenceDrawer";
import { productEvents, products } from "@/content/load";
import { catalogueAt, nameAt, type ProductState } from "@/content/derive";
import { formatDate } from "@/content/dates";
import type { HistoryState } from "./state";

const MATURITY: Record<string, { label: string; variant: "good" | "warn" | "accent" | "default" | "bad" }> = {
  ga: { label: "GA", variant: "good" },
  beta: { label: "Beta", variant: "warn" },
  preview: { label: "Preview", variant: "warn" },
  maintenance: { label: "Maintenance", variant: "default" },
  retiring: { label: "Retiring", variant: "bad" },
  retired: { label: "Retired", variant: "bad" },
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

function Card({ s, date }: { s: ProductState; date: string }) {
  const m = s.maturity ? MATURITY[s.maturity] : null;
  const parent = s.product.parent ? products.get(s.product.parent) : null;
  return (
    <li className={"flex flex-col gap-2 rounded-lg border p-3 " + (s.product.family === "dbt" ? "border-border" : "border-dashed border-border")}>
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
          {m && <Badge variant={m.variant}>{m.label}</Badge>}
          {s.certainty === "qualified" && <Badge variant="warn">date qualified</Badge>}
          {s.product.family === "fivetran" && <Badge>Fivetran lineage</Badge>}
        </div>
      </div>
      {s.product.description && <p className="text-sm text-muted-foreground">{s.product.description}</p>}
      <div className="flex flex-wrap gap-1">
        {(s.access ?? []).map((a) => (
          <Badge key={a}>{ACCESS[a] ?? a}</Badge>
        ))}
        {s.owner && <Badge>owner: {s.owner}</Badge>}
      </div>
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {s.latest ? (
            <>
              Latest event: {formatDate(s.latest.date, s.latest.precision)} · {s.latest.summary.trim().split(". ")[0].replace(/\.$/, "")}.
            </>
          ) : (
            "No dated event applied yet."
          )}
        </span>
        <EvidenceDrawer
          title={s.name}
          description={`Events on or before ${formatDate(date)}.`}
          trigger={<button type="button" className="shrink-0 underline-offset-4 hover:text-foreground hover:underline">Source</button>}
        >
          <ol className="flex flex-col gap-4 text-sm">
            {[...s.applied, ...s.qualified].map((e) => (
              <li key={e.id} className="border-l-2 border-border pl-3">
                <p className="font-mono text-xs text-muted-foreground">
                  {formatDate(e.date, e.precision)} · {e.kind.replace("_", " ")}
                  {s.qualified.includes(e) && " · anchor falls inside this event's date range"}
                </p>
                <p className="mt-1">{e.summary}</p>
                <div className="mt-2">
                  <SourceList sources={e.sources} />
                </div>
              </li>
            ))}
          </ol>
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
  return (
    <div className="flex flex-col gap-6">
      <p className="text-base text-muted-foreground">
        What <span className="text-foreground">{company?.name ?? "the company"}</span> offered on{" "}
        <span className="text-foreground">{formatDate(date)}</span>, under the names and maturity of that day. Later launches and renames are not shown.
      </p>
      {GROUPS.map((g) => {
        const items = states.filter(g.match);
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
      <p className="provenance">
        Availability and licence are separate dimensions. "Date qualified" means the anchor falls inside an event whose exact day is not established.
      </p>
    </div>
  );
}
