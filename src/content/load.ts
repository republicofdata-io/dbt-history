import { z } from "zod";
import { Dataset, Ecosystem, Metrics, Product, ProductEvent, Release, type Release as ReleaseT } from "./schema";

/**
 * Loads every content file under documentation/content/ and validates it.
 * Validation errors throw at module load so a bad file is caught in dev and
 * in the content test, never silently rendered.
 */

type Modules = Record<string, { default: unknown }>;

const releaseModules = import.meta.glob("../../documentation/content/releases/*.yaml", { eager: true }) as Modules;
const datasetModules = import.meta.glob("../../documentation/content/waffle-shop/dataset.yaml", { eager: true }) as Modules;
const productModules = import.meta.glob("../../documentation/content/catalogue/products.yaml", { eager: true }) as Modules;
const eventModules = import.meta.glob("../../documentation/content/catalogue/events.yaml", { eager: true }) as Modules;
const ecosystemModules = import.meta.glob("../../documentation/content/ecosystem/placements.yaml", { eager: true }) as Modules;
const ecosystemProductModules = import.meta.glob("../../documentation/content/ecosystem/products.yaml", { eager: true }) as Modules;
const metricsModules = import.meta.glob("../../documentation/content/adoption/metrics.yaml", { eager: true }) as Modules;

function parseAll<T extends z.ZodTypeAny>(schema: T, modules: Modules, label: string): z.infer<T>[] {
  return Object.entries(modules).map(([file, mod]) => {
    const result = schema.safeParse(mod.default);
    if (!result.success) {
      const issues = result.error.issues.map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
      throw new Error(`Invalid ${label} content in ${file}:\n${issues}`);
    }
    return result.data;
  });
}

function single<T extends z.ZodTypeAny>(schema: T, modules: Modules, label: string): z.infer<T> {
  const all = parseAll(schema, modules, label);
  if (all.length !== 1) throw new Error(`Expected exactly one ${label} file, found ${all.length}`);
  return all[0];
}

/** Chapter order: origin, 0.1 … 0.21, 1.0 … 1.12, 2.0. */
export function chapterSortKey(id: string): number {
  if (id === "origin") return -1;
  const [major, minor] = id.split(".").map(Number);
  return major * 1000 + minor;
}

export const releases: ReleaseT[] = parseAll(Release, releaseModules, "release").sort(
  (a, b) => chapterSortKey(a.id) - chapterSortKey(b.id),
);

export const dataset = single(Dataset, datasetModules, "dataset");

export const catalogueProducts = single(z.array(Product), productModules, "products");
export const productEvents = single(z.array(ProductEvent), eventModules, "events");
export const ecosystem = single(Ecosystem, ecosystemModules, "ecosystem");
/** Non-dbt players may be defined in ecosystem/products.yaml instead of inline. */
export const ecosystemProducts: z.infer<typeof Product>[] = parseAll(z.array(Product), ecosystemProductModules, "ecosystem products").flat();

/** Published adoption figures (weekly active companies, Slack members), sorted by date. */
export const metrics = single(Metrics, metricsModules, "metrics");
for (const series of metrics.series) series.points.sort((a, b) => a.date.localeCompare(b.date));

/** Every product, whether defined in the catalogue or in the ecosystem files. */
export const products = new Map<string, z.infer<typeof Product>>();
for (const p of [...catalogueProducts, ...ecosystem.products, ...ecosystemProducts]) {
  if (products.has(p.id)) throw new Error(`Duplicate product id: ${p.id}`);
  products.set(p.id, p);
}
// Inline definitions on placements fill in external players not defined elsewhere.
for (const pl of ecosystem.placements) {
  if (pl.product_definition && !products.has(pl.product_definition.id)) products.set(pl.product_definition.id, pl.product_definition);
}

export function getRelease(id: string): ReleaseT | undefined {
  return releases.find((r) => r.id === id);
}

export function releaseIndex(id: string): number {
  return releases.findIndex((r) => r.id === id);
}
