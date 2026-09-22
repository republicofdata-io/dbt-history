# dbt v2 runtime research for Waffle Shop

> **Scope update · 22 September 2026:** this report preserves the original research. The current deliverable is the app with [guided, read-only examples](02-guided-examples-brief.md). Runtime build instructions and execution acceptance checks below are reference material only; full runtime reproduction is outside the current scope.

Research cutoff: 2026-09-21. This is source and metadata verification. No dbt runtime was installed or executed, and no container was started. Recommendations below are agent recommendations, not additional user decisions.

## Recommended local endpoint

Use a separately isolated, pinned full dbt v2 environment against a file-backed DuckDB database for the v2 chapter. Add a separate dbt OSS environment only if showing the distribution distinction adds value to the video. Keep historical Python dbt environments separate. The shared object is the Waffle Shop dataset and business question, not one executable, adapter or project configuration.

The first gate should prove the baseline v2 build, unit test, microbatch and docs operations on the actual Mac arm64 host. A separate authenticated test should prove strict SQL analysis. No installation or successful run is claimed by this report.

## Names, packages and dates

The September 15 branding makes **dbt** the full distribution and **dbt OSS** its Apache 2.0 subset. Both can run locally; the full distribution adds proprietary capabilities and uses the dbt Product Licensing Agreement. A platform subscription isn't needed for the basic local runtime. The older Fusion ELv2 description is historical, not the current license. [Licensing FAQ](https://www.getdbt.com/licenses-faq)

| Item | Verified package or artifact | Observation at cutoff |
|---|---|---|
| Full dbt | `dbt==2.0.2` | Published to PyPI September 15; latest available is 2.0.6, September 19 |
| Open source v2 | `dbt-oss==2.0.2` | Published September 15; latest available is 2.0.5, September 18 |
| Python dbt Core | `dbt-core` | Latest stable is 1.12.5; published 2.x compatibility packages are prereleases such as 2.0.0rc5, not 2.0.2 |
| OSS GitHub release | `v2.0.2` | Published September 15; fixes bundled docs UI in pip wheels |
| Chapter date | v2 GA announcement | September 16, 2026; distribution naming changed September 15; don't equate announcement date with first uploaded artifact |

Sources: [dbt PyPI metadata](https://pypi.org/pypi/dbt/json), [dbt OSS metadata](https://pypi.org/pypi/dbt-oss/json), [dbt-core metadata](https://pypi.org/pypi/dbt-core/json), [v2.0.2 release](https://github.com/dbt-labs/dbt/releases/tag/v2.0.2), [Summit announcement](https://www.getdbt.com/blog/dbt-summit-2026-product-announcements).

**Recommended historical pin:** start validation with 2.0.2 for the GA chapter; if a later patch is necessary, display both the chapter version and tested patch. Don't silently present 2.0.6 behavior as launch-day behavior. Don't install `dbt-core==2.0.2`.

## Reproducible installation

The documented full installation is `pip install dbt`; the documented OSS package is `dbt-oss`. The curl installer changes shell configuration and can install a `dbtf` alias, so it isn't an appropriate uncontrolled global installer for a version museum. [Full installation](https://docs.getdbt.com/docs/local/install-dbt), [OSS installation](https://docs.getdbt.com/docs/local/install-dbt-v2)

Both 2.0.2 PyPI distributions require Python >=3.11 for the packaging route. The actual engine is a native binary. Their tiny source distributions use a PEP 517 backend that downloads the real platform wheel and checks its embedded SHA256. Preserve the sdist, embedded `assets.json`, downloaded wheel, driver and resolved Python dependencies. Caching only the sdist is insufficient for an offline rebuild.

The 2.0.2 wheel manifests include macOS x86_64 and arm64, Linux x86_64 and aarch64 (manylinux 2.28), and Windows amd64. No Windows ARM wheel is listed. For Olivier's Mac, the native wheel is `cp311-abi3-macosx_11_0_arm64`; Python 3.11 in the isolated installation environment is a conservative choice.

Concrete full-distribution wheel from its sdist manifest:

- URL: `https://public.cdn.getdbt.com/fs/wheels/dbt-2.0.2-cp311-abi3-macosx_11_0_arm64.whl`
- SHA256: `bac2d76c6e2bc4739b089f762864d818062dde4f97f9557b34a4d4b91c3b396e`

Concrete OSS wheel:

- URL: `https://github.com/dbt-labs/dbt/releases/download/v2.0.2/dbt_oss-2.0.2-cp311-abi3-macosx_11_0_arm64.whl`
- SHA256: `1e7affe0f29e2eb7d5f0fcbee5c5ec10457a800df0ae081665e79623781f0037`

These URLs and expected hashes were read from official metadata; the wheels themselves weren't downloaded or executed. The package sources and manifests are saved in the original workspace under `work/current-runtime/`; the official URLs above make this handoff independently retrievable. [Full package release metadata](https://pypi.org/pypi/dbt/2.0.2/json), [OSS release metadata](https://pypi.org/pypi/dbt-oss/2.0.2/json)

The GitHub API reports `immutable: false` for v2.0.2. Archive SHA256s and the resolved commit, not only a tag. Its tree resolves to `611ba382edbc7d3bb55f9f7e498ed02b4fed0853`. The old-named OSS native tarball is `dbt-core-2.0.2-aarch64-apple-darwin.tar.gz`, SHA256 `d59ca784d48bf06d9d1091ff3b883e32444f635caa2f168f04ff7f75a80c6e53`. Its old filename doesn't make it the proprietary full distribution. [Release metadata](https://api.github.com/repos/dbt-labs/dbt/releases/tags/v2.0.2)

## Adapter and feature feasibility

Detailed support docs list BigQuery, Databricks, Redshift and Snowflake, plus DuckDB (CLI only), Spark (CLI only, beta) and ClickHouse (private beta). The broad Summit announcement calls DuckDB GA. Preserve both lifecycle and execution surface in app data. PostgreSQL appears in source enums and drivers but isn't listed as supported for v2 in these docs; don't use its presence in Rust code as a support promise. [Supported features](https://docs.getdbt.com/docs/dbt/supported-features)

| Demo | Local feasibility | Requirement or limit |
|---|---|---|
| SQL models, seeds, data tests, snapshots | Baseline candidate on v2 DuckDB | Built-in adapter; no warehouse account needed; validate exact fixture and pin |
| SQL unit tests | Candidate on normal DuckDB target | Unit tests are supported across v1/v2; SQL models only |
| Experimental local unit compute | Optional v2-only example | `compute: local` requires `DBT_ENGINE_EXPERIMENTAL_LOCAL_UNIT_TESTS=true`; distinguish from simply running a normal test against a local DuckDB target |
| Microbatch | Source-backed candidate on v2 DuckDB | 2.0.2 includes DuckDB macro; it uses event-time delete/insert, requires `event_time`, rejects `unique_key`; validate late-data/backfill result |
| Python models | **Not supported on v2 DuckDB** | Use a historical v1 + dbt-duckdb checkpoint, or an optional remote supported platform |
| Strict SQL analysis/type checking/column lineage | Full dbt plus login | Free account is sufficient per availability docs; unauthenticated strict invocation falls back to baseline |
| Docs | Basic local docs without login; full features need login | 2.0.2 fixes pip docs UI; verify static assets and offline rendering |
| Metrics | Separate MetricFlow environment | `mf` is local; `dbt sl` executes through platform context |
| Hosted catalogue, commercial orchestration, BI integration | Not recreated by local binary | Show historical evidence/captured output or explicitly optional service integration |

Sources: [Unit tests](https://docs.getdbt.com/docs/build/unit-tests), [DuckDB microbatch macro at v2.0.2](https://github.com/dbt-labs/dbt/blob/v2.0.2/crates/dbt-loader/src/dbt_macro_assets/dbt-duckdb/macros/materializations/incremental_strategy/microbatch.sql), [Python model support](https://docs.getdbt.com/docs/build/python-models), [v2.0.2 adapter dispatch rejecting DuckDB Python](https://github.com/dbt-labs/dbt/blob/v2.0.2/crates/dbt-adapter/src/adapter/adapter_impl.rs#L1068), [Python parity issue](https://github.com/dbt-labs/dbt/issues/14514), [Feature availability](https://docs.getdbt.com/docs/dbt/dbt-availability), [MetricFlow commands](https://docs.getdbt.com/docs/build/metricflow-commands).

## DuckDB driver contradiction and data isolation

The September 16 setup page says the bundled driver can't load extensions and recommends `dbc` for an external driver. It also warns that static analysis may fail to infer flat-file schemas. Avoid `read_csv`/`read_parquet` as the main demonstration input; use small seeded relational tables. [DuckDB setup](https://docs.getdbt.com/docs/local/connect-data-platform/duckdb-setup)

However, the v2.0.2 source sets the official DuckDB driver version to **1.5.4**, and distinguishes it from `DuckDBExtended` with internal extensions. The official backend's source comment says it supports community extensions. This differs from the setup page's blanket restriction. Treat extension loading as a test gate on the chosen distribution rather than relying on either statement alone. [Driver constants](https://github.com/dbt-labs/dbt/blob/v2.0.2/crates/dbt-adbc/src/lib.rs#L81), [Backend definitions](https://github.com/dbt-labs/dbt/blob/v2.0.2/crates/dbt-adbc/src/driver.rs#L69), [Driver selection](https://github.com/dbt-labs/dbt/blob/v2.0.2/crates/dbt-adbc/src/install.rs#L365).

Agent recommendations:

- Give each checkpoint its own DuckDB file; never let old/new DuckDB engines alternately mutate one file.
- Record `select version()` from the actual dbt connection and any separate Python query client. Don't assume `pip install duckdb` controls the native v2 driver's version.
- Record whether the run selected a system driver or the bundled/CDN driver, including its resolved path and hash.
- Prewarm and preserve driver artifacts for repeatable recording. Validate behavior with external networking disabled only after setup.
- Start without external extensions; add them only for a specific, tested demonstration.

## MetricFlow integration needs isolation

The current docs say self-hosted v2 can use separately installed MetricFlow through `mf`. The current `dbt-metricflow==0.15.0` package explicitly depends on `dbt-core>=1.11,<1.13` and `metricflow==0.213.0`, and offers a `dbt-duckdb` extra. Installing it into a v2 environment risks conflicting `dbt` executables. Use a separate MetricFlow environment and explicitly pass the intended project/artifacts. Verify artifact interoperability before calling this a working v2 local semantic demo. [Package metadata](https://pypi.org/pypi/dbt-metricflow/0.15.0/json)

A Rust `dbt-metricflow` crate exists in the v2 source, but its own documentation calls it a compiler rather than a query runner. Its presence doesn't establish an integrated, supported local semantic service. [Crate semantics document](https://github.com/dbt-labs/dbt/blob/v2.0.2/crates/dbt-metricflow/docs/metric-semantics.md)

## Migration and recording implications

v2 removes deprecated project behavior and validates configuration more strictly. Missing macros/variables can fail during parse. Old `--models` flags must become `--select`. Package constraints must explicitly allow v2. Full strict analysis requires login and unauthenticated runs fall back to baseline. v2 also changes docs and artifact generation. [Upgrade guide](https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/upgrading-to-v2)

Keep era-specific command recipes with checkpoints. Don't run one modern script against every version. A meaningful v2 comparison is the same intentionally broken model on v1 and full v2 strict analysis, with authentication state recorded. Separately demonstrate parser validation without login. Make the distinction visible in the recording checklist.

## Required proof before the coding agent declares the environment ready

1. Install pinned full v2 in a project-scoped environment; verify package, executable version, architecture, binary checksum and driver identity.
2. Reset Waffle Shop from deterministic fixtures; seed, run, test and generate docs.
3. Verify successful SQL unit tests and a deliberately failing refund-edge-case fixture.
4. Verify microbatch initial load, late order and bounded backfill against independently calculated totals.
5. Prove strict SQL analysis catches a missing column after login; prove that authentication absence is reported rather than silently presented as an equivalent demo.
6. Keep Python models disabled in v2 DuckDB checkpoint with a clear capability explanation.
7. If metrics are included, prove the separate `mf` environment reads the selected checkpoint and calculates the same revenue; log both environment versions.
8. Re-run from reset without a version upgrade. Verify docs browser assets and required driver caches before recording offline.

Unresolved by source research: actual execution on Olivier's Mac, native full-v2 versus OSS driver selection at runtime, whether the chosen extension path works, exact standalone MetricFlow/v2 artifact compatibility, and login persistence inside the final isolation strategy. These are bounded implementation acceptance checks, not reasons to leave the brief open-ended.
