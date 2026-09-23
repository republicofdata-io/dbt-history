# Content authoring contract

The app renders content directly from YAML under `documentation/content/`. Nothing is executed. This document is the field-name contract between the content author (a research agent) and the app schema in `src/content/schema.ts`. Extra fields are tolerated; renamed fields break validation.

Run `make test` after adding or editing content. It validates every file and checks source references, highlight ranges, table widths, diagram edges and the dataset arithmetic.

## Files and delivery order

1. `jaffle-shop/dataset.yaml`
2. `releases/<id>.yaml` for `origin`, `0.1` … `0.21`, `1.0` … `1.12`, `2.0`
3. `catalogue/products.yaml` and `catalogue/events.yaml`
4. `ecosystem/placements.yaml`

## Dates

`"YYYY-MM-DD"`, `"YYYY-MM"` or `"YYYY"`, with `precision: day | month | year`. Where only a bound is known, add `uncertainty: { earliest, latest }`. Never invent a day for month-only evidence.

## Jaffle Shop dataset

```yaml
id: jaffle-shop
recurring_question: How much revenue did each location earn, and can we trust the answer?
provenance: { kind: authored-fiction, authored_on: "2026-09-22", historical_claim: false }
business_rules: [{ id: revenue-definition, statement: ... }]
tables:
  - name: locations
    columns: [{ name: location_id, type: integer }, { name: name, type: text }]
    rows: [[1, Old Port], ...]
expected_revenue:
  columns: [location_id, location, payment_cents, refund_cents, revenue_cents]
  rows: [[1, Old Port, 4400, 1000, 3400], ...]
  total_cents: 12500
  arithmetic: |
    Old Port: ...
derived_relations: [{ name: order_revenue, definition: ... }]
variants:
  - id: second-day
    extends: base
    description: ...
    extra_rows: [{ table: orders, rows: [[...]] }]
    change_events: [...]          # optional, free-form
    expected_revenue: { total_cents: 14400, arithmetic: ... }
```

## Release chapter

```yaml
id: "1.8"
label: v1.8
title: Native unit tests
status: draft                      # skeleton | draft | reviewed (defaults to draft when a walkthrough exists)
featured: true                     # optional: highlights the chapter in the sidebar index (chapters to dwell on)
lead: |
problem_then: |
what_changed:
  - id: unit-tests
    summary: ...
    introduced_in: "1.8.0"         # exact patch, or null with known_present_in / introduction_uncertainty
    adapter_constraints: null
    evidence: [src-1]              # ids from sources
    confidence: high               # high | qualified
in_practice: |
technical_detail: |
caveats: []
milestones:
  - id: "1.8.0"
    kind: package                  # package | github_release | patch | announcement | product_event | snapshot | origin
    date: "2024-05-09"
    precision: day
    title: First published package
    version: "1.8.0"               # optional
    evidence: [src-2]
default_milestone: null            # milestone id the chapter opens on (v2.0 uses summit-ga)
sources:
  - { id: src-1, title: ..., url: ..., retrieved: "2026-09-21", supports: ... }
narrative_evidence: [src-1]        # optional
walkthrough: { ... }               # or null while in preparation
```

## Walkthrough

Every walkthrough opens on a first screen before step 1: what this version lets you do, and what the scenario is about. Author it in `intro`; without it the app derives the screen from `what_changed` and `context`.

Every step that shows a command, a result or a test must also show the code that produced it: the model SQL, the schema or test YAML, the macro, the configuration. A shell command alone is not enough. Use the syntax of that exact version.

```yaml
walkthrough:
  id: wt-1.8
  learning_objective: |
  context: |                       # enough to enter this chapter directly
  intro:
    can_now:                       # 2–4 plain-language capabilities this version unlocks
      - Write a unit test with a small fixture next to the model.
    scenario: |                    # what the Jaffle Shop scenario is about, 2–3 sentences
    outcome: |                     # optional: what the visitor will have seen by the last step
  dataset_variant: base
  steps:
    - id: refund
      title: The refund problem
      explanation: |
      code:
        - language: sql            # sql | yaml | jinja | shell | python | text | json | toml
          filename: models/order_revenue.sql
          content: |
          highlight_lines: [3]
      state:                       # optional; complete on its own
        kind: table                # table | result | diagram | comparison
        title: ...
        columns: [...]
        rows: [[...]]
        highlight_rows: []         # table only
        result_status: fail        # result only: pass | fail | warn | info
        message: ...               # result only
        diagram:                   # diagram only
          nodes: [{ id: orders, label: orders }]
          edges: [{ from: orders, to: revenue }]
          highlight: [revenue]
      takeaway: |
  evidence:
    status: illustration           # illustration | captured
    review_date: "2026-09-22"
    source_refs: [src-1]           # or sources: [...]
    limitations: |
    captured:                      # only when status is captured
      runtime: ...
      adapter: ...
      capture_date: ...
      artifact_ref: ...
      adaptations: ...
```

Rules: 3–5 steps; each step's state is complete on its own; era-appropriate syntax; features that arrived in a patch say so; every table's arithmetic checked against the dataset; `illustration` unless real output was captured; no invented terminal logs.

## Alignment review conventions

- Put the file the step is about first, supporting files next, and the command last. The app opens the first file by default.
- Every explanation says what is on screen, names the highlighted lines and describes the result panel. Every takeaway states what the step just showed. Give technical terms a plain-language explanation; keep personal recording notes out of the content.
- Show the enabling code and a visible prepared outcome. A command flag alone is not a demonstration. Use a separate step for a distinct feature, within the 3–5-step limit. Keep each code block around 20 lines or fewer.
- Keep the intro and walkthrough title limited to capabilities actually demonstrated. Name the exact patch in the step title when appropriate and state the adapter used.
- Table columns and rows must match the displayed query. Use named fixture variants and explicit phases; never change shared base rows to fit an example.
- Preserve the field contract when correcting snippets or results. A retained historical limit belongs in the chapter’s `evidence.limitations`, with a source reference and a disposition in the review register.
- `review-resolutions-2026-09-22.yaml` records all review decisions. `demo_alignment` in the index and validation report describes the current pass; `walkthrough_enrichment` is the earlier pass record.

## Product catalogue

```yaml
# products.yaml
- id: dbt-cloud
  type: platform                   # engine | distribution | platform | capability | product | service | company
  family: dbt                      # dbt | fivetran | external
  parent: null
  roles: [orchestration]
  description: ...
  names:
    - { name: Sinter, from: "2017-01", from_precision: month, to: "2019-01-15" }
    - { name: dbt Cloud, from: "2019-01-15", to: null }
  owners:
    - { owner: Fishtown Analytics, from: "2017-01", from_precision: month, to: "2021-06-30" }

# events.yaml
- id: sinter-renamed-dbt-cloud
  product: dbt-cloud
  kind: rename                     # launch | rename | maturity | pricing | licence | acquisition_agreed | acquisition_closed | merger_announced | merger_closed | retirement_announced | retired | ownership | note
  date: "2019-01-15"
  precision: day
  uncertainty: null
  maturity: ga                     # preview | beta | ga | maintenance | retiring | retired
  access: [requires-login, paid-plan]   # free-local | open-source-apache | source-available | requires-login | paid-plan | proprietary
  summary: ...
  sources: [{ title, url, retrieved }]
  affects_catalogue: true
```

A product appears in the catalogue at a date once at least one of its events has happened by then. Its name, owner, maturity and access are the latest applied values. Fivetran-family products appear only from the `merger_closed` event.

## Ecosystem

```yaml
products: [...]                    # non-dbt players, same shape as catalogue products
placements:
  - product: snowflake
    layer: warehouse               # sources | ingestion | warehouse | transformation | bi | orchestration | quality | metadata | semantics | reverse-etl | open-table-compute | ai-context
    from: "2017-02-09"
    from_precision: day
    to: null                       # set a date to rotate a player out of the representative set
    relationship: complement       # complement | partial-substitute | integration | infrastructure | dbt-owned | combined-family
    maturity: null
    rationale: ...
    sources: [...]
```

At most five players per layer at any chapter date (enforced by a test). "Representative" is editorial, not a ranking.

## Authored payload conventions

The complete content authored on 22 September follows the narrower enums in Olivier’s request. `access` is a scalar or null; the app may normalize it to an array. `license` and `commercial_conditions` remain separate. Merger completion is `acquisition_closed` with `transaction_type: merger`. The schema-limited `pricing` event for MetricFlow has `event_subtype: licence-change`; it does not assert a price change.

The delivered ecosystem file is a bare list of placements with external identities under `product_definition`; register these before resolving references. Read [content-index.yaml](content/content-index.yaml) for the full rendering contract, especially availability, maturity overrides and uncertainty fields. A decoder must preserve these fields if the UI needs to communicate the underlying qualification.

## Step input phases and source inspection

The enriched walkthroughs retain the original fields and add an optional `data_context: { dataset_variant, phase }` to distinguish an existing target from newly arrived source data. Short SQL comments also explain these phases where needed. A historical freshness example may use a derived view and a fixed evaluation time; native freshness still uses the real warehouse clock. Source evidence may include `source_path` and `sha256` for the exact package archive inspected. All examples retain `status: illustration`.
