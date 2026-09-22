import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import EvidenceDrawer, { SourceList } from "@/components/EvidenceDrawer";
import { ecosystem, productEvents, products, releases } from "@/content/load";
import { BAND_LAYERS, FLOW_LAYERS, LAYER_LABELS, diffEcosystem, ecosystemAt, intervalQualified, ownerIntervalAt, resolveAnchor, type PlacementState } from "@/content/derive";
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

function Chip({ s, date, tag }: { s: PlacementState; date: string; tag?: string }) {
  const own = s.relationship === "dbt-owned";
  const fam = s.relationship === "combined-family";
  const ownerInterval = ownerIntervalAt(s.product, date);
  const ownerQualified = intervalQualified(ownerInterval, date);
  return (
    <EvidenceDrawer
      title={s.name}
      description={`${LAYER_LABELS[s.placement.layer]} · ${REL[s.relationship]} · as of ${formatDate(date)}`}
      trigger={
        <button
          type="button"
          className={cn(
            "w-full rounded-md px-2.5 py-1.5 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            own && "bg-highlight-wash font-semibold text-foreground",
            fam && "bg-highlight-wash/70 text-foreground",
            !own && !fam && "bg-card text-foreground/90 hover:bg-muted",
          )}
        >
          <span className="flex items-center gap-1.5">
            <span className="truncate">{s.name}</span>
            {tag && <Badge variant={tag === "new" ? "accent" : "warn"} className={tag === "new" ? "bg-highlight-wash" : "bg-gold-wash"}>{tag}</Badge>}
          </span>
          {s.placement.maturity && <span className="provenance block text-[10px]">{s.placement.maturity}</span>}
        </button>
      }
    >
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex flex-wrap gap-1">
          <Badge variant={own ? "accent" : "default"}>{REL[s.relationship]}</Badge>
          {s.placement.maturity && <Badge variant="warn">{s.placement.maturity}</Badge>}
          {s.owner && s.owner !== s.name && <Badge>owner: {s.owner}</Badge>}
          {ownerQualified && <Badge variant="warn">ownership qualified</Badge>}
        </div>
        {ownerInterval?.note && <p className="text-xs text-muted-foreground">{ownerInterval.note}</p>}
        {ownerInterval?.uncertainty && (
          <p className="text-xs text-muted-foreground">
            Ownership transition between {formatDate(ownerInterval.uncertainty.earliest)} and {formatDate(ownerInterval.uncertainty.latest)}.
          </p>
        )}
        {s.product.ownership_note && <p className="text-xs text-muted-foreground">{s.product.ownership_note}</p>}
        <div>
          <p className="kicker mb-1">Why it is on the chart</p>
          <p className="text-muted-foreground">{s.placement.rationale.trim()}</p>
          <p className="provenance mt-1">
            on the chart from {formatDate(s.placement.from, s.placement.from_precision)}
            {s.placement.from_precision !== "day" ? ` (${s.placement.from_precision} precision; the exact day is not established)` : ""}
          </p>
        </div>
        <div>
          <p className="kicker mb-2">Sources</p>
          <SourceList sources={s.placement.sources} />
        </div>
      </div>
    </EvidenceDrawer>
  );
}

/**
 * The ecosystem panel from the concept: legend, a left-to-right logical flow
 * with one column per layer, then cross-cutting responsibilities as rails.
 */
export default function EcosystemTab({ state }: { state: HistoryState }) {
  const date = state.anchor.date;
  const snapshot = useMemo(() => ecosystemAt(date, ecosystem.placements, products, productEvents), [date]);
  const bands = BAND_LAYERS.filter((l) => snapshot.has(l));
  const merged = date >= "2026-06-01";
  // What appeared, left or was renamed on the chart since the previous chapter opened.
  const previousRelease = state.index > 0 ? releases[state.index - 1] : null;
  const change = useMemo(() => {
    if (!previousRelease) return null;
    const prev = ecosystemAt(resolveAnchor(previousRelease).date, ecosystem.placements, products, productEvents);
    return diffEcosystem(prev, snapshot);
  }, [previousRelease, snapshot]);
  const tagFor = (s: PlacementState) => {
    if (!change) return undefined;
    if (change.added.some((a) => a.product.id === s.product.id && a.placement.layer === s.placement.layer)) return "new";
    const r = change.renamed.find((x) => x.now.product.id === s.product.id && x.now.placement.layer === s.placement.layer);
    return r ? `was ${r.from}` : undefined;
  };
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      <div className="mb-3 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-2.5 w-2.5 rounded-[2px] bg-accent" aria-hidden="true" /> {merged ? "Combined Fivetran and dbt family" : "dbt products"}
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-2.5 w-2.5 rounded-[2px] bg-muted-foreground opacity-50" aria-hidden="true" /> Other players and approaches
        </span>
        <span>The data stack on {formatDate(date)}. dbt models execute in the warehouse.</span>
      </div>
      {change && (
        <p className="mb-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Since {previousRelease!.label}:</span>{" "}
          {change.added.length === 0 && change.renamed.length === 0 && change.removed.length === 0 && "no change on the chart."}
          {change.added.length > 0 && (
            <>
              new <span className="text-foreground">{change.added.map((s) => `${s.name} (${LAYER_LABELS[s.placement.layer].toLowerCase()})`).join(", ")}</span>
              {change.renamed.length || change.removed.length ? "; " : "."}
            </>
          )}
          {change.renamed.length > 0 && (
            <>
              renamed <span className="text-foreground">{change.renamed.map((r) => `${r.from} to ${r.now.name}`).join(", ")}</span>
              {change.removed.length ? "; " : "."}
            </>
          )}
          {change.removed.length > 0 && <>no longer shown {change.removed.map((s) => s.name).join(", ")} (editorial rotation, not retirement).</>}
        </p>
      )}

      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5" aria-label="Logical data flow">
        {FLOW_LAYERS.map((layer, i) => {
          const items = snapshot.get(layer) ?? [];
          return (
            <li key={layer} className="relative flex flex-col gap-1.5 rounded-lg border border-border bg-muted/60 p-2.5">
              <h3 className="text-xs font-semibold">
                {LAYER_LABELS[layer]}
                {i < FLOW_LAYERS.length - 1 && (
                  <span className="absolute -right-2 top-2 hidden text-muted-foreground sm:inline" aria-hidden="true">
                    ›
                  </span>
                )}
              </h3>
              {layer === "sources" && !items.length && <p className="text-[11px] text-muted-foreground">Applications, databases, events and files.</p>}
              {items.map((s) => (
                <Chip key={s.product.id} s={s} date={date} />
              ))}
            </li>
          );
        })}
      </ol>

      {bands.length > 0 && (
        <div className="mt-3" aria-label="Cross-cutting responsibilities">
          {bands.map((layer) => (
            <div key={layer} className="grid grid-cols-1 gap-2 border-t border-border py-2 text-xs sm:grid-cols-[150px_minmax(0,1fr)]">
              <span className="pt-1.5 font-medium">{LAYER_LABELS[layer]}</span>
              <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3 xl:grid-cols-5">
                {(snapshot.get(layer) ?? []).map((s) => (
                  <Chip key={s.product.id} s={s} date={date} tag={tagFor(s)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="provenance mt-auto pt-3">Representative players, not a market ranking. Select a chip for its relationship, ownership and sources.</p>
    </div>
  );
}
