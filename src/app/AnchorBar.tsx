import { releases } from "@/content/load";
import { formatDate } from "@/content/dates";
import type { HistoryState } from "./state";

/**
 * The shared anchor from the concept: a release select, the resolved date and
 * milestone, and previous/next. All three tabs resolve against this date.
 */
export default function AnchorBar({ state }: { state: HistoryState }) {
  const { release, anchor } = state;
  const m = anchor.milestone;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <label htmlFor="release-select" className="text-[11px] text-muted-foreground">
          Selected release
        </label>
        <select
          id="release-select"
          className="max-w-[200px] rounded-md border border-border bg-highlight-wash py-1.5 pl-2.5 pr-6 text-[13px] font-semibold text-foreground"
          value={release.id}
          onChange={(e) => state.goRelease(e.target.value)}
        >
          {releases.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label} · {r.title}
            </option>
          ))}
        </select>
        {release.milestones.length > 1 ? (
          <select
            aria-label="Milestone"
            className="max-w-[260px] rounded-md border border-border bg-card py-1.5 pl-2 pr-6 text-xs text-foreground"
            value={m.id}
            onChange={(e) => state.setMilestone(e.target.value)}
          >
            {release.milestones.map((x) => (
              <option key={x.id} value={x.id}>
                {formatDate(x.date, x.precision)} · {x.title}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {formatDate(m.date, m.precision)} · {m.title}
          </span>
        )}
        {m.kind === "package" && <span className="provenance hidden lg:inline">package upload date, not an announcement date</span>}
        {m.kind !== "package" && m.kind !== "origin" && <span className="provenance hidden lg:inline">during {release.label}</span>}
      </div>
      <div className="flex gap-1.5">
        <button type="button" onClick={state.goPrevious} disabled={!state.hasPrevious} aria-label="Previous release" title="Previous release ([)" className="whitespace-nowrap rounded-md border border-border bg-card px-2.5 py-1.5 text-xs disabled:opacity-35">
          ‹ Previous
        </button>
        <button type="button" onClick={state.goNext} disabled={!state.hasNext} aria-label="Next release" title="Next release (])" className="whitespace-nowrap rounded-md border border-border bg-card px-2.5 py-1.5 text-xs disabled:opacity-35">
          Next ›
        </button>
      </div>
    </div>
  );
}
