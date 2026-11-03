# `.claude/rules/planning.md` — rationale

Why the rules in [`.claude/rules/planning.md`](../../../.claude/rules/planning.md) exist. No tool loads this file automatically. Read an entry
when you must apply its rule in an unusual case, or change the rule. Format:
[Rule and Rationale](../../../.claude/rules/editing.md#rule-and-rationale).

<a id="sibling-formats"></a>

## Formats shared with the sibling repos

**Rule:** [planning.md §Phased Plan Guidelines](../../../.claude/rules/planning.md#phased-plan-guidelines)

This file was adapted from `karens-database` and `readingorder.info-2025`. The shared skills read one format across all three repos, so a local change to it breaks them.

<a id="premise-spikes"></a>

## Why premise spikes run first

**Rule:** [planning.md §Premise Spikes](../../../.claude/rules/planning.md#premise-spikes-precondition-not-acceptance)

Origin: `readingorder.info-2025` reverted a whole phase whose "verify on a production build" acceptance criterion failed after the build (`docs/archive/plans/timeline-toolbar-registry-plan.md` Phase 1 there).

<a id="run-named-commands"></a>

## Run a command before a plan names it

**Rule:** [planning.md §Authoring Rule](../../../.claude/rules/planning.md#run-named-commands)

QN-17's plan review found two commands that would have failed the plan's own acceptance checks: `node --test <dir>` exits `MODULE_NOT_FOUND` on Node 24, and `next-phase --dry-run` refuses while a phase is 🟡. Both worked as written in some other state. Promoted from the lessons inbox in QN-17 Phase 4.
