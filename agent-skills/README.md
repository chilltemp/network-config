# Agent skills

Machine-wide skills for Claude Code and Codex, kept as one generic copy and linked into each tool's
user-level skill directory. Each skill opens a **new** Atrium pane and hands
it a prompt; the work happens there, not in the pane that ran the skill.

| Skill | What it does | Who may start it |
| --- | --- | --- |
| `next-phase` | Starts the next phase of a queue item in a new **Claude Code** pane: the ⏸ paused phase, else the first ⬜. Refuses while a phase is 🟡, or when more than one is ⏸. | The user, or the agent when asked to |
| `adversarial-review` | Opens a read-only **Codex** reviewer (the `code-reviews` launch profile) on the current session, a plan phase or a whole plan. The reviewer follows [`reviewer.md`](adversarial-review/reviewer.md) and messages its findings back. | **Explicit invocation only:** `/adversarial-review` in Claude Code, `$adversarial-review` or `/skills` in Codex (see §Codex for the one gap) |

Both run against the git repo of the **current directory**, never against this one.

```
agent-skills/
  README.md
  install.sh                  link, unlink, idempotent
  lib/queue-plan.cjs          queue row → plan doc → the phases on its **Status:** line
  next-phase/                 SKILL.md · scripts/next-phase.sh
  adversarial-review/         SKILL.md · reviewer.md · agents/openai.yaml · scripts/adversarial-review.sh
```

## Prerequisites

- **Atrium**, with the agent running inside an Atrium pane (`$ATRIUM_CLI_PATH` and
  `$ATRIUM_PANE_ID` set). Outside one, only `--dry-run` works.
- **Node** on `PATH` (the scripts parse the queue with it) and **git**.
- **Claude Code**, for `next-phase`'s pane, and **Codex** with an Atrium launch profile named
  `code-reviews`, for the reviewer (`--profile <slug>` picks another).

## Install and uninstall

```bash
~/github/network-config/agent-skills/install.sh --dry-run   # show what it would do
~/github/network-config/agent-skills/install.sh             # install, or repair; safe to re-run
~/github/network-config/agent-skills/install.sh --uninstall # remove only what it made
```

`install.sh` links every skill folder here into:

- `~/.agents/skills/` — always. Codex reads it, and every `SKILL.md` names its script by
  `~/.agents/skills/<skill>/scripts/…`, so the path holds whichever tool runs it.
- `~/.claude/skills/` and `~/.claude-secondary/skills/` — for each Claude Code profile that exists.

It also writes `~/.codex/rules/agent-skills.rules`, one rule per script:

```
prefix_rule(pattern=["/Users/<you>/.agents/skills/next-phase/scripts/next-phase.sh"], decision="allow")
```

Before changing anything, it refuses if a destination exists and is not its own link, or if the
rules file was not written by it. Uninstall removes its links and the rules file, nothing else.
New skills here are picked up by re-running it.

⚠️ **A personal skill beats a project skill of the same name in Claude Code.** Installing makes
`/next-phase` in every repo resolve to this copy immediately, including a repo that still has its
own.

## Codex: the sandbox and the rule

Codex runs commands in a sandbox that refuses Atrium's socket (`~/.atrium/ipc/stable.sock`,
`connection_denied`), so a script there cannot create a pane. The rule above lets the script run
outside the sandbox with no prompt. Without it, the run still works if the user approves one
escalation each time.

- The rule matches **only the absolute path**. Codex wraps `~/…` or `$HOME/…` as
  `zsh -lc "<whole string>"`, which never matches, so `SKILL.md` tells Codex to write the home
  directory out. For the same reason, the approval prompt's "don't ask again" saves a rule for the
  exact string, which misses once the arguments change.
- Codex lists **both** copies of a same-name skill, and `$name` then Tab can complete to the
  project copy. Delete a repo's own copy once it has moved here.
- Keep any `agents/openai.yaml` `display_name` equal to the skill name: Codex shows the display name
  in its `$` list in place of the name.
- `allow_implicit_invocation: false` hides a skill from Codex's own choice, but it is a listing
  policy, not a fence: Codex can still find the file by searching.
- ⚠️ **Codex starts `adversarial-review` when asked for it in words.** Told "start an adversarial
  review of this session", it searched `~/.agents/skills`, read `SKILL.md` and ran the script,
  despite the `SKILL.md` line that says a request in words is not an invocation. It does not pick
  the skill for a generic request ("look over the uncommitted changes"). Claude Code holds the
  line: it answers with the command to type.
- **A reviewer never starts a review.** A `session` reviewer reads a transcript that shows
  `/adversarial-review` typed, and the rule above lets the script run with no prompt, so a reviewer
  that took it as a request could chain reviewers. `reviewer.md` forbids it, and the script refuses
  when the calling pane's name or room starts `Review: ` (it names every reviewer pane that way
  before sending the prompt, and opens it split beside the caller), or when it cannot list panes
  to check. `next-phase` has no such guard: chaining phases is its job.

## What a repo must provide

- **A queue** at `docs/proposals/_implementation-order.md`: one markdown table whose columns start
  `| # | Item | Sprint | Status |`. The `#` cell is the id; the Item cell links to the plan doc; a
  Status cell containing ✅ or ⛔ means nothing to do. A repo with no queue gets a one-line error.
- **A `**Status:**` line** in each multi-phase plan, e.g.
  `**Status:** Phase 0 ✅ · Phase 1 🟡 · Phase 2 ⬜`. Marks: ⬜ not started · 🟡 in progress ·
  ⏸ paused (at most one) · ✅ done · ⚠️ done with caveats. A doc without one still gets a generic
  prompt and a warning.
- **Its own id prefix**, distinct from every other repo's: ids match `^[A-Z][A-Z0-9]*-[0-9]+$`.
- **The wrong-session rule** in its core instructions, because a typed `do QK-12` never reaches
  these scripts:
  > An id with another repo's prefix, or one not in this queue, means the wrong session. Stop and
  > say so; never look for a near match.
- **Core instructions** the reviewer can find: `AGENTS.md` at the root, else `CLAUDE.md`, routing
  to any rule files (including the planning rules).

## Adding a repo

1. Pick a prefix no other repo uses. Today: `QK-` is `karens-database`, `QR-` is
   `readingorder.info-2025`; `QI-` is legacy and appears in both.
2. Add the queue, the `**Status:**` lines and the wrong-session rule above.
3. Check from the repo root:
   `~/.agents/skills/next-phase/scripts/next-phase.sh <ID> --dry-run`.

Nothing is installed per repo.
