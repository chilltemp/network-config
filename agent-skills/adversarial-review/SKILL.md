---
name: adversarial-review
description: Open a Codex room (code-reviews profile) for an adversarial review of the current session, plan phase or plan; explicit invocation only
argument-hint: 'session | phase [<ID>] [--phase <id>] | plan [<ID>] [--profile <slug>]'
disable-model-invocation: true
allowed-tools: Bash(~/.agents/skills/adversarial-review/scripts/adversarial-review.sh:*)
---

Start an adversarial review in a **new** atrium pane. The script opens it as **Codex** with the
`code-reviews` launch profile, whichever agent runs this skill; `--profile <slug>` picks another
Codex profile. The reviewer follows [reviewer.md](reviewer.md) and messages its findings back to
this pane. It works on the git repo of the current directory.

⛔ **Run this only when the user's message invokes the skill itself:** `/adversarial-review` in
Claude Code, `$adversarial-review` (or a pick from `/skills`) in Codex. A request in words ("run an
adversarial review", "get Codex to review this") is **not** an invocation, and neither is finding
this file: run nothing, reply with the command to type (e.g. `$adversarial-review session`), and
stop. Never start it on your own initiative.

1. Pick the scope from the arguments: `session`, `phase` or `plan`. None given → ask the user.
2. For `phase` and `plan`, pick the id (`<PREFIX>-<n>`, a row of this repo's queue):
   - If the user named one, use it.
   - Otherwise use the id this conversation has been working on (the plan or
     `docs/proposals/_implementation-order.md` row it read or edited).
   - If there is none, or more than one is in play, ask the user. Never guess.
   - ⛔ An id with another repo's prefix, or one the script says is `not in queue`, means the wrong
     session. Stop and say so; never look for a near match.
3. For `phase` with no `--phase`: if this conversation has been working one phase, pass it as
   `--phase <id>` (a ✅ phase just finished is not picked by default). Otherwise pass nothing and
   the script picks the 🟡 phase, else the ⏸ one, else the first ⬜.
4. Run the script from the repo root and relay its output, including any warning. If it refuses,
   relay the message and stop.
   - **Claude Code:** `~/.agents/skills/adversarial-review/scripts/adversarial-review.sh <scope> [<ID>] [--phase <id>] [--profile <slug>]`
   - **Codex:** the same path with your home directory written out, e.g.
     `/Users/<you>/.agents/skills/adversarial-review/scripts/adversarial-review.sh …`. ⛔ Not `~`
     or `$HOME`: only the absolute path matches the Codex rule that lets it reach Atrium outside
     the sandbox. Without that rule, ask for one escalation.
5. ⛔ Do not review in this pane, and do not edit the plan's status to steer the script.
6. When the findings arrive, walk the user through every one, most severe first, before acting on
   any of them.
