# Agent instructions migration proposal

**Queue:** QN-17 · **Affects:** `CLAUDE.md`, `.github/copilot-instructions.md`,
`.github/instructions/*.instructions.md`, `.github/agents/`, `.github/prompts/`, `.github/hooks/`,
`.vscode/settings.json`, `docs/ai-lessons.md`, this repo's entries in operator memory

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
  the sibling repos' line and byte budgets. Each rule file stays under 20,000 characters.
- **REQ-AGENT-06 — Rules match reality.**
  - The Oversized-LLM guardrails follow QN-11's outcome, or are marked dormant until it lands.
  - The Portainer rules stay until QN-12 changes them.
- **REQ-AGENT-07 — Repo rules out of memory.** Memory notes that are really repo conventions move
  into rule files: the Portainer GitOps-mode deploy. Commit-to-`main` moves only if the operator
  answers yes to open question 5. Memory keeps only personal preferences.
- **REQ-AGENT-08 — Tool settings.** Set the Copilot settings in `.vscode/settings.json` if Copilot
  stays in use. Codex and the `adversarial-review` reviewer find the core through `AGENTS.md`.
- **REQ-AGENT-09 — Kept honest.** Something checks layout, links, the routing table and budgets after
  each edit.
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

1. Is Copilot still used in this repo, or is it Claude Code plus Codex, as in `readingorder.info-2025`?
2. How should REQ-AGENT-09 be met? This repo has no test pipeline, so the options are a small guard
   script, modeled on `readingorder.info-2025`'s guard test, or a checklist in the editing rules.
3. Should every rule file get a paired rationale file, as in `readingorder.info-2025`, or only the
   rules that carry history? This repo's rules are small.
4. The `infra-reviewer` Copilot agent: convert it to a shared skill, fold it into the
   `adversarial-review` reviewer brief, or retire it?
5. Should commit-to-`main` become a repo rule, or stay a personal preference?

## Notes for planning

- Prior art, to read before planning:
  - `readingorder.info-2025` QI-88: its plan, `docs/agents/qi-88-rule-ledger.md`, the spec above, and
    `docs/agents/rationale/`.
  - `karens-database` QI-30: `docs/proposals/instruction-and-docs-diet-proposal.md` and its section
    "What QI-88 taught".
- QI-88 verified the loading matrix for Claude Code 2.1.312 and Codex CLI 0.165.0. A Phase 0 spike
  is needed only if the installed versions have moved enough to doubt it.
- This repo's rules total about 40 KB, so expect a few sessions, not QI-88's 27.
