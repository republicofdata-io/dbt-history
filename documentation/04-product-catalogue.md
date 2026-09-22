# Product catalogue and ownership research

Cutoff: 21 September 2026. This is a sourced catalogue of the major branches relevant to the app, not every commercial SKU, connector, plan change or small feature. Dates below are event dates where established; publication, observation and uncertainty are explicitly distinguished.

## Early product family

| Date | Event and historical interpretation | Evidence |
|---|---|---|
| 9 March 2016 | Project origin used in the two-year retrospective. Keep separate from the first PyPI artifact on 23 March. | [Two years of dbt](https://www.getdbt.com/blog/on-two-years-of-dbt) |
| January 2017, month precision | Sinter launched as a hosted-services experiment and increasingly focused on scheduling/monitoring dbt. Do not retroactively name it Cloud. | [Founder account](https://www.getdbt.com/blog/whats-in-a-name) |
| 15 January 2019 | Sinter becomes dbt Cloud; the open-source tool is named dbt Core. The date comes from original publication metadata, distinct from the page's 2024 edit date. | [Rename](https://www.getdbt.com/blog/whats-in-a-name), [Cloud introduction](https://www.getdbt.com/blog/introducing-dbt-cloud) |
| 2019 preview; GA announcement 14 January 2020 | Browser IDE is a Cloud development surface. A retrospective places development in 2019; the GA article's publication metadata is January 2020. Do not collapse those into one launch. | [IDE announcement](https://www.getdbt.com/blog/announcing-the-dbt-ide), [v1 retrospective](https://www.getdbt.com/blog/dbt-core-v1-is-here) |
| 30 June 2021 | Fishtown Analytics renames to dbt Labs. This is a company rename, not a new engine. | [Company announcement](https://www.getdbt.com/blog/fishtown-analytics-rebrands-as-dbt-labs-closes-150m-to-develop-open-source-analytics-engineering-software) |
| October 2022, month precision | Original dbt Semantic Layer public preview. Metrics metadata in Core 1.0 precedes this service. The July announcement is a future launch notice, not July availability. | [Original preview announcement](https://www.getdbt.com/blog/dbt-semantic-layer), [retrospective confirmation](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next) |
| 8 February 2023 | Agreement to acquire Transform and integrate MetricFlow. Record agreement separately from legal completion; exact completion date not established here. | [Acquisition agreement](https://www.getdbt.com/blog/press-release-dbt-acquisition-transform) |
| 17 October 2023 | New Semantic Layer generation, Explorer, Cloud CLI and Mesh enter the catalogue. Mesh and Explorer are public preview; the MetricFlow-based Semantic Layer reaches GA at Coalesce. | [Press announcement](https://www.getdbt.com/blog/dbt-labs-announces-major-enhancements-to-dbt-cloud-to-enable-collaboration-at-scale), [product recap](https://www.getdbt.com/blog/new-dbt-cloud-features-announced-at-coalesce-2023) |
| 14 May 2024 | Press announcement establishes GA Cloud CLI, Explorer's existing capabilities including column lineage, and Mesh multi-project support. Assist and visual editor are beta. Advanced CI and automatic exposures are described as beta coming soon. | [Dated press release](https://www.getdbt.com/blog/new-dbt-cloud-enhancements-empower-organizations-with-trustworthy-data-at-scale) |
| 28 May 2024 | Dedicated Mesh GA article is published after the earlier press statement. Store as additional evidence, not a second first-launch date. | [Mesh GA article](https://www.getdbt.com/blog/dbt-mesh-is-now-generally-available) |
| 8 October 2024 | Copilot and expanded visual/multi-platform development announced at Coalesce. Don't automatically treat all named capabilities as separately sold products or all previews as GA. | [Coalesce announcement](https://www.getdbt.com/blog/dbt-labs-unveils-ai-innovations-and-new-features-to-improve-collaboration-and-multi-platform) |

## Fusion, broader interfaces and the v2 transition

| Date | Event and historical interpretation | Evidence |
|---|---|---|
| 14 January 2025 | SDF Labs acquisition. Fusion's SQL comprehension lineage comes from SDF; a product-family diagram must not imply every product was a fork of Core's code. | [SDF announcement](https://www.getdbt.com/blog/dbt-labs-announces-sdf-labs-acquisition) |
| 28 May 2025 | Fusion and VS Code extension public beta. New development engine coexists with Python Core. | [Fusion announcement](https://www.getdbt.com/blog/dbt-labs-redefines-dbt-with-new-fusion-engine), [chronology](https://www.getdbt.com/fusion-in-bloom) |
| 28 May 2025 | Cloud branding becomes “dbt”; Explorer → Catalog, browser IDE → Studio, visual editor → Canvas, plus Insights. Keep stable product IDs through these changes. | [Names explained](https://www.getdbt.com/blog/updated-names-for-dbt-platform-and-features) |
| 28 May 2025 | Canvas GA, Insights preview, Catalog core experience GA with global Snowflake asset discovery in preview; local MCP beta appears in launch recap. | [Product press](https://www.getdbt.com/blog/dbt-labs-launches-ai-powered-features-to-onboard-data-analysts-into-dbt), [launch recap](https://www.getdbt.com/blog/dbt-launch-showcase-2025-recap) |
| 14 October 2025 | Insights and remote MCP GA; Fusion state-aware orchestration preview. Discovery and analyst agents beta; developer/observability agents described as upcoming. MetricFlow moves to Apache 2.0. | [Dated product press](https://www.getdbt.com/blog/dbt-labs-cost-optimization-agentic-ai-product-announcements), [Coalesce recap](https://www.getdbt.com/blog/coalesce-2025-rewriting-the-future) |
| 6 May 2026 publication | Developer Agent preview in Studio, described as Copilot's next evolution. Original publication is May 6; edited date May 7. | [Developer Agent](https://www.getdbt.com/blog/the-dbt-developer-agent-is-now-in-preview) |
| 1 June 2026 | Merger closes; Core v2 alpha and dbt State preview announced. Separate these from September GA. | [Merger completion](https://www.getdbt.com/blog/fivetran-dbt-labs-complete-merger-to-create-the-data-infrastructure-for-trusted-ai-agents), [Summit recap](https://www.getdbt.com/blog/what-we-announced-at-snowflake-summit-and-why-it-matters) |
| 24 July 2026 publication | dbt Snowflake Native App enters maintenance; new installations disabled; November removal announced. It is still in maintenance at this research cutoff, not already removed. This is distinct from Snowflake's own dbt Projects product. | [Retirement notice](https://www.getdbt.com/blog/retiring-the-dbt-snowflake-native-app) |
| 14 / 15 / 16 September 2026 | v2 artifact / new distribution names / public Summit GA announcement respectively. Full distribution is dbt; Apache subset is dbt OSS. Python Core remains v1. | [v2 release](https://github.com/dbt-labs/dbt/releases/tag/v2.0.0), [licensing chronology](https://www.getdbt.com/licenses-faq), [Summit recap](https://www.getdbt.com/blog/dbt-summit-2026-product-announcements) |

Fusion's 2025 licensing description is not the current v2 distribution description. Model licence events independently from name events. The licensing FAQ supplies the dated changes; avoid interpreting this catalogue as legal advice.

## Fivetran and other ownership events

| Date or bound | Event | Treatment in the app |
|---|---|---|
| 1 October 2021 | Fivetran completed HVR acquisition. [Completion announcement](https://www.fivetran.com/press/fivetran-completes-acquisition-of-hvr) | Adds enterprise replication/CDC to the Fivetran family; Fivetran remains external to dbt. |
| 23 April 2025 | Datadog acquires Metaplane. [Datadog announcement](https://investors.datadoghq.com/news-releases/news-release-details/datadog-brings-observability-data-teams-acquiring-metaplane) | Metaplane must never appear as a dbt Labs acquisition. |
| 1 May 2025 | Fivetran signs Census acquisition agreement. [Agreement](https://www.fivetran.com/press/fivetran-signs-agreement-to-acquire-census-delivering-the-first-end-to-end-data-movement-platform-for-the-ai-era) | Agreement is not a verified completion date. Keep ownership transition uncertainty until confirmed. |
| By 3 September 2025 | Tobiko acquisition announcement refers to Census as already acquired. [Tobiko press](https://www.fivetran.com/press/fivetran-acquires-tobiko-data-to-power-the-next-generation-of-advanced-ai-ready-data-transformation) | Establishes a conservative completion bound. Earlier exact completion remains open. |
| 3 September 2025 | Fivetran acquires Tobiko Data, including SQLMesh and SQLGlot. [Announcement](https://www.fivetran.com/press/fivetran-acquires-tobiko-data-to-power-the-next-generation-of-advanced-ai-ready-data-transformation) | SQLMesh is an independent alternative before acquisition, Fivetran-owned afterward, combined-family after merger. Acquisition is not proof of retirement or full integration. |
| 13 October 2025 | Fivetran/dbt Labs merger announced. [Founder announcement](https://www.getdbt.com/blog/dbt-labs-and-fivetran-merge-announcement) | Keep announced combination separate from completed ownership. |
| By 2 February 2026 | Census is described as Fivetran Activations in a pricing article. [Primary article](https://www.fivetran.com/blog/census-joins-fivetrans-consumption-based-pricing) | Use as an observed name bound, not a proved original rename date; older pages may have been updated retrospectively. |
| 1 June 2026 | Fivetran/dbt merger completes. [Completion](https://www.getdbt.com/blog/fivetran-dbt-labs-complete-merger-to-create-the-data-infrastructure-for-trusted-ai-agents) | Combined catalogue/ownership can now appear, while product names and access requirements remain distinct. |

## Endpoint catalogue: 16–21 September 2026

This is a compact maturity summary, not proof of equal availability on every adapter or plan. The [Summit recap](https://www.getdbt.com/blog/dbt-summit-2026-product-announcements) and [dated press release](https://www.getdbt.com/blog/fivetran-dbt-labs-announces-new-capabilities-to-make-enterprise-data-agent-ready-at-dbt-summit) support the endpoint. Use detailed availability documentation before enabling a demonstration.

| Offering | State and role |
|---|---|
| dbt v2 / dbt OSS | GA engine distributions; full versus Apache subset |
| dbt v1 | Maintained Python engine lineage |
| Platform surfaces | Studio, Canvas, Catalog and Insights remain part of the wider product history; don't infer retirement from a new agent interface |
| Semantic Layer / MCP | GA semantics and agent access |
| dbt State | GA optional service; distinct from old manifest-based state selection |
| Lake Compute | Private beta in detailed announcement text, although recap table says beta; limited compute offering, not a general warehouse replacement |
| Wizard | Platform and Explore Mode public preview; CLI public beta; Desktop private beta |
| Charts | Public beta dashboard-as-code offering |
| Fivetran Context Layer | Private beta |
| Fivetran movement / Activations / SQLMesh | Combined-family capabilities; preserve product-specific maturity and integration evidence |

## Publication metadata evidence

`data/publication-metadata.json` records original `datePublished` and `dateModified` values extracted from the official pages on 21 September. This resolved the Sinter rename and IDE date confusion. Page-body event statements take precedence when an article was published after availability, as with Mesh in May 2024.

Research boundaries: exact Census closing/rename day, original Native App launch day, historical plan entitlements, and every small Cloud release are not exhaustively established. The major catalogue can be rendered with qualified dates; don't fill gaps with January 1 placeholders.
