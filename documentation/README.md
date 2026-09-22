# dbt, from the first commit to v2

Research cutoff: 21 September 2026 · Delivery direction updated: 22 September 2026

The project tells dbt's history through one Waffle Shop business question: **How much revenue did each location earn, and can we trust the answer?** It begins in 2016. Olivier's adoption in 2018 is a milestone within the story. The app supports a 20-minute YouTube recording and deeper exploration afterward.

## Current direction

**Confirmed by Olivier on 22 September:** the complete experience lives in the app, which will be published on his website. Every release includes a guided Waffle Shop example with prepared steps, read-only code and explained results. Visitors use Next, Previous and Restart. They don't edit code or run commands. Olivier uses these same examples during the 20-minute video.

The separate local lab is superseded. Historical runtime research remains useful evidence, but reproducing every runtime is no longer a delivery requirement.

## Start here

The app source belongs at the project root. This folder holds the briefs, research, prepared data inventories and visual reference. The project-wide [agent instructions](../AGENTS.md) remain at the root.

| Document | Use |
|---|---|
| [Guided examples brief](02-guided-examples-brief.md) | Step structure, read-only interaction, content/evidence model and acceptance criteria. |
| [App brief](01-app-brief.md) | Give this to the agent turning the approved visual concept into the history app. |
| [Release research](03-release-history.md) | All 35 version chapters, feature changes, dates, proposed demonstrations and primary sources. |
| [Product catalogue](04-product-catalogue.md) | Dated launches, renames, maturity changes, acquisitions and the v2 endpoint. |
| [Ecosystem research](05-ecosystem.md) | Historically bounded chart contents, surrounding players and the combined offering's limits. |
| [Historical runtime evidence](06-historical-runtime.md) | Reference only: Python, packaging and adapter constraints for historical accuracy. |
| [v2 runtime evidence](07-v2-runtime.md) | Reference only: full dbt versus OSS and documented feature limits. |
| [Research gaps and corrections](08-evidence-and-open-checks.md) | Conflicting evidence, prototype corrections and bounded work remaining during implementation. |
| [Data inventory](data/release-inventory.json) | Machine-readable releases, exact patch milestones and 250 stable package versions observed. |
| [Product event ledger](data/product-event-ledger.json) | 28 sourced catalogue and ownership records, preserving uncertain date labels for editorial normalization. |
| [Approved shaping document](project-shaping.md) | Olivier's confirmed direction. |
| [Visual reference](visual-reference.html) | Earlier visual direction. Its example interaction predates the guided-walkthrough decision; historical content is provisional. |

## What the research establishes

There are 35 published minor-series chapters: **v0.1–v0.21, v1.0–v1.12 and v2.0**. Keep all of them. Significant patch milestones belong inside their version chapter; for example, exposures shipped in 0.18.1, and native PostgreSQL support in 0.5.1.

Each release now needs an authored Waffle Shop walkthrough. Use historical syntax and accurate feature dates, with clearly distinguished illustrative results and genuine captured output. The reader advances through prepared states rather than switching executable environments.

The product story also has its own clock. A Core feature does not establish the release of a hosted product. The catalogue and ecosystem tabs must resolve against the same explicit historical moment as the release tab.

## Ready-to-use coding-agent instruction

> Build the public dbt history app described in `01-app-brief.md` and `02-guided-examples-brief.md`. Read the project root `AGENTS.md` and the release/product research first. Brief paths here are relative to `documentation/`. Preserve the 35 version chapters, origin context and shared release anchor for all three tabs. Add a guided Waffle Shop walkthrough inside every release, with read-only code, prepared tables/diagrams/results, and Next/Previous/Restart controls. Visitors don't edit code or execute commands. Clearly distinguish illustrative results from captured dbt output. The app is the whole presentation and public browsing experience; don't build the superseded local lab or a SQL execution service. Preserve the visual direction, update README and AGENTS, and verify the complete experience before preparing it for Olivier's website. Confirm integration details against the existing website before deployment.

## Delivery status

The briefs now reflect the guided-example direction. The app has not been changed in this documentation pass. Previous source/package research is retained; no runtime is certified as passing. Completion now depends on accurate authored examples, working step navigation and a website-ready app, not full historical runtime coverage.

The package is also saved in RoD under `Sessions/2026-09-21-dbt-history-research/`. Raw source archives and API responses remain in the original workspace's `work/` directory; this handoff contains the portable conclusions and source URLs.
