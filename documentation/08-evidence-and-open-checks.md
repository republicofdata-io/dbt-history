# Evidence, corrections and remaining checks

> **Scope update · 22 September 2026:** this report preserves the original research. The current deliverable is the app with [guided, read-only examples](02-guided-examples-brief.md). Runtime build instructions and execution acceptance checks below are reference material only; full runtime reproduction is outside the current scope.

## Research method and confidence

Reviewed official release APIs, tagged changelogs/source, original PyPI source archives and metadata, official product/ownership announcements, documentation, page publication metadata and Olivier's two articles. The runtime researchers inspected actual historical code and v2's native packaging manifests. No engine was installed or executed.

RoD supplied current project context. A search of the local durable PKM vault found no relevant dbt mental-model note in the available material; Olivier's supplied 2018 and 2022 articles were used for documented perspective. The absence of a retrieved note is not evidence that he has no view.

Treat a claim as high confidence when a dated primary release or immutable source establishes it. Treat original article metadata as publication evidence. Treat retrospective dates, bounded observations and conflicting sources as qualified. Current documentation can establish current behavior but should not overwrite historical release content.

## Corrections to the concept prototype

| Draft assumption or common shortcut | Researched treatment |
|---|---|
| Begin at Olivier's 2018 adoption | Begin in 2016; adoption is a personal milestone. |
| `dbt==0.1.0` | No such package found; first 0.1 artifact is 0.1.1. |
| Modern ref/test workflow from the beginning | 0.1.1 lacks ref and test. ref/deps are present by 0.1.14; test in 0.2.0. |
| Seeds introduced in 0.10 | Present in 0.2.3.0; substantially revised in 0.10. |
| PostgreSQL works natively throughout history | First-class support begins 0.5.1; earlier local runs require a disclosed surrogate experiment. |
| Exposures introduced in 0.19 | 0.18.1. |
| Every event belongs to a major/minor release day | Patch, product, announcement, GA and artifact dates differ. |
| Sinter rebrand date inferred from page edit | Original publication metadata establishes 15 January 2019. |
| Company rebrand in May 2021 | Official announcement is 30 June 2021. |
| 2019 IDE means 2019 GA | 2019 history and January 2020 GA announcement must be distinguished. |
| Explorer remains current name in 2025/26 | Catalog from May 2025; also account for Studio, Canvas and Insights. |
| SQLMesh remains independent at final endpoint | Acquired by Fivetran in September 2025; combined family after June 2026 merger. |
| Metaplane acquired by dbt | Acquired by Datadog. |
| v2 equals a single fully open-source distribution | Full dbt and Apache dbt OSS are distinct distributions. |
| Install `dbt-core==2.0.2` | Full package is `dbt`; OSS package is `dbt-oss`. |
| All v2 features work on local DuckDB | Python models are rejected; full strict analysis has a login gate; services have separate requirements. |
| Every preview announced at Summit is GA | Preserve per-product/per-surface maturity. |
| Retiring Native App already removed in July | Maintenance begins July; removal scheduled November 2026. |

## Conflicts and bounded implementation checks

| Issue | Evidence / resolution for the brief | Next check |
|---|---|---|
| v2 date | Artifact September 14; licence/name change September 15; official GA press/recap September 16 | Keep separate fields and a selectable Summit milestone. |
| Core 1.12 date | PyPI/GitHub July 16; blog's edited date August 17 | Do not use edited date as original GA evidence; extract publication metadata if needing an announcement milestone. |
| `run-operation` history | Inspected 0.13.0 package CLI includes it, while 0.14 release notes announce its addition | Do not label an exact first release in public copy until archive/tag lineage is reconciled. The 0.14 checkpoint can still demonstrate it. |
| Mesh GA | May 14 press says GA; dedicated post published May 28 | Use available-by May 14, with later post as additional evidence. |
| Atlan early launch | 2019 announcement versus current company history's 2020 public launch | Qualify early milestone; use 2022 dated product evidence for unambiguous chart inclusion. |
| Census close and rename | Agreement May 1, acquired by September 3; later pages use updated Activations name | Keep bounded dates; do not infer ownership or name on an arbitrary exact day. |
| DuckDB extensions in v2 | Setup docs describe restriction; 2.0.2 source selects an official driver with extension support comments | Test chosen distribution/driver, default demo without extensions. |
| v2 authentication | Generic free-local language is broader than detailed full-feature login guidance | Verify strict mode after login and report fallback behavior explicitly. |
| MetricFlow with v2 | Documentation describes local mf use; package installs Python Core dependencies | Separate environment and prove artifact interoperability. |
| Historical Python/package constraints | Metadata gives ranges, not solvable contemporary environments | Build and lock per checkpoint; archive native dependencies and wheelhouses. |
| Adapter-dependent features | Python, UDFs, cloning, microbatch and grants vary by version/adapter | Test exact combination; do not generalize engine-level support. |

These are bounded execution/editorial checks, not a need to repeat the whole research project. The main historical inventory, architecture and handoff can proceed now.

## Preserve these distinctions

- Original availability versus later documentation edits.
- Product ownership versus branding versus integration.
- Core metadata/configuration versus a hosted query or orchestration service.
- Source-confirmed implementation versus tested compatibility.
- Local target execution versus offline compilation/validation.
- Native historical behavior versus a disclosed modern compatibility adaptation.
- Representative ecosystem presence versus a market-share claim.

## Portable evidence included

The release JSON preserves exact upload/release timestamps and URLs for 35 chapters and 250 stable package versions. Publication metadata is included separately. Runtime reports preserve primary source links and, for v2, concrete wheel URLs and expected hashes. Root research and code inspections remain reproducible from those references.

Handoff QA checked 177 unique linked primary/reference URLs: 171 responded successfully to direct HEAD requests; six had access restrictions or timeouts and were already available through the browsing research tool. No 404 response was found. All local Markdown links resolve. These checks validate the package's references, not the proposed runtime environments.

Raw downloaded repositories, source archives and larger API responses remain under the original workspace's `work/release-history`, `work/historical-runtime`, `work/current-runtime` and `work/product-history`. They are scratch evidence, not required dependencies of the app. Do not ship an entire downloaded upstream source tree as app assets.
