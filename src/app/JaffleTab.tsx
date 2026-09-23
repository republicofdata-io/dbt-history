import type { HistoryState } from "./state";
import WalkthroughPlayer from "./WalkthroughPlayer";

/** The Jaffle Shop tab: the guided, read-only example for the selected release, full width. */
export default function JaffleTab({ state, active }: { state: HistoryState; active: boolean }) {
  const r = state.release;
  if (!r.walkthrough) {
    return (
      <section aria-label="Jaffle Shop walkthrough" className="rounded-[11px] border border-dashed border-border p-5">
        <div className="flex items-center gap-2.5">
          <div className="jaffle-mark" aria-hidden="true" />
          <div>
            <h3 className="text-sm font-semibold">Jaffle Shop</h3>
            <small className="block text-[11px] text-muted-foreground">Walkthrough in preparation for {r.label}.</small>
          </div>
        </div>
      </section>
    );
  }
  return (
    <div className="flex h-full min-h-0 flex-col">
      <WalkthroughPlayer release={r} walkthrough={r.walkthrough} step={state.step} onStep={state.setStep} active={active} />
    </div>
  );
}
