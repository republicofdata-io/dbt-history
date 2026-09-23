// Generates documentation/content/releases/<id>.yaml skeletons from the
// research inventory. Existing chapters whose status is not "skeleton" are
// left untouched, so authored content is never overwritten.
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const root = path.resolve(new URL(".", import.meta.url).pathname, "..");
const inventory = JSON.parse(fs.readFileSync(path.join(root, "documentation/data/release-inventory.json"), "utf8"));
const outDir = path.join(root, "documentation/content/releases");
fs.mkdirSync(outDir, { recursive: true });

const day = (iso) => iso.slice(0, 10);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function eraOf(id) {
  if (id === "origin") return "origin";
  if (id.startsWith("0.")) return "0.x";
  if (id.startsWith("1.")) return "1.x";
  return "2.x";
}

function skeleton(ch) {
  const sources = ch.source_urls.map((url, i) => ({
    id: `src-${i + 1}`,
    title: url.includes("CHANGELOG")
      ? "Historical changelog (tagged source)"
      : url.includes("github.com")
        ? `GitHub release ${ch.github_tag ?? ch.initial_version}`
        : url.includes("pypi.org/pypi/")
          ? "PyPI release metadata (JSON)"
          : url.includes("pypi.org")
            ? `PyPI package ${ch.initial_version}`
            : url,
    url,
    retrieved: inventory.researched_on,
    supports: "Release date and version inventory.",
  }));
  const milestones = [
    {
      id: `${ch.id}-package`,
      kind: "package",
      date: day(ch.first_package_uploaded_at),
      precision: "day",
      title: "First published package",
      version: ch.initial_version,
      evidence: sources.filter((s) => s.url.includes("pypi")).map((s) => s.id),
      note: ch.display_date_kind,
    },
  ];
  if (ch.github_release_published_at && day(ch.github_release_published_at) !== day(ch.first_package_uploaded_at)) {
    milestones.push({
      id: `${ch.id}-github`,
      kind: "github_release",
      date: day(ch.github_release_published_at),
      precision: "day",
      title: "GitHub release published",
      version: ch.initial_version,
      evidence: sources.filter((s) => s.url.includes("github")).map((s) => s.id),
    });
  }
  for (const p of inventory.patch_submilestones) {
    const series = p.version.split(".").slice(0, 2).join(".");
    if (series !== ch.id) continue;
    milestones.push({
      id: `${ch.id}-patch-${p.version}`,
      kind: "patch",
      date: day(p.package_uploaded_at),
      precision: "day",
      title: p.feature,
      version: p.version,
      evidence: [],
      note: `Source: ${p.source_url}`,
    });
  }
  milestones.sort((a, b) => a.date.localeCompare(b.date));
  return {
    id: ch.id,
    label: ch.label,
    title: ch.title,
    status: "skeleton",
    era: eraOf(ch.id),
    lead: ch.highlights[0] ?? ch.title,
    problem_then: null,
    what_changed: ch.highlights.map((h, i) => ({
      id: `${slug(ch.id)}-change-${i + 1}`,
      summary: h,
      introduced_in: i === 0 ? ch.initial_version : null,
      adapter_constraints: null,
      evidence: sources.map((s) => s.id),
      confidence: "qualified",
    })),
    in_practice: null,
    technical_detail: null,
    caveats: ch.caveats,
    milestones,
    default_milestone: null,
    sources,
    walkthrough: null,
    authoring_notes: {
      proposed_jaffle_shop_demo: ch.proposed_jaffle_shop_demo,
      latest_stable_patch_observed: ch.latest_stable_patch_observed,
      research_confidence: ch.confidence,
    },
  };
}

function originSkeleton() {
  return {
    id: "origin",
    label: "Origins",
    title: "Before the first release",
    status: "skeleton",
    era: "origin",
    lead: "The project begins in March 2016, before models, tests and a shared workflow existed.",
    problem_then: null,
    what_changed: [],
    in_practice: null,
    technical_detail: null,
    caveats: [inventory.origin.note],
    milestones: [
      { id: "origin-project", kind: "origin", date: "2016-03-09", precision: "day", title: "Project origin in the two-year retrospective", evidence: ["src-2"] },
      { id: "origin-package", kind: "package", date: day(inventory.origin.first_package_uploaded_at), precision: "day", title: "First PyPI package 0.0.1", version: "0.0.1", evidence: ["src-1"] },
    ],
    default_milestone: "origin-package",
    sources: [
      { id: "src-1", title: "PyPI package 0.0.1", url: inventory.origin.source_url, retrieved: inventory.researched_on, supports: "First package upload date." },
      { id: "src-2", title: "On two years of dbt", url: "https://www.getdbt.com/blog/on-two-years-of-dbt", retrieved: inventory.researched_on, supports: "Retrospective origin date of 9 March 2016." },
    ],
    walkthrough: null,
  };
}

let written = 0;
let kept = 0;
const all = [originSkeleton(), ...inventory.chapters.map(skeleton)];
for (const rel of all) {
  const file = path.join(outDir, `${rel.id}.yaml`);
  if (fs.existsSync(file)) {
    const existing = yaml.load(fs.readFileSync(file, "utf8"));
    if (existing && existing.status !== "skeleton") {
      kept += 1;
      continue;
    }
  }
  const header = `# Generated skeleton from documentation/data/release-inventory.json.\n# Replace with authored content and set status: draft or reviewed.\n`;
  fs.writeFileSync(file, header + yaml.dump(rel, { lineWidth: 100, noRefs: true }));
  written += 1;
}
console.log(`releases: wrote ${written} skeleton(s), kept ${kept} authored chapter(s)`);
