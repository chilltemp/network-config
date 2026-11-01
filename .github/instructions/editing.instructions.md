---
description: "Use when modifying copilot-instructions.md, any scoped *.instructions.md file, CLAUDE.md, or docs/ai-lessons.md, or when asked to codify a rule. Covers where rules live for multiple agents, externalization, style, the lessons loop, and cross-reference discipline."
name: "Instruction File Editing"
applyTo: ".github/copilot-instructions.md, .github/instructions/*.instructions.md, CLAUDE.md, docs/ai-lessons.md"
---

# Instruction File Editing

Authoritative reference for editing `copilot-instructions.md`, scoped `*.instructions.md` files,
`CLAUDE.md`, and the lessons inbox. `copilot-instructions.md` holds the global rules. Adapted from
`karens-database`.

## Where Rules Live

Several agents work this repo: Claude Code (two account profiles), GitHub Copilot, and Codex as the
`adversarial-review` reviewer. A rule only one of them can see is not a rule.

- `.github/copilot-instructions.md` → global rules: scope, architecture, change safety, agent workflow.
- `.github/instructions/<topic>.instructions.md` → one area's rules, loaded by `applyTo`.
- `CLAUDE.md` → Claude Code entry point: points at `copilot-instructions.md`, repeats the critical
  rules, and carries the scoped-rule table. When `/init` is invoked, update `copilot-instructions.md`
  or the relevant scoped file — **not** `CLAUDE.md`.
- `docs/ai-lessons.md` → staging for new lessons, promoted from there into a rule file.
- ⛔ **Never in agent memory.** Memory is visible only to the agent and account that wrote it. Memory
  keeps operator preferences and machine-local facts; repo rules, handoffs and investigation logs go
  in repo files.

## Externalization Rule

- Domain-specific addition >5 lines → `.github/instructions/<topic>.instructions.md` (create if missing).
- `copilot-instructions.md` gets a one-line pointer in its **Scoped Instructions** list.
- An addition spanning unrelated domains is split across their topic files.

## Topic-File Header Convention

- Open with the frontmatter block (`description`, `name`, `applyTo`).
- First sentence states the file's domain and that `copilot-instructions.md` holds global rules.

## Style Rules (every instruction file)

1. Short, direct sentences. Cut filler words.
2. No explanations unless the rationale changes how the rule is applied.
3. Technical terms exact. Code blocks unchanged verbatim.
4. Prioritize: [Thing] [Action] [Result].
5. Use symbols where clear: →, =, vs., ≥, ✕, ⛔, ⚠️.

**Non-negotiable:** zero rule drops — every enum value, path, naming pattern, and example survives a
rewrite. Bold warnings stay bold. YAML/JSON/bash blocks copied unchanged.

## Self-Improvement Loop

After any user correction or agent mistake:

1. Capture the pattern in [`docs/ai-lessons.md`](../../docs/ai-lessons.md).
2. Promote a durable rule into the relevant scoped file or `copilot-instructions.md`.
3. Prune the staging note once the canonical rule exists.

## Cross-Reference Discipline

- When content moves between instruction files, grep every `*.instructions.md`,
  `copilot-instructions.md` and `CLAUDE.md` for stale pointers and update each hit.
- A new scoped file gets an entry in the **Scoped Instructions** list in `copilot-instructions.md`
  and in the scoped-rule table in `CLAUDE.md`.
- ⚠️ A `git mv` of a doc is followed by a link check of the moved file's own relative links, not
  just a grep for inbound links.
