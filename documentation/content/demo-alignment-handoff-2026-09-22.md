# Jaffle Shop demo alignment handoff

Completed locally in `republicofdata-io/dbt-history` on 22 September 2026. Historical cutoff remains 21 September 2026.

All 18 partial demos have been expanded or corrected. The 17 previously aligned version demos received only relevant review corrections. Origin is unchanged. The app now has 36 illustrative walkthroughs, 121 guided steps and 359 code blocks, with no block longer than 17 lines.

**Review status:** 60 wording/content flags settled: 48 fixed and 12 retained with sourced explanations. The alignment report’s 82 historical observations are also settled: 42 fixed and 40 documented limitations. Zero unresolved. “Documented limitation” means an explicit, sourced boundary or confirmation of historically correct content; it does not imply that an unverified behavior is demonstrated.

**Validation:** `make test` passed all 64 tests across three files. Independent checks passed for all eight fixture states, source references, code highlights, file order, YAML/Python snippets and selected SQL/result projections. Browser spot checks confirmed the corrected 0.1 and 1.11 diagrams render.

**Execution boundary:** no historical warehouse runs or original terminal captures were produced. SQLite/Jinja checks verify calculations and selected projections. The Core 1.7 request-hash helper was run in isolation to verify the prepared lockfile hash. Every walkthrough remains labelled as an illustration.

**Files:** release YAMLs under `documentation/content/releases/`; source-backed dispositions in `documentation/content/review-resolutions-2026-09-22.yaml`; current counts and checks in `content-index.yaml` and `validation-report.yaml`. README, AGENTS and the authoring contract now reflect the conventions. The original review reports are preserved with pointers to the resolutions.

**Fixture:** base rows are unchanged. The existing customer-city-change variant now declares the timestamps used by the archive example; no new variant or hidden base mutation was introduced.

**Publication:** this pass has not been deployed. Review the changed screens at recording size before publishing; no app execution feature or backend is needed.

## Historical decisions to preserve

- **0.2 relationship:** retain the declaration under parent `orders`, pointing to child `payments`. The original `schema_tester.py` lines 130–133 assign those roles; lines 24–33 count orphan children. Reversing it would make this example wrong.
- **0.2.3.0 seeds:** `data/` is correct. Seeded tables were not eligible `ref()` targets in the inspected source, so there is no invented seed-join demonstration at that patch. The later chapter shows the supported join.
- **Profiles:** 0.3 uses `run-target` under `user`; 0.7 and 0.8 use `target` under a named profile. BigQuery 0.8.3 uses the historical `schema` key.
- **1.8 unit tests:** use `--empty` to prepare upstream relations without production rows. A warehouse connection and suitable schemas still matter; this is not an offline test claim.
- **Adapters:** Snowflake is explicit where its types or capabilities are used, including the 1.11 function. PostgreSQL is explicit for the 1.6 materialized view; DuckDB is explicit in the 2.0 example.
- **1.12 parser:** the common parser flags, their placement and the `vars.yml` wrapper were checked against the original package. The comparison panel is prepared, not a measured parity result.

## Changes and dispositions by chapter

IDs below refer to the resolution register. “Fixed” lists both review flags and historical observations corrected in content. Retained items have their explanation and source references in chapter evidence.

### 0.1

Matched SQL/result columns, showed generated table/view statements, supplied the ref parent and explicit diagram IDs.

**Fixed:** review-0.1-01, review-0.1-02, review-0.1-03, historical-0.1-01, historical-0.1-02, historical-0.1-03.

**Recorded as limitations or confirmed historical behavior:**

- `historical-0.1-04`: 0.1.1 compile.py inspected: only Jinja/project wrapping, no ref helper. 0.1.14 has ref; exact introduction patch stays unknown.

### 0.2

Kept and explained the source-correct parent-to-child declaration; schema opens first. Confirmed data/ seeds cannot be ref targets yet; changed the orphan inspection to direct warehouse SQL.

**Fixed:** historical-0.2-02.

**Recorded as limitations or confirmed historical behavior:**

- `review-0.2-01`: The reviewer’s modern direction is incorrect for 0.2.0. Retain parent orders -> child payments. schema_tester.py lines 130-133 assign these roles; lines 24-33 count orphan children. Schema file now opens first.
- `review-0.2-02`: Confirmed data/ in 0.2.3.0 project.py. Seeds are loaded independently; compilation.py ref lookup only sees SQL models. Keep the seed result without a ref join; explain the 0.10 change.
- `historical-0.2-01`: The reviewer’s modern direction is incorrect for 0.2.0. Retain parent orders -> child payments. schema_tester.py lines 130-133 assign these roles; lines 24-33 count orphan children. Schema file now opens first.
- `historical-0.2-03`: Accepted-values tests remain patch release context, not an intro or step promise.

### 0.3

Added order_amounts to the dependency picture and confirmed user.run-target in the original loader.

**Fixed:** review-0.3-01, review-0.3-02.

**Recorded as limitations or confirmed historical behavior:**

- `historical-0.3-01`: Temporary relation swapping remains release context, documented as outside this walkthrough.
- `historical-0.3-02`: Retained the prepared-scheduling label; this is not a measured schedule or native log.
- `historical-0.3-03`: Keep named profile target in 0.7.0. Original loader/connection source verifies the change from 0.3 user.run-target; these versions should not be made artificially identical.

### 0.4

Added a dedicated ephemeral step and kept one model chain and incremental config through all four steps.

**Fixed:** review-0.4-01, review-0.4-02, review-0.4-03, historical-0.4-01, historical-0.4-02.

**Recorded as limitations or confirmed historical behavior:**

- `historical-0.4-03`: Kept sql_where with this after checking the original 0.4 materialization implementation.

### 0.5

Replaced repetitive conversion screens with variables, a 0.5.1 archive, and a 0.5.4 custom reconciliation test; added explicit archive feed metadata to the existing variant.

**Fixed:** No correction required for the reviewed points.

**Recorded as limitations or confirmed historical behavior:**

- `historical-0.5-01`: Kept the confirmed models.jaffle_shop.vars layout from 0.5.0.
- `historical-0.5-02`: Kept the .0 suffix; the rendered expression divides by decimal 100.0, verified arithmetically.
- `historical-0.5-03`: Safer incremental writes and adapter introduction are release context; the demo shows variables, archives and custom SQL tests.

### 0.6

Aligned query columns and added a full-refresh step with incorrect stored values visibly corrected.

**Fixed:** review-0.6-01, historical-0.6-01.

**Recorded as limitations or confirmed historical behavior:**

- `historical-0.6-02`: Kept macro definition and folder after checking 0.6.0 source.
- `historical-0.6-03`: Hooks and target context remain release context, expressly outside the walkthrough.

### 0.7

Confirmed the named-profile target syntax and added an explicitly dated 0.7.1 role setting.

**Fixed:** No correction required for the reviewed points.

**Recorded as limitations or confirmed historical behavior:**

- `review-0.7-01`: Keep named profile target in 0.7.0. Original loader/connection source verifies the change from 0.3 user.run-target; these versions should not be made artificially identical.
- `historical-0.7-01`: Keep named profile target in 0.7.0. Original loader/connection source verifies the change from 0.3 user.run-target; these versions should not be made artificially identical.
- `historical-0.7-02`: Original 0.7.0 connection contract confirms account, user, password, database, schema and warehouse; role is shown only in patch 0.7.1.

### 0.8

Replaced the transaction label with a visible prepared schedule and added a 0.8.3 BigQuery profile using the historical schema key.

**Fixed:** review-0.8-01, historical-0.8-01, historical-0.8-03.

**Recorded as limitations or confirmed historical behavior:**

- `review-0.8-02`: Fixture confirms 13 payment rows for 12 orders; order 1043 has two payments. Kept the count and documented why.
- `historical-0.8-02`: Materializations-as-macros is retained in release context and removed from intro promises.

### 0.9

Showed hand-written duplicated SQL before package use and kept the unconfigured order model in schema jaffle.

**Fixed:** review-0.9-01, review-0.9-02, historical-0.9-01.

**Recorded as limitations or confirmed historical behavior:**

- `historical-0.9-02`: Confirmed package-prefixed v1 constraints in 0.9 parser.py, resolving a namespaced test_ macro.
- `historical-0.9-03`: Confirmed repositories is handed to Git clone, which accepts file URLs. The example is an authored existing local Git repository, not a historical public package.

### 0.10

Added packages.yml/local dependency step and joined seed names directly to order-level revenue.

**Fixed:** review-0.10-01, review-0.10-02, historical-0.10-01.

**Recorded limitations:** none from this review.

### 0.11

Highlighted the actual column description, made diagram IDs explicit and included the fields consumed by the location query.

**Fixed:** review-0.11-01, review-0.11-02.

**Recorded as limitations or confirmed historical behavior:**

- `historical-0.11-01`: Deliberately retain raw.locations in this standalone slice; the diagram only promises model ref dependencies and does not draw a seed edge.

### 0.12

Kept identical tagged model SQL across all screens; removed the undemonstrated cache promise from the intro.

**Fixed:** review-0.12-01, historical-0.12-01, historical-0.12-02.

**Recorded as limitations or confirmed historical behavior:**

- `review-0.12-02`: Relation caching is sourced release context only. Removed it from intro promises and documented the omitted demonstration.

### 0.13

Connected downstream revenue to the source-backed payments model; made the Redshift date arithmetic assumption explicit.

**Fixed:** review-0.13-01, historical-0.13-01.

**Recorded as limitations or confirmed historical behavior:**

- `historical-0.13-02`: Named Redshift as the adapter for datediff(hour,...); no PostgreSQL compatibility is claimed for that query.

### 0.14

Standardized snapshot SQL/highlights and added a working soft-rule warning over the base refund of 800 cents.

**Fixed:** review-0.14-01, review-0.14-02, historical-0.14-01, historical-0.14-02.

**Recorded limitations:** none from this review.

### 0.15

Showed file-level parse reuse, the profile option and an explicitly authored JSON field example; verified global command-flag positions.

**Fixed:** review-0.15-01, historical-0.15-01.

**Recorded as limitations or confirmed historical behavior:**

- `review-0.15-02`: Original 0.15.0 main.py confirms --log-format and --partial-parse are root flags before run. Keep this order and cite it.
- `historical-0.15-02`: Python 2 retirement remains in the chapter’s release claims; not a walkthrough demonstration.

### 0.16

Removed meta from the unanswered-question screen, highlighted its actual values, and replaced the boundary screen with seed documentation.

**Fixed:** review-0.16-01, review-0.16-02, review-0.16-03, historical-0.16-01.

**Recorded limitations:** none from this review.

### 0.17

Kept the same refund input on both sides of the repair, showed the fail-fast outcome, and used path selection to restore the numeric revenue result.

**Fixed:** review-0.17-01, review-0.17-02, historical-0.17-01, historical-0.17-02.

**Recorded limitations:** none from this review.

### 0.18

Made the SQL edit visible, included order_amounts in the rebuilt branch, and listed every reused model parent with deferral preconditions.

**Fixed:** review-0.18-01, review-0.18-02, review-0.18-03, historical-0.18-01, historical-0.18-02.

**Recorded limitations:** none from this review.

### 0.19

Kept the snapshot/highlights identical and qualified fixture dates, revival and test-deferral scope.

**Fixed:** review-0.19-01.

**Recorded as limitations or confirmed historical behavior:**

- `historical-0.19-01`: Revival and test deferral remain release context with explicit limitations; the shown event is deletion only.
- `historical-0.19-02`: 2016 dates are declared fixture observations, not the 2021 release date or a captured warehouse clock.

### 0.20

Recorded the audit-schema assumption and narrowed the intro to the stored-failure behavior actually shown.

**Fixed:** No correction required for the reviewed points.

**Recorded as limitations or confirmed historical behavior:**

- `historical-0.20-01`: Keep jaffle_dbt_test__audit with target.schema=jaffle; the naming assumption is recorded.
- `historical-0.20-02`: Retain the count wrapper as an inspection query, not a second test; recorded explicitly.

### 0.21

Expanded the graph through both intermediate models to revenue_by_location and named that exact skipped table.

**Fixed:** review-0.21-01, review-0.21-02, historical-0.21-01.

**Recorded as limitations or confirmed historical behavior:**

- `historical-0.21-02`: Keep failed-test blocking behavior; the test has both orders and payments as ancestors of the dependent revenue branch.

### 1.0

Separated the schema filenames and kept the metric definition in the original 1.0 dialect.

**Fixed:** review-1.0-01, historical-1.0-03.

**Recorded as limitations or confirmed historical behavior:**

- `historical-1.0-01`: Default parsing optimizations stay in release context; removed the undemonstrated speed claim from can_now.
- `historical-1.0-02`: Retain the 1.0 model/type/sql metric schema verified against the original contract, not later metric syntax.

### 1.1

Restored the actual source-to-revenue graph and explained timestamp comparison independently of freshness thresholds.

**Fixed:** review-1.1-01.

**Recorded as limitations or confirmed historical behavior:**

- `historical-1.1-01`: Documented that fresher compares max_loaded_at, independently of freshness error status or the actual current clock.
- `historical-1.1-02`: The independent chapter slice intentionally reads current raw payments/refunds; restored the orders ref edge and explained the layout difference.

### 1.2

Rebuilt the three screens as denied read, declared/applied grant, and successful read; removed duplicate conflicting model files.

**Fixed:** review-1.2-01, review-1.2-02, historical-1.2-01.

**Recorded as limitations or confirmed historical behavior:**

- `historical-1.2-02`: Grant reconciliation may revoke removed grants; no additive-only claim is made. Existing role/schema access are explicit preconditions.

### 1.3

Confirmed 12 base orders and the Snowflake/Snowpark assumption; aligned the input inspection table with its query.

**Fixed:** No correction required for the reviewed points.

**Recorded as limitations or confirmed historical behavior:**

- `review-1.3-01`: Confirmed exactly 12 base orders and kept the result; it remains a Snowflake/Snowpark illustration, not a captured Python run.
- `historical-1.3-01`: Confirmed exactly 12 base orders and kept the result; it remains a Snowflake/Snowpark illustration, not a captured Python run.
- `historical-1.3-02`: Retain the Snowpark string-column select recipe and its explicit Snowflake restriction.

### 1.4

Showed 12,500 versus 14,400 directly and added a Snowflake incremental-predicate step with a safe fixed fixture boundary.

**Fixed:** historical-1.4-01.

**Recorded as limitations or confirmed historical behavior:**

- `historical-1.4-02`: Keep the existing-development precedence contrast, confirmed in 1.4 source.
- `historical-1.4-03`: Keep distinct variant names: orders-refreshed extends second-day with freshness metadata, while this chapter needs only the rows.

### 1.5

Fixed contract highlights and result columns; added a complete two-version interface with dbt show and a preserved v1 consumer.

**Fixed:** review-1.5-01, historical-1.5-01, historical-1.5-02, historical-1.5-03.

**Recorded limitations:** none from this review.

### 1.6

Added missing model code and complete retry statuses, removed the unchanged-SQL requirement, and added a PostgreSQL materialized-view screen.

**Fixed:** review-1.6-01, historical-1.6-01, historical-1.6-02.

**Recorded limitations:** none from this review.

### 1.7

Replaced the local dependency with a real Hub range, showed the prepared lock pin and independently verified request hash, and named static_index.html.

**Fixed:** review-1.7-01, historical-1.7-01, historical-1.7-02.

**Recorded as limitations or confirmed historical behavior:**

- `review-1.7-02`: Both features verified at 1.7.0 in task/deps.py and task/generate.py. Lock resolution remains illustrative; only the request hash was computed with the actual versioned helper.

### 1.8

Added --empty setup and unit-test commands, explained warehouse schema requirements, and aligned the upstream chain.

**Fixed:** historical-1.8-01, historical-1.8-02.

**Recorded limitations:** none from this review.

### 1.9

Named Snowflake, clarified exclusive bounds and lookback, added a total query, and demonstrated a YAML snapshot with two dated rows.

**Fixed:** review-1.9-01, review-1.9-03, historical-1.9-01, historical-1.9-02.

**Recorded as limitations or confirmed historical behavior:**

- `review-1.9-02`: Exclusive end verified: adapter relation wrapper uses >= start and < end. Keep March 9 as the exclusive boundary and cite the source.

### 1.10

Added the historically qualified sampling screen, named the deprecation category and escalation command, and moved highlights to the duplicated key.

**Fixed:** review-1.10-01, review-1.10-02, historical-1.10-01.

**Recorded as limitations or confirmed historical behavior:**

- `historical-1.10-02`: Verified the initial --sample implementation: accepted directly, hidden from help, no second enable flag; qualified in the step and limitations.

### 1.11

Named Snowflake on screen, verified function() syntax and the nonempty dependency diagram, and supplied the location-level conversion query.

**Fixed:** review-1.11-01, historical-1.11-01.

**Recorded as limitations or confirmed historical behavior:**

- `review-1.11-02`: Confirmed function(name) in the original 1.11 context provider and parser. Keep the call and cite exact-version source.
- `historical-1.11-02`: The diagram has three nodes and two valid edges; empty table columns are normal for a diagram state.
- `historical-1.11-03`: Confirmed function(name) in the original 1.11 context provider and parser. Keep the call and cite exact-version source.

### 1.12

Added vars.yml with its correct wrapper, showed explicit four-model selection comparisons, verified common parser flags, and removed the duplicate ad hoc query file.

**Fixed:** review-1.12-01, review-1.12-02, historical-1.12-02, historical-1.12-03.

**Recorded as limitations or confirmed historical behavior:**

- `review-1.12-03`: Confirmed use_v2_parser, --use-v2-parser and --no-use-v2-parser in 1.12 params.py and common command flags. The extra parser binary is required.
- `historical-1.12-01`: Confirmed use_v2_parser, --use-v2-parser and --no-use-v2-parser in 1.12 params.py and common command flags. The extra parser binary is required.

### 2.0

Matched corrected query columns, named DuckDB and full-dbt compilation, confirmed pre-cutoff package pins/licence/status evidence, and corrected the meaning of GA.

**Fixed:** review-2.0-01, review-2.0-02, historical-2.0-02.

**Recorded as limitations or confirmed historical behavior:**

- `review-2.0-03`: Confirmed both 2.0.2 PyPI uploads on September 15, the Product Licensing Agreement/Apache distinction, and Summit maturity levels. Kept access and beta qualifications.
- `historical-2.0-01`: Confirmed both 2.0.2 PyPI uploads on September 15, the Product Licensing Agreement/Apache distinction, and Summit maturity levels. Kept access and beta qualifications.
- `historical-2.0-03`: Retain the final product-status screen as an explicit short bridge to catalogue/ecosystem, not a dbt execution demo.
