import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS, useHistoryState, type Tab } from "./state";
import Header from "./Header";
import { usePresentation } from "./usePresentation";
import { useTheme } from "./theme";
import { usePageViews } from "./analytics";
import ReleaseIndex from "./ReleaseIndex";
import AnchorBar from "./AnchorBar";
import ReleaseTab from "./ReleaseTab";
import JaffleTab from "./JaffleTab";
import CatalogueTab from "./CatalogueTab";
import EcosystemTab from "./EcosystemTab";
import NotFound from "./NotFound";
import { cn } from "@/lib/utils";

/**
 * The page is a fixed-height shell (masthead / sidebar + main / footer) so a
 * chapter fits the screen without scrolling during a recording. Panels scroll
 * internally only as a fallback on small screens.
 */
export default function HistoryPage() {
  const state = useHistoryState();
  const [presentation, setPresentation] = usePresentation();
  const [theme, cycleTheme] = useTheme();
  usePageViews();

  useEffect(() => {
    if (!state) return;
    document.title = `${state.release.label} ${state.release.title} · dbt, version by version`;
  }, [state]);

  // Global keys: [ and ] change release, P toggles presentation. Arrow keys belong to the walkthrough.
  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof HTMLElement && ["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.key === "]") state.goNext();
      if (e.key === "[") state.goPrevious();
      if (e.key === "p" || e.key === "P") setPresentation((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, setPresentation]);

  if (!state) return <NotFound />;

  return (
    <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
      <Header presentation={presentation} onTogglePresentation={() => setPresentation((v) => !v)} theme={theme} onCycleTheme={cycleTheme} />
      <div className={cn("grid min-h-0 border-t border-border", presentation ? "grid-cols-1" : "grid-cols-1 md:grid-cols-[166px_minmax(0,1fr)]")}>
        {!presentation && (
          <div className="hidden min-h-0 md:block">
            <ReleaseIndex current={state.release.id} onSelect={state.goRelease} />
          </div>
        )}
        <main id="main" className={cn("flex min-h-0 flex-col overflow-y-auto px-5 pt-4 md:px-7", presentation && "px-8 pt-6 md:px-10")}>
          <AnchorBar state={state} />
          <Tabs value={state.tab} onValueChange={(v) => state.goTab(v as Tab)} className="flex min-h-0 flex-1 flex-col">
            <TabsList aria-label="Views of this release">
              {TABS.map((t) => (
                <TabsTrigger key={t.id} value={t.id}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="release" className="min-h-0 flex-1">
              <ReleaseTab state={state} />
            </TabsContent>
            <TabsContent value="jaffle" className="min-h-0 flex-1">
              <JaffleTab state={state} active={state.tab === "jaffle"} />
            </TabsContent>
            <TabsContent value="catalogue" className="min-h-0 flex-1">
              <CatalogueTab state={state} />
            </TabsContent>
            <TabsContent value="ecosystem" className="min-h-0 flex-1">
              <EcosystemTab state={state} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {!presentation && (
        <footer className="flex flex-wrap justify-between gap-2 border-t border-border bg-muted px-7 py-2 text-[11px] text-muted-foreground">
          <span>
            Research cutoff 21 September 2026 · illustrative examples, no live dbt execution ·{" "}
            <a href="https://republicofdata.io" className="text-accent underline-offset-2 hover:underline">
              RepublicOfData.io
            </a>
          </span>
          <span>keys: [ ] releases · ← → steps · P presentation</span>
        </footer>
      )}
    </div>
  );
}
