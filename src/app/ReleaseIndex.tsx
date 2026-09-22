import { releases } from "@/content/load";
import { releaseStatus } from "@/content/schema";
import { cn } from "@/lib/utils";

const ERAS: { id: string; label: string }[] = [
  { id: "origin", label: "Origins" },
  { id: "0.x", label: "The road to v1" },
  { id: "1.x", label: "The v1 releases" },
  { id: "2.x", label: "v2" },
];

function eraOf(id: string) {
  if (id === "origin") return "origin";
  if (id.startsWith("0.")) return "0.x";
  if (id.startsWith("1.")) return "1.x";
  return "2.x";
}

/**
 * The version index. Every one of the 35 series plus the origin prologue is a
 * button; on narrow screens the same list is a select so it stays reachable.
 */
export default function ReleaseIndex({ current, onSelect, compact }: { current: string; onSelect: (id: string) => void; compact?: boolean }) {
  return (
    <nav aria-label="Release index" className={cn("border-b border-border", compact && "hidden")}>
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="sm:hidden">
          <label className="kicker block pb-1" htmlFor="release-select">
            Release
          </label>
          <select
            id="release-select"
            className="w-full rounded-md border border-border bg-card px-3 py-2 font-mono text-sm"
            value={current}
            onChange={(e) => onSelect(e.target.value)}
          >
            {releases.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label} · {r.title}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden flex-wrap gap-x-6 gap-y-2 sm:flex">
          {ERAS.map((era) => {
            const items = releases.filter((r) => eraOf(r.id) === era.id);
            return (
              <div key={era.id} className="flex flex-col gap-1">
                <span className="kicker">{era.label}</span>
                <ul className="flex flex-wrap gap-1" role="list">
                  {items.map((r) => {
                    const active = r.id === current;
                    const pending = releaseStatus(r) === "skeleton";
                    return (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(r.id)}
                          aria-current={active ? "page" : undefined}
                          title={`${r.label} · ${r.title}${pending ? " (walkthrough in preparation)" : ""}`}
                          className={cn(
                            "rounded-sm border px-2 py-0.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            active
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                            pending && !active && "opacity-60",
                          )}
                        >
                          {r.id === "origin" ? "2016" : r.label.replace(/^v/, "")}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
