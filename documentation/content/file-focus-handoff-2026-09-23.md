# Step file focus handoff

Completed locally in `republicofdata-io/dbt-history` on 23 September 2026. Historical cutoff remains 21 September 2026. The working tree uses Jaffle Shop; that naming was preserved.

Reviewed all 36 chapters and 121 steps. Removed 138 file tabs, reducing this checkout from 352 to 214 blocks. The supplied v0.4 reference had already removed seven from the earlier 359-block set and is unchanged in this pass.

**Unnamed retained files: none.** Every retained file is named by filename, model name or a supported role phrase in its step explanation. Two before/after comparisons have ambiguous links because their filenames share a path; these are app follow-ups, not unnamed-file exceptions.

**Preserved:** every retained code object, its filename, content, highlights and relative order. Result panels, takeaways, intros, historical claim fields, evidence, and the base fixture plus all variants are unchanged. Only step explanations and removal of code blocks changed within chapter files.

**Validation:** all 68 tests pass across three test files. A separate structural comparison verified that retained code lists are exact ordered subsets of the starting lists, all other chapter fields are unchanged, the v0.4 reference and dataset are byte-for-byte unchanged, and every retained file has a name or supported role reference. No browser review or historical runtime execution is claimed for this pass.

**Coverage:** 116 steps retain non-shell code. Three steps show only their command: 1.6/repair demonstrates retry, 1.12/inspect contains the inline SQL being run, and 1.12/compare compares the two parser-selection commands. Two steps are pure results: 0.14/change and 0.19/missing explain the declared customer fixture changes that produced their panels. At most four file tabs remain in a step.

## Follow-up flags

### file-focus-0.6-refresh-links

Both macro versions are named and needed for the before/after comparison. CodeFiles.tsx strips filename suffixes when building aliases, so both use macros/net_cents.sql and prose links select the first block. The corrected macro remains accessible through its file tab.

Make each full displayed filename select its own block, including the version without a suffix. Preserve both filenames and code blocks.

### file-focus-0.18-change-links

The current and saved production versions are both explicitly named. Their shared models/refunds_by_order.sql alias makes prose links select the current version even when the saved version is named. The saved version remains accessible through its file tab.

Disambiguate the full displayed filename with its saved-production suffix in the app link resolver.

### file-focus-0.3-fixed-code

The supplied step has no corrected refunds_by_order.sql block. It now explicitly presents the result after repair, using the existing revenue_by_location.sql block. No corrected file was invented.

If this step should show the repair itself, add a source-checked corrected refunds_by_order.sql excerpt in a separately scoped authoring pass. The present pass only permits removals.

## Files removed by chapter

Counts are file blocks removed from step lists, not physical project files deleted.

| Chapter | Before | Removed | Remaining |
|---|---:|---:|---:|
| origin | 4 | 0 | 4 |
| 0.1 | 6 | 1 | 5 |
| 0.2 | 9 | 4 | 5 |
| 0.3 | 18 | 13 | 5 |
| 0.4 | 7 | 0 | 7 |
| 0.5 | 11 | 4 | 7 |
| 0.6 | 11 | 2 | 9 |
| 0.7 | 7 | 3 | 4 |
| 0.8 | 11 | 4 | 7 |
| 0.9 | 11 | 3 | 8 |
| 0.10 | 8 | 2 | 6 |
| 0.11 | 8 | 3 | 5 |
| 0.12 | 7 | 1 | 6 |
| 0.13 | 10 | 4 | 6 |
| 0.14 | 9 | 3 | 6 |
| 0.15 | 9 | 4 | 5 |
| 0.16 | 6 | 2 | 4 |
| 0.17 | 12 | 7 | 5 |
| 0.18 | 13 | 8 | 5 |
| 0.19 | 7 | 2 | 5 |
| 0.20 | 6 | 1 | 5 |
| 0.21 | 15 | 11 | 4 |
| 1.0 | 7 | 1 | 6 |
| 1.1 | 10 | 4 | 6 |
| 1.2 | 6 | 1 | 5 |
| 1.3 | 6 | 2 | 4 |
| 1.4 | 8 | 2 | 6 |
| 1.5 | 12 | 3 | 9 |
| 1.6 | 16 | 10 | 6 |
| 1.7 | 7 | 2 | 5 |
| 1.8 | 12 | 5 | 7 |
| 1.9 | 16 | 7 | 9 |
| 1.10 | 10 | 2 | 8 |
| 1.11 | 13 | 6 | 7 |
| 1.12 | 15 | 9 | 6 |
| 2.0 | 9 | 2 | 7 |
| **Total** | **352** | **138** | **214** |

## Handoff files

- `documentation/content/file-focus-review-2026-09-23.yaml`: every retained and removed filename by step, checks and follow-up flags.
- `documentation/content/content-index.yaml` and `validation-report.yaml`: current counts in `step_file_focus`; earlier pass records retain their historical counts.
- `README.md`, `AGENTS.md` and `documentation/09-content-authoring.md`: synchronized file-selection rules.

This pass is local and has not been committed or deployed. The coding agent can review presentation sizing, address the two file-link ambiguities, and decide whether the flagged 0.3 repair needs a separate code-authoring change.
