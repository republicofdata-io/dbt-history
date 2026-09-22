import { List } from "lucide-react";
import { releases } from "@/content/load";
import { cn } from "@/lib/utils";

function eraOf(id: string) {
  if (id === "origin") return "origin";
  if (id.startsWith("0.")) return "0.x";
  if (id.startsWith("1.")) return "1.x";
  return "2.x";
}

function VersionButton({ id, label, current, onSelect, className }: { id: string; label: string; current: string; onSelect: (id: string) => void; className?: string }) {
  const active = id === current;
  const r = releases.find((x) => x.id === id)!;
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-pressed={active}
      aria-current={active ? "page" : undefined}
      title={`${r.label} · ${r.title}`}
      className={cn(
        "rounded-[5px] border border-transparent py-1 text-xs tabular-nums transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "bg-accent text-accent-foreground hover:bg-accent",
        className,
      )}
    >
      {label}
    </button>
  );
}

/** The sidebar release index from the concept: origin, the road to v1, the v1 releases, v2. */
export default function ReleaseIndex({ current, onSelect }: { current: string; onSelect: (id: string) => void }) {
  const zero = releases.filter((r) => eraOf(r.id) === "0.x");
  const one = releases.filter((r) => eraOf(r.id) === "1.x");
  return (
    <aside aria-label="Release index" className="flex h-full flex-col overflow-y-auto border-r border-border bg-muted px-4 py-4">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold">
        Release index <List className="h-4 w-4" aria-hidden="true" />
      </div>
      <button
        type="button"
        onClick={() => onSelect("origin")}
        aria-pressed={current === "origin"}
        className={cn("rounded-[5px] px-1 py-1 text-left text-xs text-muted-foreground hover:bg-card", current === "origin" && "bg-accent text-accent-foreground hover:bg-accent")}
      >
        Before the first release
      </button>
      <span className="mb-1.5 mt-3 block text-xs text-muted-foreground">The road to v1</span>
      <div className="grid grid-cols-3 gap-1">
        {zero.map((r) => (
          <VersionButton key={r.id} id={r.id} label={r.id} current={current} onSelect={onSelect} />
        ))}
      </div>
      <span className="mb-1.5 mt-3 block text-xs text-muted-foreground">The v1 releases</span>
      <div className="grid grid-cols-3 gap-1">
        {one.map((r) => (
          <VersionButton key={r.id} id={r.id} label={r.id} current={current} onSelect={onSelect} />
        ))}
      </div>
      <VersionButton id="2.0" label="v2.0 · September 2026" current={current} onSelect={onSelect} className="mt-3 w-full border-border px-2.5 py-1.5 text-left" />
      <p className="mt-4 text-[11px] text-muted-foreground">35 version chapters. The history starts in 2016.</p>
    </aside>
  );
}
