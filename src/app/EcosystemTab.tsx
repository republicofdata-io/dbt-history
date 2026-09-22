import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EvidenceDrawer, { SourceList } from "@/components/EvidenceDrawer";
import { ecosystem, productEvents, products } from "@/content/load";
import { BAND_LAYERS, FLOW_LAYERS, LAYER_LABELS, ecosystemAt, type PlacementState } from "@/content/derive";
import { formatDate } from "@/content/dates";
import { cn } from "@/lib/utils";
import type { HistoryState } from "./state";

const REL: Record<string, string> = {
  "dbt-owned": "dbt product",
  "combined-family": "combined Fivetran and dbt family",
  complement: "complement",
  "partial-substitute": "partial substitute",
  integration: "integration",
  infrastructure: "infrastructure",
};

function Chip({ s, date }: { s: PlacementState; date: string }) {
  const own = s.relationship === "dbt-owned";
  const fam = s.relationship === "combined-family";
  return (
    <EvidenceDrawer
      title={s.name}
      description={`${LAYER_LABELS[s.placement.layer]} · ${REL[s.relationship]} · as of ${formatDate(date)}`}
      trigger={
        <button
          type="button"
          className={cn(
            "w-full rounded-sm border px-2 py-1 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            own && "border-accent bg-highlight-wash text-accent-bright",
            fam && "border-accent/50 bg-highlight-wash/60 text-foreground",
            !own && !fam && "border-border bg-card text-foreground/90 hover:border-foreground/40",
          )}
        >
          <span className="block truncate">{s.name}</span>
          {s.certainty === "qualified" && <span className="provenance block text-[0.65rem]">date qualified</span>}
        </button>
      }
    >
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex flex-wrap gap-1">
          <Badge variant={own ? "accent" : "default"}>{REL[s.relationship]}</Badge>
          {s.placement.maturity && <Badge variant="warn">{s.placement.maturity}</Badge>}
          {s.owner && <Badge>owner: {s.owner}</Badge>}
          {s.certainty === "qualified" && <Badge variant="warn">placement date qualified</Badge>}
        </div>
        <div>
          <p className="kicker mb-1">Why it is on the chart</p>
          <p className="text-muted-foreground">{s.placement.rationale}</p>
          <p className="provenance mt-1">on the chart from {formatDate(s.placement.from, s.placement.from_precision)}</p>
        </div>
        <div>
          <p className="kicker mb-2">Sources</p>
          <SourceList sources={s.placement.sources} />
        </div>
      </div>
    </EvidenceDrawer>
  );
}

/** The data-stack diagram at the anchor date: a left-to-right flow plus cross-cutting bands. */
export default function EcosystemTab({ state }: { state: HistoryState }) {
  const date = state.anchor.date;
  const snapshot = useMemo(() => ecosystemAt(date, ecosystem.placements, products, productEvents), [date]);
  const bands = BAND_LAYERS.filter((l) => snapshot.has(l));
  return (
    <div className="flex flex-col gap-6">
      <p className="text-base text-muted-foreground">
        The data stack on <span className="text-foreground">{formatDate(date)}</span>: a logical flow from raw data to answers, with dbt's footprint highlighted. dbt's SQL runs inside the warehouse, so there is no separate storage hop through dbt.
      </p>

      <section aria-label="Logical data flow">
        <h2 className="kicker mb-3">Logical flow</h2>
        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-5">
          {FLOW_LAYERS.map((layer, i) => {
            const items = snapshot.get(layer) ?? [];
            return (
              <li key={layer} className="relative flex flex-col gap-2 rounded-lg border border-border p-3">
                <h3 className="font-display text-sm font-semibold">{LAYER_LABELS[layer]}</h3>
                {layer === "sources" && !items.length && <p className="text-xs text-muted-foreground">Applications, databases, events and files. Not vendor-specific on this chart.</p>}
                {items.map((s) => (
                  <Chip key={s.product.id} s={s} date={date} />
                ))}
                {i < FLOW_LAYERS.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground sm:block" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {bands.length > 0 && (
        <section aria-label="Cross-cutting responsibilities">
          <h2 className="kicker mb-3">Cross-cutting responsibilities</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {bands.map((layer) => (
              <li key={layer} className="flex flex-col gap-2 rounded-lg border border-border p-3">
                <h3 className="font-display text-sm font-semibold">{LAYER_LABELS[layer]}</h3>
                {(snapshot.get(layer) ?? []).map((s) => (
                  <Chip key={s.product.id} s={s} date={date} />
                ))}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border border-accent bg-highlight-wash" aria-hidden="true" /> dbt product
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border border-accent/50 bg-highlight-wash/60" aria-hidden="true" /> combined family (after 1 June 2026)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border border-border bg-card" aria-hidden="true" /> other player
        </span>
        <span className="provenance">Representative players, not a market ranking. Select a chip for its relationship and sources.</span>
      </div>
    </div>
  );
}
