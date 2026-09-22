# dbt history

A public history of dbt from its first release in 2016 through v2 in 2026, told through one evolving Waffle Shop project. It supports a 20-minute recorded walkthrough and independent browsing afterwards.

Published at `republicofdata.io/labs/dbt-history` (see [Publishing](#publishing)).

## What the app does

- **35 version chapters plus an origin prologue**: v0.1–v0.21, v1.0–v1.12, v2.0. Nothing is invented and nothing is skipped.
- **One date, three views.** The selected release and its dated milestone anchor three tabs: the release, the product catalogue at that date, and the wider data-stack diagram at that date. Changing tab keeps the release; changing release keeps the tab.
- **Selectable milestones** inside a chapter (patches, announcements, product events) move the date for all three tabs.
- **A guided Waffle Shop walkthrough** in each chapter: prepared steps with read-only code, highlighted lines, small tables, diagrams and explained results. Visitors use Next, Previous and Restart only. Nothing executes.
- **State in the URL**: `/<release>/<tab>?m=<milestone>&s=<step>`. Deep links and browser history restore everything. Step progress per release is remembered for the browsing session.
- **Presentation mode** (button or `P`) hides the index and enlarges type for recording. `[` and `]` change release; `←` and `→` change step.

## Stack

Vite 8, React 19, TypeScript, Tailwind 4 and shadcn-style components on Radix, react-router 7, zod for content validation, vitest for tests. The look mirrors the RepublicOfData.io website's dark "Signal" design tokens (`src/index.css`), so the app reads as part of the site.

```sh
make            # menu of targets
make install    # npm install
make dev        # http://localhost:8081/labs/dbt-history/
make check      # typecheck, lint, tests
make build      # production build into dist/
```

## Layout

```
documentation/           research handoff, briefs and the content files
  content/               all app content as YAML (see below)
  data/                  raw research inventories (inputs, not app content)
scripts/                 content tooling (release skeleton generator)
src/
  content/               schema.ts (zod), load.ts (YAML loader), derive.ts (catalogue and ecosystem at a date), dates.ts
  app/                   page, URL state, tabs, walkthrough player
  components/            code block, tables, lineage diagram, evidence drawer, ui/
```

## Content model

Content lives under `documentation/content/` and is validated against `src/content/schema.ts` at load time and in `npm test`. Field names are the contract shared with the content author; see [documentation/09-content-authoring.md](documentation/09-content-authoring.md) for the full format.

| File | Holds |
|---|---|
| `waffle-shop/dataset.yaml` | The one shop: tables, business rules, expected revenue with its arithmetic, named variants. |
| `releases/<id>.yaml` | One chapter: lead, problem, feature claims with their exact introducing patch, milestones, sources, walkthrough. |
| `catalogue/products.yaml` | Stable product identities with dated names and owners (Sinter → dbt Cloud → dbt, Explorer → Catalog…). |
| `catalogue/events.yaml` | Dated product events. The catalogue at any date is computed from these; nothing is copied per chapter. |
| `ecosystem/placements.yaml` | Which products sit in which layer from when, their relationship to dbt, and sources. |

### Date policy

- A chapter opens on its first published package date, labelled as a package upload date, not an announcement date. `default_milestone` overrides this (v2.0 opens on the 16 September Summit milestone).
- Dates carry a `precision` (`day`, `month`, `year`) and optionally an `uncertainty` interval. When the anchor falls inside an interval the state is shown as "date qualified" rather than resolved silently.
- Fivetran-lineage products enter the catalogue only from the merger close, derived from the `merger_closed` event.
- Tests in `src/content/content.test.ts` pin the boundaries from the brief: Sinter is renamed only from 15 January 2019, Explorer is not called Catalog in 2023, the 14 May 2024 announcements do not appear at the 9 May v1.8 launch, Fivetran is outside the catalogue before 1 June 2026.

### Adding or revising a walkthrough

1. Edit `documentation/content/releases/<id>.yaml`. Set `status: draft` (or `reviewed`), fill `walkthrough.steps` with 3–5 steps, each carrying its complete `state` so any step renders on its own.
2. Keep `evidence.status: illustration` unless real dbt output was captured; then fill the `captured` block. Never invent terminal logs.
3. Run `make test`. It checks schema, source references, highlight line ranges, table widths, diagram edges and the dataset arithmetic.
4. Chapters without a walkthrough render a "Walkthrough in preparation" panel. `make content-releases` regenerates skeletons for those chapters only; authored chapters are never overwritten.

## Publishing

The app is its own Netlify site, served under the main domain by a proxy rule in the website repo:

1. Netlify site for this repo: build `npm run build`, publish `dist` (see `netlify.toml`). Vite's `base` is `/labs/dbt-history/`.
2. In the website repo (`republicofdata.io-website`), add to `netlify.toml` before the SPA fallback:
   ```toml
   [[redirects]]
     from = "/labs/dbt-history/*"
     to = "https://<this-site>.netlify.app/labs/dbt-history/:splat"
     status = 200
   ```
3. Check deep links, asset paths and a narrow screen on the live URL.

## Status

First slice (22 September 2026): scaffold, content schema, app shell, walkthrough player, computed catalogue and ecosystem, and browser-checked navigation. Walkthroughs are being authored chapter by chapter; chapters without one show a preparation panel. Not yet done: the Netlify site and the website proxy rule.
