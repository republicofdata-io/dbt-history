# dbt history

A public history of dbt from its first release in 2016 through v2 in 2026, told through one evolving Jaffle Shop project. It supports a 20-minute recorded walkthrough and independent browsing afterwards.

Published at `republicofdata.io/labs/dbt-history` (see [Publishing](#publishing)).

## What the app does

- **35 version chapters plus an origin prologue**: v0.1–v0.21, v1.0–v1.12, v2.0. Nothing is invented and nothing is skipped.
- **One date, four views.** The selected release and its dated milestone anchor four tabs: the release, the Jaffle Shop walkthrough, the product catalogue at that date, and the wider data-stack diagram at that date. Changing tab keeps the release; changing release keeps the tab.
- **Selectable milestones** inside a chapter (patches, announcements, product events) move the date for all four tabs.
- **A guided Jaffle Shop walkthrough** in each chapter, on its own tab. It opens on a first screen (what this version lets you do, the scenario, the steps ahead), then prepared steps with read-only code, highlighted lines, small tables, diagrams and explained results. Visitors use Next, Previous and Restart only. Nothing executes.
- **State in the URL**: `/<release>/<tab>?m=<milestone>&s=<step>`. Deep links and browser history restore everything. Step progress per release is remembered for the browsing session.
- **Presentation mode** (button or `P`) hides the index and enlarges type for recording. `[` and `]` change release; `←` and `→` change step.

## Stack

Vite 8, React 19, TypeScript, Tailwind 4 and shadcn-style components on Radix, react-router 7, zod for content validation, vitest for tests.

**Look and feel** follow the approved concept in `documentation/visual-reference.html`: paper, plum and gold palette as light-dark pairs (system preference, with a toggle), DM Sans and Space Grotesk, a sidebar release index, a large plum version number and a Jaffle Shop card with the gold jaffle mark. Tokens live in `src/index.css`.

**Fits one screen.** The page is a fixed-height shell (masthead, sidebar plus main, footer) so a chapter never needs page scrolling during a recording. Details open in side drawers instead of expanding the page. A panel or code block scrolls internally only as a fallback when a screen is smaller than about 1280×800.

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
| `jaffle-shop/dataset.yaml` | The one shop: tables, business rules, expected revenue with its arithmetic, named variants. |
| `releases/<id>.yaml` | One chapter: lead, problem, feature claims with their exact introducing patch, milestones, sources, walkthrough. |
| `catalogue/products.yaml` | Stable product identities with dated names and owners (Sinter → dbt Cloud → dbt, Explorer → Catalog…). |
| `catalogue/events.yaml` | Dated product events. The catalogue at any date is computed from these; nothing is copied per chapter. |
| `ecosystem/placements.yaml` | Which products sit in which layer from when, their relationship to dbt, and sources. |

### Qualifications the UI keeps visible

The catalogue derivation (`src/content/derive.ts`) carries every qualification field to the screen rather than stripping it: licence is shown separately from access and commercial conditions; `availability` distinguishes announced-but-unavailable, alpha and existing-installations-only from usable previews; `availability_scope` labels private versus public betas; a `state_override` replaces carried maturity (the June 2026 engine alpha); owner and name intervals show their notes and bounded transitions; products with a `pending_from` membership appear in a separate "announced or agreed, not yet part of the catalogue" group. Merger and licence events are labelled by their specific meaning, not their generic kind. Tests in `src/content/qualifications.test.ts` pin these rules, and `src/app/render-all.test.tsx` renders every chapter, tab, step and milestone.

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

The app is its own Netlify site, `republicofdata-dbt-history` (https://republicofdata-dbt-history.netlify.app), served under the main domain by one proxy rule in the website repo (`republicofdata.io-website/netlify.toml`):

```toml
[[redirects]]
  from = "/labs/dbt-history/*"
  to = "https://republicofdata-dbt-history.netlify.app/labs/dbt-history/:splat"
  status = 200
  force = true
```

Vite builds into `dist/labs/dbt-history/` (see `vite.config.ts`) so the files sit at the path they are served from; `netlify.toml` publishes `dist`, adds the SPA fallback for deep links and redirects the site root to the app.

Deploy from this folder with the Netlify CLI (`npm install -g netlify-cli`, `netlify login` once):

```sh
netlify deploy --prod --build
```

Continuous deploys from GitHub can be enabled with `netlify init` (it needs a one-time GitHub authorization in the browser). After any deploy, check `https://republicofdata.io/labs/dbt-history/1.8/jaffle?s=2` loads directly.

## Status

22 September 2026: scaffold, content schema, app shell, walkthrough player, computed catalogue and ecosystem, and browser-checked navigation. The complete first content set is integrated: 36 chapters with 121 walkthrough steps, 43 catalogue identities, 105 events and 61 ecosystem placements, all rendered with their qualifications and covered by 64 tests. Published on 22 September 2026 to the `republicofdata-dbt-history` Netlify site and proxied from the website.

## Authored history content

The first complete content set was authored on 22 September 2026, with history frozen at 21 September: 36 chapters (including origin), now 121 guided steps, one base fixture and seven variants, 43 catalogue identities, 105 events and 61 ecosystem placement intervals. Every walkthrough is an illustration; no historical dbt execution is claimed.

Read [the content index](documentation/content/content-index.yaml) for rendering conventions and retained uncertainty, and [the validation report](documentation/content/validation-report.yaml) for coverage and arithmetic checks. All 64 app/content tests passed using the bundled current Node runtime; the shell’s older Node cannot start this Vite/Vitest toolchain.

Do not discard the content’s extra qualification fields when loading it: licence versus access, announced-but-unavailable products, private/public beta, bounded ownership/name changes and the explicit alpha maturity override affect what visitors should see. Ecosystem content is a list with external identities nested under `product_definition`. The completed merger uses `kind: acquisition_closed` plus `transaction_type: merger`, within the requested event enum.

### Walkthrough first screens and code

All 36 walkthroughs now have an authored `intro` with version-specific capabilities and a self-contained scenario. All 121 steps include non-shell code, with 359 blocks of at most 17 lines. Commands follow the relevant model, test or configuration. The field contract is preserved; reviewed corrections align snippets, highlights and prepared results. Examples remain illustrations. See `demo_alignment` in the content validation report for the current checks and `walkthrough_enrichment` for the earlier pass.

### Demo alignment review

The 22 September alignment pass addresses all 18 partial demos and resolves 60 review flags: 48 fixed and 12 retained with sourced explanations. All 82 historical observations also have dispositions. The [handoff](documentation/content/demo-alignment-handoff-2026-09-22.md) lists changes by chapter; the [resolution register](documentation/content/review-resolutions-2026-09-22.yaml) records every decision and its chapter-local sources. Retained limitations also appear in each chapter’s evidence. This content pass is local and has not been redeployed.

Put the featured file first, supporting files next and the command last. Every step names its highlighted lines and explains the prepared result. Keep patch labels and adapter assumptions explicit, and reconcile every result with a named fixture phase. The shared base rows remain unchanged.
