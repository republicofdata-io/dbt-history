# Ecosystem research and chart specification

Research cutoff: 21 September 2026. The chart should show representative significant players and relationships, not claim a measured market ranking. The evidence below establishes presence and relevance at a historical point; it does not establish that a product first existed on that date.

## What the chart explains

The story begins with a relatively small warehouse-centred workflow and ends with overlapping platforms spanning movement, transformation, metadata, semantics, consumption and agents. dbt's expanding footprint is one part of that change. Broader suites, specialist tools and open-source projects evolve alongside it.

Draw transformations within the warehouse/compute relationship, with dbt supplying definitions and execution control. Orchestration, quality, metadata and governance are cross-cutting responsibilities. A single flat chain would misrepresent them. Use two ownership highlights at the endpoint if useful: dbt-origin products and other combined-family products.

## Evidence-backed roster and earliest safe placement

“Safe placement” is conservative for this research package. Where only a later observation is documented, do not infer an earlier launch or absence.

| Player(s) | Responsibility and relationship | Historical evidence and safe placement |
|---|---|---|
| Amazon Redshift | Warehouse; early target and complement | Founder's retrospective explicitly describes Redshift with Fivetran/Stitch and Looker/Mode in client stacks during 2016–2019. [Account](https://www.getdbt.com/blog/dbt-labs-and-fivetran-merge-announcement) |
| Fivetran, Stitch | Ingestion; early complements | Same dated-period retrospective. Present as contemporary stack examples rather than precise product-launch claims. [Account](https://www.getdbt.com/blog/dbt-labs-and-fivetran-merge-announcement) |
| Looker, Mode | BI/analysis; early complements, later overlap in semantics/consumption | Same 2016–2019 account. Brand ownership needs separate events if shown. [Account](https://www.getdbt.com/blog/dbt-labs-and-fivetran-merge-announcement) |
| Tableau | BI; downstream consumption | Olivier's July 2018 implementation used Tableau. This is concrete practitioner evidence, not proof of first market availability. [2018 article](https://odupuis.medium.com/my-journey-introducing-the-data-build-tool-dbt-in-projects-analytical-stacks-69971faed2c2) |
| Snowflake | Warehouse; complement and later overlapping developer platform | dbt 0.7 adds support in February 2017. [Tagged release](https://github.com/dbt-labs/dbt/releases/tag/v0.7.0) |
| BigQuery | Warehouse; complement and later native transformation alternatives | dbt 0.8.3 adds support in July 2017. This is a dbt integration date, not BigQuery's creation. [Historical changelog](https://github.com/dbt-labs/dbt-core/blob/v0.13.0/CHANGELOG.md) |
| Airflow | Cross-system orchestration; complement/partial scheduling substitute | Public announcement June 2015, Apache incubator March 2016. Can appear in the initial ecosystem. [Official history](https://airflow.apache.org/docs/apache-airflow/2.10.3/project.html) |
| Dagster | Orchestration; complement/partial scheduling substitute | First release July 2019; 1.0 August 2022. [Founder retrospective](https://dagster.io/blog/open-core-business-model-dagster), [1.0](https://dagster.io/blog/dagster-1-0-hello) |
| Prefect | Orchestration; complement/partial scheduling substitute | January 2019 founder update describes preview partners and planned Q2 launch. Label preview at that observation; do not assign an invented GA day. [Update](https://www.prefect.io/blog/golden-spike) |
| Airbyte | Ingestion alternative | Soft MVP launch 24 September 2020, with later public-repository milestone. [First-year retrospective](https://airbyte.com/blog/airbyte-is-turning-1), [1.0 journey](https://airbyte.com/blog/airbytes-journey-until-1-0) |
| Dataform / Google Cloud | SQL transformation alternative | Google acquisition 8 December 2020 establishes a conservative dated inclusion point; product existed earlier. [Google announcement](https://cloud.google.com/blog/products/data-analytics/welcoming-dataform-to-bigquery) |
| Databricks | Storage/compute platform and transformation overlap | Named among dbt's platform ecosystem in June 2021. Use a separate earlier source before placing a specific Databricks product in an older snapshot. [dbt company announcement](https://www.getdbt.com/blog/fishtown-analytics-rebrands-as-dbt-labs-closes-150m-to-develop-open-source-analytics-engineering-software) |
| Census, Hightouch | Reverse ETL/activation | Both named in dbt's June 2021 ecosystem; Hightouch describes the category in March 2021. [dbt announcement](https://www.getdbt.com/blog/fishtown-analytics-rebrands-as-dbt-labs-closes-150m-to-develop-open-source-analytics-engineering-software), [Hightouch](https://hightouch.com/blog/reverse-etl-is-not-for-data-engineers-to-write) |
| DataHub | Metadata/discovery; complement and partial overlap with dbt docs/catalogue | LinkedIn describes internal project August 2019, open source February 2020. [Engineering account](https://www.linkedin.com/blog/engineering/archive/data-hub) |
| Atlan | Metadata/governance, later context; complement and partial overlap | July 2019 announcement exists, while current company history says public launch in 2020. Use qualified early history; July 2022 active-metadata release is a clear inclusion point. [2019](https://blog.atlan.com/announcements/humans-of-data-welcome-home/), [2022](https://humansofdata.atlan.com/2022/07/atlan-pioneering-active-metadata/) |
| Cube | Headless semantics; alternative/complement | Founder retrospective establishes open-source analytics framework in 2019; rename Cube.js → Cube in 2022. Olivier documents using Cube by October 2022. [Cube retrospective](https://cube.dev/blog/cube-js-is-now-cube), [Olivier](https://odupuis.medium.com/dbt-inside-setting-the-data-platform-standard-419aa3d9e11c) |
| Coalesce | Visual transformation alternative | Company reports launch January 2022. Distinguish Coalesce product from dbt's conference of the same name. [Company announcement](https://coalesce.io/company-news/coalesce-secures-26-million-series-a-funding/) |
| Lightdash | BI/semantic consumption closely connected to dbt | October 2022 founder announcement documents existing product/community. [Announcement](https://www.lightdash.com/blogpost/lightdash-raises-seed-round) |
| Hex | Analysis and semantic consumption | Named as Semantic Layer integration at Coalesce October 2023. Use this dated participation rather than guessing launch date. [dbt announcement](https://www.getdbt.com/blog/dbt-labs-announces-major-enhancements-to-dbt-cloud-to-enable-collaboration-at-scale) |
| SQLMesh / Tobiko | Transformation alternative; later within combined family | Launch article 8 March 2023; Fivetran acquisition 3 September 2025. [Launch](https://www.tobikodata.com/blog/the-future-of-dataops), [Acquisition](https://www.fivetran.com/press/fivetran-acquires-tobiko-data-to-power-the-next-generation-of-advanced-ai-ready-data-transformation) |
| Microsoft Fabric / Power BI | Integrated analytics suite; complement and cross-layer competitor | Fabric GA 15 November 2023 brings existing Power BI, Synapse and Data Factory into one suite. Don't rename earlier products Fabric before launch. [Microsoft](https://www.microsoft.com/en-us/microsoft-fabric/blog/2023/11/15/prepare-your-data-for-ai-innovation-with-microsoft-fabric-now-generally-available/) |
| Metaplane / Datadog | Data observability; partial overlap with quality/monitoring | Datadog acquisition 23 April 2025 establishes ownership at later snapshots. Earlier emergence date is not established in this pass. [Datadog](https://investors.datadoghq.com/news-releases/news-release-details/datadog-brings-observability-data-teams-acquiring-metaplane) |
| Snowflake dbt Projects | Managed execution; complement and commercial overlap | Snowflake GA announcement demonstrates native hosting of dbt. Do not confuse with dbt Labs' retiring Native App. [Snowflake](https://www.snowflake.com/en/blog/dbt-projects-generally-available/) |
| Snowflake Cortex Analyst / agents | Semantic and AI consumption; integration and overlap | Current primary documentation and engineering account support the endpoint; consult their dated milestones before adding older snapshot states. [Analyst docs](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst), [Agents account](https://www.snowflake.com/en/blog/engineering/cortex-agents-unified-data-intelligence/) |
| Databricks Genie One / Genie Agents / Genie Code | AI analysis, development and consumption; broad overlap | September 2026 release notes supply contemporary names and dated capabilities. Do not call every 2026 product merely “AI/BI Genie” or apply 2026 names to 2024. [2026 release notes](https://docs.databricks.com/aws/en/ai-bi/release-notes/2026) |

This roster is sufficient to populate an initial chart with meaningful competitors and complements. It deliberately avoids unsupported claims about all vendors' early launch days or current ownership. Additional candidates such as Alation, Collibra, Great Expectations, Soda, Monte Carlo, OpenMetadata and newer analysis tools can be added with dated evidence; their absence from an initial diagram is not a claim that the responsibility or company did not exist.

## Suggested snapshot composition

These are editorial groups for constructing dated charts, not replacements for version chapters. Resolve every node against the selected release/milestone date.

| Period | Main visible story |
|---|---|
| 2016 | SQL transformation amid ingestion, Redshift, BI and general orchestration. dbt's footprint is small. |
| 2017–2018 | Snowflake/BigQuery targets, Sinter scheduling, reusable packages and generated docs. Olivier's 2018 practice enters the story. |
| 2019–2020 | Core/Cloud identity, browser development, sources/snapshots, emerging orchestration/metadata tools, Airbyte and Google/Dataform by their dated events. |
| 2021–2022 | Stable v1, stronger operational workflow, reverse ETL and semantic offerings. Python and Semantic Layer broaden the standard thesis. |
| 2023–2024 | Mesh, Explorer, contracts and semantics expand dbt's coordination role. SQLMesh, Coalesce and broader platforms complicate the competition picture. |
| 2025 | Fusion/SDF, new development and analysis surfaces, acquisitions and overlapping AI offerings. Preserve announcement versus completion dates. |
| September 2026 | Combined movement/transformation/activation footprint, open-table compute experiments, semantics, context, agents and dashboard ambitions, with maturity visible. |

## Assessing the combined offering

The final chart should answer “Which responsibilities does the combined family serve?” rather than presume it supplies every component completely. The following is an analytical synthesis of the [merger announcement](https://www.getdbt.com/blog/fivetran-dbt-labs-complete-merger-to-create-the-data-infrastructure-for-trusted-ai-agents), [Tobiko acquisition](https://www.fivetran.com/press/fivetran-acquires-tobiko-data-to-power-the-next-generation-of-advanced-ai-ready-data-transformation) and product ledger.

| Responsibility | Combined-family presence | Boundary to keep visible |
|---|---|---|
| Ingestion and replication | Fivetran connectors and HVR lineage | Source applications/databases remain external; connector coverage is product-specific. |
| Storage and compute | Managed lake movement and beta Lake Compute broaden its role | Still relies substantially on external cloud storage, warehouses and lake platforms. |
| Transformation | dbt v1/v2; SQLMesh under common ownership | Different engines and compatibility constraints persist; acquisition does not imply one interchangeable runtime. |
| Orchestration | Hosted jobs, State and integration with external orchestrators | General cross-system orchestration remains a wider responsibility than dbt model execution. |
| Quality and metadata | Tests, contracts, lineage, Catalog and operational context | Do not equate these with complete enterprise observability, governance, access control and data management. |
| Semantics | Semantic Layer and MetricFlow | Interoperability, supported targets and service requirements matter. |
| Analysis and dashboards | Insights, Wizard exploration, Charts beta | Maturity and scope differ from established BI suites. |
| Activation | Fivetran Activations, formerly Census | Operational destinations and their application behavior remain external. |
| AI context and development | MCP, Wizard, Context Layer preview | Model providers, general agent infrastructure and many business workflows remain external. |

## Closing interpretation for Olivier to assess

The evidence supports a shift from a focused SQL tool within a modular stack toward a broader data infrastructure offering. It also shows that competitors are expanding across the same boundaries. “Beyond the Modern Data Stack” can examine that overlap, ownership consolidation, native warehouse tools and agent interfaces without declaring that one vendor has replaced the entire ecosystem.

Olivier's 2022 standard thesis is a useful question to revisit, not a prediction this app must prove correct. Keep his personal assessment for the recording and distinguish it from sourced product events.
