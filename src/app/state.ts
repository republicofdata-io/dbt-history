import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getRelease, releaseIndex, releases } from "@/content/load";
import { resolveAnchor, type Anchor } from "@/content/derive";
import type { Release } from "@/content/schema";

export type Tab = "release" | "waffle" | "catalogue" | "ecosystem";
export const TABS: { id: Tab; label: string }[] = [
  { id: "release", label: "The release" },
  { id: "waffle", label: "Waffle Shop" },
  { id: "catalogue", label: "The catalogue" },
  { id: "ecosystem", label: "The wider ecosystem" },
];

const STEP_KEY = "dbt-history:steps";
const PRESENTATION_KEY = "dbt-history:presentation";

/** Step progress per release for this browsing session. Restart resets to 1. */
function readSteps(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(STEP_KEY) ?? "{}");
  } catch {
    return {};
  }
}
function writeStep(releaseId: string, step: number) {
  try {
    const all = readSteps();
    all[releaseId] = step;
    sessionStorage.setItem(STEP_KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable: progress simply isn't remembered */
  }
}

export interface HistoryState {
  release: Release;
  index: number;
  tab: Tab;
  anchor: Anchor;
  step: number;
  stepCount: number;
  goRelease: (id: string) => void;
  goPrevious: () => void;
  goNext: () => void;
  goTab: (tab: Tab) => void;
  setMilestone: (id: string | null) => void;
  setStep: (n: number) => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

function isTab(x: string | undefined): x is Tab {
  return x === "release" || x === "waffle" || x === "catalogue" || x === "ecosystem";
}

/**
 * The whole app state lives in the URL: /:releaseId/:tab?m=<milestone>&s=<step>.
 * Tabs: release | waffle (the guided example) | catalogue | ecosystem.
 * Deep links and browser history therefore restore version, tab, milestone and step.
 */
export function useHistoryState(): HistoryState | null {
  const params = useParams();
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();

  const release = params.releaseId ? getRelease(params.releaseId) : undefined;
  const tab: Tab = isTab(params.tab) ? params.tab : "release";
  const milestoneId = search.get("m");
  const stepParam = Number(search.get("s"));

  const anchor = useMemo(() => (release ? resolveAnchor(release, milestoneId) : null), [release, milestoneId]);
  // Step 0 is the walkthrough's first screen (what this version lets you do, the scenario);
  // steps 1..n are the prepared states. A link without ?s= lands on the first screen.
  const stepCount = release?.walkthrough?.steps.length ?? 0;
  const step = stepCount ? Math.min(Math.max(0, Number.isFinite(stepParam) ? stepParam : 0), stepCount) : 0;

  useEffect(() => {
    if (release && stepCount) writeStep(release.id, step);
  }, [release, step, stepCount]);

  const buildSearch = useCallback(
    (next: { m?: string | null; s?: number | null }) => {
      const sp = new URLSearchParams();
      const m = next.m === undefined ? milestoneId : next.m;
      const s = next.s === undefined ? (stepParam || null) : next.s;
      if (m) sp.set("m", m);
      if (s && s > 0) sp.set("s", String(s));
      const str = sp.toString();
      return str ? `?${str}` : "";
    },
    [milestoneId, stepParam],
  );

  const goRelease = useCallback(
    (id: string) => {
      const target = getRelease(id);
      if (!target) return;
      const remembered = readSteps()[id] ?? 0;
      const sp = new URLSearchParams();
      if (remembered > 0 && target.walkthrough) sp.set("s", String(remembered));
      const str = sp.toString();
      navigate(`/${id}/${tab}${str ? `?${str}` : ""}`);
    },
    [navigate, tab],
  );

  const index = release ? releaseIndex(release.id) : -1;

  const goTab = useCallback(
    (next: Tab) => {
      if (!release) return;
      navigate(`/${release.id}/${next}${buildSearch({})}`);
    },
    [navigate, release, buildSearch],
  );

  const setMilestone = useCallback(
    (id: string | null) => {
      setSearch((prev) => {
        const sp = new URLSearchParams(prev);
        if (id) sp.set("m", id);
        else sp.delete("m");
        return sp;
      });
    },
    [setSearch],
  );

  const setStep = useCallback(
    (n: number) => {
      if (!release) return;
      const clamped = Math.min(Math.max(0, n), stepCount);
      writeStep(release.id, clamped);
      setSearch(
        (prev) => {
          const sp = new URLSearchParams(prev);
          if (clamped > 0) sp.set("s", String(clamped));
          else sp.delete("s");
          return sp;
        },
        { replace: true },
      );
    },
    [release, stepCount, setSearch],
  );

  if (!release || !anchor) return null;

  return {
    release,
    index,
    tab,
    anchor,
    step,
    stepCount,
    goRelease,
    goPrevious: () => index > 0 && goRelease(releases[index - 1].id),
    goNext: () => index < releases.length - 1 && goRelease(releases[index + 1].id),
    goTab,
    setMilestone,
    setStep,
    hasPrevious: index > 0,
    hasNext: index < releases.length - 1,
  };
}

/** Presentation mode: larger type and hidden chrome, remembered per browser. */
export function readPresentation(): boolean {
  try {
    return localStorage.getItem(PRESENTATION_KEY) === "true";
  } catch {
    return false;
  }
}
export function writePresentation(on: boolean) {
  try {
    localStorage.setItem(PRESENTATION_KEY, String(on));
  } catch {
    /* ignore */
  }
  document.documentElement.dataset.presentation = String(on);
}
