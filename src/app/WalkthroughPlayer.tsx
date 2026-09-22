import { useEffect } from "react";
import { Camera, ChevronLeft, ChevronRight, FlaskConical, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CodeFiles from "@/components/CodeFiles";
import StateView from "@/components/StateView";
import EvidenceDrawer, { SourceList } from "@/components/EvidenceDrawer";
import { formatDate } from "@/content/dates";
import { walkthroughSourceIds, type Release, type Walkthrough } from "@/content/schema";
import { cn } from "@/lib/utils";

/**
 * The Waffle Shop card from the concept, holding the guided example. Visitors
 * only move through prepared steps with Next, Previous and Restart. Each step
 * renders its complete authored state, so a deep link to step 4 shows step 4.
 * The card fills the remaining screen height; its body scrolls only if a
 * step's code and result together exceed it.
 */
export default function WalkthroughPlayer({ release, walkthrough, step, onStep, active }: { release: Release; walkthrough: Walkthrough; step: number; onStep: (n: number) => void; active: boolean }) {
  const steps = walkthrough.steps;
  // step 0 is the first screen (what this version lets you do, the scenario); 1..n are prepared states.
  const pos = Math.min(Math.max(step, 0), steps.length);
  const intro = pos === 0;
  const current = intro ? null : steps[pos - 1];
  const first = pos === 0;
  const last = pos === steps.length;

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.key === "ArrowRight" && !last) onStep(pos + 1);
      if (e.key === "ArrowLeft" && !first) onStep(pos - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, pos, first, last, onStep]);

  // First-screen content: authored intro when present, otherwise derived from the chapter.
  const canNow = walkthrough.intro?.can_now.length ? walkthrough.intro.can_now : release.what_changed.map((c) => c.summary);
  const scenario = walkthrough.intro?.scenario ?? walkthrough.context;

  const captured = walkthrough.evidence.status === "captured";
  const sourceIds = new Set(walkthroughSourceIds(walkthrough));
  const sources = release.sources.filter((s) => sourceIds.has(s.id));

  return (
    <section aria-label="Waffle Shop walkthrough" className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[11px] border border-border bg-card">
      <header className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <div className="waffle-mark" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold">
            Waffle Shop <span className="font-normal text-muted-foreground">· {release.label}</span>
          </h3>
          <small className="block text-[11px] leading-snug text-muted-foreground">{walkthrough.title ?? walkthrough.learning_objective.trim()}</small>
        </div>
        <ol className="flex items-center gap-1" aria-label="Steps">
          <li>
            <button
              type="button"
              onClick={() => onStep(0)}
              aria-current={intro ? "step" : undefined}
              aria-label="Overview"
              className={cn("h-6 rounded-[5px] border px-2 text-[11px]", intro ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground")}
            >
              Start
            </button>
          </li>
          {steps.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onStep(i + 1)}
                aria-current={i + 1 === pos ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${s.title}`}
                className={cn("h-6 min-w-6 rounded-[5px] border px-1.5 text-[11px] tabular-nums", i + 1 === pos ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground")}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ol>
      </header>

      {intro ? (
        <div key="intro" className="grid min-h-0 flex-1 gap-8 overflow-y-auto px-5 py-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            <div>
              <p className="kicker mb-1.5">What you can now do</p>
              <h3 className="font-display text-2xl font-medium tracking-[-0.5px]">
                {release.label === "Origins" ? "Before dbt" : `With ${release.label}`}
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {canNow.slice(0, 5).map((c, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed">
                    <span className="mt-[8px] h-1.5 w-1.5 flex-none rounded-full bg-accent" aria-hidden="true" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="kicker mb-1.5">The scenario</p>
              <p className="max-w-[60ch] text-[13px] leading-relaxed">{scenario.trim()}</p>
              {walkthrough.intro?.outcome && <p className="mt-2 max-w-[60ch] text-[13px] leading-relaxed text-muted-foreground">{walkthrough.intro.outcome.trim()}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="kicker">What you will see</p>
            <ol className="flex flex-col gap-2">
              {steps.map((st, i) => (
                <li key={st.id}>
                  <button type="button" onClick={() => onStep(i + 1)} className="flex w-full items-start gap-3 rounded-md border border-border bg-background px-3 py-2 text-left text-[13px] hover:border-accent">
                    <span className="mt-px inline-flex h-5 w-5 flex-none items-center justify-center rounded-[5px] bg-highlight-wash text-[11px] font-semibold tabular-nums">{i + 1}</span>
                    <span>
                      <span className="block font-semibold">{st.title}</span>
                      <span className="block text-muted-foreground">{st.takeaway?.trim() ?? st.explanation.trim()}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="provenance">Fixture: {walkthrough.dataset_variant} · every state is an authored illustration.</p>
          </div>
        </div>
      ) : (
        <div key={current!.id} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          <div>
            <h3 className="font-display text-xl font-medium tracking-[-0.3px]">{current!.title}</h3>
            <p className="mt-1 max-w-[70ch] text-[13px] leading-relaxed text-muted-foreground">{current!.explanation.trim()}</p>
          </div>
          <div className={cn("grid min-h-0 gap-4", current!.code.length && current!.state ? "lg:grid-cols-2" : "")}>
            {current!.code.length > 0 && (
              <div className="flex min-h-0 flex-col gap-2">
                <CodeFiles key={`${release.id}/${current!.id}`} blocks={current!.code} />
              </div>
            )}
            {current!.state && (
              <div className="flex min-h-0 flex-col gap-2">
                {current!.data_context && (
                  <p className="provenance">
                    Data: {current!.data_context.dataset_variant ?? walkthrough.dataset_variant}
                    {current!.data_context.phase ? ` · ${current!.data_context.phase}` : ""}
                  </p>
                )}
                <StateView state={current!.state} />
              </div>
            )}
          </div>
          {current!.takeaway && (
            <p className="border-l-[3px] border-accent bg-highlight-wash px-3 py-2 text-[13px]">
              <span className="mr-1.5 font-semibold">Takeaway.</span>
              {current!.takeaway.trim()}
            </p>
          )}
        </div>
      )}

      <footer className="flex items-center justify-between gap-2 border-t border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onStep(0)} disabled={first} title="Restart the walkthrough" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-35">
            <RotateCcw className="h-3.5 w-3.5" /> Restart
          </button>
          <span className="text-[11px] text-muted-foreground" aria-live="polite">
            {intro ? `Overview · ${steps.length} steps` : `Step ${pos} of ${steps.length}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <EvidenceDrawer
            title="Evidence for this example"
            description={captured ? "Contains captured dbt output." : "Authored illustration, reviewed against sources."}
            trigger={
              <button type="button" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
                {captured ? <Camera className="h-3 w-3" /> : <FlaskConical className="h-3 w-3" />}
                {captured ? "Captured output" : "Illustrative · no live dbt execution"}
              </button>
            }
          >
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={captured ? "good" : "accent"}>{captured ? "captured dbt output" : "illustration"}</Badge>
                {walkthrough.evidence.review_date && <span className="provenance">reviewed {formatDate(walkthrough.evidence.review_date)}</span>}
              </div>
              <p className="text-muted-foreground">Learning objective: {walkthrough.learning_objective.trim()}</p>
              {current?.state?.provenance && <p className="provenance">{current.state.provenance}</p>}
              {release.review_scope && (
                <div>
                  <p className="kicker mb-1">Review scope</p>
                  <p className="text-muted-foreground">{release.review_scope.trim()}</p>
                </div>
              )}
              {walkthrough.evidence.limitations && (
                <div>
                  <p className="kicker mb-1">Limitations</p>
                  <p className="text-muted-foreground">{walkthrough.evidence.limitations.trim()}</p>
                </div>
              )}
              {captured && walkthrough.evidence.captured && (
                <div>
                  <p className="kicker mb-1">Capture</p>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-xs">
                    {Object.entries(walkthrough.evidence.captured)
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <div key={k} className="contents">
                          <dt className="text-muted-foreground">{k.replace("_", " ")}</dt>
                          <dd>{String(v)}</dd>
                        </div>
                      ))}
                  </dl>
                </div>
              )}
              <div>
                <p className="kicker mb-2">Sources</p>
                <SourceList sources={sources.length ? sources : release.sources} />
              </div>
            </div>
          </EvidenceDrawer>
          <button type="button" onClick={() => onStep(pos - 1)} disabled={first} title="Previous step (←)" className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs disabled:opacity-35">
            <ChevronLeft className="h-3.5 w-3.5" /> Previous
          </button>
          <button type="button" onClick={() => onStep(pos + 1)} disabled={last} title="Next step (→)" className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground disabled:opacity-35">
            {intro ? "Start the walkthrough" : "Next"} <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </footer>
    </section>
  );
}
