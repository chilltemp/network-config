# QN-17 — Agent instructions migration — plan

**Status:** Phase 1 ✅ · Phase 2 ✅ · Phase 3 🟡 · Phase 4 ⬜

Written 2026-11-01 from [agent-instructions-migration-proposal][proposal], which stays as the
requirements doc (REQ-AGENT-01…10) and records the rulings. Queue row **QN-17**, sprint `current`.

**The guides are two sibling plans**, read for this plan on 2026-11-01:

- `~/github/readingorder.info-2025` QI-88 (27 sessions, all ✅):
  `docs/archive/plans/arch-instruction-and-docs-diet-plan.md`, its ledger beside it, and the contract
  `docs/specs/agent-instructions-spec.md`.
- `~/github/karens-database` QI-30 (in progress, at Phase 5a):
  `docs/plans/instruction-and-docs-diet-plan.md`, `docs/agents/qi-30-rule-ledger.md`, the guard in
  `tooling/agent-guard/`. Where the two differ, QI-30 is later and wins.

This plan changes agent rules, docs, one tooling folder and two memory notes. ⛔ It changes no running
host or service, no compose file and nothing under `Ansible/`, so
[Live-Host Safety](../../.github/instructions/planning.instructions.md) has nothing to gate.

---

## Context

The proposal's §Why has the diagnosis. This repo differs from the siblings in three ways that shape
the plan:

1. **It is small.** The merged core is ~17 KB before duplicates go, about a third of what QI-30 started
   with, and every rule file is already under budget. This is a move and a merge, not a diet.
2. **It has no test pipeline.** The siblings' guards run inside `pnpm test`. Here the guard runs only
   when someone runs it (D5).
3. **It commits straight to `main`** (D7), so there is no branch to hide a half-moved tree on. Phase 2
   lands as one change.

### Measured state at `762734b`

| What | Measure |
| ---- | ------- |
| Core files | `CLAUDE.md` 58 lines / 6,392 B · `.github/copilot-instructions.md` 119 lines / 10,749 B. Merged ≈ 17.1 KB, duplicates included. Three lines over 400 chars: `CLAUDE.md:22`, `copilot-instructions.md:38` and `:69` |
| Scoped files | `planning` 11,812 B · `proposals` 5,127 · `editing` 3,417 · `ansible-safety` 1,403 · `compose-stack-conventions` 1,304. None has a line over 400 chars |
| Other surfaces | `infra-reviewer.agent.md` 1,471 B · `new-stack-readme.prompt.md` 1,079 B · `block-plaintext-secrets.json.DISABLED` 661 B, renamed to disabled on 2026-04-21 · `.vscode/settings.json` holds `cSpell.words` only |
| Inbound references | 18 files name an instruction path. 10 lines in 7 files name `copilot-instructions` with no `.md`. 12 lines cite a rule file by `§Section` |
| Compose files | 12, all `<stack>/docker-compose.yml`, one level down |
| Portainer wording | `CLAUDE.md`, `copilot-instructions.md:9`, the compose rule, `Ansible/README.md` and 10 stack READMEs say "UI/API". `forgejo/README.md` says UI in GitOps mode |
| Claude memory | `~/.claude/projects/-Users-chill-github-network-config/memory/` 3 notes · `~/.claude-secondary/…/memory/` empty |
| Tools | Claude Code 2.1.316, Codex CLI 0.166.0: the exact versions QI-30's Phase 0 proved on 2026-11-01 |
| git | The global ignore file names only `.claude/settings.local.json`. `AGENTS.md`, `.claude/rules/`, `.agents/` and `docs/agents/` are not ignored (`git check-ignore`) |
| History | 130 commits, 0 merges |

### Decisions

**Operator rulings, 2026-11-01 (this planning session):**

- **D5 — The guard is a script, run by hand.** Not a checklist, and no git hook. It is a
  dependency-free Node script (§Design → Guard). `editing.md` and §Before ending a phase say when to
  run it, and nothing enforces that (R2).
- **D6 — The `infra-reviewer` Copilot agent is retired.** Its five checks are already rules, and
  `adversarial-review` reports a violated repo rule as a finding. The ledger maps each check to its
  rule.
- **D7 — Commit-to-`main` is a repo rule.** It goes in `AGENTS.md`, and the memory note goes. This plan
  commits on `main`, only when the operator asks. Pushing still needs an explicit ask.
- **D8 — The Oversized-LLM guardrails move to one scoped rule file,** `.claude/rules/oversized-llm.md`,
  marked dormant until QN-11. Their intent does not change. QN-11 then edits one file.

**Standing rulings carried from the sibling repos (applied without a new question):**

- **D1 — Agent-neutral core** (QI-88 D1). `AGENTS.md` holds the core and the routing table. `CLAUDE.md`
  is `@AGENTS.md` plus Claude-only notes. Scoped rules live in `.claude/rules/` with `paths:`.
- **D2 — Moving rationale is not a rule drop** (QI-88 D2), when intent is unchanged and the rationale is
  traceable. The ledger is the evidence.
- **D3 — One rationale file per instruction file** (QI-88 D3, re-confirmed 2026-10-27), at
  `docs/agents/rationale/<rule>.rationale.md`. Some start as stubs. This answers the proposal's open
  question 3, and the guard's both-ways check stays simple.
- **D4 — Copilot and Goose are dropped** (QI-30 ruling, 2026-10-30: Copilot is not expected back; its
  pricing does not fit the operator's usage). This answers open question 1. No Copilot settings are
  kept. The roster can change, so nothing may depend on a Goose-free tree: `AGENTS.md` stays
  agent-neutral, and the routing table stays the only scoping an `AGENTS.md`-only tool needs.

**Authoring decisions (from the siblings' lessons; the operator may overrule any at a phase start):**

- **D9 — No Phase 0 spike.** QI-30's Phase 0 proved the loading matrix on the installed versions today.
  Each loading fact this plan relies on is one of its passes: `@AGENTS.md` imports once, Codex reads
  32,768 B and no `CLAUDE.md`, and `**/`, `dir/**` and nested `paths:` load on Read. If either version
  has moved when Phase 2 starts, re-run that probe first.
- **D10 — The `new-stack-readme` prompt becomes a repo skill** (QI-88 D5, which moved `srp-review` and
  `timeline-review` the same way). Its section list exists nowhere else, so unlike D6 retiring it would
  lose something.
- **D11 — The disabled secrets hook is retired, not ported.** It has been off since 2026-04-21, and its
  `python3 -c` command cannot run on this machine (`Bad CPU type`). The plaintext-secrets rule stays.
- **D12 — Budgets** as QI-88 D12 and D23, with QI-30 D28's soft rule-file size (§Design → Budgets).
- **D13 — History keeps its paths** (QI-88 D14; §Design → History set).
- **D14 — Citations become anchor links** (QI-88 D15). A `§Section` citation of an instruction file
  becomes `path#anchor`, and the guard rejects the old forms.
- **D15 — Lessons and memory** (QI-88 D19, D21, D22). An inbox entry or a memory is a candidate, not a
  rule: check its claim first. Repo lessons go to the repo, and a plan's last phase sweeps its own. Every
  live `ai-lessons.md#<slug>` resolves.
- **D16 — No spec file.** This repo has no `docs/specs/`, and QI-30 D26 keeps a spec for as-built
  behaviour. `.claude/rules/editing.md` holds the authoring contract; §Design here holds it until Phase
  2 lands. REQ-AGENT-01's target stays reading-order's spec, adapted.
- **D17 — One rule text for every pane** (QI-88 D8). Repo files do not restate what Atrium injects.
- **D18 — Sessions start with `next-phase` and end with `adversarial-review`** (QI-30 D9).
  `adversarial-review` is explicit-invocation-only, so the operator types it.
- **D19 — The compose rule's glob becomes `**/docker-compose.yml`.** `*/docker-compose.yml` is not a form
  QI-30's Phase 0 probed, and `**/` is. Every compose file is one level down, so nothing changes in
  practice. QI-88's "verbatim `applyTo`" otherwise holds.
- **D20 — The Portainer deploy rule goes in the core, and only as a practice.** Stacks deploy through the
  Portainer UI in GitOps mode. It governs stack READMEs and new stacks, which the compose rule's `paths:`
  would miss. The memory note's vendor claim, that the API cannot enable GitOps updates, is unverified,
  so it goes to the rationale as the operator's reported reason (D15). No mass README edit: wording
  changes as a README is touched.
- **D21 — Findings for the siblings are logged, never applied.** Editing them is a non-goal. Phase 4's
  log lists anything that would change their rules, as QI-30's §Handback does.

### Corrections to the proposal (verified at authoring; fixed there)

- QI-88's plan and ledger now sit under `docs/archive/plans/`.
- REQ-AGENT-05's 20,000-char limit is soft (D12). REQ-AGENT-08 has no Copilot settings to set (D4).
  REQ-AGENT-09 is a hand-run script (D5). REQ-AGENT-07's commit-to-`main` move is confirmed (D7).
- The loading matrix rests on QI-30's Phase 0, not QI-88's (D9).

### Plan review (2026-11-01; every fix accepted by the operator)

An adversarial review of this plan's text (Codex, `code-reviews` profile). No High findings and no open
questions. M1 and M2 were reproduced against the tree before the fixes.

| Finding | Resolution | Lands in |
| ------- | ---------- | -------- |
| **M1** — `node --test tooling/agent-guard/` fails with `MODULE_NOT_FOUND` on Node 24, because the folder has no entry module | Commands name `check.test.mjs` | §Design → Guard, 1 |
| **M2** — `next-phase --dry-run` refuses while a phase is 🟡, so Phase 2's acceptance check could not pass where it ran | It runs at §Before ending a phase step 5, after the marks move | 2 |
| **M3** — The `oversized-llm.md` routing row lacked the firewall and exposure words R5 said it named, so a task touching no file could not reach the moved rules | The row names them, and Phase 3's consumer audit covers them | §Routing table, 3 |
| **L1** — The only required guard run came before the closeout edits and review fixes | It runs last, and again after review fixes | §Before ending a phase |

---

## Design

The contract until Phase 2 turns it into `.claude/rules/editing.md` (D16).

### Target layout

| Path | Holds | Loaded |
| ---- | ----- | ------ |
| `AGENTS.md` | The core and the routing table | Codex natively. Claude Code through `@AGENTS.md` on `CLAUDE.md`'s line 1 |
| `CLAUDE.md` | `@AGENTS.md`, then Claude Code–only notes | Claude Code, at session start |
| `.claude/rules/<topic>.md` | One area's rules: one-line `description:`, `paths:` block list | Claude Code on the first Read, Write or Edit of a matching file. Codex through the routing table only |
| `docs/agents/rationale/<rule>.rationale.md` | Why each rule exists | Never automatically |
| `docs/agents/qn-17-rule-ledger.md` | The zero-drops evidence (D2) | — |
| `docs/ai-lessons.md` | The inbox, ≤ 200 lines | Read before implementing |
| `.agents/skills/<n>/` + a `.claude/skills/<n>` symlink | Repo skills: `new-stack-readme` | Codex natively; Claude Code through the link |
| `agent-skills/` | Machine-wide skills, unchanged. ⚠️ Not `.agents/skills/` | User-level links |
| `tooling/agent-guard/` | The guard and its fixtures | By hand |

⚠️ **`.claude/rules/` holds rule files only.** Claude Code loads every `.md` under it as a rule.

### Move map (Phase 2)

Frontmatter: `description:` stays on one line, `applyTo:` becomes a `paths:` block list, `name:` goes.
Quote a glob that starts with `*` (`'**/docker-compose.yml'`): bare, YAML reads it as an alias.
Rule file names stay, less `.instructions`.

| Old path | New path | `paths:` |
| -------- | -------- | -------- |
| `.github/copilot-instructions.md` | `AGENTS.md` | — (the core) |
| `.github/instructions/ansible-safety.instructions.md` | `.claude/rules/ansible-safety.md` | `Ansible/**` |
| `.github/instructions/compose-stack-conventions.instructions.md` | `.claude/rules/compose-stack-conventions.md` | `**/docker-compose.yml` (D19) |
| `.github/instructions/editing.instructions.md` | `.claude/rules/editing.md` | `AGENTS.md`, `CLAUDE.md`, `.claude/rules/**`, `.agents/skills/**`, `docs/agents/**`, `docs/ai-lessons.md`, `tooling/agent-guard/**` |
| `.github/instructions/planning.instructions.md` | `.claude/rules/planning.md` | `docs/plans/**`, `docs/proposals/_implementation-order.md` |
| `.github/instructions/proposals.instructions.md` | `.claude/rules/proposals.md` | `docs/proposals/**` |
| *(new, Phase 3)* | `.claude/rules/oversized-llm.md` | `Ansible/**`, `ollama/**`, `portainer/**` |

### `AGENTS.md` shape (Phase 2)

| Section | From |
| ------- | ---- |
| Repository Scope | copilot §Repository Scope |
| Architecture | copilot §Architecture, merged with `CLAUDE.md` §Architecture (networking, per-stack source of truth) |
| Commands | `CLAUDE.md` §Commands, merged with copilot §Build And Test |
| Collaboration Preference | copilot |
| Agent Workflow | copilot, including the queue and wrong-session rules |
| Docs Lifecycle | copilot, under `<a id="docs-lifecycle">` |
| Rule files | The routing table. Replaces copilot §Scoped Instructions and `CLAUDE.md` §Scoped Rules |
| Conventions | copilot, plus the `_IDEAS_/` note |
| Internal Domain | copilot, under `<a id="internal-domain">`: five proposal lines cite it |
| Oversized-LLM Guardrails | copilot, until Phase 3 moves it (D8) |
| Change Safety Rules | copilot, plus anything in `CLAUDE.md` §Critical Rules it lacks |
| Agent Skills | copilot |
| Key References | copilot |

`CLAUDE.md` keeps `@AGENTS.md` and three notes: `/init` updates `AGENTS.md` or a rule, never this file;
"plan first" means plan mode; "delegate exploration" means the Agent tool. §Mandatory Context and the
"also used with GitHub Copilot" line are retired (D4).

### Routing table (Phase 2)

Heading `## Rule files`. It is the only list of rule files, each file in exactly one row, within the
first 16 KiB of `AGENTS.md`. One line above it: *Claude Code loads these automatically when you touch a
matching file. If your tool does not, read the file yourself before you start.* A row names every trigger
a prompt can carry, not just the rule's `paths:`.

| When you… | Read |
| --------- | ---- |
| author or work a plan, read or update the queue, or see a `QN-<n>` id in a prompt | `.claude/rules/planning.md` |
| author or revise a proposal in `docs/proposals/` | `.claude/rules/proposals.md` |
| edit `AGENTS.md`, `CLAUDE.md`, a rule, a rationale file, a repo skill, the guard or `docs/ai-lessons.md`, or are asked to codify a rule | `.claude/rules/editing.md` |
| edit anything under `Ansible/`, or run a playbook or `ansible-vault` | `.claude/rules/ansible-safety.md` |
| edit a stack's `docker-compose.yml`, or add a stack | `.claude/rules/compose-stack-conventions.md` |
| *(Phase 3)* touch `Ansible/`, `ollama/` or `portainer/`, or a task names Oversized-LLM, `oversized`, Ollama, `OLLAMA_BIND_IP`, the Portainer Agent, Tailscale, the firewall, inbound ports or exposure | `.claude/rules/oversized-llm.md` |

### Surface dispositions (REQ-AGENT-02)

| Surface | Outcome | Phase |
| ------- | ------- | ----- |
| `CLAUDE.md`, `copilot-instructions.md` | Merged: §`AGENTS.md` shape | 2 |
| The five `.github/instructions/` files | Moved: §Move map | 2 |
| `infra-reviewer` agent | Retired (D6) | 4 |
| `new-stack-readme` prompt | Converted to a repo skill (D10) | 4 |
| Disabled secrets hook | Retired (D11) | 4 |
| `.vscode/settings.json` | Unchanged: `cSpell.words` only (D4) | — |
| `_IDEAS_/ai-instructions/` | Unchanged: reference-only, in the history set | — |

### Rule and rationale

Ported from karens-database's `.claude/rules/editing.md` §Rule and Rationale, without change:

- **A rule says what to do,** with one short reason only when the reason changes how it is applied. It
  ends with `([why](<rel>/docs/agents/rationale/<rule>.rationale.md#<anchor>))`.
- **Everything else moves to the paired rationale file:** dates, ids, how the rule was found, rejected
  alternatives.
- **Entry format:** `<a id="<anchor>"></a>`, a blank line, `## <short title>`,
  `**Rule:** [<rule file> §<section>](<rel>#<anchor>)`, then the body.
- **Pairing:** `AGENTS.md` → `agents.rationale.md`, `CLAUDE.md` → `claude.rationale.md`,
  `.claude/rules/<p>.md` → `<p>.rationale.md`. Seven at Phase 2, eight from Phase 3.
- ⛔ This repo is public: rationale carries no per-service finding, and a stub says so by saying nothing.

### Rule ledger

`docs/agents/qn-17-rule-ledger.md`: one section per phase, one row per rule the phase touched.

`| Before (file §section · first words) | After (file §section) | Rationale anchor | How |`

`How` is one of: kept · moved · duplicate of … · changed (D#) · changed (drift) · promoted from memory ·
retired (D#). A phase is not done until every rule in a touched file has a row; an untouched file gets
one "unchanged" row.

### Budgets

| File | Budget | Kind |
| ---- | ------ | ---- |
| `AGENTS.md` | ≤ 200 lines, ≤ 24,576 B, ≤ 400 chars per line, no hard wrap | Hard. Working target ≤ 190 lines, ≤ 22,528 B: expected to pass with room |
| `CLAUDE.md` | ≤ 40 lines | Hard |
| Each rule file | ≤ 400 chars per line outside fenced code | Hard |
| Each rule file | ~20,000 chars | Soft: reported on every run, never a failure (QI-30 D28) |
| `docs/ai-lessons.md` | ≤ 200 lines | Hard |

`docs/index.md` has no Description cells, so QI-88's cap has nothing to apply to.

### History set (D13)

The retired-path, anchor and citation-form checks skip:

- `docs/archive/**`, `docs/handoffs/**` and `_IDEAS_/**`;
- `docs/agents/rationale/**` and the guard's own files, permanently. The anchor check still reads the
  rationale files, so a back-link to a rule stays checked;
- this plan, its proposal and the ledger, until the operator archives them.

Every other proposal is a live surface and gets repointed. Negative fixtures prove a retired path
anywhere else fails.

### Guard (`tooling/agent-guard/`)

**Shape (D5):** `check.mjs` and `check.test.mjs`, plain ESM, ⛔ no dependencies and no `package.json`.
`node tooling/agent-guard/check.mjs` exits non-zero on any hard failure and prints the soft size table.
`--only <check>` runs one check. `node --test tooling/agent-guard/check.test.mjs` runs the fixtures. ⚠️
Name the file: Node 24 reads `node --test <dir>` as a module entry and fails with `MODULE_NOT_FOUND`.
Expect ~400–500 lines of source; karens-database's is ~970, plus ~1,500 lines of tests.

**Port, don't rewrite.** Start from karens-database's `tooling/agent-guard/src/`, which holds the fixes
for its Handback H5–H15, and log each deviation. With no `js-yaml` or `marked`, two things become strict
line parsers, each pinned by fixtures: frontmatter, and the `@` model, which strips fences, code spans
and HTML, then treats `*`, `_` and `[` as text-run starts.

**Discovery:** `git ls-files -z`, never a directory walker. Checks over governed files (`AGENTS.md`,
`CLAUDE.md`, `.claude/rules/`, `.claude/skills/`, `.agents/skills/`, `docs/agents/rationale/`) also list
untracked, non-ignored files. Scans over every live file stay tracked-only, so another pane's draft
cannot fail a run. Symlinks use `lstat`. The repo root comes from `git rev-parse --show-toplevel`.

| Check | What it enforces |
| ----- | ---------------- |
| `plan-status` | Each plan's `**Status:**` marks equal its completion-log marks, at most one ⏸, and a row's `Next: Phase <id>` names the current phase. Fences stripped first. Rows match `^[A-Z][A-Z0-9]*-[0-9]+$` |
| `layout` | `AGENTS.md`, `CLAUDE.md` and the rules exist. No retired surface: `.github/copilot-instructions.md`, `.github/instructions/`, any tracked `*.instructions.md`. Phase 4 adds `.github/agents/`, `.github/prompts/`, `.github/hooks/` |
| `frontmatter` | One-line `description:`, a non-empty `paths:` block list, no literal `[`, no `name:` or `applyTo:` |
| `retired-paths` | No live surface names a retired path, with or without `.md` |
| `links` | Every relative link in the governed files resolves, URL-decoded |
| `anchors` | Every `#anchor` into an instruction or rationale file matches a heading slug or `<a id>`. The whole fragment counts |
| `inbox` | Every live `ai-lessons.md#<slug>` resolves, and the 200-line cap holds |
| `citations` | No `file.md:N` or `file.md §Title` for an instruction or rationale file on a live surface |
| `rationale` | One rationale file per instruction file, both ways. Every `why` link resolves to its paired file, and every entry is linked from its rule. Real link destinations, not text matches (QI-30 H15) |
| `routing` | One row per rule file, both ways, starting within 16 KiB of `AGENTS.md` |
| `core` | `CLAUDE.md` line 1 is `@AGENTS.md` |
| `at-rule` | Claude Code's import model captures no resolving path in `AGENTS.md`, `CLAUDE.md` after line 1, or a rule. Absolute and `~/` paths count (H14). The docblock names 2.1.316 |
| `budgets` | §Budgets |
| `skills` | Every `.agents/skills/<n>/` has a `.claude/skills/<n>` symlink that resolves to it, and its `SKILL.md` declares one top-level `name:`. A folder missing `SKILL.md` fails (H9) |

---

## Pitfalls carried from the siblings

| Pitfall | Here |
| ------- | ---- |
| A guard with a dot-folder-skipping walker passed without checking anything | Phase 1: `git ls-files -z` |
| A never-staged rule escaped `git ls-files`; a new file is invisible to tracked-only scans | Phase 1: untracked governed files; every phase `git add -N` a new file |
| macOS `git grep -E` has no `\b`, and `grep` here is a ugrep shell function | Phases 2–4: `git grep -P` or `/usr/bin/grep`; try a pattern on one crafted line before writing down a count |
| Bare names escape a path grep (`copilot-instructions` with no `.md`) | Phase 2: `retired-paths` matches both forms |
| Routing rows named only file edits, so Codex never reached rules triggered by a command or an id | §Routing table |
| A rule moved into a file whose `paths:` never load for the work it governs | Phase 3: a consumer audit per moved rule (D20 is that audit's first result) |
| Four of eight "moves" were already in the target, and one held a contradicting copy | Phases 2–3: grep the receiving file first; ledger "duplicate of" |
| Line citations drifted after the move | Phase 2: convert them against the pre-move commit |
| The anchor check passed on a valid fragment prefix, and fences closed on a shorter inner fence | Phase 1: port the fixed primitives (H6, H8, H11) |
| Promoted memories were wrong or obsolete | D15; Phase 3 checks each claim first |
| Scripted doc edits with `String.replace` expand `$` in doc text | Pass a function, or use `split`/`join` |
| Header and log drift launched the wrong phase | Phase 1: `plan-status` |
| Other panes kept stale paths through the moves | Phase 2 runs with no other pane on this checkout |
| Each guard check needs proof it can fail | Phase 1: a failing fixture per check |
| `claude -p --disallowedTools` swallowed a trailing prompt; a model's answer is not proof of what it loaded | Pipe the prompt on stdin; prove loading from the Claude Code transcript and the Codex rollout log |

New here, with no sibling precedent: nothing runs the guard unless told to (R2), and `agent-skills/`
sits next to the new `.agents/skills/` under a confusingly close name (§Target layout).

---

## How to work this plan

Status legend: ⬜ not started · 🟡 in progress · ⏸ paused · ✅ done · ⚠️ done with caveats (see log). At
most one ⏸. Each phase is **one working session**, self-contained. Start it with `/next-phase QN-17`.
Commit on `main` (D7), only when the operator asks.

### Preconditions (operator)

- Before Phase 1: `/adversarial-review plan QN-17` reviews this plan's text.
- Before Phase 2: every uncommitted doc edit on this checkout is committed, and no other agent pane is
  open on it (check the Atrium panes).

### Before starting a phase

1. Read the core, the editing rule and the planning rule. Before Phase 2: `CLAUDE.md`,
   `.github/copilot-instructions.md`, `editing.instructions.md`, `planning.instructions.md`. From Phase
   2: `AGENTS.md`, `.claude/rules/editing.md`, `.claude/rules/planning.md`.
2. Read §Design, §Pitfalls and `docs/ai-lessons.md`.
3. Set the phase to 🟡 in the `**Status:**` header and its completion log, together.
4. Read **every prior completion log**. The plan text is the intent; the logs are the reality.
5. A phase that moves rule text asks the operator its candidate picks before editing, with a recommended
   default.

### Before ending a phase

1. Confirm the acceptance criteria with evidence: command output, transcript or rollout paths. The guard
   and any `next-phase` dry run are confirmed at step 5.
2. Write the completion log: status, what landed, evidence, and a handoff with every decision, deviation,
   gotcha and exact name a later phase consumes. If the plan text was wrong, fix the plan too.
3. **Public-safety check:** the diff carries no secrets and no per-service finding.
4. Move the `**Status:**` header and the log mark together. Set the queue row's Notes to
   `Next: Phase <id> — …` (≤ 100 chars), then
   `npx --yes prettier@3 --write docs/proposals/_implementation-order.md`. ⛔ That file only.
5. **Final checks, after every closeout edit.** Run the guard (`--only plan-status` in Phase 1) and the
   fixtures, and paste the output in the log. ⛔ Never skip it: nothing else runs the guard.
6. **Review:** the operator runs `/adversarial-review phase QN-17`. Walk the findings, most severe
   first, before acting on any. Accepted fixes land in the same phase, under *Review fixes*. Re-run step
   5 after them.

### QN-17 specifics

- Delegate fact checks to read-only subagents, with briefs in the gitignored `.tmp/qn-17/<phase>/`, never
  `/tmp`. Re-check a "missing" or "wrong" verdict by hand.
- The queue and `docs/index.md` are shared with other panes: exact-string edits on a fresh read.
- Scripts are Node (`python3` does not run here) or zsh.

---

## Phase 1 — The guard script

**Goal:** a hand-run guard exists, and every check is proven able to fail, before any rule file moves.

**Build:** REQ-AGENT-09, D5. No host touched; no instruction file touched.

1. Read karens-database's `tooling/agent-guard/src/` and its §Handback. Diff the port against that
   source, and log every deliberate deviation.
2. Write `tooling/agent-guard/check.mjs` with all of §Design → Guard's checks. They run against the
   target layout, so a full run on today's tree fails. That is expected until Phase 2.
3. Write `tooling/agent-guard/check.test.mjs`: `node:test` fixtures on temp git repos, covering discovery
   (staged and untracked rules), the Markdown primitives, and QI-30 G1f's `@` table (imported: bold, link,
   italic, frag, bare; not imported: span, punct, fence).

**Acceptance criteria:**

- `node --test tooling/agent-guard/check.test.mjs` passes, with a fixture per check that fails for
  exactly that check.
- `node tooling/agent-guard/check.mjs --only plan-status` passes on the real queue and this plan, and a
  planted header/log mismatch in a temp copy fails it.
- `git status` shows only `tooling/agent-guard/`, this plan and the queue.

**Completion log** — _status: ✅ done_ (2026-11-02)

**What landed.** `tooling/agent-guard/check.mjs` (14 checks, 1,085 lines with comments) and
`tooling/agent-guard/check.test.mjs` (148 tests, after the review fixes). Plain ESM on Node 24.20.0, no dependencies, no
`package.json`. No host touched; no instruction file touched.

**How the fixtures prove each check can fail.** `goodRepo()` builds a temp git repo in the
post-Phase-2 layout (`AGENTS.md` with a routing table, `CLAUDE.md` = `@AGENTS.md`, the five rules,
seven rationale files with one real entry, the inbox, a plan and its queue row, a linked repo skill,
history files). It passes all 14 checks. Then each of 25 mutations, at least one per check, must fail
**exactly** that check and no other (`r.failing()` = `[check]`). A test also asserts every key of
`CHECKS` has a mutation, so a check added later without a failing fixture fails the suite. The
primitives keep table fixtures: Markdown, frontmatter, discovery (staged, untracked, ignored,
deleted, dangling symlink), and QI-30 G1f's `@` table (imported: bare, frag, bold, italic, link; not
imported: span, punct, fence, plus HTML, comments, email and link destinations).

**Deviations from karens-database `tooling/agent-guard/src/` (diffed against it, `ec4c870`):**

- One file of checks instead of 11 modules plus vitest specs over the live tree. Each check is a
  function `(repo) => problems[]`; `runChecks(root, only)` runs them. The siblings' "live tree" tests
  are the CLI run; their fixtures are `check.test.mjs`.
- **Frontmatter** is a line parser, not `js-yaml`. It accepts only `key: value` lines, a one-line
  `description:` and a `paths:` block list of `  - glob` items. It is stricter: an unparsed line, a
  duplicate key, or an unclosed quote is a problem rather than a YAML error.
- **`@` model** is a line parser, not `marked`: fences, code spans, HTML tags and comments are blanked;
  `@path` starts at a line start, whitespace, `*`, `_` or `[`; the path stops at whitespace, `*` or
  `]`; a trailing `_` is dropped as closing emphasis. Docblock names 2.1.316.
- The repo root is `git rev-parse --show-toplevel` of the **working directory**, not of the module,
  so the guard checks the checkout it runs in. Every function takes the root; no global.
- **`rationale` gains `strayWhyLinks`**: a `[why](…)` link must resolve to the paired rationale file
  with an anchor (§Design → Guard). QI-30 had no such check.
- **The inbox's 200-line cap is `inbox`'s**, not `budgets`', so the cap fixture fails one check.
- **History set:** `_IDEAS_/` added to the prefixes; no completed-plans list (this repo has none);
  `docs/index.md`'s exempt section is `## Archive` (QI-30: `## Archive:`). The stale-exemption check
  lives in `retired-paths`.
- `routing` reports a missing `AGENTS.md`, heading or table as problems instead of asserting.
  `plan-status` reports a missing queue, or a queue with no rows read.
- `ALLOWED_DRIFT` dropped: empty in QI-30, and nothing here needs it.
- Temp repos go in `.tmp/agent-guard-tests/`, removed after the run, never `os.tmpdir()`.
- Size: 1,085 + 743 lines against the plan's ~400–500 estimate; QI-30's is ~970 + ~1,500.

**Review fixes** (`/adversarial-review phase QN-17`, Codex `code-reviews`; no High, no open
questions; the operator accepted all four):

| Finding | Fix |
| ------- | --- |
| **M1** — The frontmatter parser passed YAML that js-yaml rejects or mis-types: `- **/docker-compose.yml` (an alias), `description: false`, `- 42` | `yamlString()` reads each one-line scalar as js-yaml would. A plain scalar fails on an indicator start, a `: ` or ` #` inside, or a boolean, null or number; quoted forms are strings. 8 fixtures. ⚠️ Phase 2: quote `'**/docker-compose.yml'` (D19) |
| **M2** — The `@` parser missed `~~@x~~` and `>@x`, and flagged indented code and HTML blocks | `blankBlocks()` blanks HTML blocks (block-tag lines; lone-tag lines after a blank) and indented code (not a list or lazy continuation), and strips blockquote markers; `~` starts a text run and a trailing `~` is dropped. 11 fixtures. Cross-checked against the sibling's `marked` 18.1.1 walker: 0 differences in 34 cases (`.tmp/qn-17/phase-1/at-crosscheck.mjs`, scratch) |
| **M3** — A reference-style `[why][w]` escaped the pairing check | `strayWhyLinks()` resolves full, collapsed and shortcut references through their definitions; an undefined reference is text. 5 assertions |
| **L1** — `--only constructor` passed name validation, then crashed with exit 1 | `Object.hasOwn(CHECKS, …)`; the CLI fixture tries `constructor`, `toString`, `__proto__` (exit 2) |

**Acceptance evidence** (final runs, after every closeout edit and the review fixes):

```text
$ node --test tooling/agent-guard/check.test.mjs
ℹ tests 148 · suites 12 · pass 148 · fail 0          (exit 0)

$ node tooling/agent-guard/check.mjs --only plan-status
✓ plan-status
All checks passed.                                   (exit 0)

# Temp copy (.tmp/qn-17/phase-1/copy: this plan + the queue, git add -A), header planted ✅ vs log 🟡:
✗ plan-status (2)
    docs/plans/agent-instructions-migration-plan.md: Phase 1: header ✅, completion log 🟡
    QN-17: the queue says Next: Phase 1, the plan's current phase is 2
                                                     (exit 1)

$ git status --short
 M docs/plans/agent-instructions-migration-plan.md
 M docs/proposals/_implementation-order.md
?? tooling/
```

**Handoff for Phase 2:**

- A full run today fails 7 checks, all expected: `layout`, `retired-paths` (85 hits plus the missing
  ledger), `inbox`, `rationale`, `routing`, `core`, `budgets` (`CLAUDE.md` is 58 lines). `links`,
  `anchors`, `citations`, `at-rule`, `frontmatter` and `skills` pass vacuously (no rules yet).
- ⚠️ **`inbox` found a real hit:** `docs/ai-lessons.md:18`'s example `docs/ai-lessons.md#the-slug`
  reads as a dead slug. Phase 2 writes it as `#<slug>`, which cannot match.
- `NAMED_EXEMPTIONS` names `docs/agents/qn-17-rule-ledger.md`; `retired-paths` fails until Phase 2
  creates it.
- Constants later phases edit in `check.mjs`: `REQUIRED_RULES` (Phase 3 adds `oversized-llm`),
  `RETIRED_SURFACES` and `RETIRED_PATTERNS` (Phase 4 adds the three `.github/` paths).
- `plan-status` and the live scans read **tracked** files: `git add -N` a new plan or doc before the
  run. Governed files (`AGENTS.md`, `CLAUDE.md`, `.claude/rules/`, skills, rationale) are seen
  untracked.
- `--only <check>` takes one name; an unknown name exits 2. The soft size table prints on a full run
  and on `--only budgets`.

---

## Phase 2 — Move every rule file, one core

**Goal:** every agent loads the same core from `AGENTS.md`, the rules live in `.claude/rules/`, and
nothing live points at the old paths.

**Build:** REQ-AGENT-01, 02, 03, 05, 08, D1–D4, D12–D14, D16, D17, D19. No wording diet: Phase 3 owns
content. No host touched. Rollback is `git revert`, so this lands as one commit.

1. **Preconditions.** `claude --version` and `codex --version` still read 2.1.316 and 0.166.0, else D9.
   §Preconditions hold.
2. `git mv` per §Move map. Convert the frontmatter.
3. **Take the rules out of §Scoped Instructions first** (QI-88 R2-H1), then merge `CLAUDE.md` block by
   block per §`AGENTS.md` shape, one ledger row each. Repeats are ledgered "duplicate of", naming the
   surviving twin. A contradiction between the two files stops for an operator ruling.
4. Unwrap `AGENTS.md` to one paragraph or bullet per line, and split the three long lines at a sentence
   break.
5. Write `CLAUDE.md` per §`AGENTS.md` shape.
6. Rewrite `.claude/rules/editing.md` as a port of karens-database's, diffed against it, without its
   Next.js, Goose or code-comment items unless they apply. Add the hand-run guard step. Update the leads
   of `planning.md` and `proposals.md`, and add the guard to `planning.md` §Before Ending a Phase.
7. Create the seven rationale stubs and the ledger.
8. **Repoint.** Every live reference, by `git grep -P`, including the 10 bare `copilot-instructions`
   lines. Turn the 12 `§` citations into anchor links, adding `<a id>`s on the rule lines they cite.
9. `docs/index.md`: its two rule links, and Agent docs gains the ledger and the rationale folder.

**Acceptance criteria:**

- `node tooling/agent-guard/check.mjs` exits 0 on the real tree, with no `--only`.
- The ledger's Phase 2 section has a row for every rule in `CLAUDE.md`, `copilot-instructions.md` and the
  five scoped files.
- A fresh Claude Code session's transcript shows `AGENTS.md` loaded once through the import, and no rule
  at start. One Read per distinct `paths:` glob shows its rule arriving on that turn.
- A Codex rollout with no `function_call` items quotes the routing table's editing row verbatim.
- At §Before ending a phase step 5, `~/.agents/skills/next-phase/scripts/next-phase.sh QN-17 --dry-run`
  selects Phase 3. It refuses while any phase is 🟡, so it cannot run before step 4.

**Completion log** — _status: ✅ done_ (2026-11-02)

**What landed.** `AGENTS.md` is the core (142 lines, 12,351 B, every line under 400 chars), with the
routing table inside the first 16 KiB. `CLAUDE.md` is `@AGENTS.md` plus the three notes (7 lines). The
five rule files moved to `.claude/rules/` with `paths:` frontmatter. `editing.md` is a port of
karens-database's. There are seven rationale files, and `docs/agents/qn-17-rule-ledger.md` has 242 rows. Every
live reference is repointed, the 12 `§` citations are links, and `docs/index.md` lists the ledger and
the rationale folder. No host touched.

**Operator picks at phase start.** The "Queue next steps" pane was open on this checkout, so the operator
closed it before any edit. `editing.md` takes everything but the code-comment item, the `picomatch` note
and the QI-30 links.

**Decisions and deviations:**

- **No contradiction** between `CLAUDE.md` and `copilot-instructions.md`, so nothing stopped for a ruling.
  The ledger's `CLAUDE.md` table names each surviving twin.
- **Four things `CLAUDE.md` §Critical Rules had and the core lacked** are now in `AGENTS.md`: the vault and
  `.env` wording, "no per-host cert without approval" (§Internal Domain), image pinning, and the live-host
  line (§Change Safety Rules). The example list and "the link breaks on GitHub" joined §Docs Lifecycle.
- **"Rules there override any generic defaults"** survives as `AGENTS.md`'s lead line.
- **`AGENTS.md` §Commands gains one line** that the guard is run by hand (R2). It is not in §`AGENTS.md`
  shape.
- **`ansible-safety.md` and `compose-stack-conventions.md` gain a lead sentence,** because the header
  convention applies to a touched file. Their rules are unchanged.
- **`editing.md` deviations from karens-database's at its current tree:** keeps this repo's "Never in agent
  memory" bullet and ⛔/⚠️ symbols; adds the roster line (D4), a public-repo line, the YAML-alias note, §The
  Guard (D5) and the `agent-skills/` warning; widens "read the source" to both siblings; the history list
  adds `_IDEAS_/` and `docs/agents/rationale/`; the inbox entry format drops the mandatory date, because
  this repo's inbox tags by queue id. Its rationale entries are condensed from the sibling's, and name no
  QI-30 phase.
- **Six rationale files are stubs** (D3); only `editing.rationale.md` has entries.
- **Bare `AGENTS.md` and `CLAUDE.md` globs stay** in `editing.md`: both names exist only at the root.
- **`docs/proposals/_implementation-order.md` loads both `planning.md` and `proposals.md`,** because
  `docs/proposals/**` matches it. Same as `applyTo` before; harmless.
- **`infra-reviewer`'s pointer** left with `CLAUDE.md` (ledger: retired, D6); the file goes in Phase 4.

**Gotchas:**

- `git mv` left an empty `.github/instructions/`, and the guard's `layout` check fails on it until
  `rmdir`.
- The transcript proof is in `attachment` lines: `instructions` lists the start files, `nested_memory` a
  rule's arrival. `.agents/skills/**` has no file until Phase 4, so that probe used a temporary file, since
  removed.
- Follow [the lesson on Codex](../../.claude/rules/editing.md#loading-probes): the rollout check counts
  `custom_tool_call` too, and was tried first on a session that used tools.

**Acceptance evidence.** Claude Code 2.1.316, Codex 0.166.0: unchanged, so D9 needed no re-probe. One fresh
session per `paths:` glob (`claude -p`, prompt on stdin, default context window, transcripts in
`~/.claude/projects/`):

```text
.claude/rules/ansible-safety.md                    AGENTS×1  rules at start 0  → editing.md
tooling/agent-guard/check.test.mjs                 AGENTS×1  rules at start 0  → editing.md
.agents/skills/probe/note.md                       AGENTS×1  rules at start 0  → editing.md
ollama/docker-compose.yml                          AGENTS×1  rules at start 0  → compose-stack-conventions.md
docs/plans/agent-instructions-migration-plan.md    AGENTS×1  rules at start 0  → planning.md
docs/ai-lessons.md                                 AGENTS×1  rules at start 0  → editing.md
Ansible/README.md                                  AGENTS×1  rules at start 0  → ansible-safety.md
docs/agents/qn-17-rule-ledger.md                   AGENTS×1  rules at start 0  → editing.md
docs/proposals/_implementation-order.md            AGENTS×1  rules at start 0  → planning.md, proposals.md
CLAUDE.md                                          AGENTS×1  rules at start 0  → editing.md
docs/proposals/dns-resilience-proposal.md          AGENTS×1  rules at start 0  → proposals.md
AGENTS.md                                          AGENTS×1  rules at start 0  → editing.md
```

Codex (`codex exec --sandbox read-only`, rollout `rollout-2026-11-02T19-13-28-01a19ec0-…`) quoted, verbatim:

```text
| edit `AGENTS.md`, `CLAUDE.md`, a rule, a rationale file, a repo skill, the guard or `docs/ai-lessons.md`, or are asked to codify a rule | `.claude/rules/editing.md` |

function_call: 0  custom_tool_call: 0     (control, a session that used tools: 20)
```

Final checks:

```text
$ node tooling/agent-guard/check.mjs
✓ plan-status
✓ layout
✓ frontmatter
✓ retired-paths
✓ links
✓ anchors
✓ inbox
✓ citations
✓ rationale
✓ routing
✓ core
✓ at-rule
✓ budgets
✓ skills

Rule file sizes (soft, never a failure):
     12069 / 20000 ok   .claude/rules/editing.md
     11855 / 20000 ok   .claude/rules/planning.md
      4929 / 20000 ok   .claude/rules/proposals.md
      1443 / 20000 ok   .claude/rules/ansible-safety.md
      1355 / 20000 ok   .claude/rules/compose-stack-conventions.md

All checks passed.
(exit 0)

$ node --test tooling/agent-guard/check.test.mjs
ℹ tests 148
ℹ pass 148
ℹ fail 0

$ next-phase.sh QN-17 --dry-run
repo:   /Users/chill/github/network-config
plan:   docs/plans/agent-instructions-migration-plan.md
room:   QN-17 Phase 3
prompt: do Phase 3 of QN-17
```

**Host state:** no host touched.

**Handoff for Phase 3:**

- `AGENTS.md` has 48 lines and ~10.1 KB of headroom against the working target (190 lines, 22,528 B).
- The Oversized-LLM guardrails are still in `AGENTS.md` §Oversized-LLM Guardrails, §Change Safety Rules and
  §Repository Scope, with copies in `ansible-safety.md` and `compose-stack-conventions.md`. Add
  `oversized-llm` to `REQUIRED_RULES` in `check.mjs`, and its routing row.
- "UI/API" remains in `AGENTS.md` §Repository Scope and §Commands, and in the compose rule.
- `proposals.md`'s `QN-1 §Decisions, 2026-11-01` is unchanged: not an instruction-file citation, and Phase
  3's history candidate. The "Adapted from" lead remains in `planning.md`; `editing.md` no longer has one.
- A session opened before this phase is stale (R1): restart any pane on this checkout.
- The work is uncommitted until the operator asks: `git add -N` was used on the new files. Land it as one
  commit (rollback is `git revert`).

---

## Phase 3 — Rule content

**Goal:** the rules match reality: history in rationale, dormant guardrails in one file, repo conventions
out of memory.

**Build:** REQ-AGENT-03, 04, 06, 07, 10, D6–D8, D15, D20. No host touched.

1. **Oversized-LLM (D8).** Create `.claude/rules/oversized-llm.md` from `AGENTS.md` §Oversized-LLM
   Guardrails, the Ollama and Tailscale lines of §Change Safety Rules and §Repository Scope, and the
   matching lines of `ansible-safety.md` and `compose-stack-conventions.md`. Its rules keep their intent
   and wording, including the scope line. Its first line marks it dormant until QN-11. Add its routing
   row and rationale file. A consumer audit shows every file a moved rule names matches its `paths:`
   (`Ansible/roles/base/tasks/main.yml`, `ollama/docker-compose.yml`, `portainer/docker-compose.yml`),
   and every trigger that touches no file is in the routing row: firewall, inbound ports, exposure,
   `OLLAMA_BIND_IP` and Tailscale.
2. **History (REQ-AGENT-04).** Move each rule's dates, ids and backstory to its rationale file, and link
   it. Known candidates: the "Adapted from" leads in `editing.md` and `planning.md`, the Premise Spikes
   origin line, `proposals.md`'s "best artifact" line and its `2026-11-01` decision citation. ⚠️ The Internal
   Domain dates stay: the Certificate Transparency check applies them.
3. **Portainer (D20).** Add the UI-in-GitOps-mode practice to `AGENTS.md`, replacing "UI/API" in the core
   and the compose rule. The Ansible-vs-Portainer boundary rules do not change.
4. **Commit-to-`main` (D7).** Add it to `AGENTS.md`.
5. **Memory (REQ-AGENT-07, D15).** Check each note's claim, and copy its text into the paired rationale
   entry first, because memory has no history. Delete `commit-direct-to-main.md` and
   `portainer-gitops-ui-deploy.md` and their `MEMORY.md` lines. `prefers-zsh-scripts.md` stays: it is a
   personal preference. The secondary profile's memory is empty.
6. **Carried rules (REQ-AGENT-10).** Each rule added on 2026-11-01, `.tmp/` scratch and the `private/`
   logs rule included, has a ledger row showing its intent survived.

**Acceptance criteria:**

- The guard exits 0, including `rationale` over real `why` links.
- The consumer audit is in the log. A fresh-session Read of `ollama/docker-compose.yml` shows
  `oversized-llm.md` and the compose rule arriving together.
- A grep shows no Oversized-LLM guardrail left in `AGENTS.md`, and each intent in the ledger with a home.
- The core and the compose rule no longer say "UI/API". Stack READMEs are unchanged.
- `MEMORY.md` lists one note, and both promoted rules are in a file every agent loads.
- `AGENTS.md`'s headroom against the working target is recorded.

**Completion log** — _status: 🟡 in progress_

<!-- HANDOFF: what landed · acceptance evidence · host state left behind ·
     every decision/deviation/gotcha + exact name/value the next phase consumes -->

---

## Phase 4 — Surfaces and closeout

**Goal:** no Copilot surface remains, every surface has a recorded outcome, and the plan closes.

**Build:** REQ-AGENT-02, 08, 09, D4, D6, D10, D11, D21. No host touched.

1. **`infra-reviewer` (D6).** Delete it. The ledger maps its five checks to their rules.
2. **`new-stack-readme` (D10).** Convert it to `.agents/skills/new-stack-readme/SKILL.md`, with a
   `.claude/skills/new-stack-readme` link to `../../.agents/skills/new-stack-readme`. Keep `name`,
   `description` and `argument-hint`; drop `agent` and `tools`. Point it at `AGENTS.md`, and make its
   "Deployment in Portainer" section follow D20.
3. **Hook (D11).** Delete it. `.github/` is now empty.
4. **Guard.** Add the three retired `.github/` paths to `layout` and `retired-paths`, and sweep any
   reference they find.
5. **Dispositions.** The ledger closes with §Surface dispositions as built, one row per surface.
6. **Inbox.** Promote or retire every `docs/ai-lessons.md` entry this plan added, with a one-line reason
   each in the log.
7. **Docs.** `docs/index.md` and the proposal's status. Log any finding for the siblings (D21).

**Acceptance criteria:**

- The guard exits 0 with the new retired paths, and the fixtures pass.
- `.github/` no longer exists, and `git ls-files .vscode _IDEAS_` matches the pre-plan list.
- Claude Code runs `/new-stack-readme` by name, and a Codex rollout shows the skill listed.
- Every REQ-AGENT-01…10 is mapped to the phase and evidence that met it.
- The queue row reads ✅ complete, with empty Notes.

**Completion log** — _status: ⬜ not started_

<!-- HANDOFF: what landed · acceptance evidence · host state left behind ·
     every decision/deviation/gotcha + exact name/value the next phase consumes -->

---

## Risks

- **R1 — Concurrent agents.** Panes keep stale paths through Phase 2. §Preconditions closes them first,
  and a session opened before Phase 2 is restarted after it.
- **R2 — The guard goes unrun (D5).** Nothing runs it automatically, so a rule edit outside a plan can
  break a link unnoticed. `editing.md` tells agents to run it, §Before ending a phase requires it, and
  `adversarial-review` reports a skipped run as a violated repo rule. If drift shows up anyway, a
  pre-commit hook is a small later addition.
- **R3 — Silent rule drops.** The ledger, plus the both-way rationale check.
- **R4 — Vendor drift.** A Claude Code or Codex upgrade can change what loads. Re-run QI-30's Phase 0
  probe after a major upgrade; the routing table is the fallback.
- **R5 — Exposure rules leave the always-loaded core (D8).** A task that discusses firewall or exposure
  without touching a file loads no rule. The routing row names those words, and the guardrails stay
  dormant until QN-11 either way.
- **R6 — New work cites old names.** QN-1 and later proposals may be written during this plan. The next
  guard run after Phase 2 catches a retired path on a live surface.

## Out of scope

- `agent-skills/` and its `install.sh`.
- Edits to the sibling repos (D21).
- QN-11's park-or-retire decision and QN-12's Portainer changes.
- Any change to firewall, exposure, secrets or the Ansible-vs-Portainer boundary.
- A mass edit of stack READMEs (D20).
- A pre-commit hook or CI (D5).

[proposal]: ../proposals/agent-instructions-migration-proposal.md
