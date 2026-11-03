# `.claude/rules/editing.md` — rationale

Why the rules in [`.claude/rules/editing.md`](../../../.claude/rules/editing.md) exist. No tool loads this file automatically.
Read an entry when you must apply its rule in an unusual case, or change the rule. Format:
[Rule and Rationale](../../../.claude/rules/editing.md#rule-and-rationale).

The file was rewritten in QN-17 Phase 2, ported from `~/github/karens-database`'s `.claude/rules/editing.md`.
The deviations are in the plan's Phase 2 completion log.

<a id="one-line-description"></a>

## `description:` on one line

**Rule:** [editing.md §Authoring Rules](../../../.claude/rules/editing.md#one-line-description)

Ported from `karens-database`. On Claude Code 2.1.312 a wrapped `description:` read as no frontmatter, so the
rule loaded in every session. On 2.1.316 a plain two-line scalar parses and the rule stays scoped. The
one-line form is safe on both, and the guard checks it.

<a id="zero-rule-drops"></a>

## Moving rationale is not a rule drop

**Rule:** [editing.md §Style Rules](../../../.claude/rules/editing.md#zero-rule-drops)

QN-17 D2, from QI-88 D2: moving dates, ids and measurements out of a rule into its rationale file is not
a drop while the rule's intent is unchanged and the rationale is traceable. The evidence is the rule
ledger, [`qn-17-rule-ledger.md`](../qn-17-rule-ledger.md).

<a id="routing-row-triggers"></a>

## A routing row names every trigger a prompt can carry

**Rule:** [editing.md §Cross-Reference Discipline](../../../.claude/rules/editing.md#routing-row-triggers)

Ported from `karens-database`. Codex has no path-scoped loading, so the routing table is its only way
into a rule. In QI-88 the rows named only file edits, and Codex, asked to work an id or run a command
that touched no file, never reached the rule that governed it.

<a id="scripted-doc-edits"></a>

## Scripted doc edits

**Rule:** [editing.md §Authoring Rules](../../../.claude/rules/editing.md#scripted-doc-edits)

A Node `String.replace` with a **string** replacement expands the `$` patterns (`` $` ``, `$'`, `$&`, `$1`).
In `readingorder.info-2025` QR-102 Phase 1, doc text holding a regex that ended in `$` inside a code span
pasted the whole file prefix into a plan. Ported from `karens-database`.

<a id="root-globs"></a>

## Root globs

**Rule:** [editing.md §Authoring Rules](../../../.claude/rules/editing.md#root-globs)

Measured in `karens-database` QI-30 on Claude Code 2.1.316: a rule's `'package.json'`, meant for the root,
loaded on a nested manifest, and `'/package.json'` loaded on the root file only. Here, `AGENTS.md` and
`CLAUDE.md` exist only at the root, so `editing.md` keeps them bare (QN-17 §Move map).

<a id="conventions-apply-to-touched-files"></a>

## The conventions apply to files you touch

**Rule:** [editing.md §Topic-File Header Convention](../../../.claude/rules/editing.md#conventions-apply-to-touched-files)

Ported from `karens-database`, where applying the header convention to new files only left four scoped
files headerless through a full rewrite.

<a id="read-the-source"></a>

## Read the source, not only the local port

**Rule:** [editing.md §Authoring Rules](../../../.claude/rules/editing.md#read-the-source)

Ports carry deliberate deviations, so which text is verbatim decides whether a divergence is a bug or a
decision. Ported from `karens-database`, widened from its one source repo to both siblings.

<a id="loading-probes"></a>

## Loading probes

**Rule:** [editing.md §Authoring Rules](../../../.claude/rules/editing.md#loading-probes)

Two gaps in `karens-database` QI-30's own probes. A first run measured a 1M session only and reported no
cut-off; a re-run with `CLAUDE_CODE_DISABLE_1M_CONTEXT=1` found the ~40,000-char cut. And Codex 0.166.0
logs tool calls as `custom_tool_call`, so a "no `function_call` items" proof was blind: a session that read
files showed 0.

<a id="check-the-cause"></a>

## Check a lesson's cause

**Rule:** [editing.md §Lessons Inbox](../../../.claude/rules/editing.md#check-the-cause)

In `karens-database` QI-30 a lesson was promoted because its claim still read as true, then retired: what
it guarded against had been removed, and as a rule it set the wrong default. Ported from there; QN-17 D15.

<a id="retired-surfaces"></a>

## Retired instruction surfaces

**Rule:** [editing.md §Cross-Reference Discipline](../../../.claude/rules/editing.md#moving-content)

QN-17 moved this repo off a Copilot-shaped layout, in which Codex loaded no project rules and scoping used
`applyTo`, which Claude Code never reads. The guard fails on these paths on a live surface; this file, the
history set and the guard's own files keep them.

| Retired | Replaced by |
| ------- | ----------- |
| `.github/copilot-instructions.md` | `AGENTS.md` |
| `.github/instructions/*.instructions.md` (five files) | `.claude/rules/*.md` |
| `.github/agents/` (`infra-reviewer`) | Its rules, reported by `adversarial-review` |
| `.github/prompts/` (`new-stack-readme`) | The `new-stack-readme` repo skill |
| `.github/hooks/` (the disabled secrets hook) | The plaintext-secrets rule in `AGENTS.md` |
| `CLAUDE.md`'s restatement of the core | `@AGENTS.md` on line 1, then Claude-only notes |
| `applyTo:` and `name:` frontmatter | `description:` and a `paths:` block list |
