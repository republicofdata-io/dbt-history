# Walkthrough review flags for the researcher (22 September 2026)

Resolution status (22 September 2026): this original review is retained as an input record. All 60 review flags and 82 historical observations have dispositions in [the resolution register](review-resolutions-2026-09-22.yaml); see [the handoff](demo-alignment-handoff-2026-09-22.md) for changes by chapter. The original verdicts below describe the pre-alignment content.

Wording was rewritten by an editorial pass; these items need a content or historical decision and were left untouched.

## 0.1
- Step 1 result table shows location, payment_cents and refund_cents columns, but the query only outputs location_id and revenue_cents and never joins a locations table. Consider aligning the table with the query or the query with the table.
- Step 3 diagram edge is written order_revenue->revenue while the node is named revenue_by_location.
- Step 3 ref('order_revenue') points at a model that is not shown anywhere in this chapter.

## 0.2
- Step 2 schema.yml declares the relationship under orders (from order_id to payments). That checks that every order has a payment. The scenario needs the reverse: every payment must have an order. The result row label (payments to orders) matches the scenario, not the code. Please confirm the intended direction and fix the yaml if needed.

## 0.3
- The step 1 diagram shows payments_by_order and refunds_by_order feeding order_revenue, but the code shows them feeding order_amounts, which order_revenue then reads. Consider adding order_amounts to the diagram or explaining the shortcut.
- Diagram edges use short names (payments, refunds, revenue) that do not match the node names.

## 0.4
- Step 3 shows order_revenue.sql as a plain select from order_amounts, without the incremental config that step 2 introduced. A viewer may think the config was removed. Consider showing the incremental version in step 3.
- Step 1 order_revenue.sql reads from order_amounts, but step 2 introduces order_revenue_input as the source. The chain of models changes between steps without explanation.
- The ephemeral materialization is listed in can_now but never appears in a step.

## 0.6
- Step 3 order_revenue.sql selects only order_id and revenue_cents, but the result table also shows location, payment_cents and refund_cents. Consider aligning the table with the model output.

## 0.7
- profiles.yml here uses target: dev while chapter 0.3 uses run-target: dev. Please confirm which key was current at 0.7.0 so the two chapters agree with history.

## 0.8
- Step 2 shows exactly the same code and highlights as step 1. Per-model transactions are a runtime behaviour that is invisible in model SQL; the wording now says so, but consider a result-panel note or log excerpt if one exists.
- Step 1 result says 13 payment rows for 12 orders in the base dataset. Please confirm the base fixture really has 13 payment rows.

## 0.9
- Step 1 is framed as the problem (copies), but both models already call shared_shop.net_cents. The before state with copied SQL is never shown. Consider showing the hand-typed subtraction in step 1 and the macro call in step 2.
- Step 3 result lists order_revenue in jaffle_analytics, but only revenue_by_location is shown with the schema config.

## 0.10
- packages.yml is listed in can_now but no step shows it. Either add a small step or accept that only seeds are demonstrated.
- Step 3 code joins ref(revenue_by_location), which in other chapters already joins raw.locations for names. Not wrong, but a reader may wonder why names are joined twice.

## 0.11
- Step 1 (meaning): highlights [1,2,3,4] do not cover the column description on lines 6 and 7, which is the point of the step. Consider highlighting 6 and 7 instead of or in addition to 1 to 4.
- Step 2 diagram edges use short names (payments->revenue, refunds->revenue) while the nodes are named payments_by_order, refunds_by_order and order_revenue. Align the edge labels with the node names.

## 0.12
- Step 3 (answer) shows a different revenue_by_location.sql (9 lines, joins raw.locations) than step 2 (4 lines, no join), and order_revenue.sql loses its config tag line between step 2 and step 3. The code should be the same model across steps.
- Relation caching has no step. Either accept that only tags are demonstrated or add a short comparison step.

## 0.13
- Step 3 (business): payments.sql reads through source(), but order_amounts.sql still reads raw.payments and raw.refunds directly, so the new payments model is not actually used downstream. Consider having order_amounts read from ref(payments).

## 0.14
- Step 2 (change): the snapshot code reads select * from raw.customers, while steps 1 and 3 read select customer_id, name, city. The snapshot definition should be identical across steps.
- Step 1 and step 3 snapshot files carry a fixture-phase comment on line 1 that shifts the config lines to 3 and 4, while step 2 has no comment and highlights 1 to 4. Consistent line numbering would help.

## 0.15
- All three steps highlight revenue_by_location.sql lines 3 to 5, which are unrelated to the feature. Consider highlighting only the YAML description in step 1 and only the command line in steps 2 and 3.
- Step 3 command uses dbt --log-format json run. Confirm the flag was global (before the subcommand) in 0.15.0, as shown.

## 0.16
- Step 1 (question): the schema.yml with the meta block is shown before the question is asked. Consider showing only the SQL in step 1, or a schema.yml without meta.
- Steps 2 and 3 (meta, boundary): highlights [1,2,3,4] stop at the meta: line. Lines 5 and 6 (owner: finance, unit: cents) should be highlighted.
- Step 1 table cell reads revenue_by_location: Old Port in the model column. Consider splitting model and location into separate columns.

## 0.17
- Path-based selection has no step. Either accept that only fail-fast is demonstrated or add a one-line command example.
- Step 1 file label says deliberately invalid, which is fine, but the broken model reads raw.refunds directly while the repaired model in step 3 reads ref(refunds). Two things change in the fix, not one.

## 0.18
- Step 1 (change): highlights [1,2] on refunds_by_order.sql show the final SQL with nothing that marks a change. Consider a comment line or a before-and-after view.
- order_amounts reads refunds_by_order, so it is also downstream of the change, but it is missing from the step 1 status table and from the step 2 build list.
- Step 2 table lists only orders as a reused parent. payments_by_order is also unselected and would also be read from production.

## 0.19
- Step 2's snapshot file lacks the 'Fixture phase' comment line that steps 1 and 3 have, so the highlight numbers shift by one between steps (1-4 versus 2-5). Harmless but inconsistent.

## 0.21
- Step 1's result panel lists order_revenue as depending directly on staged payments, but the code shows two models in between (payments_by_order and order_amounts). Consider naming the chain or simplifying the panel.
- Step 3 queries jaffle.revenue_by_location, which is not one of the models shown in step 1, while the step 2 panel calls the skipped model 'dependent revenue model'. Consider aligning the names so the viewer can see it is the same thing.

## 1.0
- Step 1 shows two files both named models/schema.yml with different content (one has the payments test, the other documents revenue_by_location). Consider giving one a different filename or merging them.

## 1.1
- In step 3, order_amounts reads raw.orders, raw.payments and raw.refunds directly rather than through source() or ref(). In dbt's graph it would not sit downstream of the orders source, so source_status:fresher+ would not select it or the models after it. Only orders.sql in step 2 uses source(). The chain the walkthrough describes may not match what the code would actually do.

## 1.2
- Step 3 shows two files with the same name models/revenue_by_location.sql but different SQL (one with the grant config and only revenue, the other with payments and refunds too).
- Step 1 is framed as the situation before the grant, but its code already contains the grant config on line 1 and highlights it. Consider a version without line 1 for step 1, or highlights 2 to 4 only.

## 1.3
- Step 3 result panel says 'all 12 orders'. Confirm the base fixture has exactly 12 orders; the dump does not show them.

## 1.5
- In all three steps the schema.yml highlights are lines 1 to 4 (version, models, name, config). The content that matters is lines 5 and 6 (contract enforced) and 8 to 11 (column names and types). Suggest highlighting 5, 6, 8, 9, 10, 11 instead.

## 1.6
- Step 1 result table lists payments_by_order, refunds_by_order and order_revenue, but the models shown do not include payments_by_order.sql. Consider adding it or accepting that it is referenced only.

## 1.7
- Step 1 uses a local package (local: ../shared_shop). A local dependency has no version to resolve, so it is a weak illustration of request versus resolution. Consider a git or hub package with a version range if the historical record supports it.
- Confirm that package-lock.yml and dbt docs generate --static were both introduced in 1.7.0 as stated.

## 1.9
- Step 3 original takeaway gives location totals 4,500, 5,700 and 4,800 cents. They add to 15,000 but are not shown in any state table. Either add a location table or drop the numbers. The rewrite drops them.
- The rewrite says the second command rebuilds March 8 only, treating --event-time-end 2016-03-09 as exclusive. Confirm that is how 1.9 treats the end date.
- With lookback set to 1, a plain run on March 9 would also reprocess March 8. Consider saying why the explicit date range is shown instead.

## 1.10
- Steps 1 and 2 highlight lines 1 to 4, but the problem is the repeated description on lines 4 and 5. Highlighting 4 and 5 only would match the explanation better.
- The can_now items about macro argument checks and custom freshness SQL are not demonstrated in any step.

## 1.11
- intro.outcome refers to a named supported adapter, but the walkthrough never names one. The return type number(18, 2) suggests Snowflake. Either name the adapter in a code comment or accept the rewrite, which drops the claim.
- Confirm the Jinja call form {{ function("cents_to_units") }} matches the 1.11.0 syntax.

## 1.12
- can_now mentions moving variables into vars.yml, but no step shows a vars.yml file. Either add one or drop the item.
- Step 3 shows the same files as step 1. A parse comparison or a vars.yml example would give the step its own content.
- Confirm the flag name use_v2_parser and the command flags --use-v2-parser and --no-use-v2-parser as of 1.12.0.

## 2.0
- Step 3 result table shows location, payment_cents and refund_cents, but the corrected query selects only location_id and revenue_cents. Either widen the query or narrow the table.
- Step 2 does not say which distribution reports the missing column, or at what moment (parse, compile, run). The rewrite says full dbt, while reading the SQL. Confirm.
- Historical claims to confirm: package names dbt and dbt-oss at 2.0.2, the Product Licensing Agreement licence category, and the September 16 Summit product statuses.

## 0.2 (added by Olivier's review)
- Step 3 was replaced by a seed demo (CSV in `data/locations.csv`, `dbt seed`, resulting table). Confirm against the 0.2.3.0 source that the seed folder was `data/` and whether models could `ref()` a seeded table at that patch; adjust the CSV path or add a join step if so.
