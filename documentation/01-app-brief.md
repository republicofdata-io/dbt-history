# Coding brief: the dbt history app

**Direction updated 22 September 2026:** guided examples inside the public app replace the separate runnable lab. See [guided examples brief](02-guided-examples-brief.md).

## Outcome

Turn the approved visual concept into a browsable, sourced history of dbt from 2016 through v2. Olivier will use it while recording a 20-minute YouTube video. The app will be published on Olivier's website. Viewers explore each release and its guided Waffle Shop example entirely within the app, both during the video and independently afterward.

Keep the existing visual direction: prominent version navigation, restrained purple accents, readable release cards, light/dark themes, and presentation mode. `visual-reference.html` is the design reference, not the historical source of truth.

## Confirmed experience

The selected version remains visible above three tabs:

1. **The release:** the problem practitioners faced, what changed, its practical effect, and the Waffle Shop demonstration.
2. **The catalogue:** products and capabilities offered by the company at that moment, under their contemporary names and maturity.
3. **The wider ecosystem:** a recognizable data-stack diagram showing dbt's footprint and representative surrounding players.

Changing tabs preserves the version. Changing versions preserves the active tab. Previous/next navigation works everywhere. Deep links preserve version, tab and selected milestone. Browser back/forward restores that state. Keyboard navigation and visible focus must work without relying on colour.

Every published minor series gets a chapter: v0.1–v0.21, v1.0–v1.12, v2.0. Add an origin prologue for the first commit and 0.0.1; do not make Olivier's 2018 adoption the beginning. No personal recording-notes panel.

## Resolve the historical date explicitly

Recommended editorial policy: a version chapter initially opens at its first stable artifact date, labelled **First published package**, unless a separately sourced public-release date is deliberately selected. The release inventory preserves both GitHub and PyPI dates. Do not call every package timestamp a GA date.

Inside a chapter, significant patches and product events are selectable dated milestones. The top anchor changes to that milestone, and **all three tabs use its date**. For example, v0.5 opens before first-class PostgreSQL support; choosing 0.5.1 moves the shared anchor to 21 October 2016. If a genuine captured result uses a later runtime patch, disclose it in the evidence details; it never silently shifts the historical catalogue.

Product events between minor releases must remain discoverable inside the active release period. Otherwise a version-only index hides major launches. Explicitly selecting an event preserves its version chapter, with a subtitle such as “During v1.8 · 14 May 2024”. This does not create thematic chapters.

For v2, provide distinct milestones: artifact 14 September; distribution naming 15 September; Summit GA announcements 16 September; research snapshot 21 September 2026. Default the final presentation stop to the **16 September Summit** milestone so its product catalogue can legitimately include those announcements. Keep the artifact date visible in details. Core v1 remains a parallel maintained line; don't imply it ceased to exist.

Do not invent exact dates for month-only evidence. Store a precision and uncertainty interval. If a cutoff intersects that interval, show a qualified note or omit the disputed state from the definitive chart. An edited article's original publication metadata is evidence for publication, not automatically product launch.

## Release contents

Each chapter has a short plain-language lead, sourced feature changes, expandable technical detail and an embedded Waffle Shop walkthrough. Show the exact feature-introduction patch when known.

Visitors advance through prepared steps with Next, Previous and Restart. Read-only code highlights, small tables, diagrams and explained results show the problem, the relevant change and its consequence. They don't edit SQL, change data or execute commands. A typical unit-test example shows the refund problem, faulty SQL, the fixture, failure and corrected result.

Use an appropriate number and kind of steps for the release; reliability or packaging improvements can use a workflow comparison. Don't invent a business feature for every chapter. Keep all examples in The release tab, with progress preserved when returning from the catalogue or ecosystem.

Provide sources and distinguish authored illustrations from genuine captured outputs through an evidence link. An untested historical environment doesn't block a sourced illustration. Avoid fake original terminal logs or claims of live execution. See the guided examples brief for the complete interaction and authoring rules.

## Catalogue contents

Use stable product identities with historical aliases: Sinter → dbt Cloud; dbt Explorer → dbt Catalog; Cloud IDE → Studio; visual editor → Canvas. Show capabilities within a platform differently from standalone distributions, products or acquired companies. A product can span multiple ecosystem responsibilities without being duplicated as unrelated products.

Every card shows its role, contemporary name, availability, and source. Preview, beta, GA, maintenance and announced retirement are distinct states. Commercial availability and open-source licence are separate dimensions. Do not flatten “free local use”, “Apache-licensed”, “requires login”, and “included in a paid platform plan” into one badge.

Before the merger closes on 1 June 2026, keep Fivetran outside the dbt Labs catalogue. Its earlier acquisitions still affect ecosystem ownership. At the endpoint, represent full dbt and dbt OSS separately without depicting Fusion as an additional current engine alongside v2.

## Ecosystem diagram

Use a left-to-right data flow, with cross-cutting bands beneath or above it. Keep visual positions stable across adjacent versions so growth is legible. The diagram is a logical responsibility map; dbt's SQL normally executes in the target platform, so don't draw a fictitious standalone data-storage hop through dbt.

The earliest snapshot can show sources → ingestion → warehouse → SQL transformation → BI, with orchestration and quality as supporting responsibilities. Later snapshots introduce independently evidenced reverse ETL, metadata, headless semantics, open-table compute and AI context offerings. The underlying responsibilities often existed earlier; a newer category name does not mean the problem was newly invented.

Highlight dbt-owned offerings; after the merger, distinguish the combined family's footprint. Neutral surrounding products may be complements, partial substitutes, integrations or infrastructure. Show a relationship label on inspection. “Representative players” is editorial selection, not a market-share ranking. Use `05-ecosystem.md` for evidence and inclusion rules.

Keep three to five visible examples per layer at most, with details on demand. No dense logo wall. Text labels must remain usable without downloaded logos. Show product maturity on the chart and a small source drawer for the selected node.

## Suggested data model

Keep content in version-controlled JSON/YAML and Markdown, separate from rendering. A static web build is sufficient initially; no accounts, CMS or application database are required. Choose implementation tooling appropriate to the coding agent's existing project, rather than adding a backend for this content.

| Entity | Required fields |
|---|---|
| Release series | id, sequence, first exact version, package date, GitHub date, announcement dates, source references |
| Milestone | id, release series, date or interval, date kind, precision, title, evidence |
| Feature claim | id, description, introduced by exact version, adapter constraints, evidence, confidence |
| Product | stable id, type, parent platform, historical names, ownership intervals |
| Product event | effective date/interval, event type, maturity, pricing/access category, source, uncertainty |
| Ecosystem placement | product id, layer, valid interval, relationship to dbt, inclusion rationale, evidence |
| Walkthrough | id, release/milestone id, learning objective, context, ordered steps, evidence references |
| Step | id, title, explanation, read-only code, highlights, prepared table/diagram/result state, takeaway |
| Evidence | source URLs, illustration/captured status, review date, limitations; capture runtime/artifact metadata only when applicable |

Compute snapshots from events, rather than maintaining 35 contradictory copies of the catalogue. Preserve source titles and URLs, retrieval date and the specific claim supported. Do not fetch mutable current websites at page-render time to decide historical facts.

The supplied release JSON is a research inventory. Normalize it into this model; don't mistake `latest_stable_patch_observed` for a certified runtime selection. Product research is an event ledger, not a finished exhaustive commercial SKU database.

## Prepared examples and website integration

Bundle the walkthrough definitions and their prepared visual states with the app. Step selection renders the authored state directly; it doesn't call dbt or depend on a separate lab export. Use the same content in presentation mode and public browsing. No editor, execution service or visitor installation is required.

Source-reviewed illustrations and genuine captured artifacts can coexist. Captures retain the actual version, adapter, date and disclosed adaptations in evidence details. The historical runtime reports remain references for authors, with no requirement to build every environment.

Publish on Olivier's website after establishing its existing stack, intended route and deployment process. The current brief doesn't select another hosting provider. Check asset paths, deep links and narrow-screen behavior in that website context.

## Presentation and recording

All 35 chapters stay in the app. A suggested 20-minute route allocates roughly 1 minute to origins, 7 minutes to 0.x, 3 minutes to 1.0–1.4, 5 minutes to 1.5–1.12, and 4 minutes to v2 and the ecosystem ending. These are pacing recommendations, not renamed chapters or a script for Olivier's recollections. Keep the recording inside the app and advance through the same prepared examples visitors can browse later. No terminal switching or live setup is part of the presentation.

## Acceptance criteria

- All 35 chapters and origin context are reachable; no invented series.
- All tabs remain tied to the same milestone date through navigation and browser history.
- Date-boundary tests prove Sinter is renamed only from 15 January 2019; Explorer is not called Catalog in 2023; May 2024 announcements do not appear at the 9 May v1.8 launch; Fivetran ownership does not move to dbt before June 2026.
- A patch demo cannot masquerade as a feature present in the initial minor artifact.
- Every factual feature/product claim has a source; uncertainty remains visible.
- The v2 endpoint distinguishes mature products from previews and external dependencies.
- Every release has a guided Waffle Shop walkthrough with working Next/Previous/Restart controls, read-only code and accurate prepared results.
- Step progress, direct links and tab/release navigation work consistently; illustrative and captured outputs are distinguishable.
- The public examples require no visitor account, code editing, database or local tools.
- Presentation mode, keyboard access, readable contrast, responsive layouts and deep links are visually checked in a browser.
- README and AGENTS document the content schema, date policy, walkthrough authoring/evidence process and website integration.
