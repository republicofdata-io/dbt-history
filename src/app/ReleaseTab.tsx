import { Badge } from "@/components/ui/badge";
import EvidenceDrawer, { SourceList } from "@/components/EvidenceDrawer";
import { releaseStatus } from "@/content/schema";
import type { HistoryState } from "./state";
import WalkthroughPlayer from "./WalkthroughPlayer";

function Prose({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <>
      {text
        .trim()
        .split(/\n\s*\n/)
        .map((p, i) => (
          <p key={i} className="leading-relaxed">
            {p}
          </p>
        ))}
    </>
  );
}

export default function ReleaseTab({ state, active }: { state: HistoryState; active: boolean }) {
  const r = state.release;
  const status = releaseStatus(r);
  const sourcesById = new Map(r.sources.map((s) => [s.id, s]));
  const proposed = (r.authoring_notes?.proposed_waffle_shop_demo as string | undefined) ?? null;
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-6">
          <p className="text-lg leading-relaxed sm:text-xl">{r.lead.trim()}</p>
          {r.problem_then && (
            <section>
              <h2 className="kicker mb-2">The problem then</h2>
              <Prose text={r.problem_then} />
            </section>
          )}
          {r.in_practice && (
            <section>
              <h2 className="kicker mb-2">What changed in practice</h2>
              <Prose text={r.in_practice} />
            </section>
          )}
          {r.technical_detail && (
            <details className="group rounded-md border border-border p-3">
              <summary className="cursor-pointer text-sm font-medium text-foreground/90">Technical detail for practitioners</summary>
              <div className="mt-3 flex flex-col gap-3 text-sm text-foreground/90">
                <Prose text={r.technical_detail} />
              </div>
            </details>
          )}
        </div>
        <aside className="flex flex-col gap-4">
          <section className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="kicker">What shipped</h2>
              <EvidenceDrawer title={`${r.label} sources`} description="Primary release and package evidence." trigger={<button type="button" className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Sources</button>}>
                <SourceList sources={r.sources} />
              </EvidenceDrawer>
            </div>
            {r.what_changed.length ? (
              <ul className="mt-3 flex flex-col gap-3">
                {r.what_changed.map((c) => (
                  <li key={c.id} className="text-sm">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {c.introduced_in && <Badge variant="accent">{c.introduced_in}</Badge>}
                      {!c.introduced_in && c.known_present_in && <Badge>by {c.known_present_in}</Badge>}
                      {c.confidence === "qualified" && <Badge variant="warn">qualified</Badge>}
                    </div>
                    <p className="mt-1">{c.summary}</p>
                    {c.adapter_constraints && <p className="mt-0.5 text-xs text-muted-foreground">{c.adapter_constraints}</p>}
                    {c.introduction_uncertainty && <p className="mt-0.5 text-xs text-muted-foreground">{c.introduction_uncertainty}</p>}
                    {c.evidence.length > 0 && (
                      <p className="provenance mt-0.5">
                        {c.evidence.map((e) => sourcesById.get(e)?.title ?? e).join(" · ")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Feature claims are still being authored for this chapter.</p>
            )}
          </section>
          {r.caveats.length > 0 && (
            <section className="rounded-lg border border-border p-4">
              <h2 className="kicker">Keep in mind</h2>
              <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-4 text-sm text-muted-foreground">
                {r.caveats.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </section>
          )}
          {r.milestones.length > 1 && (
            <section className="rounded-lg border border-border p-4">
              <h2 className="kicker">Dated milestones in this chapter</h2>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm">
                {r.milestones.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => state.setMilestone(m.id)}
                      aria-current={state.anchor.milestone.id === m.id ? "true" : undefined}
                      className={"text-left underline-offset-4 hover:underline " + (state.anchor.milestone.id === m.id ? "text-accent-bright" : "text-foreground/90")}
                    >
                      <span className="font-mono text-xs text-muted-foreground">{m.date}</span> {m.version ? `${m.version} · ` : ""}
                      {m.title}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="provenance mt-2">Selecting a milestone moves the date for all three tabs.</p>
            </section>
          )}
        </aside>
      </div>

      {r.walkthrough ? (
        <WalkthroughPlayer release={r} walkthrough={r.walkthrough} step={state.step} onStep={state.setStep} active={active} />
      ) : (
        <section aria-label="Waffle Shop walkthrough" className="rounded-lg border border-dashed border-border p-6">
          <p className="kicker">Waffle Shop · see it happen</p>
          <h3 className="mt-1 font-display text-lg font-semibold">Walkthrough in preparation</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {proposed ? `Planned example: ${proposed}` : "The guided example for this chapter has not been authored yet."}
          </p>
          <p className="provenance mt-2">Chapter status: {status}</p>
        </section>
      )}
    </div>
  );
}
