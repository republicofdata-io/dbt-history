# Instructions for the implementation agent

Current delivery direction confirmed by Olivier on 22 September 2026. This supersedes the local-lab instructions in the archived plan and older research recommendations.

## Direction

- Build one public app for Olivier's website, supporting both a 20-minute video and independent visitor browsing.
- History begins in 2016, with 35 version chapters: 0.1–0.21, 1.0–1.12, 2.0. Keep version chapters, with significant patches inside them.
- Waffle Shop is the recurring scenario. Each release contains a guided walkthrough for new and experienced practitioners.
- Visitors advance through prepared steps using Next, Previous and Restart. Show read-only code, highlighted changes, tables, diagrams and explained results. No visitor code editing, fixture changes, live execution or separate terminal workflow.
- Selected release/date anchors the release, Waffle Shop, catalogue and wider ecosystem tabs. Preserve active tab and walkthrough progress when navigating appropriately.
- **Decision of 22 September 2026:** the Waffle Shop walkthrough is its own tab, alongside the release, catalogue and ecosystem. This supersedes the guided-examples brief's line that the example lives inside The release tab.
- Read `documentation/01-app-brief.md` and `documentation/02-guided-examples-brief.md` as the implementation briefs. The separate local lab is outside scope; runtime research is reference material, not a prerequisite.
- Keep Olivier's personal recording notes out of the app.
- Source historical claims and preserve exact introduction patches, contemporary product names, maturity and ownership.
- Distinguish illustrative results from captured dbt output. Never fabricate original logs or claim execution verification from source inspection.
- Review example logic and arithmetic independently. Actual runtime captures are optional authoring evidence, not visitor functionality.
- Bundle examples with the app. Visitors need no dbt account, database connection or local installation. Don't add an execution backend.
- Historical research cutoff remains 2026-09-21; the 2026-09-22 scope decision doesn't silently update historical facts.

## Technical decisions (22 September 2026)

- **Own repo, own site.** This repo (`republicofdata-io/dbt-history`) is a standalone Vite + React 19 + TypeScript app deployed as its own Netlify site and proxied under `republicofdata.io/labs/dbt-history` by the website repo. Do not move the app into the website repo.
- **Concept look, not the website's.** Olivier preferred the researcher's HTML concept (`documentation/visual-reference.html`) over the website's dark Signal look once he saw a build of it. Style from the concept's stylesheet: light-dark paper/plum/gold palette, DM Sans and Space Grotesk, sidebar release index, big plum version number, Waffle Shop card with the gold waffle mark. The website is only the deployment host.
- **One screen per chapter.** Everything must fit the viewport without page scrolling, so the video recording is smooth. Put detail behind drawers, keep rows compact, and let a panel scroll internally only as a fallback.
- **Not about Olivier.** App copy and content never refer to Olivier, "you" or "your story". His articles may be cited as neutral sources ("a July 2018 practitioner article").
- **Content is YAML, separate from UI.** Everything visitors read is under `documentation/content/` and validated by `src/content/schema.ts`. Field names are a contract with the content author (`documentation/09-content-authoring.md`). Change a field only together with that document and the content files.
- **Catalogue and ecosystem are computed**, never hand-copied per chapter: `src/content/derive.ts` resolves product names, owners, maturity and placements at the anchor date from the event ledger.
- **State lives in the URL** (`/<release>/<tab>?m=&s=`); step progress per release in `sessionStorage`; presentation mode in `localStorage`.
- **Keep the bundle lean.** No syntax-highlighting or charting libraries; the code block, tables and lineage diagram are small components in `src/components/`.

## Working rules

- Run `make check` (typecheck, lint, tests) before committing. The content tests encode the date-boundary acceptance criteria from the app brief; keep them green.
- Never overwrite an authored chapter. `scripts/generate-release-skeletons.mjs` only writes chapters whose `status` is `skeleton`. A chapter without a `status` field that carries a walkthrough is treated as `draft`.
- The research agent writes into `documentation/content/` concurrently. Adapt the schema to reasonable drift rather than re-keying content; add tests for any new invariant.
- Keep README and AGENTS synchronized with implementation and walkthrough authoring conventions.

## Authored-content handoff

- The complete first content set is in `documentation/content/`; start with `content-index.yaml` and `validation-report.yaml`. Historical cutoff remains 2026-09-21; authoring/review dates can be 2026-09-22.
- All 36 chapters now contain reviewed illustrative walkthroughs. Reviewed means source/fixture review, not historical runtime execution. Preserve these chapters when running skeleton tooling.
- Keep all qualifications through schema parsing and UI rendering: `license`, `commercial_conditions`, `availability`, `availability_scope`, `maturity_label`, `state_override`, and uncertainty on name/owner intervals. Accepting unknown fields while dropping them can hide material historical distinctions.
- A product’s `catalogue_membership` is separate from its age or current owner. Fivetran-lineage products stay outside the dbt catalogue until the completed merger on 2026-06-01.
- The event schema uses `acquisition_closed` with `transaction_type: merger`; a licence change uses the allowed `pricing` category with `event_subtype: licence-change` and `price_change_asserted: false`. Render the specific meaning, not a misleading generic label.
- `ecosystem/placements.yaml` is a list, with external products declared once in `product_definition`. Placement end dates may be editorial rotation, not retirement.
- Keep the base fixture immutable; recursively apply named variants and their explicit change events. The orphan payment is a reported integrity failure, not revenue attributed to a fabricated location.

## Walkthrough enrichment conventions

- Preserve `walkthrough.intro` with 2–4 version-specific `can_now` capabilities, a short `scenario`, and optional `outcome`.
- Every command/result/test step includes its model, test or configuration; shell commands come last. Keep blocks short and highlights in range.
- Preserve original authored fields, existing snippets and prepared values when adding material.
- `data_context` can identify the before/after phase of a named fixture variant. These phases do not mutate the shared base dataset.
- Historical details matter: 0.2.0 declares this relationship under parent `orders`, pointing to child `payments`; 0.3.0 uses `run-target` in the default `user` profile. Do not modernize these examples.
- New source inspections cite package archives with source paths and hashes where available. Their review date can be later than the unchanged historical cutoff.
