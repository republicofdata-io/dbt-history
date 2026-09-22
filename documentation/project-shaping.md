# dbt, from the first commit to v2

> Working concept: one evolving data project tells the story of dbt from its beginnings in 2016 through v2 in 2026, with Olivier’s eight years of practice woven into that history.

**Status:** Shaping draft with confirmed editorial direction, updated 22 September 2026. Guided examples inside the app replace the separate local lab. App implementation has not started.

**Historical scope:** 2016–September 2026. Olivier’s adoption in 2018 is a personal milestone within the larger history, not the starting point.

**Working title:** *Ten years of dbt, through one evolving data project.*

**Format:** One public web app with guided Waffle Shop examples, supporting a 20-minute YouTube video recorded by Olivier and subsequent browsing on his website.

**Audience:** Both newcomers and experienced data practitioners.

**Chapter structure:** Version by version, beginning with the earliest releases: v0.1, v0.2, and the actual published release sequence through v2. Features and personal reflections sit within that chronology.

## Purpose

Show how dbt developed from its earliest releases into today’s engine and product offering, and what those changes meant in the daily work of a data practitioner.

The project connects four stories:

1. The evolution of dbt’s capabilities, from its beginnings through v2.
2. The products that grew around the engine, including changes in naming, packaging, and availability.
3. The expansion of the combined dbt–Fivetran offering across the data ecosystem.
4. What comes beyond the Modern Data Stack, including an expanding competitive landscape.

Olivier’s [July 2018 article](https://odupuis.medium.com/my-journey-introducing-the-data-build-tool-dbt-in-projects-analytical-stacks-69971faed2c2) provides a personal reference point: SQL models, reusable business logic, tests, Sinter, and a belief in modular tools. Revisiting those ideas as the offering expands gives the project a practitioner’s perspective.

His [October 2022 article, “dbt Inside: Setting the data platform standard”](https://odupuis.medium.com/dbt-inside-setting-the-data-platform-standard-419aa3d9e11c), adds a second reference point. It interprets Python support and the semantic layer as moves toward broader adoption and a position as a platform standard, while questioning the consequences for modularity and replaceability. Treat this as Olivier’s interpretation at the time, to revisit in the recording. The article’s forward-looking use of “version 2” should not be mistaken for a description of the eventual 2026 release.

The central question is: **What changed in the work of a data practitioner as dbt grew?**

## One complete experience in the app

### A public history app

A browsable history that Olivier can navigate while recording, with enough depth for viewers to explore independently afterward. Every release chapter offers a plain-language explanation for newcomers and expandable technical details for experienced practitioners.

| View | What visitors explore |
| --- | --- |
| The release | Details of the selected version, its practical changes, and its Waffle Shop demonstration. |
| The catalogue | The products offered by Fishtown Analytics / dbt Labs at that release date, using their names and availability at the time. The combined Fivetran offering appears only after the merger. |
| The wider ecosystem | A diagram of the data stack at that release date, showing the layers present then, dbt’s products within them, and the significant surrounding players. |

**The release is the anchor for all three tabs.** A persistent selected-version control and date sit above them. Switching tabs preserves the release. Switching releases preserves the active tab and updates its contents, so viewers can watch the catalogue or ecosystem evolve without returning to the release view. Previous/next controls remain available in every tab and in presentation mode.

The release index covers dbt’s origins in 2016 through v2. Olivier’s adoption appears in 2018. The tabs are three views of the same historical moment; neither the catalogue nor the ecosystem defaults to today’s offering.

Selecting a version opens a consistent chapter:

- **The problem then:** what practitioners struggled with.
- **What shipped:** the feature, release, and supporting evidence.
- **What changed in practice:** the effect on a real workflow.
- **See it happen:** an embedded, step-by-step Waffle Shop example with prepared code and results.
- **Availability:** open source, proprietary/free, paid, preview, or retired.

Separate original release dates from announcement dates, preview dates, GA dates, and later edits to documentation. Preserve historical product names alongside their current names.

Olivier’s recording notes do not appear in the app. His personal commentary remains part of the video.

### Guided Waffle Shop examples

Every release includes a short walkthrough within The release tab. Visitors use Next, Previous and Restart to move through prepared steps: the situation, relevant code or configuration, result and practical takeaway. Code is read-only; tables, highlights and diagrams change as the visitor advances.

For unit tests, the sequence can show a refund problem, faulty SQL, a small fixture, the test failure, then corrected SQL and the matching result. Visitors don't introduce the bug or type the fix themselves.

The app contains everything Olivier needs for the video and everything visitors need to explore afterward. There is no separate terminal demonstration, visitor setup or live execution. The earlier multi-version local lab is superseded; its research remains reference material for accurate examples.

## Timeline scope and narrative depth

Chapters are named for versions: **v0.1, v0.2, …, v1.0, v1.1, …, v2.0**. Populate the sequence from release evidence; do not assume every possible version number was published. Include any earlier initial releases in the opening history.

Cover every published release series in that sequence, including pre-1.0 and 1.x minor releases. Individual patches can sit within their series when historically significant. The earlier proposal for 8–10 thematic chapters is superseded by this version-by-version structure.

Each chapter should capture the release date, what changed since the preceding version, the corresponding guided Waffle Shop steps, and the relevant product or market events. If a release mainly improves compatibility or developer experience, show that honestly without inventing a business feature.

The timeline begins with dbt’s origins in 2016. It should explain what existed before Olivier adopted it, then introduce his 2018 article as a personal milestone. Avoid attributing later first-hand experience to the earlier period.

The exact release inventory and feature-to-version mapping remain research work. Product launches have their own dates and should appear alongside the relevant versions without implying that they shipped as part of Core.

## Waffle Shop

**Confirmed scenario:** Waffle Shop, with customers, orders, payments, refunds, and multiple locations.

Proposed recurring business question:

**How much revenue did each location earn, and can we trust the answer?**

The project grows as the versions introduce capabilities. Attach each demonstration to the version that introduced it: reusable SQL, tests, documentation, snapshots, state comparison, contracts, unit tests, microbatch, and later SQL comprehension are candidate examples to map through research.

Keep the underlying business question stable. Add controlled complications when a release gives a useful way to address them. Each version should explain what changed, including releases where the business output stays the same but the workflow improves.

## The 20-minute YouTube recording

Olivier will record a 20-minute video using the web app and Waffle Shop project. The release sequence provides the structure. The personal and strategic themes below are commentary woven into that sequence, with opening and closing context.

The duration requires uneven pacing: some versions may receive a brief explanation, while others justify a visible demonstration. Preserve every release chapter and its complete guided example in the app for viewers to browse afterward. The detailed timing remains to be shaped after the release inventory is known.

Support both audiences within each chapter: begin with the practical change, then show the relevant code or execution detail. Keep the recording inside the app, advancing through prepared steps without terminal switching or live setup.

### Olivier’s commentary threads

Olivier will supply his experiences while recording. Keep relevant sources in the preparation document rather than displaying personal recording notes in the app or writing recollections on his behalf.

- **The pre-dbt era:** how he worked before dbt and what made its approach compelling.
- **The exciting road toward v1:** adoption, community, and the growing usefulness of the tool.
- **The businessification of dbt Labs:** his perspective on the growing company and commercial catalogue, anchored to dated product and company events.
- **dbt as a standard:** revisit the argument in his 2022 “dbt Inside” article and assess what followed.
- **Beyond the Modern Data Stack:** close with the expanding competitive landscape and the role of dbt–Fivetran within it.

## Preparing historically accurate examples

Author each example against the release research, preserving period-appropriate syntax, feature-introduction patches and relevant adapter limitations. Keep the Waffle Shop data and business rules consistent and independently check each small result table.

Prepared results may be illustrative. Label them accordingly and distinguish genuine captured dbt outputs with their actual version and capture details. Don't fabricate terminal transcripts or claim a historical environment was run when it wasn't.

Original runtime execution can support selective authoring checks if useful. Reproducing every version is no longer a deliverable or prerequisite for publishing the app. Keep the runtime research as a reference and the previous local environment plan as superseded history.

Use short, reversible walkthrough steps. Direct entry into any release should provide enough context to understand its example. Presentation mode and public browsing share the same content.

## The catalogue at each release

Show the products that existed at the selected release date. Organize them by role and show relationships between the engine, hosted services, and capabilities where useful. Historical family relationships support this snapshot; future launches do not appear as though they were already available.

The product history should distinguish:

- Engine and framework releases.
- Open-source and proprietary distributions.
- Hosted services and developer interfaces.
- Capabilities within products versus separately packaged products.
- Acquisitions, integrations, renames, and retirements.

Sinter and its evolution into dbt Cloud belong in this history. So do the products and capabilities that expanded the offering into metadata, semantics, development assistance, and consumption.

The v2 endpoint needs precise language: the full distribution is **dbt**, and its Apache-licensed subset is **dbt OSS**. The convergence of the Core and Fusion engines does not eliminate the distinction between distributions.

The dated catalogue remains to be researched and populated. It should not imply that every product was a direct branch of Core’s codebase, that every capability was sold separately, or that Fivetran was part of dbt Labs before the merger.

## The wider ecosystem at each release

Use a recognizable data-stack diagram rather than a comparison table. Show a logical flow through the layers present in that era, with named products inside each layer and cross-cutting responsibilities such as orchestration and data quality where appropriate.

- Highlight dbt’s own products consistently; show other players in a neutral treatment.
- Preserve historical company ownership and product names.
- Represent major players of the period through evidence, not current popularity projected backward.
- Allow the diagram’s layers and product footprint to evolve over time. Earlier stacks should not inherit today’s agent or headless semantic offerings.
- Distinguish logical data flow from physical execution: dbt transformations execute in the warehouse.
- Keep integrations, complements, and direct alternatives distinguishable. Co-location in a layer does not imply complete substitutability.

The first mockup uses representative players and provisional snapshots to demonstrate the interaction. Full historical selection, prominence, availability, and release dates still require verification. Package publication timestamps used for draft positioning are not automatically GA dates.

## The ending: dbt and Fivetran across the ecosystem

Use the final ecosystem map to examine the combined offering across:

- Data ingestion and movement.
- Storage and compute.
- Transformation and orchestration.
- Data quality, metadata, and discovery.
- Semantic definitions and metrics.
- Analytics and consumption.
- AI context and agent workflows.

For each responsibility, show what dbt or Fivetran supplies directly, what relies on partners or external platforms, and what remains outside the offering.

Show product maturity explicitly. The September 2026 announcements include a mix of GA products and beta or preview offerings. “Serving the whole ecosystem” is a proposition to assess through this map, rather than a conclusion to assume.

The closing reflection can return to Olivier’s original interest in modular tools: **How has that promise changed as the product catalogue expanded?**

### Beyond the Modern Data Stack and the competitive landscape

Extend the closing map beyond the combined product catalogue. Examine how the competitive field changes when tools expand into adjacent responsibilities and when platform vendors bundle more of the stack.

Research should distinguish direct alternatives, complementary tools, and products that compete in one area while integrating in another. Candidate comparison areas include transformation engines, orchestration, warehouse and lakehouse platforms, semantics, analytics, and agent workflows. Specific vendors and current capabilities remain to be researched.

Compare concrete responsibilities, interoperability, and adoption tradeoffs. Separate shipped capabilities from announced direction. Use the 2022 standards argument as a question to revisit: where has dbt become a shared foundation, and where do competing approaches challenge or bypass it?

## Proposed first scope

This is a suggested boundary for a future build, not an approved implementation plan:

- A sourced historical inventory from 2016 through v2.
- Three views anchored to the same release: release details, the contemporary product catalogue, and a contemporary ecosystem diagram.
- Waffle Shop as the single evolving business scenario.
- A chapter for every published release series from the earliest versions through v2.
- An embedded guided Waffle Shop example for every version, using prepared steps and read-only code.
- Source-reviewed illustrative results, with genuine captured artifacts where useful and clearly identified.
- Publication on Olivier's website for independent browsing after the video.
- A 20-minute YouTube walkthrough for newcomers and experienced practitioners.
- Olivier’s own experience and reflections in the recording, without a recording-notes panel in the app.
- A closing view of the world beyond the Modern Data Stack and the expanding competitive landscape.

The shaping stage does not require choosing a web framework, building a public execution service, or recreating every historical hosted product.

## Confirmed editorial decisions

1. **Scenario:** Waffle Shop.
2. **Audience:** both newcomers and experienced practitioners.
3. **Presentation:** Olivier will record a 20-minute YouTube video entirely within the app.
4. **Chapters:** version by version, beginning with v0.1, v0.2, and continuing through the published sequence to v2. Thematic chapters are superseded.
5. **Personal history:** Olivier will discuss the pre-dbt era, the road to v1, the businessification of dbt Labs, and dbt as a standard while recording.
6. **Closing perspective:** beyond the Modern Data Stack and the expanding competitive landscape.
7. **Shared historical anchor:** the release controls all three tabs; changing releases preserves the active tab.
8. **Catalogue:** show dbt’s products as they existed at that point in time.
9. **Ecosystem:** show a data-stack diagram for that time, including dbt’s footprint and the major players in each contemporary layer.
10. **Recording notes:** remove Olivier’s personal recording notes from the app.
11. **Examples (22 September):** guided steps with Next, Previous and Restart; read-only code and prepared results. No visitor code changes or execution.
12. **Publication (22 September):** publish the complete app on Olivier’s website for visitors to explore. The separate local lab and terminal-demo approach are superseded.

## Remaining preparation

- Turn the researched per-release demonstrations into concise guided storyboards and prepared visual states.
- Review historical snippets and independently check the example results.
- Rehearse pacing across the 35 chapters within the 20-minute recording.
- Resolve qualified catalogue/ecosystem dates and finish the selected historical diagrams using the research ledger.
- Establish integration and publishing details for Olivier's existing website.

The release inventory and coding-agent research are complete for planning. This update changes documentation only; the approved visual concept hasn't yet been revised to include the walkthroughs.

## Initial evidence and research anchors

These sources support the initial shape. They are not a completed historical bibliography.

| Source | Relevance |
| --- | --- |
| [On two years of dbt](https://www.getdbt.com/blog/on-two-years-of-dbt) | Retrospective on the March 2016 origins and early development. |
| [Olivier’s 2018 article](https://odupuis.medium.com/my-journey-introducing-the-data-build-tool-dbt-in-projects-analytical-stacks-69971faed2c2) | Personal milestone, original Eventbrite example, and modular architecture perspective. |
| [Olivier’s 2022 “dbt Inside” article](https://odupuis.medium.com/dbt-inside-setting-the-data-platform-standard-419aa3d9e11c) | His contemporary interpretation of dbt’s expansion, standards strategy, and implications for modularity. |
| [What’s in a name?](https://www.getdbt.com/blog/whats-in-a-name) | Sinter and the naming of dbt Core and dbt Cloud. |
| [dbt Core v1.0 is here](https://www.getdbt.com/blog/dbt-core-v1-is-here) | Retrospective on early capabilities and the path to v1.0. |
| [dbt Core v1.5](https://www.getdbt.com/blog/dbt-core-v1.5) | Model contracts and model versions. |
| [2024 dbt Cloud launch showcase](https://www.getdbt.com/blog/dbt-cloud-launch-showcase-2024) | v1.8 and unit testing among the announced capabilities. |
| [dbt Core v1.9 is GA](https://www.getdbt.com/blog/dbt-core-v1-9-is-ga) | Microbatch and snapshot changes. |
| [Fivetran and dbt Labs complete their merger](https://www.getdbt.com/blog/fivetran-dbt-labs-complete-merger-to-create-the-data-infrastructure-for-trusted-ai-agents) | June 2026 corporate milestone, distinct from the earlier merger announcement. |
| [dbt licensing FAQ](https://www.getdbt.com/licenses-faq) | Changes in distribution naming and licensing through v2 GA. |
| [dbt Summit 2026 product announcements](https://www.getdbt.com/blog/dbt-summit-2026-product-announcements) | Current products, maturity statuses, and adapter availability. |

## Working notes

Add decisions, corrections, sources, and possible demonstrations here as the concept develops. Distinguish confirmed choices from proposals.

- **Confirmed by Olivier:** start at the beginning of dbt, not at his adoption in 2018.
- **Confirmed by Olivier:** keep a shared Markdown document for continued shaping.
- **Confirmed by Olivier:** the editorial and interaction decisions above.
- **Superseded proposals:** the Eventbrite alternative, the 8–10 thematic chapter structure, and (22 September) the separate multi-version local lab and terminal demonstrations.

## Research handoff · 21 September 2026

Olivier requested the research and a coding-agent brief while signing off. The completed [research package](README.md) contains the 35-version release inventory, product/ownership history, ecosystem evidence, and separate app and local Waffle Shop coding briefs. Research verified source and package metadata. The runtime build plan was superseded by the guided-example decision on 22 September; its research remains reference material.

## Guided examples decision · 22 September 2026

**Confirmed by Olivier:** keep the whole experience inside the app. Each release has a guided Waffle Shop example with prepared steps and read-only code/results; visitors don't edit or execute code. Publish the app on his website. The [updated handoff](README.md) now prioritizes the app and guided examples briefs, retaining the local environment plan only as an archive.
