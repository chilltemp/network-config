---
description: "Use when modifying AGENTS.md, CLAUDE.md, a rule under .claude/rules/, a rationale file, a repo skill, the guard or docs/ai-lessons.md, or when asked to codify a rule. Covers where rules live, rule and rationale, authoring rules, style, the lessons inbox and cross-reference discipline."
paths:
  - 'AGENTS.md'
  - 'CLAUDE.md'
  - '.claude/rules/**'
  - '.agents/skills/**'
  - 'docs/agents/**'
  - 'docs/ai-lessons.md'
  - 'tooling/agent-guard/**'
---

# Instruction File Editing

Authoritative reference for editing `AGENTS.md`, the scoped rules in `.claude/rules/`, `CLAUDE.md`, the rationale files, the repo skills and the lessons inbox. `AGENTS.md` holds the global rules. Apply this file whenever asked to "add this to CLAUDE.md", codify a new rule, or restructure instructions.

## Where Rules Live

Several agents work this repo: Claude Code (two account profiles) and Codex as the `adversarial-review` reviewer. A rule only one of them can see is not a rule. Nothing may depend on the current roster: keep `AGENTS.md` agent-neutral, and the routing table the only scoping an `AGENTS.md`-only tool needs.

- `AGENTS.md` → the core every agent loads every session: scope, architecture, change safety, agent workflow, and the **routing table** ([§Rule files](../../AGENTS.md#rule-files)), the only list of rule files.
- `.claude/rules/<topic>.md` → one area's rules, loaded by Claude Code on the first Read, Write or Edit of a file matching `paths:`. Other agents reach them through the routing table. ⚠️ `.claude/rules/` holds rule files only: Claude Code loads every `.md` under it.
- `CLAUDE.md` → `@AGENTS.md` as line 1, then Claude Code–only notes. When `/init` is invoked, update `AGENTS.md` or the relevant rule file — **not** `CLAUDE.md`.
- `docs/agents/rationale/<rule>.rationale.md` → why each rule exists ([§Rule and Rationale](#rule-and-rationale)). No tool loads it.
- `.agents/skills/<name>/SKILL.md` → repo skills. Claude Code sees each through a `.claude/skills/<name>` symlink to `../../.agents/skills/<name>`; a new skill needs its link. ⚠️ Not `agent-skills/`, which holds the machine-wide skills.
- `docs/ai-lessons.md` → the lessons inbox ([§Lessons Inbox](#lessons-inbox)).
- ⛔ **Never in agent memory.** Memory is visible only to the agent and account that wrote it. Memory keeps operator preferences and machine-local facts; repo rules, handoffs and investigation logs go in repo files, so a fresh `git clone` yields identical behavior.

## Externalization Rule

- An addition of more than 5 lines about one area → that area's rule file, never `AGENTS.md`.
- A new area gets four things: a rule file, its `paths:`, a row in the `AGENTS.md` routing table, and a paired rationale file.
- An addition spanning unrelated areas is split across their rule files.

## Topic-File Header Convention

- Open with the frontmatter block (`description`, `paths`).
- First sentence states the file's domain and that `AGENTS.md` holds global rules.
- The topic file owns its domain's recipes, patterns and workflow.
- <a id="conventions-apply-to-touched-files"></a>The conventions in this file apply to every instruction file a task **touches**, not only to the ones it authors. ([why](../../docs/agents/rationale/editing.rationale.md#conventions-apply-to-touched-files))

## Rule and Rationale

- **A rule says what to do.** It keeps one short reason only when that reason changes how the rule is applied.
- **Everything else goes in the paired rationale file:** dates, queue ids, measurements, how the rule was found, rejected alternatives, links to archived plans.
- **Link format.** The rule ends with `([why](<relative path>/docs/agents/rationale/<rule>.rationale.md#<anchor>))`.
- **Entry format.** `<a id="<anchor>"></a>`, a blank line, `## <short title>`, then `**Rule:** [<rule file> §<section>](<relative path to the rule>#<anchor>)`, then the body. The back-link is a link, so the anchor check covers it.
- **Traceability both ways.** Every rationale link in a rule resolves; every rationale entry is linked from its rule.
- **Pairing.** Exactly one rationale file per instruction file: `AGENTS.md` → `agents.rationale.md`, `CLAUDE.md` → `claude.rationale.md`, `.claude/rules/<p>.md` → `<p>.rationale.md`.
- **Public repo.** Rationale carries no per-service finding.
- **Citations are links.** Cite an instruction file as a `path#anchor` link, never `file.md:N` or a bare `§Section`. Keep an `<a id>` and its heading on whichever line holds its rule: the guard fails on a dropped one.

## Authoring Rules

- **Frontmatter.** Every rule file has `description:` and a non-empty `paths:` written as a YAML block list (`paths:` then `  - 'glob'` lines). A rule with no `paths` loads in every session, which makes it global: put it in `AGENTS.md` instead.
  Write globs with `**`, never a literal `[segment]`: it reads as a bracket expression. Quote a glob that starts with `*`: bare, YAML reads it as an alias.
  - <a id="root-globs"></a>⚠️ A glob with no `/` matches at any depth; anchor a root file with a leading `/` when the same name exists deeper. ([why](../../docs/agents/rationale/editing.rationale.md#root-globs))
  - <a id="one-line-description"></a>⛔ Keep `description:` on one line, however long. ([why](../../docs/agents/rationale/editing.rationale.md#one-line-description))
- ⛔ **No `@` token that resolves to a file** in `AGENTS.md`, `CLAUDE.md` after line 1, or a rule. Claude Code imports `@path` from Markdown text, including bold, italic and link text, with a `#fragment` stripped; it skips code spans and fences.
  - Write a path as a code span with no whitespace before `@` (`` `@path` ``), or as a link with no `@` in its text.
  - `CLAUDE.md`'s `@AGENTS.md` is the one intended import.
- **No hard wrap in `AGENTS.md`.** One paragraph or bullet per line. Rule files may wrap at 100.
- <a id="read-the-source"></a>**A rule ported from a sibling repo** (`~/github/karens-database`, `~/github/readingorder.info-2025`): diff the local copy against the source before relying on it, and log every deliberate deviation. ([why](../../docs/agents/rationale/editing.rationale.md#read-the-source))
- **Name tools neutrally.** No harness-specific tool names in `AGENTS.md` or rule files. Claude-only bindings go in `CLAUDE.md`.
- **Don't restate Atrium's guidance.** Atrium injects its own guidance into every pane (pane and agent messaging, browser use, workspace commands).
- <a id="loading-probes"></a>**A loading probe** (after a Claude Code or Codex upgrade) records the tool version and, for Claude Code, the context window, and tests 200K (`CLAUDE_CODE_DISABLE_1M_CONTEXT=1`) as well as the default.
  A "no tools used" check on a Codex rollout counts `function_call` and `custom_tool_call`, and is tried first on a session that did use tools. ([why](../../docs/agents/rationale/editing.rationale.md#loading-probes))
- <a id="scripted-doc-edits"></a>⛔ **Scripted doc edits never pass a string replacement to `String.replace`:** it expands `$` patterns in doc text. Pass a function (`s.replace(a, () => b)`) or use `split`/`join`. ([why](../../docs/agents/rationale/editing.rationale.md#scripted-doc-edits))
- **Budgets** (the guard enforces the hard ones): `AGENTS.md` ≤ 200 lines, ≤ 24,576 bytes, ≤ 400 chars per line (working target, not guarded: ≤ 190 lines and ≤ 22,528 bytes, so a routing row can land without a trade); `CLAUDE.md` ≤ 40 lines; each rule file ≤ 400 chars per line outside fenced code; `docs/ai-lessons.md` ≤ 200 lines.
  Soft: each rule file ~20,000 chars, reported on every guard run, never a failure — a rule loads whole on every matching file, so its size is paid on every such task.

## The Guard

- Run `node tooling/agent-guard/check.mjs` by hand after every edit to an instruction file, and fix what it reports. ⛔ Nothing runs it automatically: no hook, no CI.
- `--only <check>` runs one check. `node --test tooling/agent-guard/check.test.mjs` runs its fixtures, and is required after a change to the guard.
- The live scans read tracked files: `git add -N` a new doc before the run.

## Style Rules (every instruction file)

1. Short, direct sentences. Cut filler words.
2. No explanations unless the rationale changes how the rule is applied.
3. Technical terms exact. Code blocks unchanged verbatim.
4. Prioritize: [Thing] [Action] [Result].
5. Use symbols where clear: →, =, vs., ≥, ✕, ⛔, ⚠️.

<a id="zero-rule-drops"></a>**Non-negotiable:** zero rule drops — every enum value, path, naming pattern, and example survives a rewrite. Bold warnings stay bold. YAML/JSON/bash blocks copied unchanged. Compression is reorganization, not content rewriting.
⭐ **Moving rationale is not a rule drop**, as long as the rule's intent is unchanged and the rationale is traceable at its new location. ([why](../../docs/agents/rationale/editing.rationale.md#zero-rule-drops))

## Lessons Inbox

[`docs/ai-lessons.md`](../../docs/ai-lessons.md) is an inbox of **at most 200 lines**.

- **Capture.** After a user correction or an agent mistake, capture the pattern in the inbox, never only in an agent's private memory, which other agents and the other Claude account cannot see. Promote a durable rule into the relevant rule file or `AGENTS.md`, and prune the note once the canonical rule exists.
- **Entry format.** The plan's queue id when written during plan work; an `<a id>` when another doc cites the entry.
- **Sweep.** A plan's last phase promotes or retires every entry the plan added, in one sweep, and its completion log lists each retired entry with a one-line reason. The 200-line cap is the backstop for lessons written outside a plan.
- <a id="check-the-cause"></a>**Check first.** An entry is a candidate, not a rule. Check what it claims against the current tree, and that its cause still exists, before choosing its outcome; a path that still exists is not enough. ([why](../../docs/agents/rationale/editing.rationale.md#check-the-cause))

| Outcome | What happens |
| ------- | ------------ |
| Promote | The durable rule goes into the owning rule file, within its budget, and the history and evidence go into the paired rationale file. The entry is deleted |
| Already promoted, or enforced by the guard | The entry is deleted |
| Obsolete: what it describes is gone or reversed | The entry is deleted, and the commit message cites the evidence |
| Not a rule: true, but not a standing instruction | History that explains a rule moves to that rule's rationale file; the rest is deleted |
| Not durable yet | It stays, compressed |

When an entry is deleted, repoint or remove every inbound `ai-lessons.md#<slug>` link; the guard fails on one left behind on a live surface. Placeholder examples use `#<slug>`, which cannot match.

## Cross-Reference Discipline

- <a id="moving-content"></a>**Moving content** means repointing every inbound link on a live surface, then a link check, not just a grep: the moved text's own relative links break too. Historical records (`docs/archive/`, `docs/handoffs/`, `_IDEAS_/`, `docs/agents/rationale/`, the `## Archive` rows of `docs/index.md`) keep their paths.
  The guard catches a broken link, anchor or citation. ([retired paths](../../docs/agents/rationale/editing.rationale.md#retired-surfaces))
- ⚠️ A `git mv` of a doc is followed by a link check of the moved file's own relative links, not just a grep for inbound links.
- **Before moving a rule into a file, check the receiving file**; a copy already there is ledgered as "duplicate of", not added twice.
- **Adding, renaming or removing a rule file** → update the routing table in `AGENTS.md` (each rule file in exactly one row) and the paired rationale file.
- <a id="routing-row-triggers"></a>**A routing row names every trigger a prompt can carry**, not just the `paths:` globs: ids (`QN-<n>`), words, and actions that touch no file (running a playbook, `ansible-vault`).
  Moving text out of `AGENTS.md` into a path-scoped rule → put every trigger in that rule's `description:` into its row. ([why](../../docs/agents/rationale/editing.rationale.md#routing-row-triggers))
