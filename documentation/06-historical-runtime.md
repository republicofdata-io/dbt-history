# Historical dbt runtime research

> **Scope update · 22 September 2026:** this report preserves the original research. The current deliverable is the app with [guided, read-only examples](02-guided-examples-brief.md). Runtime build instructions and execution acceptance checks below are reference material only; full runtime reproduction is outside the current scope.

Research date: 2026-09-21. Scope: local execution of dbt 0.1–1.12 on Olivier’s Apple Silicon Mac; v2 is handled separately by the parent research task.

## Evidence and status

This is source and package-metadata inspection, **not a tested installation matrix**. No historical engine was installed or executed, no container was built or started, and no PostgreSQL compatibility combination was smoke-tested. Requirements below were read from PyPI release metadata, release source distributions, and tagged dbt source. Proposed runtime pins are starting points for the coding agent, not proven recipes.

Artifacts beside this report preserve complete PyPI JSON for `dbt`, `dbt-core`, and `dbt-postgres`, selected release JSON, source archives, setup files, tagged tox files, and selected code. `matrix.json` contains machine-readable first/last stable three-component versions plus runtime requirements. **It is not a canonical release inventory:** its three-component filter excludes historical four-component releases such as 0.2.3.0. Do not import it as the app timeline without merging the separate release-history research.

## Main conclusions

1. Build one immutable runner environment per chosen exact release, with one matching Waffle Shop checkpoint. Changing only the dbt executable cannot recreate the old experience.
2. Use Linux/amd64 container runners for archaeology. Native arm64 may be used for modern runners once their full wheel set is verified. Python 2 and old drivers should remain in isolated containers. Docker Desktop supports emulation; its performance cost makes historic-versus-current speed comparisons misleading. [Docker multi-platform documentation](https://docs.docker.com/build/building/multi-platform/)
3. `dbt` was the monolithic PyPI package through 0.12. The 0.13 source/package split created `dbt-core` and adapter packages. Install just the Postgres adapter and its exact Core version for the later legacy environments; avoid the meta-package that pulls unrelated warehouse drivers. [Core 0.13 metadata](https://pypi.org/pypi/dbt-core/0.13.0/json), [Postgres 0.13 metadata](https://pypi.org/pypi/dbt-postgres/0.13.0/json)
4. Before 0.5.1 the code recognizes Redshift, not a native Postgres target. A limited local PostgreSQL surrogate may work through the Redshift profile, but this is an experiment that requires honest labeling and tests, not evidence of historical PostgreSQL support.
5. Freeze every transitive Python dependency, build tool, OS image digest, and native driver library. Pinning only `dbt==old-version` allows modern dependencies into a historical environment and is inadequate for reproducibility.
6. After 1.8, Core and adapters have independent versions. There is no Postgres 1.12 package to mirror Core 1.12. Pin Core, the chosen adapter, dbt-adapters, dbt-common, and their dependency tree separately. [dbt 1.8 migration guide](https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/upgrading-to-v1.8)

## Per-minor compatibility evidence

“Python declared” means the package metadata requirement where present; older releases omitted it, so tox evidence is used instead. It does not mean every allowed Python version works. Candidate Python is a proposed starting point. Exact patch/image digest and full constraints must be fixed after installation tests. The engine column gives the first three-component stable PyPI version for the family, except 0.0.1 is an optional origin exhibit. The selectable family can have later patches and feature submilestones.

| Family | First package observed | Python declared / historical CI | Candidate Python | Candidate adapter strategy |
|---|---|---|---|---|
| 0.0 | [dbt 0.0.1](https://pypi.org/pypi/dbt/0.0.1/json) | No Python requirement published; inspect exact source | 2.7.18 (proposed) | Bundled Redshift; local surrogate unverified |
| 0.1 | [dbt 0.1.1](https://pypi.org/pypi/dbt/0.1.1/json) | No Python requirement published; inspect exact source | 2.7.18 (proposed) | Bundled Redshift; local surrogate unverified |
| 0.2 | [dbt 0.2.0](https://pypi.org/pypi/dbt/0.2.0/json) | No Python requirement published; inspect exact source | 2.7.18 (proposed) | Bundled Redshift; local surrogate unverified |
| 0.3 | [dbt 0.3.0](https://pypi.org/pypi/dbt/0.3.0/json) | No Python requirement published; inspect exact source | 2.7.18 (proposed) | Bundled Redshift; local surrogate unverified |
| 0.4 | [dbt 0.4.0](https://pypi.org/pypi/dbt/0.4.0/json) | tox: Python 2.7 / 3.5 | 2.7.18 | Bundled Redshift; local surrogate unverified |
| 0.5 | [dbt 0.5.0](https://pypi.org/pypi/dbt/0.5.0/json) | tox: Python 2.7 / 3.5 | 2.7.18 | Bundled (native Postgres from 0.5.1) |
| 0.6 | [dbt 0.6.0](https://pypi.org/pypi/dbt/0.6.0/json) | tox: Python 2.7 / 3.5 | 2.7.18 | Bundled (native Postgres from 0.5.1) |
| 0.7 | [dbt 0.7.0](https://pypi.org/pypi/dbt/0.7.0/json) | tox: Python 2.7 / 3.6 | 3.6.15 | Bundled (native Postgres from 0.5.1) |
| 0.8 | [dbt 0.8.0](https://pypi.org/pypi/dbt/0.8.0/json) | tox: Python 2.7 / 3.6 | 3.6.15 | Bundled (native Postgres from 0.5.1) |
| 0.9 | [dbt 0.9.0](https://pypi.org/pypi/dbt/0.9.0/json) | tox: Python 2.7 / 3.6 | 3.6.15 | Bundled (native Postgres from 0.5.1) |
| 0.10 | [dbt 0.10.0](https://pypi.org/pypi/dbt/0.10.0/json) | tox: Python 2.7 / 3.6 | 3.6.15 | Bundled (native Postgres from 0.5.1) |
| 0.11 | [dbt 0.11.0](https://pypi.org/pypi/dbt/0.11.0/json) | tox: Python 2.7 / 3.6 | 3.6.15 | Bundled (native Postgres from 0.5.1) |
| 0.12 | [dbt 0.12.0](https://pypi.org/pypi/dbt/0.12.0/json) | tox: Python 2.7 / 3.6 | 3.6.15 | Bundled (native Postgres from 0.5.1) |
| 0.13 | [dbt-core 0.13.0](https://pypi.org/pypi/dbt-core/0.13.0/json) | tox: Python 2.7 / 3.6 | 3.6.15 | dbt-postgres==0.13.0 |
| 0.14 | [dbt-core 0.14.0](https://pypi.org/pypi/dbt-core/0.14.0/json) | tox: Python 2.7 / 3.6 | 3.6.15 | dbt-postgres==0.14.0 |
| 0.15 | [dbt-core 0.15.0](https://pypi.org/pypi/dbt-core/0.15.0/json) | classifiers: 3.6 / 3.7 / 3.8; tox 3.6 | 3.6.15 | dbt-postgres==0.15.0 |
| 0.16 | [dbt-core 0.16.0](https://pypi.org/pypi/dbt-core/0.16.0/json) | classifiers: 3.6 / 3.7 / 3.8; tox 3.6 | 3.6.15 | dbt-postgres==0.16.0 |
| 0.17 | [dbt-core 0.17.0](https://pypi.org/pypi/dbt-core/0.17.0/json) | >=3.6.2 | 3.8.20 | dbt-postgres==0.17.0 |
| 0.18 | [dbt-core 0.18.0](https://pypi.org/pypi/dbt-core/0.18.0/json) | >=3.6.3 | 3.8.20 | dbt-postgres==0.18.0 |
| 0.19 | [dbt-core 0.19.0](https://pypi.org/pypi/dbt-core/0.19.0/json) | >=3.6.3 | 3.8.20 | dbt-postgres==0.19.0 |
| 0.20 | [dbt-core 0.20.0](https://pypi.org/pypi/dbt-core/0.20.0/json) | >=3.6.3 | 3.8.20 | dbt-postgres==0.20.0 |
| 0.21 | [dbt-core 0.21.0](https://pypi.org/pypi/dbt-core/0.21.0/json) | >=3.6.3 | 3.8.20 | dbt-postgres==0.21.0 |
| 1.0 | [dbt-core 1.0.0](https://pypi.org/pypi/dbt-core/1.0.0/json) | >=3.7 | 3.9 (freeze patch after test) | dbt-postgres==1.0.0 |
| 1.1 | [dbt-core 1.1.0](https://pypi.org/pypi/dbt-core/1.1.0/json) | >=3.7.2 | 3.9 (freeze patch after test) | dbt-postgres==1.1.0 |
| 1.2 | [dbt-core 1.2.0](https://pypi.org/pypi/dbt-core/1.2.0/json) | >=3.7.2 | 3.9 (freeze patch after test) | dbt-postgres==1.2.0 |
| 1.3 | [dbt-core 1.3.0](https://pypi.org/pypi/dbt-core/1.3.0/json) | >=3.7.2 | 3.9 (freeze patch after test) | dbt-postgres==1.3.0 |
| 1.4 | [dbt-core 1.4.0](https://pypi.org/pypi/dbt-core/1.4.0/json) | >=3.7.2 | 3.11 (freeze patch after test) | dbt-postgres==1.4.0 |
| 1.5 | [dbt-core 1.5.0](https://pypi.org/pypi/dbt-core/1.5.0/json) | >=3.7.2 | 3.11 (freeze patch after test) | dbt-postgres==1.5.0 |
| 1.6 | [dbt-core 1.6.0](https://pypi.org/pypi/dbt-core/1.6.0/json) | >=3.8 | 3.11 (freeze patch after test) | dbt-postgres==1.6.0 |
| 1.7 | [dbt-core 1.7.0](https://pypi.org/pypi/dbt-core/1.7.0/json) | >=3.8 | 3.11 (freeze patch after test) | dbt-postgres==1.7.0 |
| 1.8 | [dbt-core 1.8.0](https://pypi.org/pypi/dbt-core/1.8.0/json) | >=3.8 | 3.11 (freeze patch after test) | dbt-postgres==1.8.0 |
| 1.9 | [dbt-core 1.9.0](https://pypi.org/pypi/dbt-core/1.9.0/json) | >=3.9 | 3.11 (freeze patch after test) | dbt-postgres==1.9.0 |
| 1.10 | [dbt-core 1.10.0](https://pypi.org/pypi/dbt-core/1.10.0/json) | >=3.9 | 3.11 (freeze patch after test) | dbt-postgres==1.9.1 (candidate; validate with Core) |
| 1.11 | [dbt-core 1.11.0](https://pypi.org/pypi/dbt-core/1.11.0/json) | >=3.10 | 3.11 (freeze patch after test) | dbt-postgres==1.9.1 (candidate; validate with Core) |
| 1.12 | [dbt-core 1.12.0](https://pypi.org/pypi/dbt-core/1.12.0/json) | >=3.10 | 3.11 (freeze patch after test) | dbt-postgres==1.9.1 (candidate; validate with Core) |

Corrections for exact historical fidelity:

- There is **no PyPI dbt 0.1.0** in the retrieved catalogue. Earliest 0.1 is 0.1.1 (2016-04-03), with 0.1.14 uploaded 2016-05-06. Label the chapter “v0.1” while separately showing its executable patch. 0.0.1 was uploaded 2016-03-23. These are upload dates, not independently established public-announcement dates. [dbt PyPI metadata](https://pypi.org/pypi/dbt/json)
- `0.2.3.0` exists and was uploaded 2016-07-15. GitHub has tag `v0.2.3.0`; tag `0.3.0` has no leading v. Do not synthesize tags as `v${version}`. Preserve the exact `git_ref`, package version, and archive checksum independently. [Git refs](https://api.github.com/repos/dbt-labs/dbt-core/git/refs/tags), [0.2.3.0 metadata](https://pypi.org/pypi/dbt/0.2.3.0/json)
- Python 2 support exists in tox through v0.14 and is gone in v0.15’s tox/classifiers. The fact older setup metadata has no Python ceiling does not authorize using current Python. [v0.14 tox](https://github.com/dbt-labs/dbt-core/blob/v0.14.0/tox.ini), [v0.15 tox](https://github.com/dbt-labs/dbt-core/blob/v0.15.0/tox.ini)
- For 0.5, choose at least 0.5.1 when demonstrating native Postgres and archives. Keep the 0.5.0 release date separate from the feature patch date. [0.5.1 package](https://pypi.org/pypi/dbt/0.5.1/json)

## PostgreSQL viability and the earliest releases

The downloaded 0.1.1 `dbt/task/run.py` recognizes only `type: redshift` and constructs a `RedshiftTarget`. It connects through psycopg2, inspects `pg_tables` and `pg_views`, creates schemas, and executes fairly ordinary CREATE TABLE/VIEW statements. Its compilation code does not use the modern `ref()` graph: it reads dependencies from compiled SQL. Consequently, a small Waffle Shop example using plain SQL could plausibly execute unchanged against local PostgreSQL while using a Redshift profile. **This has not been tested.** It is a PostgreSQL surrogate for a Redshift-targeting engine, not a full Redshift emulator.

0.2–0.5.0 retain Redshift-only target selection; materialization paths also generate Redshift distribution/sort syntax when configured. Avoiding those settings may permit a subset to run on PostgreSQL. Do not silently rewrite generated SQL, monkeypatch the engine, or call those releases “Postgres supported.” If a compatibility patch becomes necessary, retain the original artifact and record the patch checksum, rationale, exact effect, and a conspicuous “compatibility adaptation” status. Authentic Redshift is a separate optional cloud lane, not a local prerequisite.

Sources: [0.1.1 source archive metadata](https://pypi.org/pypi/dbt/0.1.1/json), [0.2 source metadata](https://pypi.org/pypi/dbt/0.2.0/json), [0.5 source](https://github.com/dbt-labs/dbt-core/tree/v0.5.0).

Database proposal: start with a modern disposable Postgres service for 0.13–1.12, and a separately isolated historical database lane if legacy client/auth/catalog incompatibility requires it. An older server is not intrinsically required just because the client is old: client library and server versions are distinct. Old libpq may lack SCRAM support, so investigate authentication explicitly; changing pg_hba to md5 alone can still negotiate SCRAM if the stored password uses SCRAM. Do not expose a legacy trust/MD5 database beyond the lab’s private container network. Proposed fallback historical Postgres 9.6 requires its own verified image/digest and startup test; it is not a proven universal solution. [PostgreSQL password authentication](https://www.postgresql.org/docs/14/auth-password.html), [Psycopg installation](https://www.psycopg.org/docs/install.html)

## Dependency hazards established in source

| Engine/package era | Observed requirement | What the runner must account for |
|---|---|---|
| dbt 0.1–0.6 first releases | psycopg2==2.6.1; NetworkX1.11; old sqlparse; unbounded Jinja/PyYAML lower bounds | Historical compiler/libpq headers and dependency constraints; don't let modern Jinja/PyYAML satisfy old broad ranges |
| dbt0.8 | psycopg2==2.6.2; Snowflake connector1.3.15; Celery3.1.23 | Installing monolithic dbt pulls unused connector/transitive native dependencies |
| dbt0.9/0.10 | psycopg2==2.7.1; Google BigQuery driver; Snowflake lower bound | Avoid unconstrained modern connector resolution; PostgreSQL10-era libpq build changes need attention |
| dbt0.11/0.12 | psycopg2>=2.7.5,<2.8; networkx1.11 | Still monolithic; source build may be needed |
| dbt-postgres0.13/0.14 | exact same-version dbt-core; psycopg2>=2.7.5,<2.8 | Adapter split avoids unrelated warehouse SDKs |
| dbt-postgres0.15 | exact Core; psycopg2-binary~=2.8 by default with setup-time option | Record chosen distribution and build behavior |
| dbt-postgres0.16–1.7 first patches | exact Core; psycopg2-binary~=2.8 | `~=2.8` permits later 2.x; freeze the actual installed driver |
| dbt-core0.17 | Jinja2==2.11.2, old requests/idna/cffi caps | Need compatible MarkupSafe and dependency tree, even for Postgres |
| dbt-core1.0 | Jinja2==2.11.3 and dbt-extractor==0.4.0 | MarkupSafe drift and native extractor wheel/platform availability are build gates |
| dbt-postgres1.8.0 | dbt-core>=1.8.0a1, dbt-common/adapters; Linux psycopg2>=2.9,<3, non-Linux psycopg2-binary | On Linux this exact patch requires compiler/libpq headers; don't assume binary wheel installation |
| dbt-postgres1.9.0 | dbt-core>=1.8; psycopg2-binary>=2.9,<3 | Independently pin Core rather than resolving latest |
| dbt-core1.12.0 | Python>=3.10; experimental parser>=2.0.0a4,<3; metricflow>=0.211,<1 | New binary-distribution fetch and dependencies must be captured in image/wheelhouse |

The exact dependency declarations are preserved in the original workspace under `work/historical-runtime/`; each row can be reproduced from `https://pypi.org/pypi/{package}/{version}/json` and the source URL it contains. Candidate constraint fixes such as MarkupSafe==2.0.1, Jinja2==2.11.3, or an old pip are **not blanket replacements**. Apply only to the environment whose source requires them, then verify imports and SQL runs. Python2 environments require a Python2-compatible pip/setuptools pair. Do not “solve” conflicts by skipping dependency checks or globally modifying the host.

The official 1.8 upgrade guide says adapter packages still depend on Core at installation time for backward compatibility. Architectural decoupling means independent release cadence, not that an adapter package necessarily stopped installing Core. [1.8 guide](https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/upgrading-to-v1.8)

## Project format and command gates

A historical checkpoint must contain its own project YAML, profile shape, model configuration, tests, package declaration, and command sequence. The earliest releases differ enough that generating one current project and changing its version constraint is misleading.

- 0.1.1 has `clean`, `run`, `compile`, `debug`; no `test`, `seed`, or `init` in the inspected CLI. Model materialization is a boolean in `model-defaults`; profile handling merges a default `user` profile into the project. Compile and run are separate tasks. Load raw fixture data externally when no seed command exists.
- 0.2.0 CLI adds init/deps/test. Do not equate “dbt tests exist” with today's schema YAML. 0.2.3.0 has a seed command in its inspected CLI, as does0.3.0.
- 0.8 CLI has `archive`, but its compile path is represented differently than 0.9; the runner must inspect exact-version `--help` rather than assuming current commands.
- 0.11 has `docs generate` and `docs serve`. Keep the original docs bundle/artifacts with the checkpoint.
- 0.13 adds source freshness; its inspected package CLI also contains run-operation, although 0.14 release notes announce that command. See the evidence-conflict ledger before claiming an exact introduction version. The source freshness spelling changed historically. Record the command from the exact CLI, not a current docs page.
- 0.14 replaces archive with snapshot and has list, migration, and RPC tasks. A historical archive is not interchangeable with modern YAML snapshots.
- 0.17 source reads `config-version` with default1 and supports v2. Use explicit version-appropriate config; pre-0.17 checkpoints must not blindly inherit config-version2 or `+` configuration prefixes.
- 0.21 has `build`. Earlier checkpoints need explicit seed/run/test/snapshot order and equivalent outcome checks.
- 1.0 changes `source-paths` to `model-paths`, `data-paths` to `seed-paths`, and package directories from dbt_modules to dbt_packages. It removes old test flags and splits out RPC. [1.0 migration guide](https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/Older%20versions/upgrading-to-v1.0)
- 1.8 unit tests/data_tests syntax must stay in1.8+ checkpoints; 1.9 microbatch needs matching adapter strategy support and event-time configuration. A Postgres lab cannot automatically demonstrate Python models or every warehouse-specific feature. Give these a capability status instead of fabricating an equivalent.

Source inspection files for these command claims are preserved in the original workspace under `work/historical-runtime/inspection/` and `work/historical-runtime/fullsrc/`, drawn from their immutable PyPI source archives.

## Suggested coding-agent execution plan

1. Create a manifest keyed by release family and exact executable patch. Each entry stores package/tag/checksum, Python, platform, base-image digest, full dependency lock, adapter, database lane, project checkpoint, fixture version, command capabilities, artifact schema, and evidence URLs.
2. Implement a proof-of-environment spike for0.1.1,0.5.1,0.13.0,0.17.0,1.0.0,1.8.0,1.12.0 before populating all intermediate releases. These span the risky boundaries. Preserve every chapter in the website even if its execution status is pending.
3. Give status values precise meanings: `research-only`, `installable`, `compiles`, `runs`, `demo-verified`, `blocked`, `adapted`, `surrogate`. Installation is not sufficient to label a demonstration verified.
4. Build immutable containers outside the recording session. Export dependency lock, wheelhouse/checksums, exact version output, image digest, and logs. Prefer offline replay after images and fixtures are prepared. Never silently upgrade an old release or dependency to make a chapter green.
5. Use disposable per-checkpoint database/schema state, isolated profiles and credentials, independent output directories, fixed fixture timestamps, and no shared partial-parse/state artifacts across incompatible versions.
6. Each capability demonstration has a before fixture, action, expected changed SQL/data/artifact, and after fixture. Validate business outcomes with SQL assertions independent of dbt's version. Keep expected failures (bad column, contract violation, unit-test defect) distinct from infrastructure failures.
7. Expose human-facing operations such as list, prepare, reset, run, shell, doctor, and capture through a local wrapper. The browser may display generated manifests/results; do not require a public website to control Docker or hold database credentials.
8. Record architecture in artifacts. Do not publish speed comparisons between an emulated old runner and a native modern engine as engine benchmarks.
9. Before handoff completion, every chapter either has a verified runnable checkpoint or an explicit documented blocker with next diagnostic and source evidence. This fulfills “all versions” honestly; placeholders with invented passing logs do not.

## Unresolved issues for implementation

- Full solvable dependency constraints for every exact historical engine. None has been derived by installation here.
- Pre-0.5.1 PostgreSQL surrogate behavior and exact earliest Waffle Shop SQL/profile syntax.
- Availability/digests of historical Python/base images and old OS package repositories.
- Postgres server version that passes all historical adapter metadata queries and the exact necessary legacy authentication choice.
- dbt-extractor and1.12 experimental parser wheel coverage for chosen Linux architecture.
- Adapter/Core1.10–1.12 combination smoke tests;1.9.1 is a research candidate, not a certified recommendation.
- Exact released patch selection policy: first GA illustrates features at launch; latest patch in family improves stability but may change feature/bug behavior. Manifest should support both and clearly label the selected runtime.
