import { describe, expect, it } from "vitest";
import { catalogueProducts, dataset, ecosystem, metrics, productEvents, products, releases } from "./load";
import { walkthroughSourceIds, type Cell } from "./schema";
import { catalogueAt, ecosystemAt, resolveAnchor } from "./derive";

const EXPECTED_IDS = [
  "origin",
  ...Array.from({ length: 21 }, (_, i) => `0.${i + 1}`),
  ...Array.from({ length: 13 }, (_, i) => `1.${i}`),
  "2.0",
];

describe("release chapters", () => {
  it("has exactly the 35 series plus the origin prologue, in order", () => {
    expect(releases.map((r) => r.id)).toEqual(EXPECTED_IDS);
  });

  it("references only declared sources from evidence ids", () => {
    for (const r of releases) {
      const ids = new Set(r.sources.map((s) => s.id));
      for (const m of r.milestones) for (const e of m.evidence) expect(ids, `${r.id} milestone ${m.id}`).toContain(e);
      for (const c of r.what_changed) for (const e of c.evidence) expect(ids, `${r.id} change ${c.id}`).toContain(e);
      for (const e of r.walkthrough ? walkthroughSourceIds(r.walkthrough) : []) expect(ids, `${r.id} walkthrough`).toContain(e);
      for (const e of r.narrative_evidence) expect(ids, `${r.id} narrative`).toContain(e);
    }
  });

  it("keeps walkthrough highlights inside their code blocks and step ids unique", () => {
    for (const r of releases) {
      if (!r.walkthrough) continue;
      const ids = r.walkthrough.steps.map((s) => s.id);
      expect(new Set(ids).size, `${r.id} step ids`).toBe(ids.length);
      for (const s of r.walkthrough.steps) {
        for (const c of s.code) {
          const lines = c.content.trimEnd().split("\n").length;
          for (const h of c.highlight_lines) expect(h, `${r.id}/${s.id} highlight`).toBeLessThanOrEqual(lines);
        }
        if (s.state?.kind === "table" || s.state?.kind === "comparison") for (const row of s.state.rows) expect(row.length, `${r.id}/${s.id} row width`).toBe(s.state.columns.length);
        if (s.state?.kind === "diagram") {
          const nodeIds = new Set(s.state.diagram.nodes.map((n) => n.id));
          for (const e of s.state.diagram.edges) {
            expect(nodeIds, `${r.id}/${s.id} edge`).toContain(e.from);
            expect(nodeIds, `${r.id}/${s.id} edge`).toContain(e.to);
          }
        }
      }
      if (r.walkthrough.evidence.status === "captured") expect(r.walkthrough.evidence.captured?.runtime, `${r.id} captured runtime`).toBeTruthy();
    }
  });

  it("opens v2.0 on the Summit GA milestone and keeps the artifact date visible", () => {
    const v2 = releases.find((r) => r.id === "2.0")!;
    const anchor = resolveAnchor(v2);
    expect(anchor.date).toBe("2026-09-16");
    expect(v2.milestones.some((m) => m.date === "2026-09-14")).toBe(true);
  });
});

describe("jaffle shop dataset", () => {
  const table = (name: string) => dataset.tables.find((t) => t.name === name)!;
  const col = (name: string, c: string) => table(name).columns.findIndex((x) => x.name === c);

  function revenueByLocation(extra: { table: string; rows: unknown[][] }[] = []) {
    const rows = (name: string) => [...table(name).rows, ...extra.filter((e) => e.table === name).flatMap((e) => e.rows as Cell[][])];
    const locOfOrder = new Map(rows("orders").map((o) => [o[col("orders", "order_id")], o[col("orders", "location_id")]]));
    const totals = new Map<unknown, { paid: number; refunded: number }>();
    for (const l of table("locations").rows) totals.set(l[col("locations", "location_id")], { paid: 0, refunded: 0 });
    for (const p of rows("payments")) totals.get(locOfOrder.get(p[col("payments", "order_id")]))!.paid += Number(p[col("payments", "amount_cents")]);
    for (const r of rows("refunds")) totals.get(locOfOrder.get(r[col("refunds", "order_id")]))!.refunded += Number(r[col("refunds", "amount_cents")]);
    return totals;
  }

  it("has base revenue per location that matches the expected table", () => {
    const totals = revenueByLocation();
    const expected = dataset.expected_revenue!;
    const c = (name: string) => expected.columns!.indexOf(name);
    let total = 0;
    for (const row of expected.rows!) {
      const t = totals.get(row[c("location_id")])!;
      expect([t.paid, t.refunded, t.paid - t.refunded], String(row[c("location")])).toEqual([row[c("payment_cents")], row[c("refund_cents")], row[c("revenue_cents")]]);
      total += t.paid - t.refunded;
    }
    expect(total).toBe(expected.total_cents);
  });

  it("has variant totals that follow from their extra rows", () => {
    const byId = new Map(dataset.variants.map((v) => [v.id, v]));
    for (const v of dataset.variants) {
      if (!v.expected_revenue?.total_cents) continue;
      // Collect extra rows along the extends chain.
      const chain: typeof v[] = [];
      let cur: typeof v | undefined = v;
      while (cur) {
        chain.unshift(cur);
        cur = cur.extends === "base" ? undefined : byId.get(cur.extends);
      }
      const extra = chain.flatMap((x) => x.extra_rows).filter((e) => e.table !== "payments" || !v.id.startsWith("orphan"));
      const totals = revenueByLocation(extra);
      const total = [...totals.values()].reduce((s, t) => s + t.paid - t.refunded, 0);
      expect(total, v.id).toBe(v.expected_revenue.total_cents);
    }
  });
});

describe("catalogue date boundaries", () => {
  const at = (date: string) => new Map(catalogueAt(date, products, productEvents).map((s) => [s.product.id, s]));

  it("names Sinter only until 15 January 2019, then dbt Cloud", () => {
    expect(at("2019-01-14").get("dbt-cloud")?.name).toBe("Sinter");
    expect(at("2019-01-15").get("dbt-cloud")?.name).toBe("dbt Cloud");
    expect(at("2018-01-01").get("dbt-core")?.name).toBe("dbt");
    expect(at("2019-01-15").get("dbt-core")?.name).toBe("dbt Core");
  });

  it("does not call Explorer 'Catalog' in 2023", () => {
    expect(at("2023-12-01").get("explorer")?.name).toBe("dbt Explorer");
    expect(at("2025-05-28").get("explorer")?.name).toBe("dbt Catalog");
  });

  it("keeps the 14 May 2024 announcements out of the 9 May v1.8 launch", () => {
    const launch = at("2024-05-09");
    expect(launch.get("mesh")?.maturity).toBe("preview");
    expect(launch.get("copilot")).toBeUndefined();
    expect(launch.get("visual-editor")).toBeUndefined();
    const later = at("2024-05-14");
    expect(later.get("mesh")?.maturity).toBe("ga");
    expect(later.get("copilot")?.name).toBe("dbt Assist");
  });

  it("keeps Fivetran outside the dbt catalogue before 1 June 2026", () => {
    expect(at("2026-05-31").get("fivetran")).toBeUndefined();
    expect(at("2026-05-31").get("sqlmesh")).toBeUndefined();
    expect(at("2026-06-01").get("fivetran")).toBeDefined();
    expect(at("2026-06-01").get("dbt-labs")?.owner).toBe("Combined Fivetran and dbt Labs company");
  });

  it("marks month-precision events as qualified inside their month", () => {
    expect(at("2017-01-15").get("dbt-cloud")?.certainty).toBe("qualified");
    expect(at("2017-02-01").get("dbt-cloud")?.certainty).toBe("certain");
    expect(at("2016-12-31").get("dbt-cloud")).toBeUndefined();
  });

  it("shows full dbt and dbt OSS as separate distributions at the v2 endpoint, with v1 Core still present", () => {
    const end = at("2026-09-16");
    const names = [...end.values()].map((s) => s.name);
    expect(names).toContain("dbt (v2 full distribution)");
    expect(names).toContain("dbt OSS");
    const engines = [...end.values()].filter((s) => s.product.type === "engine" || s.product.type === "distribution").map((s) => s.name);
    expect(engines.filter((n) => /fusion/i.test(n))).toEqual([]);
    expect(end.get("dbt-core")?.name).toMatch(/^dbt (Core|v1)$/);
    expect(at("2026-09-13").get("dbt-oss")).toBeUndefined();
    expect(at("2026-09-13").get("dbt-full")).toBeUndefined();
  });

  it("only references products that exist", () => {
    for (const e of productEvents) expect(products.has(e.product), e.id).toBe(true);
    for (const p of ecosystem.placements) expect(products.has(p.product), p.product).toBe(true);
    expect(catalogueProducts.length).toBeGreaterThan(10);
  });
});

describe("ecosystem snapshots", () => {
  const at = (date: string) => ecosystemAt(date, ecosystem.placements, products, productEvents);

  it("starts small in 2016 and has no agent layer", () => {
    const snap = at("2016-04-03");
    expect(snap.get("transformation")?.map((s) => s.product.id)).toEqual(["dbt-core"]);
    expect(snap.get("ai-context")).toBeUndefined();
    expect(snap.get("reverse-etl")).toBeUndefined();
  });

  it("treats SQLMesh as independent before Fivetran's acquisition and combined-family after the merger", () => {
    const before = at("2025-09-02").get("transformation")!.find((s) => s.product.id === "sqlmesh")!;
    expect(before.owner).toBe("Tobiko Data");
    expect(before.relationship).toBe("partial-substitute");
    const after = at("2026-06-01").get("transformation")!.find((s) => s.product.id === "sqlmesh")!;
    expect(after.relationship).toBe("combined-family");
  });

  it("never lists more than five players in a layer", () => {
    for (const r of releases) {
      const snap = at(resolveAnchor(r).date);
      for (const [layer, list] of snap) expect(list.length, `${r.id} ${layer}`).toBeLessThanOrEqual(5);
    }
  });
});

describe("published adoption figures", () => {
  it("has two dated, sourced, increasing-in-time series", () => {
    expect(metrics.series.map((s) => s.id)).toEqual(["weekly-active", "slack-members"]);
    for (const s of metrics.series) {
      for (let i = 1; i < s.points.length; i++) expect(s.points[i].date > s.points[i - 1].date, `${s.id} order`).toBe(true);
      for (const p of s.points) expect(p.source.url, `${s.id} ${p.date}`).toMatch(/^https?:/);
    }
  });
});
