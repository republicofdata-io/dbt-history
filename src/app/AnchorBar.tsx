import { releases } from "@/content/load";
import { formatDate } from "@/content/dates";
import type { HistoryState } from "./state";

/**
 * The shared anchor: the resolved date and milestone as plain text, and
 * previous/next. All tabs resolve against this date. Milestones inside a
 * chapter are chosen from the "Milestones" drawer on the release tab; a
 * release select appears only on phones, where the sidebar index is hidden.
 */
export default function AnchorBar({ state }: { state: HistoryState }) {
  const { release, anchor } = state;
  const m = anchor.milestone;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <label htmlFor="release-select" className="text-[11px] text-muted-foreground md:sr-only">
          Selected release
        </label>
        <select
          id="release-select"
          aria-label="Selected release"
          className="max-w-[200px] rounded-md border border-border bg-highlight-wash py-1.5 pl-2.5 pr-6 text-[13px] font-semibold text-foreground md:hidden"
          value={release.id}
          onChange={(e) => state.goRelease(e.target.value)}
        >
          {releases.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label} · {r.title}
            </option>
          ))}
        </select>
        <span className="text-[13px]" aria-live="polite">
          <span className="font-semibold">{formatDate(m.date, m.precision)}</span>
          <span className="text-muted-foreground"> · {m.title}</span>
        </span>
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
