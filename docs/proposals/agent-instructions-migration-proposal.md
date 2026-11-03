# Agent instructions migration proposal

**Queue:** QN-17 · **Affects:** `CLAUDE.md`, `.github/copilot-instructions.md`,
`.github/instructions/*.instructions.md`, `.github/agents/`, `.github/prompts/`, `.github/hooks/`,
`.vscode/settings.json`, `docs/ai-lessons.md`, this repo's entries in operator memory

**Status:** Implemented 2026-11-02. The [plan](../plans/agent-instructions-migration-plan.md)'s Phase 4 log maps each requirement to its evidence.

## Why

This repo's rules use the layout that treats GitHub Copilot as the primary agent:

- `CLAUDE.md` tells Claude to go read `.github/copilot-instructions.md`, and then restates its critical
  rules.
- Area rules are `.github/instructions/*.instructions.md`, loaded by `applyTo`.

In practice, Claude Code is the primary agent here (two account profiles), and Codex runs reviews
through `adversarial-review`. All of them run side by side in Atrium panes on one checkout.
`readingorder.info-2025` (QI-88) and `karens-database` (QI-30) have both moved, or are moving, to a
layout where every agent reads the same rule text, with nothing maintained twice.

Other problems:

- Rules are duplicated between `CLAUDE.md` and copilot-instructions.
- Most of the always-loaded text is Oversized-LLM guardrails for a host that only boots Windows
  (QN-11).
- Two repo conventions live only in one agent's memory: "deploy stacks through the Portainer UI in
  GitOps mode" and "commit straight to `main`".
- The planning, proposal and editing rules added on 2026-11-01 were written into the old layout and
  need to move too.

## Requirements

- **REQ-AGENT-01 — Same layout as the sibling repos.** The target contract is `readingorder.info-2025`'s
  `docs/specs/agent-instructions-spec.md`, adapted to this repo:
  - `AGENTS.md` is the core that every agent reads, including the routing table.
  - `CLAUDE.md` is `@AGENTS.md` followed by Claude-only notes.
  - Area rules live in `.claude/rules/<topic>.md`, with a `paths:` list.
- **REQ-AGENT-02 — Every surface has a disposition.** Each current file is moved, merged, converted or
  retired, and the outcome is recorded:
  - `CLAUDE.md` and `copilot-instructions.md`.
  - The five `.github/instructions/` files.
  - The `infra-reviewer` Copilot agent.
  - The `new-stack-readme` prompt.
  - The disabled plaintext-secrets hook.
  - `_IDEAS_/ai-instructions/`, which stays reference-only.
- **REQ-AGENT-03 — No silent rule drops.** A rule ledger maps every old rule to its new home or to a
  recorded retirement. Duplicates are merged. The operator resolves contradictions.
- **REQ-AGENT-04 — History out of rule text.** Dates, ticket ids and backstory move to rationale
  files, linked from the rule, wherever a rule carries them.
- **REQ-AGENT-05 — Budgets.** `AGENTS.md` stays well inside Codex's 32 KiB read limit, and within
  the sibling repos' line and byte budgets. Each rule file targets under 20,000 characters, a soft
  limit as in `karens-database`.
- **REQ-AGENT-06 — Rules match reality.**
  - The Oversized-LLM guardrails follow QN-11's outcome, or are marked dormant until it lands.
  - The Portainer rules stay until QN-12 changes them.
- **REQ-AGENT-07 — Repo rules out of memory.** Memory notes that are really repo conventions move
  into rule files: the Portainer GitOps-mode deploy and commit-to-`main`. Memory keeps only personal
  preferences.
- **REQ-AGENT-08 — Tool settings.** Copilot is dropped, so `.vscode/settings.json` gains no Copilot
  settings. Codex and the `adversarial-review` reviewer find the core through `AGENTS.md`.
- **REQ-AGENT-09 — Kept honest.** A guard script, run by hand, checks layout, links, the routing table
  and budgets after each edit.
- **REQ-AGENT-10 — Carried rules.** Rules added before the migration keep their intent, including
  scratch in `.tmp/` (added 2026-11-01).

## Non-goals

- Changing the intent of any infra rule: firewall, exposure, secrets, or the Ansible-vs-Portainer
  boundary. Those rules move; they don't change.
- Changing the machine-wide `agent-skills/` or its `install.sh`.
- Editing the sibling repos.

## Offline behavior

No effect.

## Depends on

Nothing. It goes first so that every later plan cites the new rule paths. QN-11 and QN-12 change
rule content later, in the new layout.

## Open questions

None. All are answered in §Decisions. The plan is
[agent-instructions-migration-plan](../plans/agent-instructions-migration-plan.md).

## Decisions

Rulings of 2026-11-01. Items 1 and 3 apply the operator's earlier rulings from the sibling repos;
items 2, 4, 5 and 6 were asked in the planning session.

1. **Copilot is dropped; Claude Code and Codex are the live tools.** From `karens-database` QI-30's
   2026-10-30 ruling: Copilot is not expected back. Nothing may depend on a Goose-free tree, because
   the roster can change.
2. **REQ-AGENT-09 is a dependency-free script, run by hand.** Not a checklist, and no git hook.
3. **Every instruction file gets a paired rationale file.** From QI-88 D3, re-confirmed 2026-10-27,
   and followed by QI-30.
4. **The `infra-reviewer` Copilot agent is retired.** Its five checks are already rules, and
   `adversarial-review` reports a violated repo rule as a finding.
5. **Commit-to-`main` becomes a repo rule.** It is specific to this repo: both siblings use branches.
6. **The Oversized-LLM guardrails move to one path-scoped rule file,** marked dormant until QN-11.
   This meets REQ-AGENT-06, and QN-11 then edits one file.

## Notes for planning

- Prior art:
  - `readingorder.info-2025` QI-88: `docs/archive/plans/arch-instruction-and-docs-diet-plan.md`,
    `docs/archive/plans/qi-88-rule-ledger.md`, the spec above, and `docs/agents/rationale/`.
  - `karens-database` QI-30: `docs/plans/instruction-and-docs-diet-plan.md`, and
    `docs/proposals/instruction-and-docs-diet-proposal.md`'s section "What QI-88 taught".
- QI-30's Phase 0 verified the loading matrix on 2026-11-01 for Claude Code 2.1.316 and Codex CLI
  0.166.0, the installed versions, so no Phase 0 spike is needed.
- This repo's rules total about 40 KB, so expect a few sessions, not QI-88's 27.
