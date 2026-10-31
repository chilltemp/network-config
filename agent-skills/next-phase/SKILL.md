---
name: next-phase
description: Open a new atrium room and start the next phase of the current queue item (e.g. QK-35) there
argument-hint: '[<ID>]'
allowed-tools: Bash(~/.agents/skills/next-phase/scripts/next-phase.sh:*)
---

Start the next phase of a queue item in a **new** atrium pane. The script opens that pane as a
**Claude Code** room, whichever agent runs this skill. It works on the git repo of the current
directory, which must have a `docs/proposals/_implementation-order.md` queue.

1. Pick the id (`<PREFIX>-<n>`, a row of this repo's queue):
   - If the user named one, use it.
   - Otherwise use the id this conversation has been working on (the plan or
     `docs/proposals/_implementation-order.md` row it read or edited).
   - If there is none, or more than one is in play, ask the user. Never guess.
   - ⛔ An id with another repo's prefix, or one the script says is `not in queue`, means the wrong
     session. Stop and say so; never look for a near match.
2. Run the script from the repo root and relay its output, including any warning:
   - **Claude Code:** `~/.agents/skills/next-phase/scripts/next-phase.sh <ID>`
   - **Codex:** the same path with your home directory written out, e.g.
     `/Users/<you>/.agents/skills/next-phase/scripts/next-phase.sh <ID>`. ⛔ Not `~` or `$HOME`:
     only the absolute path matches the Codex rule that lets it reach Atrium outside the sandbox.
     Without that rule, ask for one escalation.

   The script picks the phase from the plan's `**Status:**` line: it resumes the ⏸ paused phase,
   else starts the first ⬜, and names that phase in the new pane's prompt.
   - If it refuses because a phase is 🟡 or several are ⏸, relay the message and stop. Do not edit
     the status line to get past it: a 🟡 phase may have another pane on it, and which ⏸ phase to
     resume is the user's call.
3. ⛔ Do not start the phase in this pane. The new pane does that work.
