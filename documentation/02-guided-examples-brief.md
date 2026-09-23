# Coding brief: guided Jaffle Shop examples

**Current direction, confirmed by Olivier on 22 September 2026.** This brief replaces the local environment deliverable. The public app contains the complete experience, including the examples used in the 20-minute YouTube recording.

## Experience

Each release includes a short Jaffle Shop walkthrough. Visitors advance through prepared steps with **Next**, **Previous** and **Restart**. The app shows read-only code, highlighted changes, small tables, diagrams and explained results. Visitors don't edit code, change fixtures, configure dbt or execute commands. A command may appear as part of the explanation, without being a runnable terminal control.

**Updated 22 September 2026:** the example is a fourth tab, **Jaffle Shop**, beside The release, The catalogue and The wider ecosystem. It is not a separate application. All 35 version chapters remain, with the same release/date anchor controlling the catalogue and ecosystem views. The app will be published on Olivier's website so viewers can explore at their own pace afterward.

## Suggested walkthrough structure

Use the smallest number of steps that explains the contribution clearly. Three to five is a useful starting point, not a requirement that every release fit the same template.

1. **The situation:** the Jaffle Shop problem or workflow before the feature.
2. **The change:** the relevant SQL, YAML, command or configuration, with the important lines highlighted.
3. **What happens:** the prepared table, test result, lineage change or other visible consequence.
4. **Why it matters:** the practical difference from the previous workflow.

A failure-and-fix example can split the result into two steps. A packaging or reliability release may use a workflow comparison instead of inventing a new business problem. Keep each step understandable on its own and use short captions that Olivier can speak over.

## Example: v1.8 unit tests

This is a storyboard to author and verify, not implemented UI or a captured dbt run.

| Step | What the visitor sees | Explanation |
|---|---|---|
| 1. Refund problem | One 1,200-cent payment and a 200-cent refund | The order should contribute 1,000 cents to revenue. |
| 2. Faulty calculation | Read-only SQL that adds the refund instead of subtracting it | Highlight the faulty expression. |
| 3. Small test fixture | Input rows and the expected 1,000-cent result | Show how a SQL unit test describes the edge case. |
| 4. Test fails | Expected 1,000; actual 1,400 | Explain the discrepancy using an illustrative result panel unless a real run was captured. |
| 5. Corrected calculation | Highlight the subtraction and show matching results | The final state demonstrates what the test protects. |

The visitor only advances through the sequence. They don't introduce the bug or type the fix themselves. Use era-appropriate YAML and sources when authoring the actual example.

## One evolving shop

Keep customers, orders, payments, refunds and locations consistent across releases. The recurring question is **How much revenue did each location earn, and can we trust the answer?** Reuse small, readable data examples so the visitor learns the shop once.

Possible walkthroughs already supported by the release research include dependency order, incremental loads, reusable macros, docs and lineage, source freshness, customer history, state selection, contracts, unit tests and microbatch. Adapt the proposed demonstrations in `03-release-history.md` into prepared steps. Preserve exact feature-introduction patches and adapter limits.

Users can jump directly to any chapter. Include enough context in its first step to understand the example without completing earlier chapters. Within one browsing session, returning to a release should restore its step; Restart returns it to step one. Changing tabs preserves that release's step. Entering a new release starts at its first step unless a deep link names another step.

## Content model

Store walkthrough content separately from the UI so it can be reviewed and revised without changing the component code.

| Item | Suggested fields |
|---|---|
| Walkthrough | id, release id, feature/milestone id, title, learning objective, short context, ordered steps, source references |
| Step | id, title, explanation, read-only code blocks, highlighted lines, input/output table or diagram state, takeaway |
| Evidence | source URLs, exact historical version/adapter where relevant, illustration or captured-output status, review date, limitations |
| Captured result, when available | producing runtime/version, capture date, source artifact reference, disclosed adaptations |

Prepared state changes should be deterministic and reversible. Navigating to step four should select its complete authored state, rather than rely on having executed steps one through three. Deep links may include the release, milestone, tab and step.

## Evidence and honesty

The authoring process checks snippets against the relevant release evidence and checks the small example's arithmetic and logic. Original runtime execution can be used selectively if it materially helps verify an example, but building all historical environments is no longer an app deliverable or a publication prerequisite.

Distinguish **illustrative results** from **captured dbt output**. An authored pass/fail panel is fine when it's labelled as an illustration. Don't fabricate an original terminal transcript or say a historical runtime was tested when it wasn't. Put detailed source/capture information behind an unobtrusive evidence link; keep it out of the main explanatory flow unless a limitation affects understanding.

Retain the historical runtime reports as research references. Their installation plans and compatibility acceptance gates don't govern this guided-example build. A runtime that can't be reproduced needn't block a well-sourced illustration of its documented behavior.

## Website and presentation

Bundle the prepared examples with the app. Browsing them requires no dbt account, database connection, local installation or separate terminal. Don't add a SQL execution backend for these walkthroughs. Website integration, route placement and publishing details should be established against Olivier's actual site before deployment; no hosting provider is selected by this brief.

Use readable code and tables at recording size, with touch/keyboard-accessible controls, visible step count and no forced autoplay. Steps should remain useful with reduced motion. Keep release navigation and walkthrough navigation visually distinct so advancing a step doesn't unexpectedly change the release.

For the video, Olivier can use the same walkthroughs and move quickly through shorter chapters. Public visitors can pause, go back, restart or jump between releases. Presentation mode changes the layout, not the content or evidence.

## Acceptance criteria

- Every one of the 35 release chapters has a suitable guided Jaffle Shop example.
- Every example is accessible within the release view; the whole recording can stay in the app.
- Next, Previous, Restart, step count, direct entry and tab/release navigation behave consistently.
- Code is read-only. There are no visitor fixture controls, live SQL execution buttons or simulated setup requirements.
- Each step renders the same authored state regardless of navigation history.
- Snippets, feature dates and explanations are reviewed against sources; small-table results are checked independently.
- Illustrative and captured outputs are distinguishable; no fabricated execution claims.
- The published experience works without visitor accounts or local tools and is checked for keyboard access, narrow screens and recording readability.
- The existing release/catalogue/ecosystem anchor and visual direction are preserved.
- README and AGENTS explain how to add or revise a walkthrough and its evidence.
