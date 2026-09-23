import { describe, expect, it } from "vitest";
import { productEvents, products, releases } from "./load";
import { catalogueAt, diffCatalogue, diffEcosystem, ecosystemAt, eventLabel, resolveAnchor } from "./derive";
import { ecosystem } from "./load";

const at = (date: string) => new Map(catalogueAt(date, products, productEvents).map((s) => [s.product.id, s]));

describe("qualifications survive parsing and derivation", () => {
  it("keeps the June 2026 engine alpha override instead of carrying the earlier beta", () => {
    const s = at("2026-06-01").get("fusion")!;
    expect(s.maturity).toBeNull();
    expect(s.maturityLabel).toBe("alpha");
    expect(at("2026-05-31").get("fusion")?.maturity).toBe("beta");
  });

  it("marks announced-but-unavailable capabilities as such, not as previews", () => {
    for (const id of ["advanced-ci", "automatic-exposures"]) {
      const s = at("2024-05-14").get(id)!;
      expect(s.availability, id).toBe("announced-not-available");
      expect(s.maturity, id).toBeNull();
    }
    expect(at("2025-10-14").get("observability-agent")?.availability).toBe("announced-not-available");
  });

  it("keeps private and public scopes on betas and previews", () => {
    const end = catalogueAt("2026-09-16", products, productEvents);
    const scoped = end.filter((s) => s.availabilityScope);
    expect(scoped.length).toBeGreaterThan(0);
    const lake = end.find((s) => s.product.id === "lake-compute")!;
    expect(lake.maturity).toBe("beta");
    expect(lake.availabilityScope).toBe("private");
  });

  it("records the Native App maintenance with existing-installations-only and a planned, not completed, retirement", () => {
    const s = at("2026-09-16").get("snowflake-native-app")!;
    expect(s.maturity).toBe("maintenance");
    expect(s.availability).toBe("existing-installations-only");
    expect(s.plannedRetirement?.date).toBe("2026-11");
    expect(s.product.known_since_basis).toBeTruthy();
  });

  it("keeps licence separate from access on the v2 distributions", () => {
    const end = at("2026-09-16");
    const full = end.get("dbt-full")!;
    const oss = end.get("dbt-oss")!;
    expect(full.licence?.name).toMatch(/Product Licensing/);
    expect(oss.licence?.name).toMatch(/Apache/);
    expect(full.access).toContain("free-local");
    expect(oss.access).toContain("free-local");
    expect(full.commercialConditions.length).toBeGreaterThan(0);
  });

  it("shows MetricFlow as pending between the Transform agreement and the completed acquisition", () => {
    expect(at("2023-02-07").get("metricflow")).toBeUndefined();
    const pending = at("2023-06-01").get("metricflow")!;
    expect(pending.pending).toBe(true);
    expect(pending.owner).toBe("Transform");
    expect(pending.certainty).toBe("qualified");
    expect(at("2023-10-17").get("metricflow")?.pending).toBe(false);
  });

  it("keeps the Census ownership transition bounded rather than assigning a day", () => {
    const s = at("2026-06-01").get("census")!;
    expect(s.product.owners.some((o) => o.uncertainty?.earliest === "2025-05-01" && o.uncertainty?.latest === "2025-09-03")).toBe(true);
    const names = s.product.names.map((n) => n.name);
    expect(names).toContain("Fivetran Activations");
  });

  it("labels merger and licence events by their specific meaning", () => {
    const merger = productEvents.find((e) => e.id === "merger-closed")!;
    expect(eventLabel(merger)).toBe("merger completed");
    const licence = productEvents.find((e) => e.kind === "pricing" && e.event_subtype === "licence-change")!;
    expect(eventLabel(licence)).toBe("licence change");
    expect(licence.price_change_asserted).toBe(false);
  });

  it("changes the catalogue inside a chapter when a product-event milestone is selected", () => {
    const v19 = releases.find((r) => r.id === "1.9")!;
    const open = resolveAnchor(v19);
    const fusionMilestone = v19.milestones.find((m) => m.id === "product-2025-05-28")!;
    const later = resolveAnchor(v19, fusionMilestone.id);
    expect(at(open.date).get("fusion")).toBeUndefined();
    expect(at(later.date).get("fusion")?.maturity).toBe("beta");
    expect(at(later.date).get("explorer")?.name).toBe("dbt Catalog");
  });

  it("keeps every walkthrough an illustration with step provenance and evidence", () => {
    for (const r of releases) {
      expect(r.walkthrough?.evidence.status, r.id).toBe("illustration");
      for (const s of r.walkthrough!.steps) {
        expect(s.state?.provenance ?? "", `${r.id}/${s.id}`).toMatch(/illustration/);
        expect(s.evidence.length, `${r.id}/${s.id}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("what changed since the previous chapter", () => {
  const cat = (id: string) => catalogueAt(resolveAnchor(releases.find((r) => r.id === id)!).date, products, productEvents);
  const eco = (id: string) => ecosystemAt(resolveAnchor(releases.find((r) => r.id === id)!).date, ecosystem.placements, products, productEvents);

  it("marks the Sinter to dbt Cloud rename as a change between v0.12 and v0.13", () => {
    const d = diffCatalogue(cat("0.12"), cat("0.13"));
    expect(d.get("dbt-cloud")?.kind).toBe("changed");
    expect(d.get("dbt-cloud")?.notes.join(" ")).toMatch(/was Sinter/);
  });

  it("marks Snowflake as new on the chart at v0.7", () => {
    const d = diffEcosystem(eco("0.6"), eco("0.7"));
    expect(d.added.map((s) => s.product.id)).toContain("snowflake");
  });

  it("marks everything in the first chapter as new", () => {
    const d = diffCatalogue([], cat("origin"));
    expect(d.get("dbt-core")?.kind).toBe("new");
    const e = diffEcosystem(new Map(), eco("origin"));
    expect(e.added.length).toBeGreaterThan(0);
  });

  it("marks the Fivetran lineage as new in the catalogue at the first chapter after the merger", () => {
    const d = diffCatalogue(cat("1.11"), cat("1.12"));
    expect(d.get("fivetran")?.kind).toBe("new");
  });
});

describe("dbt Cloud maturity", () => {
  it("is a hosted experiment as Sinter and generally available from the January 2019 rename", () => {
    const sinter = catalogueAt("2018-06-01", products, productEvents).find((s) => s.product.id === "dbt-cloud")!;
    expect(sinter.maturity).toBeNull();
    expect(sinter.maturityLabel).toMatch(/experiment/);
    const cloud = catalogueAt("2022-10-12", products, productEvents).find((s) => s.product.id === "dbt-cloud")!;
    expect(cloud.maturity).toBe("ga");
    expect(cloud.maturityLabel).toBeNull();
  });
});
