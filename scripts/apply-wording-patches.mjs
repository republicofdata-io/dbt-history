// Applies editorial wording patches (JSON) to release walkthroughs.
// Only prose fields are touched: walkthrough title, learning_objective, intro,
// step title/explanation/takeaway and state title. Code, highlights, numbers,
// evidence and historical claims are never modified.
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const [, , ...patchFiles] = process.argv;
const root = path.resolve(new URL(".", import.meta.url).pathname, "..");
const dir = path.join(root, "documentation/content/releases");
let changed = 0, chapters = 0;
const report = [];
for (const pf of patchFiles) {
  const patch = JSON.parse(fs.readFileSync(pf, "utf8"));
  for (const ch of patch.chapters) {
    const file = path.join(dir, `${ch.id}.yaml`);
    if (!fs.existsSync(file)) { report.push(`${ch.id}: no such chapter`); continue; }
    const doc = yaml.load(fs.readFileSync(file, "utf8"));
    const w = doc.walkthrough;
    const p = ch.patch ?? {};
    let n = 0;
    const set = (obj, key, val) => { if (typeof val === "string" && val.trim() && obj[key] !== val) { obj[key] = val.trim().endsWith("\n") ? val.trim() : val.trim() + "\n"; n++; } };
    set(w, "title", p.title);
    set(w, "learning_objective", p.learning_objective);
    if (p.intro) {
      w.intro = w.intro ?? {};
      if (Array.isArray(p.intro.can_now) && p.intro.can_now.length) { w.intro.can_now = p.intro.can_now.map((s) => s.trim()); n++; }
      set(w.intro, "scenario", p.intro.scenario);
      set(w.intro, "outcome", p.intro.outcome);
    }
    for (const [sid, sp] of Object.entries(p.steps ?? {})) {
      const step = w.steps.find((s) => s.id === sid);
      if (!step) { report.push(`${ch.id}: unknown step ${sid}`); continue; }
      if (typeof sp.title === "string" && sp.title.trim()) { step.title = sp.title.trim(); n++; }
      set(step, "explanation", sp.explanation);
      set(step, "takeaway", sp.takeaway);
      if (step.state && typeof sp.state_title === "string" && sp.state_title.trim()) { step.state.title = sp.state_title.trim(); n++; }
    }
    if (n) { fs.writeFileSync(file, yaml.dump(doc, { lineWidth: 110, noRefs: true })); changed += n; }
    chapters++;
    report.push(`${ch.id}: ${ch.verdict ?? "?"} · ${n} field(s) changed${ch.flags?.length ? ` · ${ch.flags.length} flag(s)` : ""}`);
  }
}
console.log(report.join("\n"));
console.log(`\n${chapters} chapters, ${changed} fields changed`);
