import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/content/dates";
import type { HistoryState } from "./state";

const KIND_LABEL: Record<string, string> = {
  package: "First published package",
  github_release: "GitHub release",
  patch: "Patch",
  announcement: "Announcement",
  product_event: "Product event",
  snapshot: "Snapshot",
  origin: "Origin",
};

/**
 * The shared anchor above the tabs: selected release, its dated milestone and
 * the previous/next release controls. All three tabs resolve against this date.
 */
export default function AnchorBar({ state }: { state: HistoryState }) {
  const { release, anchor } = state;
  const m = anchor.milestone;
  const isDefault = m.id === state.release.milestones[0]?.id && release.milestones.length === 1;
  return (
    <section aria-label="Selected release" className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="kicker">Selected release</p>
          <h1 className="mt-1 flex flex-wrap items-baseline gap-x-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="font-mono text-accent-bright">{release.label}</span>
            <span>{release.title}</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="text-foreground">{formatDate(m.date, m.precision)}</span>
            <span aria-hidden="true"> · </span>
            {m.kind !== "package" && m.kind !== "origin" ? `During ${release.label} · ` : ""}
            {m.version && m.kind === "patch" ? `${m.version} · ` : ""}
            {m.title}
            {m.kind === "package" && <span className="provenance"> · package upload date, not an announcement date</span>}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isDefault && release.milestones.length > 1 && (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="sr-only sm:not-sr-only">Milestone</span>
              <select
                aria-label="Milestone"
                className="max-w-[14rem] rounded-md border border-border bg-card px-2 py-1.5 font-mono text-xs text-foreground"
                value={m.id}
                onChange={(e) => state.setMilestone(e.target.value)}
              >
                {release.milestones.map((x) => (
                  <option key={x.id} value={x.id}>
                    {formatDate(x.date, x.precision)} · {x.version ?? KIND_LABEL[x.kind] ?? x.kind} · {x.title}
                  </option>
                ))}
              </select>
            </label>
          )}
          <Button variant="outline" size="sm" onClick={state.goPrevious} disabled={!state.hasPrevious} aria-label="Previous release" title="Previous release ([)">
            <ChevronLeft /> <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button variant="outline" size="sm" onClick={state.goNext} disabled={!state.hasNext} aria-label="Next release" title="Next release (])">
            <span className="hidden sm:inline">Next</span> <ChevronRight />
          </Button>
        </div>
      </div>
    </section>
  );
}
