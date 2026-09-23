# dbt release chronology: research inventory

> **Scope update · 22 September 2026:** this report preserves the original research. The current deliverable is the app with [guided, read-only examples](02-guided-examples-brief.md). Runtime build instructions and execution acceptance checks below are reference material only; full runtime reproduction is outside the current scope.

Researched 2026-09-21. Primary evidence: dbt GitHub release API and tagged changelog/source, PyPI JSON/package archives, dbt official upgrade guides and announcements. No dbt version was installed or executed.

## Inventory and date conventions

There are **35 minor-series chapters** through the current endpoint: **0.1–0.21, 1.0–1.12 and 2.0**. An origin prologue can show PyPI **0.0.1 on 2016-03-23**. No published 0.1.0 package was found: the 0.1 series starts at **0.1.1 on 2016-04-03**. Do not invent 0.22–0.99 or mark future 1.13 released.

The table uses the initial stable package upload date in UTC as a consistent machine-observed date. It is **not automatically a GA announcement date**. JSON retains separate GitHub timestamps. For example: 0.3.0 package August 3 vs GitHub August 4; 0.9.0 changelog October 25 vs UTC upload October 26; 0.10.0 package March 8 vs GitHub March 9; 0.12.0 package November 12 vs GitHub November 13; 0.13.0 package March 21 vs GitHub March 22; 1.0.0 dbt-core package December 3 vs dbt umbrella package December 6.

Modern endpoint: v1.12.0 package and GitHub release are July 16, 2026; its GA blog says last edited August 17, which is not proof of first publication. v2.0.0 package and GitHub release are September 14; licensing FAQ records naming change September 15; the public Summit GA announcement is September 16.

## Version chapters

| Series | Initial package UTC date | Focus | Proposed Jaffle Shop demonstration | Primary evidence |
|---|---|---|---|---|
| v0.1 | 2016-04-03 (0.1.1) | Earliest SQL build workflow | Compile Jaffle Shop staging and revenue models; compare the generated CREATE statements. Use 0.1.14 for a ref() demo. | [Release/package](https://pypi.org/project/dbt/0.1.1/) |
| v0.2 | 2016-06-22 (0.2.0) | Tests and a project workflow | Break a payment relationship, see a schema test fail; at patch 0.2.3.0 seed the jaffle menu. | [Release/package](https://pypi.org/project/dbt/0.2.0/) |
| v0.3 | 2016-08-03 (0.3.0) | Concurrent model builds | Build orders and payments branches together, then inject a failure into only one branch. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/0.3.0) |
| v0.4 | 2016-08-16 (0.4.0) | Materialization choices | Append a second trading day incrementally and inline a reusable staging model as a CTE. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.4.0) |
| v0.5 | 2016-09-28 (0.5.0) | Configuration, history and custom tests | Parameterize the excluded test customer; at 0.5.1 preserve a changed customer city; at 0.5.4 test revenue reconciliation. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.5.0) |
| v0.6 | 2016-12-22 (0.6.0) | Reusable macros | Use a reusable money conversion macro and rebuild the incremental revenue table after a logic change. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.6.0) |
| v0.7 | 2017-02-09 (0.7.0) | Snowflake joins the targets | Keep the local Postgres Jaffle Shop baseline; show the historical Snowflake profile and adapter reach. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.7.0) |
| v0.8 | 2017-04-17 (0.8.0) | Concurrency and adapter growth | Run two independent Jaffle Shop branches and inspect their execution order; show BigQuery as a dated patch event. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.8.0) |
| v0.9 | 2017-10-26 (0.9.0) | Extensible projects | Put finance models in a dedicated schema and install a pinned local Jaffle Shop package containing a custom test. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.9.0) |
| v0.10 | 2018-03-08 (0.10.0) | Reusable packages and portable seeds | Seed the menu and location lookup, ref them in order models, and reuse a local package. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.10.0) |
| v0.11 | 2018-09-06 (0.11.0) | Generated documentation | Generate and browse Jaffle Shop docs, tracing daily revenue back through orders and payments. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.11.0) |
| v0.12 | 2018-11-12 (0.12.0) | Faster and more selective runs | Tag finance models and run only that slice; compare query/log evidence for caching. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.12.0) |
| v0.13 | 2019-03-21 (0.13.0) | Sources and adapter plugins | Declare raw orders and payments as sources, then demonstrate a stale payment feed. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.13.0) |
| v0.14 | 2019-07-10 (0.14.0) | Snapshots replace archives | Change a customer city and inspect snapshot history; issue a warning for a soft business-rule violation. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.14.0) |
| v0.15 | 2019-11-25 (0.15.0) | Partial parsing and structured operations | Edit one Jaffle Shop model and show partial parsing; inspect a structured run log. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.15.0) |
| v0.16 | 2020-03-23 (0.16.0) | Richer metadata | Add owner and business context to the revenue model; inspect documented macro arguments and menu seeds. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.16.0) |
| v0.17 | 2020-06-08 (0.17.0) | Safer execution and configurable sources | Run with fail-fast after an intentional bad model, then persist revenue descriptions into Postgres comments. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.17.0) |
| v0.18 | 2020-09-03 (0.18.0) | State-aware selection and downstream context | Change refund logic and rebuild its affected slice against prior state; at 0.18.1 add a Jaffle Shop dashboard exposure. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.18.0) |
| v0.19 | 2021-01-27 (0.19.0) | More complete history and artifacts | Delete a customer from the raw feed and show the snapshot record being invalidated. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.19.0) |
| v0.20 | 2021-07-12 (0.20.0) | Actionable data-test failures | Persist failed payment rows and distinguish warning thresholds from errors. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.20.0) |
| v0.21 | 2021-10-04 (0.21.0) | Build in dependency order | Run the whole Jaffle Shop workflow with one build and show how a failed test prevents downstream work. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v0.21.0) |
| v1.0 | 2021-12-03 (1.0.0) | The stable framework | Run the established shop project, fail a model, and select prior failures for a targeted rerun. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v1.0.0) |
| v1.1 | 2022-04-28 (1.1.0) | Work only from fresher sources | Load new orders only and build descendants of the fresher source. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v1.1.0) |
| v1.2 | 2022-07-26 (1.2.0) | Grants as project configuration | Grant a reporting role access to revenue through model configuration. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v1.2.0) |
| v1.3 | 2022-10-12 (1.3.0) | Python models | Add an optional Python customer segmentation model while keeping SQL revenue as the shared baseline. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v1.3.0) |
| v1.4 | 2023-01-25 (1.4.0) | Fine-tuning incremental work | Constrain the scanned history for an incremental revenue model; show favor-state using a known reference manifest. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v1.4.0) |
| v1.5 | 2023-04-27 (1.5.0) | Models as governed interfaces | Break a revenue contract, then provide v1/v2 revenue model interfaces and preview a result. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v1.5.0) |
| v1.6 | 2023-07-31 (1.6.0) | Recovery, cloning and semantic-model foundations | Retry a failed shop build; inspect a local materialized view; offer clone only where its semantics are supported. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v1.6.0) |
| v1.7 | 2023-11-02 (1.7.0) | Reproducible dependencies and shareable docs | Install locked shop packages and open a self-contained documentation page. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v1.7.0) |
| v1.8 | 2024-05-09 (1.8.0) | Native unit tests | Test refund edge cases before materializing full data; display expected versus actual results. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v1.8.0) |
| v1.9 | 2024-12-09 (1.9.0) | Microbatch and simpler snapshots | Backfill daily order batches and repair a late-arriving order; express customer history in YAML. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v1.9.0) |
| v1.10 | 2025-06-16 (1.10.0) | Sampling and migration readiness | Build a small trading window, then show actionable warnings from a deliberately outdated configuration. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v1.10.0) |
| v1.11 | 2025-12-19 (1.11.0) | Functions become project resources | Create a revenue-normalization function and reference it from a shop model, on a supported adapter. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v1.11.0) |
| v1.12 | 2026-07-16 (1.12.0) | Preparing for the Rust engine | Compare parsers on the same shop project and validate equivalent model selection; move stable vars into vars.yml. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v1.12.0) |
| v2.0 | 2026-09-14 (2.0.0) | One engine, two distributions | Run the shop locally with DuckDB, introduce an invalid column, and compare feedback to a v1 checkpoint. | [Release/package](https://github.com/dbt-labs/dbt/releases/tag/v2.0.0) |

## Exact patch milestones matter

| Version | Package upload UTC | Feature | Source |
|---|---|---|---|
| 0.1.14 | 2016-05-06 | ref()/deps present by this package; absence in 0.1.1 source confirmed | [Primary evidence](https://pypi.org/project/dbt/0.1.14/) |
| 0.2.3.0 | 2016-07-15 | CSV seed command and accepted-values tests | [Primary evidence](https://github.com/dbt-labs/dbt/releases/tag/v0.2.3.0) |
| 0.5.1 | 2016-10-21 | Archives; first-class Postgres | [Primary evidence](https://github.com/dbt-labs/dbt/releases/tag/v0.5.1) |
| 0.5.4 | 2016-11-29 | Custom SQL data tests | [Primary evidence](https://github.com/dbt-labs/dbt/releases/tag/v0.5.4) |
| 0.8.3 | 2017-07-14 | BigQuery adapter | [Primary evidence](https://github.com/dbt-labs/dbt/releases/tag/v0.8.3) |
| 0.18.1 | 2020-10-13 | Exposures | [Primary evidence](https://github.com/dbt-labs/dbt/releases/tag/v0.18.1) |

For 0.5.1, 0.5.4 and 0.8.3, the [tagged historical changelog](https://github.com/dbt-labs/dbt-core/blob/v0.13.0/CHANGELOG.md) supplies the feature explanation. For 0.1.14, source files in the original PyPI sdist prove `ref` and `deps`; 0.1.1 source lacks them.

## Details and constraints by series

### v0.1 — Earliest SQL build workflow

- Jinja-templated SQL compiled to tables/views; materialized configuration was Boolean.
- By 0.1.14: ref-based dependencies and dependency installation.
- Demo: Compile Jaffle Shop staging and revenue models; compare the generated CREATE statements. Use 0.1.14 for a ref() demo.
- Constraint: Early Redshift-only code; local Postgres execution must be proven and disclosed as compatibility work. No dbt test command.
- Sources: [source 1](https://pypi.org/project/dbt/0.1.1/), [source 2](https://pypi.org/pypi/dbt/json)

### v0.2 — Tests and a project workflow

- 0.2.0 includes init, deps, test and ref().
- 0.2.3.0 adds CSV seeds, accepted-values tests and compilation of analytical queries.
- Demo: Break a payment relationship, see a schema test fail; at patch 0.2.3.0 seed the jaffle menu.
- Constraint: Four-component 0.2.3.0 is a real historical version. Seed is not present in 0.2.0.
- Sources: [source 1](https://pypi.org/project/dbt/0.2.0/), [source 2](https://pypi.org/pypi/dbt/json)

### v0.3 — Concurrent model builds

- Parallel model creation with up to eight threads.
- Failures skip descendants while independent branches continue; temporary relations reduce unavailable time.
- Demo: Build orders and payments branches together, then inject a failure into only one branch.
- Constraint: First release uses tag 0.3.0 without v prefix; runtime still needs early-database feasibility validation.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/0.3.0)

### v0.4 — Materialization choices

- Incremental and ephemeral models introduced in 0.4.0.
- In-model config and this variable; enum materializations replace Boolean configuration.
- Demo: Append a second trading day incrementally and inline a reusable staging model as a CTE.
- Constraint: Use period-correct sql_where configuration, not today's incremental recipe.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.4.0)

### v0.5 — Configuration, history and custom tests

- 0.5.0 adds vars and more reliable incremental writes.
- 0.5.1 adds archives and first-class Postgres; 0.5.4 adds custom SQL data tests.
- Demo: Parameterize the excluded test customer; at 0.5.1 preserve a changed customer city; at 0.5.4 test revenue reconciliation.
- Constraint: Archives predate snapshots. Features listed span distinct patches, not the initial 0.5.0 release.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.5.0), [source 2](https://github.com/dbt-labs/dbt-core/blob/v0.13.0/CHANGELOG.md)

### v0.6 — Reusable macros

- Macros, full-refresh control for incrementals and target context.
- Run-level hooks and additional runtime materialization controls.
- Demo: Use a reusable money conversion macro and rebuild the incremental revenue table after a logic change.
- Constraint: Historical macro context is more limited than in 0.9 and later.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.6.0), [source 2](https://github.com/dbt-labs/dbt-core/blob/v0.13.0/CHANGELOG.md)

### v0.7 — Snowflake joins the targets

- Snowflake support joins Redshift and Postgres.
- Snowflake role configuration arrives in 0.7.1.
- Demo: Keep the local Postgres Jaffle Shop baseline; show the historical Snowflake profile and adapter reach.
- Constraint: Actual Snowflake execution is an optional external-service demo; local Postgres cannot demonstrate Snowflake behavior.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.7.0), [source 2](https://github.com/dbt-labs/dbt-core/blob/v0.13.0/CHANGELOG.md)

### v0.8 — Concurrency and adapter growth

- Unique per-model transactions fix true concurrency; materializations rewritten as macros.
- BigQuery support appears in 0.8.3.
- Demo: Run two independent Jaffle Shop branches and inspect their execution order; show BigQuery as a dated patch event.
- Constraint: BigQuery support must not be shown at the initial April 0.8.0 anchor.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.8.0), [source 2](https://github.com/dbt-labs/dbt-core/blob/v0.13.0/CHANGELOG.md)

### v0.9 — Extensible projects

- Macros can use adapter, ref and var; packages can supply custom tests/materializations.
- Custom schemas; improved BigQuery table support.
- Demo: Put finance models in a dedicated schema and install a pinned local Jaffle Shop package containing a custom test.
- Constraint: Package management syntax still predates packages.yml.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.9.0)

### v0.10 — Reusable packages and portable seeds

- packages.yml and local package paths replace repository declarations.
- Seed overhaul: all adapters, ref-able CSVs and configuration.
- Demo: Seed the menu and location lookup, ref them in order models, and reuse a local package.
- Constraint: Seeds were introduced in 0.2.3.0; this chapter is their overhaul.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.10.0)

### v0.11 — Generated documentation

- Auto-generated project documentation and lineage.
- Schema YAML version 2 adds model/column descriptions.
- Demo: Generate and browse Jaffle Shop docs, tracing daily revenue back through orders and payments.
- Constraint: Schema YAML version 2 is unrelated to dbt engine v2.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.11.0)

### v0.12 — Faster and more selective runs

- Relation caching speeds introspection.
- Model tags and selection by tag.
- Demo: Tag finance models and run only that slice; compare query/log evidence for caching.
- Constraint: Small fixtures may not show a meaningful speed difference; do not fabricate a benchmark.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.12.0)

### v0.13 — Sources and adapter plugins

- Sources with freshness checks.
- Stable adapter API and separate adapter plugins; Presto adapter.
- Demo: Declare raw orders and payments as sources, then demonstrate a stale payment feed.
- Constraint: Historical freshness command syntax differs from modern dbt source freshness.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.13.0)

### v0.14 — Snapshots replace archives

- Snapshots replace archives.
- ls and RPC server; configurable test severity. Release notes also announce run-operation, although the inspected 0.13 package already includes that CLI; exact introduction remains a source conflict.
- Demo: Change a customer city and inspect snapshot history; issue a warning for a soft business-rule violation.
- Constraint: Archives are deprecated/replaced, not a brand-new historical-data capability.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.14.0)

### v0.15 — Partial parsing and structured operations

- Opt-in partial parsing; structured/JSON logging.
- Python 2 support dropped; improved snapshot/docs/RPC behavior.
- Demo: Edit one Jaffle Shop model and show partial parsing; inspect a structured run log.
- Constraint: Record exact Python runtime and partial-parsing configuration for the checkpoint.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.15.0)

### v0.16 — Richer metadata

- meta and richer resource documentation.
- Documentation for macros, analyses, snapshots and seeds; source/column tags.
- Demo: Add owner and business context to the revenue model; inspect documented macro arguments and menu seeds.
- Constraint: These are Core project metadata features, not a separately hosted catalogue product.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.16.0)

### v0.17 — Safer execution and configurable sources

- fail-fast and path-based selection.
- Source overrides/enablement; persist_docs support expands across warehouses.
- Demo: Run with fail-fast after an intentional bad model, then persist revenue descriptions into Postgres comments.
- Constraint: Show concrete output rather than promise large speedups.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.17.0)

### v0.18 — State-aware selection and downstream context

- state:modified/new, --state, --defer and YAML selectors.
- 0.18.1 adds exposures representing dashboards and other downstream uses.
- Demo: Change refund logic and rebuild its affected slice against prior state; at 0.18.1 add a Jaffle Shop dashboard exposure.
- Constraint: File-based state selection is distinct from the 2026 commercial dbt State product.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.18.0), [source 2](https://github.com/dbt-labs/dbt-core/releases/tag/v0.18.1)

### v0.19 — More complete history and artifacts

- Snapshot hard-delete invalidation and revival.
- Deferral extends to tests; versioned artifact schemas and project config migrations.
- Demo: Delete a customer from the raw feed and show the snapshot record being invalidated.
- Constraint: Exposures already existed in 0.18.1; do not attribute them here.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.19.0)

### v0.20 — Actionable data-test failures

- Store test failures in the database.
- Test where/limit/warn_if/error_if/fail_calc configuration; experimental parser.
- Demo: Persist failed payment rows and distinguish warning thresholds from errors.
- Constraint: Do not use native unit-test YAML here; that arrives in 1.8.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.20.0)

### v0.21 — Build in dependency order

- dbt build runs seeds, snapshots, models and tests in DAG order.
- on_schema_change for incremental models; state detects macro changes.
- Demo: Run the whole Jaffle Shop workflow with one build and show how a failed test prevents downstream work.
- Constraint: 0.21 is the last 0.x minor series; no 0.22–0.99 chapters.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v0.21.0)

### v1.0 — The stable framework

- Default partial/static parsing, result selectors and interactive init.
- Metrics nodes enter the manifest; package/adapter installation conventions evolve.
- Demo: Run the established shop project, fail a model, and select prior failures for a targeted rerun.
- Constraint: Metrics metadata in Core does not mean a hosted Semantic Layer query service existed at 1.0.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v1.0.0)

### v1.1 — Work only from fresher sources

- source_status:fresher+ selection.
- Composite unique_key lists and custom generic-test names.
- Demo: Load new orders only and build descendants of the fresher source.
- Constraint: This is explicitly user-driven freshness/state selection, not automatic 2026 dbt State.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v1.1.0)

### v1.2 — Grants as project configuration

- Grants managed through model configs.
- Cross-database macros move into Core; ratio metrics supported.
- Demo: Grant a reporting role access to revenue through model configuration.
- Constraint: Local role verification works only on an adapter with grants support, such as Postgres.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v1.2.0)

### v1.3 — Python models

- Python models, including incremental support on supported platforms.
- More portable macros and .dbtignore.
- Demo: Add an optional Python customer segmentation model while keeping SQL revenue as the shared baseline.
- Constraint: Python-model execution is adapter-specific and cannot be assumed on local Postgres; may require another adapter or evidence-only experience.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v1.3.0)

### v1.4 — Fine-tuning incremental work

- Incremental predicates and favor-state deferral.
- Buildable indirect test selection; richer structured logs and warning controls.
- Demo: Constrain the scanned history for an incremental revenue model; show favor-state using a known reference manifest.
- Constraint: Adapter support and generated SQL must be validated for the chosen target.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v1.4.0)

### v1.5 — Models as governed interfaces

- Contracts, model versions, groups and access.
- dbt show and programmatic dbtRunner.
- Demo: Break a revenue contract, then provide v1/v2 revenue model interfaces and preview a result.
- Constraint: Database-enforced constraints differ by adapter; do not conflate contract validation with all database constraints.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v1.5.0)

### v1.6 — Recovery, cloning and semantic-model foundations

- retry, clone and materialized views.
- Semantic-model parsing and cross-project dependency foundations.
- Demo: Retry a failed shop build; inspect a local materialized view; offer clone only where its semantics are supported.
- Constraint: Postgres clone fallback is not zero-copy storage cloning; hosted Mesh and Semantic Layer availability must be dated independently.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v1.6.0)

### v1.7 — Reproducible dependencies and shareable docs

- Package dependency locking and static documentation.
- Saved-query semantic metadata; configurable seed delimiters.
- Demo: Install locked shop packages and open a self-contained documentation page.
- Constraint: Semantic query execution needs separate MetricFlow/service setup; parsing alone is not the whole product.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v1.7.0)

### v1.8 — Native unit tests

- Native SQL unit tests with controlled fixtures.
- Schema-only --empty builds; Core/adapter internals decoupled.
- Demo: Test refund edge cases before materializing full data; display expected versus actual results.
- Constraint: Unit tests still use a warehouse to execute SQL; --empty also connects and executes, and is not an offline SQL validator.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v1.8.0)

### v1.9 — Microbatch and simpler snapshots

- Microbatch incremental strategy and batch retry.
- YAML snapshots and new snapshot configuration.
- Demo: Backfill daily order batches and repair a late-arriving order; express customer history in YAML.
- Constraint: Execution and parallelism depend on adapter support. Keep event timestamps deterministic.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v1.9.0)

### v1.10 — Sampling and migration readiness

- Time-window sample mode and custom source freshness queries.
- Macro argument validation and clearer configuration deprecations.
- Demo: Build a small trading window, then show actionable warnings from a deliberately outdated configuration.
- Constraint: Some configuration exists for platform features; its presence in Core is not proof the hosted feature is locally available.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v1.10.0)

### v1.11 — Functions become project resources

- User-defined functions represented as first-class DAG resources.
- Stricter config validation and DBT_ENGINE_ environment-variable namespace.
- Demo: Create a revenue-normalization function and reference it from a shop model, on a supported adapter.
- Constraint: Language and adapter support must be checked; do not assume Postgres supports every new UDF feature.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v1.11.0)

### v1.12 — Preparing for the Rust engine

- Opt-in v2 Rust parser; vars.yml and ad hoc run-operation --sql.
- Expanded UDFs, semantic definitions and catalogue integration; on_error configuration.
- Demo: Compare parsers on the same shop project and validate equivalent model selection; move stable vars into vars.yml.
- Constraint: GitHub/PyPI July 16 differs from blog edited Aug 17. Optional parser is an extra binary. Catalogue integrations/UDFs have adapter-specific requirements.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v1.12.0), [source 2](https://www.getdbt.com/blog/dbt-core-v1-12-is-ga)

### v2.0 — One engine, two distributions

- Rust engine becomes dbt v2; full dbt and Apache-licensed dbt OSS distributions.
- Full distribution adds proprietary SQL comprehension, including earlier SQL feedback.
- Demo: Run the shop locally with DuckDB, introduce an invalid column, and compare feedback to a v1 checkpoint.
- Constraint: Do not attribute proprietary SQL comprehension to dbt OSS. Postgres is coming soon at GA; v1 remains maintained, so v2 does not mean v1 vanished.
- Sources: [source 1](https://github.com/dbt-labs/dbt/releases/tag/v2.0.0), [source 2](https://www.getdbt.com/blog/dbt-summit-2026-product-announcements), [source 3](https://www.getdbt.com/licenses-faq)

## Content and implementation recommendations

1. Preserve every minor-series chapter but put patch milestones inside it. Date each feature to its actual patch. A first-release anchor cannot silently show features or products shipped months later. Provide an explicit patch event/date selection or make the chapter cutoff explicit.
2. Choose one historical runtime per series for the first runnable build, while retaining exact feature-introduction dates. Prefer a tested stable patch, not mechanically the first .0 or latest release. The JSON's latest stable patch is an observed inventory, not a recommendation or compatibility certification.
3. Keep release facts, proposed demos and proven execution results separate. Every demo here is proposed and untested. Content can be complete while a checkpoint honestly says unavailable, compatibility adaptation required or external service required.
4. Ship engine/adapter/dependency/runtime locks and immutable data snapshots together. Feature availability varies by adapter. Historical warehouse client packages may no longer authenticate or install today.
5. Show original language/syntax. Earliest materialized config is Boolean; 0.4 adds named materializations and sql_where; 0.5 archives differ from 0.14 snapshots; pre-0.21 no build command; pre-1.8 no native unit-test YAML.
6. Do not infer paid product GA from a manifest node or configuration field in Core. Metrics nodes in 1.0, semantic models in 1.6 and model freshness config in 1.10 require separate product dates.
7. Do not promise fully local historical fidelity in every chapter. Before 0.5.1 the implementation is Redshift-oriented; at v2 GA Postgres is coming soon while DuckDB is GA. A reproducible local compatibility route must be tested and labelled.
8. The 20-minute recording can visit every version briefly while spending more time on selected demos. Do not rename version chapters into thematic chapters.
9. Keep the three app tabs pinned to a single explicit as-of date, and record company/product names appropriate to that date. Separate narrative editorial annotations from observed release facts.

## High-priority validation before coding

- Prove 0.1.14 and 0.2.3.0 installation plus SQL compile/run in an isolated legacy environment. If adapted to Postgres, show the patch and compatibility status.
- Prove one local Postgres path for 0.5.1–1.12 and a DuckDB path for v2; change backend only with visible explanation and invariant expected results.
- Verify Python-model, UDF, grants, clone and microbatch adapter support at each exact pinned version.
- At v2 compare full dbt versus dbt OSS without attributing proprietary SQL comprehension to OSS.
- Consult tagged source for recent release claims if the current upgrade guide includes later backports or live product renames.

## Source ledger

- [GitHub release API](https://api.github.com/repos/dbt-labs/dbt-core/releases?per_page=100) — paginated pages 1–4 saved locally; 371 release records.
- [PyPI dbt JSON](https://pypi.org/pypi/dbt/json) and [PyPI dbt-core JSON](https://pypi.org/pypi/dbt-core/json) — per-file upload timestamps and package availability.
- [Tagged historical changelog](https://github.com/dbt-labs/dbt-core/blob/v0.13.0/CHANGELOG.md) — especially 0.2.3.0, 0.5.1, 0.5.4, 0.6–0.8.
- [v1.8 upgrade guide](https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/upgrading-to-v1.8) — unit tests, empty execution and adapter decoupling.
- [v1.11 upgrade guide](https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/upgrading-to-v1.11) — first-class UDFs and config validation.
- [v1.12 announcement](https://www.getdbt.com/blog/dbt-core-v1-12-is-ga) — parser, UDF, vars and semantic changes.
- [Summit 2026 announcement](https://www.getdbt.com/blog/dbt-summit-2026-product-announcements) — v2 GA, adapters and distribution distinction.
- [Licensing FAQ](https://www.getdbt.com/licenses-faq) — dated rename history and future 1.13 support plan.

Machine-readable detail: `release-inventory.json`, including 35 chapters, source URLs, exact upload/release timestamps, patch submilestones and all stable versions observed per series.
