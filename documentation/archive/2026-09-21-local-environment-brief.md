> **Superseded on 22 September 2026.** Preserved as historical planning context. Its build tasks are outside the current scope. Use the [guided examples brief](../02-guided-examples-brief.md). Relative research references in the original text refer to the parent handoff folder.

# Coding brief: the Waffle Shop dbt history lab

## Deliverable

Build a local repository in which Olivier can select each published dbt minor series from v0.1 through v2, restore the matching Waffle Shop project and data, run a historically appropriate demonstration, and inspect the result. Keep the workflow simple enough to use while recording a 20-minute video.

There are 35 chapters, with optional significant patch checkpoints. “All versions” means all these minor-series chapters in the first delivery, not executing every one of the 250 stable package versions inventoried. Retain the full inventory so additional patch experiments can be added. This interpretation follows Olivier's requested v0.1, v0.2, … chapter structure.

The research is complete enough to start building. Compatibility remains to be established through execution. The first task is to prove the riskiest boundaries, then populate the complete matrix. Do not describe this brief's proposed commands or environments as already implemented.

## Host and constraints

Read-only inspection on 21 September 2026 found macOS 26.6.2, Apple Silicon arm64, working Docker Desktop 4.81.0 / Docker Engine 29.6.1, and installed uv, Git, Python and GitHub CLI. Recheck these with a `doctor` command. No dbt installation or container was run during research.

Use project-scoped environments. Preserve any existing global dbt installation and shell configuration. Default to local fixtures and disposable databases, with no paid warehouse or platform subscription required for the common baseline. Optional features needing an account or external platform must state that requirement before use.

## Architecture recommendation

Use one repository with a small host-side launcher and declarative checkpoint manifests. Keep the data scenario stable while allowing the executable, SQL, YAML, adapter and database to change across eras. Do not generate one current project and assume older engines will accept it.

Suggested layout:

```text
README.md
AGENTS.md
catalog/                   # release inventory, checkpoint manifests, feature gates
fixtures/waffle-shop-v1/    # immutable base data and numbered change batches
checkpoints/               # era-appropriate project code and command recipes
environments/              # container recipes, locks, checksums, driver manifests
launcher/                  # host-side version selection and lifecycle operations
expected/                  # independent business assertions and expected failures
artifacts/<checkpoint>/    # generated logs, SQL, docs and result summaries
research/                  # this handoff and linked sources
```

Directory-per-checkpoint is the recommended default: the user can inspect two versions side by side without checking out another branch. Shared fixture and assertion helpers are useful; avoid a deeply inherited template system that hides historical differences. Git tags can mark finished milestones but should not be required to run the lab.

The website is a separate consumer of generated artifacts. It is not responsible for creating databases or running arbitrary commands.

## Runtime lanes

| Lane | Proposed implementation | Meaning and limits |
|---|---|---|
| 0.1–0.5.0 | Isolated Linux/amd64 legacy Python runners; try unmodified Redshift-target code against a private PostgreSQL surrogate | Experimental until demonstrated. It is not native PostgreSQL support and not a Redshift emulator. |
| 0.5.1–0.12 | Legacy monolithic `dbt` package, native Postgres target, pinned dependencies | Old Python and unrelated bundled connector dependencies make packaging the main risk. |
| 0.13–1.7 | Separate pinned `dbt-core` and `dbt-postgres`, isolated Python runner | Respect each exact adapter's Core dependency and project format. |
| 1.8–1.12 | Independently pinned Core and adapter families | Do not invent `dbt-postgres==1.12`; 1.9.1 is a candidate for later Core, pending tests. |
| 2.0 | Isolated full `dbt` distribution with built-in DuckDB; native arm64 preferred for developer experience | Start validation with 2.0.2; use separate OSS environment if demonstrating distribution differences. No v2 Postgres promise at GA. |
| Optional features | Separate compatible adapter or service environment | Python models, some UDFs, zero-copy clone, hosted catalogue and commercial services are not universally available on the baseline. |

Sources and per-minor Python candidates are in `06-historical-runtime.md` and `07-v2-runtime.md`. These are starting points, not certified pins. Linux/amd64 emulation avoids some missing historical arm64 packages but must itself be tested. Do not compare an emulated legacy runtime's wall time to native v2 as a fair engine benchmark.

Database selection is also a test result. Try a supported disposable Postgres server for recent versions; add a separately isolated older server only where evidence shows it is necessary. Older libpq authentication and catalogue-query compatibility need investigation. Do not assume an old client intrinsically requires an equally old server. Bind any host access to localhost and keep legacy authentication within the private lab network.

## Exact version and feature policy

Every checkpoint records both its **chapter** and **executable patch**. The chapter's historical date is not automatically the runtime's date. Pin a tested patch that demonstrates the intended feature and visibly disclose it.

Mandatory early submilestones: 0.1.1 baseline; 0.1.14 for `ref()` known present by that patch; 0.2.3.0 for seed; 0.5.1 for archives/Postgres; 0.5.4 for custom SQL tests; 0.8.3 for BigQuery history; 0.18.1 for exposures. The exact first patch introducing `ref()` is not established, so retain “present by 0.1.14”. [Release inventory](../03-release-history.md)

Do not synthesize Git refs: the historical `0.3.0` tag lacks the usual `v`, and `0.2.3.0` has four version components. Preserve exact package identifiers, tags and archive hashes.

## Reproducibility contract

For each prepared environment capture:

- engine distribution, exact version, source commit/archive and SHA256;
- Python version, OS/base image digest, CPU architecture and emulation status;
- exact adapter plus every transitive dependency, pip/build tools and native libraries;
- database server or DuckDB driver version, path and checksum;
- checkpoint source revision, fixture revision, commands and expected outcomes;
- required authentication state and optional services;
- build log, dependency resolution output, version output and verification timestamp.

Archive a wheelhouse or equivalent downloadable artifacts after a successful build. Do not rely on today's resolver to keep resolving old broad dependency ranges. Avoid silently bypassing dependency checks. A minimal compatibility patch is a last resort: store its diff/hash and rationale, preserve the original archive, and mark results adapted.

For v2 the PyPI source package downloads a platform wheel. Preserve that wheel and its manifest, not just the tiny source archive. Cache the native DuckDB driver independently. Core 1.12 also brings an experimental parser binary and MetricFlow dependencies. See the runtime evidence reports for these packaging details.

Keep profiles, target/log directories, parse caches, state manifests and databases isolated per checkpoint. Never reuse incompatible partial-parse caches. Never alternate different DuckDB versions over the same mutable database file. Store credentials outside Git; exclude them from captured artifacts.

## Waffle Shop data and assertions

The recurring question is revenue by location and trading day. Recommended rule: net revenue equals successful captured payments minus successful refunds, attributed to the original order's location and order date. Failed payments and cancelled orders contribute zero. State this clearly; it is an editorial scenario choice, not accounting guidance.

Use integer cents, UTC fixture timestamps and stable IDs. Small human-readable CSVs should include customers, locations, menu items, orders, order lines, payments and refunds. The oldest releases load raw data through a separate fixture loader; seed becomes a demonstration only when the selected engine supports it.

Minimum fixture cases:

| Case | Inputs | Independent expected result |
|---|---|---|
| Toronto normal order | 1,200-cent captured payment, 200-cent refund | 1,000 cents net revenue |
| Montréal normal order | 1,800-cent captured payment | 1,800 cents net revenue |
| Failed payment | 900-cent failed payment | Zero contribution |
| Baseline combined | The preceding cases | 2,800 cents |
| Late order batch | Additional 500-cent captured order for an earlier trading day in Toronto | Toronto 1,500; combined 3,300 cents after repair |
| Customer relocation | Change city after first load | Revenue unchanged; archive/snapshot preserves history when supported |
| Data quality defect | Orphan payment or duplicate ID in a separate bad fixture | Intentional test failure, then clean success after reset |
| Refund logic defect | Treat refunds as additional sales | Business assertion and later unit test must fail |

These numbers are proposed golden fixtures to implement, not observed dbt results. Add a second successful payment on one order to expose accidental join duplication. Keep expected totals independently calculated rather than copied from model output.

Use numbered fixture batches for incremental and snapshot demonstrations. For source freshness, derive feed timestamps from a recorded invocation reference time or use a controlled clock; otherwise a fixed 2020 fixture becomes permanently stale. Record that reference time in results. Separate stale-feed assertions from wall-clock-dependent display text.

## Demonstration recipes

Use `03-release-history.md` for the full per-version mapping. Each recipe contains a clean baseline, intentional change, exact commands, expected visible difference and reset action. A negative demonstration passes only when the intended business/configuration error is detected; an install failure is not a successful negative test.

Important gates:

- 0.1.1 has neither modern `ref()` nor `test`/`seed`; show its actual compilation workflow.
- Incremental and ephemeral examples begin at 0.4. Archives precede 0.14 snapshots.
- Documentation begins at 0.11; project sources/freshness at 0.13. Preserve their historical YAML/CLI spelling.
- Use explicit command sequences before 0.21, which introduces `dbt build`.
- 0.18 file-based state/defer is different from the 2026 dbt State service.
- 1.3 Python models need an adapter that actually supported them at the selected date. A modern dbt-duckdb demonstration cannot automatically stand in for the original release.
- 1.5 contracts are not a guarantee that every warehouse enforces every database constraint.
- 1.6 clone must disclose whether it is actual storage cloning or an adapter fallback.
- 1.8 SQL unit tests and `--empty` still execute against a target; neither is proof of offline SQL analysis.
- Microbatch requires exact adapter support, event-time configuration, deterministic backfill and late-data assertions.
- v2 DuckDB rejects Python models. Full strict SQL analysis requires a login according to current detailed availability docs; verify and report authentication, rather than silently demonstrating a fallback.
- MetricFlow needs its own environment because its current package depends on Python Core. Verify artifact interoperability before describing it as a working local v2 semantic service.

Optional hosted demonstrations use sourced captures or real authorized integrations, clearly labelled. Do not build fake Sinter, Cloud, Canvas or State interfaces and present them as original products.

## Proposed operator workflow

The launcher should expose operations equivalent to these names; choose a convenient executable wrapper during implementation:

```text
lab doctor
lab list
lab prepare 0.5.1
lab reset 0.5.1
lab demo 0.5.1 customer-history
lab inspect 0.5.1
lab compare 0.13 0.14
lab capture 1.8
lab verify --all
```

`prepare` resolves/builds only explicit pins. `reset` affects only the selected lab's generated state. `demo` uses its checkpoint recipe. `inspect` opens readable SQL, tables, logs or documentation. `compare` explains code/workflow changes and checks shared business outcomes. `capture` emits sanitized artifacts and a result summary for the app. `verify --all` aggregates failures without stopping unrelated checkpoints.

No package downloads or dependency resolution should be necessary during the recording once preparation has completed. Prove network-free replay for baseline local demonstrations; mark features that still require authentication/service calls separately.

## Implementation order

1. Create the manifest schema, fixture loader, independent revenue assertions and launcher skeleton. Import all 35 chapters as `research-only` rather than falsely green.
2. Run feasibility spikes for 0.1.1/0.1.14, 0.2.3.0, 0.5.1, 0.13.0, 0.17.0, 1.0.0, 1.8.0, 1.12.0 and v2.0.2. These cover the oldest syntax, Postgres arrival, package split, config migration, native dependencies, unit tests and engine replacement.
3. Establish reproducible pins from those results. Resolve a failing boundary with the smallest documented change; continue other independent versions.
4. Fill every remaining minor chapter. Add meaningful patch demonstrations where the initial release doesn't contain the feature.
5. Add adapter-dependent optional lanes and authenticated v2 SQL analysis. Do not let a paid-service requirement block the baseline lab.
6. Capture outputs, check repeated resets, export app results, and perform a recording rehearsal.

## Status and acceptance

Track execution progress (`research-only`, `installed`, `compiled`, `ran`, `demo-verified`, `blocked`) separately from fidelity (`native`, `surrogate`, `adapted`) and service dependency (`local`, `login-required`, `external-service`). A source-backed feature claim is not an execution status.

The desired completion state is a repeatable, verified checkpoint for every chapter. If an environment remains blocked, report it explicitly as unfinished with its exact cause, attempted combinations, evidence and next diagnostic. All chapters remain navigable. A documented blocker preserves an honest handoff but does not count as achieving full runtime coverage.

Before declaring the runnable lab ready:

- Every claimed working checkpoint passes installation/version checks, fresh reset, baseline business assertions and its feature recipe twice.
- Negative fixtures fail for the expected reason and recover after reset.
- Each run reports exact engine, adapter, database, architecture and source revision.
- Baseline revenue is invariant across equivalent checkpoints; intentional scenario changes explain differences.
- Logs and original generated artifacts are retained, with their schema/version identifiers.
- The manifest, locks and hashes reproduce the tested environment; prepared baseline runs can replay without external network access.
- The app export reflects actual verification status and contains no credentials or fabricated output.
- README explains the shortest successful route and recovery from a failed demo; AGENTS preserves historical-fidelity and environment-isolation rules.

Do not install a cloud warehouse, subscribe to a product, or alter the user's global tooling merely to turn an optional chapter green. The research reports identify the concrete alternative or limitation to show.
