# Instructions for the implementation agent

Current delivery direction confirmed by Olivier on 22 September 2026. This supersedes the local-lab instructions in the archived plan and older research recommendations.

- Build one public app for Olivier's website, supporting both a 20-minute video and independent visitor browsing.
- History begins in 2016, with 35 version chapters: 0.1–0.21, 1.0–1.12, 2.0. Keep version chapters, with significant patches inside them.
- Waffle Shop is the recurring scenario. Each release contains a guided walkthrough for new and experienced practitioners.
- Visitors advance through prepared steps using Next, Previous and Restart. Show read-only code, highlighted changes, tables, diagrams and explained results. No visitor code editing, fixture changes, live execution or separate terminal workflow.
- Selected release/date anchors release, catalogue and wider ecosystem tabs. Preserve active tab and walkthrough progress when navigating appropriately.
- Read `documentation/01-app-brief.md` and `documentation/02-guided-examples-brief.md` as the current implementation briefs. The separate local lab is outside scope; runtime research is reference material, not a prerequisite.
- Preserve the visual direction. The HTML reference predates the walkthrough decision. Keep Olivier's personal recording notes out of the app.
- Source historical claims and preserve exact introduction patches, contemporary product names, maturity and ownership.
- Distinguish illustrative results from captured dbt output. Never fabricate original logs or claim execution verification from source inspection.
- Review example logic and arithmetic independently. Actual runtime captures are optional authoring evidence, not visitor functionality.
- Bundle examples with the app. Visitors need no dbt account, database connection or local installation. Don't add an execution backend.
- Publication is intended for Olivier's existing website. Establish its integration and deployment requirements before choosing a hosting solution or publishing.
- Keep README and AGENTS synchronized with implementation and walkthrough authoring conventions.
- Historical research cutoff remains 2026-09-21; the 2026-09-22 scope decision doesn't silently update historical facts.

## Repository layout

Keep application source and tooling at the project root. Keep planning and reference material in `documentation/`; its README is the handoff index. The visual prototype is `documentation/visual-reference.html`, research inventories are under `documentation/data/`, and superseded plans are under `documentation/archive/`. These reference inventories are not an implemented app data layer. Keep the root README and these agent instructions current as the app is built.
