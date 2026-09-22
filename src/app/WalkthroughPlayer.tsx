import { useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, FlaskConical, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "@/components/CodeBlock";
import StateView from "@/components/StateView";
import EvidenceDrawer, { SourceList } from "@/components/EvidenceDrawer";
import { formatDate } from "@/content/dates";
import { walkthroughSourceIds, type Release, type Walkthrough } from "@/content/schema";

/**
 * The guided Waffle Shop example. Visitors only move through prepared steps
 * with Next, Previous and Restart. Each step renders its complete authored
 * state, so arriving at step 4 by deep link shows exactly what step 4 shows.
 */
export default function WalkthroughPlayer({ release, walkthrough, step, onStep, active }: { release: Release; walkthrough: Walkthrough; step: number; onStep: (n: number) => void; active: boolean }) {
  const steps = walkthrough.steps;
  const idx = Math.min(Math.max(step, 1), steps.length) - 1;
  const current = steps[idx];
  const first = idx === 0;
  const last = idx === steps.length - 1;

  // Arrow keys move through steps while the release tab is showing. Release
  // navigation uses different keys ([ and ]) so a step never changes the release.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.key === "ArrowRight" && !last) onStep(idx + 2);
      if (e.key === "ArrowLeft" && !first) onStep(idx);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, idx, first, last, onStep]);

  const captured = walkthrough.evidence.status === "captured";
  const sourceIds = new Set(walkthroughSourceIds(walkthrough));
  const sources = release.sources.filter((s) => sourceIds.has(s.id));

  return (
    <section aria-label="Waffle Shop walkthrough" className="rounded-lg border border-border">
      <header className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="kicker">Waffle Shop · see it happen</p>
          <h3 className="mt-1 font-display text-lg font-semibold">{walkthrough.title ?? walkthrough.learning_objective.trim()}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{walkthrough.context.trim()}</p>
        </div>
        <EvidenceDrawer
          title="Evidence for this example"
          description={captured ? "Contains captured dbt output." : "Authored illustration, reviewed against sources."}
          trigger={
            <button type="button" className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-sm text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {captured ? <Camera className="h-3.5 w-3.5" /> : <FlaskConical className="h-3.5 w-3.5" />}
              {captured ? "Captured output" : "Illustrative results"}
            </button>
          }
        >
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={captured ? "good" : "accent"}>{captured ? "captured dbt output" : "illustration"}</Badge>
              {walkthrough.evidence.review_date && <span className="provenance">reviewed {formatDate(walkthrough.evidence.review_date)}</span>}
            </div>
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
      </header>

      <div className="px-4 py-4">
        <ol className="mb-4 flex flex-wrap items-center gap-1.5" aria-label="Steps">
          {steps.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onStep(i + 1)}
                aria-current={i === idx ? "step" : undefined}
                className={
                  "rounded-sm border px-2 py-0.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                  (i === idx ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground")
                }
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li className="ml-2 font-mono text-xs text-muted-foreground" aria-live="polite">
            Step {idx + 1} of {steps.length}
          </li>
        </ol>

        <div key={current.id} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-xl font-semibold">{current.title}</h4>
            <p className="text-base leading-relaxed">{current.explanation.trim()}</p>
            {current.code.map((c, i) => (
              <CodeBlock key={i} block={c} />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {current.state ? <StateView state={current.state} /> : <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">No prepared result for this step.</div>}
            {current.takeaway && (
              <p className="border-l-2 border-accent pl-3 text-sm text-foreground/90">
                <span className="kicker mr-2">Takeaway</span>
                {current.takeaway.trim()}
              </p>
            )}
          </div>
        </div>
      </div>

      <footer className="flex items-center justify-between gap-2 border-t border-border px-4 py-3">
        <Button variant="outline" size="sm" onClick={() => onStep(1)} disabled={first} title="Restart the walkthrough">
          <RotateCcw /> Restart
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onStep(idx)} disabled={first} title="Previous step (←)">
            <ChevronLeft /> Previous
          </Button>
          <Button size="sm" onClick={() => onStep(idx + 2)} disabled={last} title="Next step (→)">
            Next <ChevronRight />
          </Button>
        </div>
      </footer>
    </section>
  );
}
