import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS, useHistoryState, type Tab } from "./state";
import Header from "./Header";
import { usePresentation } from "./usePresentation";
import ReleaseIndex from "./ReleaseIndex";
import AnchorBar from "./AnchorBar";
import ReleaseTab from "./ReleaseTab";
import CatalogueTab from "./CatalogueTab";
import EcosystemTab from "./EcosystemTab";
import NotFound from "./NotFound";

export default function HistoryPage() {
  const state = useHistoryState();
  const [presentation, setPresentation] = usePresentation();

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
    <div className="min-h-screen">
      <Header presentation={presentation} onTogglePresentation={() => setPresentation((v) => !v)} />
      <ReleaseIndex current={state.release.id} onSelect={state.goRelease} compact={presentation} />
      <main id="main" className="pb-16">
        <AnchorBar state={state} />
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
          <Tabs value={state.tab} onValueChange={(v) => state.goTab(v as Tab)}>
            <TabsList aria-label="Views of this release">
              {TABS.map((t) => (
                <TabsTrigger key={t.id} value={t.id}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="release">
              <ReleaseTab state={state} active={state.tab === "release"} />
            </TabsContent>
            <TabsContent value="catalogue">
              <CatalogueTab state={state} />
            </TabsContent>
            <TabsContent value="ecosystem">
              <EcosystemTab state={state} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        A practitioner's history by Olivier Dupuis · <a href="https://republicofdata.io" className="underline-offset-4 hover:text-foreground hover:underline">RepublicOfData.io</a> · research cutoff 21 September 2026 · keys: [ ] releases, ← → steps, P presentation
      </footer>
    </div>
  );
}
