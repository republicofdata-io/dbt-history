import { Badge } from "@/components/ui/badge";
import EvidenceDrawer, { SourceList } from "@/components/EvidenceDrawer";
import { formatDate } from "@/content/dates";
import type { HistoryState } from "./state";
import WalkthroughPlayer from "./WalkthroughPlayer";

function Prose({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null;
  return (
    <>
      {text
        .trim()
        .split(/\n\s*\n/)
        .map((p, i) => (
          <p key={i} className={className}>
            {p}
          </p>
        ))}
    </>
  );
}

/**
 * The release panel from the concept: context row, big version number with
 * title and lead, then a story grid with "What changed" on the left and the
 * Waffle Shop card on the right. Sized to fit one screen; the walkthrough
 * takes the remaining height.
 */
export default function ReleaseTab({ state, active }: { state: HistoryState; active: boolean }) {
  const r = state.release;
  const m = state.anchor.milestone;
  const sourcesById = new Map(r.sources.map((s) => [s.id, s]));
  const kind = r.id === "origin" ? "Origins" : r.id.startsWith("2.") ? "dbt v2" : "dbt Core";
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex items-center gap-2.5 text-xs text-muted-foreground">
        <span>{formatDate(m.date, m.precision)}</span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[11px]">{kind}</span>
        {m.kind === "patch" && <span className="rounded-full border border-border px-2 py-0.5 text-[11px]">patch {m.version}</span>}
      </div>
      <div className="mb-4 flex items-center gap-5">
        <div className="whitespace-nowrap font-display text-[64px] font-medium leading-none tracking-[-4px] text-accent xl:text-[72px]">{r.id === "origin" ? "2016" : r.label}</div>
        <div className="min-w-0">
          <h2 className="text-[24px] leading-tight tracking-[-0.6px] xl:text-[28px]">{r.title}</h2>
          <p className="mt-1.5 max-w-[520px] text-[13px] leading-relaxed text-muted-foreground">{r.lead.trim()}</p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <div className="flex min-h-0 flex-col overflow-y-auto">
          <h3 className="mb-2.5 text-sm font-semibold">What changed</h3>
          {r.what_changed.length ? (
            <ul className="flex flex-col gap-3">
              {r.what_changed.map((c) => (
                <li key={c.id} className="flex gap-2.5 text-xs leading-relaxed">
                  <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-accent" aria-hidden="true" />
                  <div>
                    <strong className="block text-[13px] font-semibold">
                      {c.summary}{" "}
                      {c.introduced_in && <Badge variant="accent" className="ml-1 align-middle">{c.introduced_in}</Badge>}
                      {!c.introduced_in && c.known_present_in && <Badge className="ml-1 align-middle">by {c.known_present_in}</Badge>}
                      {c.confidence === "qualified" && <Badge variant="warn" className="ml-1 align-middle">qualified</Badge>}
                    </strong>
                    {c.adapter_constraints && <span className="text-muted-foreground">{c.adapter_constraints}</span>}
                    {c.introduction_uncertainty && <span className="block text-muted-foreground">{c.introduction_uncertainty}</span>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">Feature claims are still being authored for this chapter.</p>
          )}
          {r.problem_then && (
            <div className="mt-4">
              <h3 className="mb-1 text-xs font-semibold">The problem then</h3>
              <Prose text={r.problem_then} className="text-xs leading-relaxed text-muted-foreground" />
            </div>
          )}
          {r.in_practice && (
            <div className="mt-3">
              <h3 className="mb-1 text-xs font-semibold">In practice</h3>
              <Prose text={r.in_practice} className="text-xs leading-relaxed text-muted-foreground" />
            </div>
          )}
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-xs">
            {(r.technical_detail || r.caveats.length > 0) && (
              <EvidenceDrawer title="For the practitioner" description={`${r.label} · ${r.title}`} trigger={<button type="button" className="text-accent underline-offset-2 hover:underline">For the practitioner</button>}>
                <div className="flex flex-col gap-3 text-sm">
                  <Prose text={r.technical_detail} className="leading-relaxed" />
                  {r.caveats.length > 0 && (
                    <div>
                      <p className="kicker mb-1">Keep in mind</p>
                      <ul className="list-disc pl-4 text-muted-foreground">
                        {r.caveats.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </EvidenceDrawer>
            )}
            {r.milestones.length > 1 && (
              <EvidenceDrawer title="Dated milestones in this chapter" description="Selecting one moves the date for all three tabs." trigger={<button type="button" className="text-accent underline-offset-2 hover:underline">Milestones</button>}>
                <ul className="flex flex-col gap-2 text-sm">
                  {r.milestones.map((x) => (
                    <li key={x.id}>
                      <button
                        type="button"
                        onClick={() => state.setMilestone(x.id)}
                        aria-current={m.id === x.id ? "true" : undefined}
                        className={"text-left underline-offset-2 hover:underline " + (m.id === x.id ? "font-semibold text-accent" : "")}
                      >
                        <span className="text-xs text-muted-foreground">{formatDate(x.date, x.precision)}</span> · {x.version ? `${x.version} · ` : ""}
                        {x.title}
                      </button>
                      {x.note && <p className="text-xs text-muted-foreground">{x.note}</p>}
                      {x.evidence.length > 0 && <p className="provenance">{x.evidence.map((e) => sourcesById.get(e)?.title ?? e).join(" · ")}</p>}
                    </li>
                  ))}
                </ul>
              </EvidenceDrawer>
            )}
            <EvidenceDrawer title={`${r.label} sources`} description="Primary release and package evidence." trigger={<button type="button" className="text-accent underline-offset-2 hover:underline">Release sources</button>}>
              <SourceList sources={r.sources} />
            </EvidenceDrawer>
          </div>
        </div>

        {r.walkthrough ? (
          <WalkthroughPlayer release={r} walkthrough={r.walkthrough} step={state.step} onStep={state.setStep} active={active} />
        ) : (
          <section aria-label="Waffle Shop walkthrough" className="rounded-[11px] border border-dashed border-border p-5">
            <div className="flex items-center gap-2.5">
              <div className="waffle-mark" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold">Waffle Shop</h3>
                <small className="block text-[11px] text-muted-foreground">Walkthrough in preparation</small>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
