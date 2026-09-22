import { Presentation } from "lucide-react";
import RodMark from "@/components/RodMark";
import { Button } from "@/components/ui/button";

export default function Header({ presentation, onTogglePresentation }: { presentation: boolean; onTogglePresentation: () => void }) {
  return (
    <header className="border-b border-border">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-accent-foreground">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <a href="https://republicofdata.io" className="flex shrink-0 items-center gap-2 text-foreground" aria-label="RepublicOfData.io home">
            <RodMark className="h-6 w-6" />
            <span className="hidden font-display text-sm font-semibold tracking-tight sm:inline">RepublicOfData.io</span>
          </a>
          <span className="hidden text-muted-foreground sm:inline" aria-hidden="true">
            /
          </span>
          <span className="truncate font-display text-sm font-medium sm:text-base">dbt, version by version</span>
        </div>
        <Button
          variant={presentation ? "default" : "outline"}
          size="sm"
          onClick={onTogglePresentation}
          aria-pressed={presentation}
          title="Presentation mode (P)"
        >
          <Presentation />
          <span className="hidden sm:inline">Presentation</span>
        </Button>
      </div>
    </header>
  );
}
