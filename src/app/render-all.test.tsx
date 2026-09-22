import { describe, expect, it } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "@/App";
import { releases } from "@/content/load";
import { resolveAnchor } from "@/content/derive";

/**
 * Renders every chapter on every tab, every walkthrough step and every
 * milestone through the real router, so a content or rendering error in any
 * of the 36 chapters fails here rather than in a visitor's browser.
 */
function renderAt(path: string) {
  const r = render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
  return r;
}

describe("every chapter renders", () => {
  for (const release of releases) {
    it(`${release.label} renders all tabs, steps and milestones`, () => {
      const steps = release.walkthrough?.steps ?? [];
      for (let i = 1; i <= steps.length; i++) {
        renderAt(`/${release.id}/release?s=${i}`);
        expect(screen.getAllByText(steps[i - 1].title).length).toBeGreaterThan(0);
        expect(screen.getByText(`Step ${i} of ${steps.length}`)).toBeInTheDocument();
        cleanup();
      }
      for (const m of release.milestones) {
        for (const tab of ["catalogue", "ecosystem"] as const) {
          renderAt(`/${release.id}/${tab}?m=${m.id}`);
          expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(release.title);
          cleanup();
        }
      }
      const anchor = resolveAnchor(release);
      expect(anchor.milestone).toBeTruthy();
    });
  }

  it("opens v2.0 on the Summit milestone and lists four milestones", () => {
    renderAt("/2.0/release");
    expect(screen.getAllByText(/Summit GA announcement/).length).toBeGreaterThan(0);
    const v2 = releases.find((r) => r.id === "2.0")!;
    expect(v2.milestones).toHaveLength(4);
    cleanup();
  });

  it("sends unknown chapters to the not-found page", () => {
    renderAt("/9.9/release");
    expect(screen.getByText(/That chapter doesn't exist/)).toBeInTheDocument();
    cleanup();
  });
});
