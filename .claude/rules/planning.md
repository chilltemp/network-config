---
description: "Use when a prompt names a QN-<n> queue id, when turning a proposal into a plan, when authoring or implementing a multi-phase plan in docs/plans/, or when reading/updating the implementation queue in docs/proposals/_implementation-order.md. Covers proposal-to-plan, phase structure, live-host safety, completion logs, and the queue table format."
paths:
  - 'docs/plans/**'
  - 'docs/proposals/_implementation-order.md'
---

# Phased Plan Guidelines

- Start with the project-wide rules in [AGENTS.md](../../AGENTS.md); its [Docs Lifecycle](../../AGENTS.md#docs-lifecycle) governs where plans live and when they archive.
- This file governs the **internal structure** of a multi-phase plan, the protocol for working it, and the **implementation queue** — [`docs/proposals/_implementation-order.md`](../../docs/proposals/_implementation-order.md). See [The Implementation Queue](#the-implementation-queue).
- Adapted from `karens-database` and `readingorder.info-2025`. The queue and `**Status:**` formats must stay compatible with the machine-wide `next-phase` and `adversarial-review` skills — [agent-skills/README.md](../../agent-skills/README.md#what-a-repo-must-provide).

## From Proposal to Plan

- Every queue row starts as a proposal ([proposals.md](proposals.md)). A planning session turns **one** proposal into a plan at `docs/plans/<topic>-plan.md`, then repoints the row's Item link to the plan. The proposal stays as the requirements doc; the plan links to it and cites its `REQ-` ids.
- Resolve the proposal's open questions with the operator first ([Keep the Q&A → Proposal → Design Split](proposals.md#keep-the-qa--proposal--design-split)). ⛔ No plan while an open question would change its shape.
- ⛔ **One proposal per planning session.** Never plan several queue rows at once.
- A proposal marked "single session" may be worked directly without a plan; its completion notes go in the proposal under a `## Outcome` heading. ⛔ [Live-Host Safety](#live-host-safety) still applies in full: write its items into the Outcome **before** the change.

## When This Applies

- Plans with **≥2 phases**. Single-step plans need no completion logs.
- Each phase = **one working session**, self-contained.
- ⛔ **Exception: [Live-Host Safety](#live-host-safety) applies to every live change**, with or without a plan.

## Phase Anatomy

Every phase carries four parts:

- **Goal** — one line.
- **Build** — steps with host names, file anchors and `REQ-` refs.
- **Acceptance criteria** — the "done when" gate.
- **Completion log** — written back when the phase finishes (see below).

## Live-Host Safety

Every change to a running host, service, DNS, DHCP, firewall or firmware states the items below **before it is made**: in the phase's Build, or in the proposal's `## Outcome` when single-session work has no plan.

- **Blast radius** — hosts touched, expected downtime, and what else breaks meanwhile (e.g. furball down → `*.home-lan.net` stops resolving until QN-6 lands).
- **Backup** — a current backup of what changes exists, and where. Checked before starting, not assumed.
- **Rollback** — written before the change, not after it fails.
- **Operator gate** — reboots, wipes, DNS/DHCP changes and firmware updates are run or explicitly approved by the operator in the session. The agent proposes; the operator confirms.
- **Capture first** — export the current config before changing it.

## Premise Spikes (precondition, not acceptance)

**If a phase's premise is vendor or platform behaviour nobody here has verified (Unraid, Unifi, Traefik, AdGuard, Acronis, a container manager), the verification is a throwaway spike that runs FIRST — and the phase is not written until it passes.**

The tell is mechanical, and it is in the plan text itself: **any acceptance criterion phrased as "verify that X behaves as assumed" is misfiled.** It is a precondition. Lift it out, make it Phase 0, and write the dependent phase only after it returns.

- A Phase 0 spike changes **nothing on a live host**. Its output is a completion log.
- Give it explicit pass/fail gates, and say in the plan what happens on each.
- Read the vendor's docs or release notes for the **installed** version, not model memory.
- Origin: `readingorder.info-2025` reverted a whole phase whose "verify on a production build" acceptance criterion failed after the build (`docs/archive/plans/timeline-toolbar-registry-plan.md` Phase 1 there).

## Before Starting a Phase

1. Read `AGENTS.md` + the rule file for the area + [ai-lessons.md](../../docs/ai-lessons.md).
2. Set the phase to 🟡 in the `**Status:**` header and its completion log ([Status Legend](#status-legend)).
3. Read the **completion logs of all prior phases** — they carry the as-built shapes, decisions, and gotchas this phase depends on. **The plan text is the intent; the logs are the reality.**

## Before Ending a Phase (required)

1. **Evidence, not assertion.** There is no lint or test pipeline here. Evidence is command output, `dig` results, screenshots, UI exports, and `docker compose config` for an edited compose file where Docker is available.
2. Confirm the acceptance criteria with that evidence.
3. **Write back the completion log:** set status → list what landed → paste evidence → write a **handoff**: every decision, deviation, gotcha, and exact name/value/path *as built* that a later phase consumes.
4. If the plan text was wrong, fix the plan — not just the log.
5. **Public-safety check:** the diff carries no secrets and no finding that belongs in the private docs home ([Public Safety](proposals.md#public-safety)).
6. **A plan's last phase sweeps the lessons inbox once:** every [ai-lessons.md](../../docs/ai-lessons.md) entry the plan added is promoted or retired, with a one-line reason each in the log.
7. **Update the plan's row in the implementation queue** if its status or its remaining phase changed — status symbol and Notes only, never a log excerpt.
8. **Run the guard last**, after every closeout edit: `node tooling/agent-guard/check.mjs`, and `node --test tooling/agent-guard/check.test.mjs` if the guard changed. Paste the output in the log. ⛔ Nothing else runs it.

## Status Legend

⬜ not started · 🟡 in progress · ⏸ paused · ✅ done · ⚠️ done with caveats (see log)

- 🟡 = an agent is working the phase now. ⏸ = stopped part-way, waiting to resume; ⛔ **at most one ⏸ per plan.**
- **Pausing a phase:** set ⏸ in the header and the completion log, and write the handoff so far (what landed, what is left, uncommitted state, and **the state each touched host was left in**).
- **Resuming a ⏸ phase:** read its own log and `git status` first, then set it back to 🟡.
- **Starting or ending a phase updates the `**Status:**` header too** — the header, the completion logs and the queue row move together.
- The machine-wide `next-phase` skill ([agent-skills/next-phase](../../agent-skills/next-phase/SKILL.md)) reads the header: it resumes the ⏸ phase, else starts the first ⬜, and refuses while a phase is 🟡 or several are ⏸.

## Authoring Rule

Every multi-phase plan **embeds this protocol inline** — a `**Status:**` header, a short "How to work this plan" section + the per-phase skeleton below — so the rules travel with the plan (self-enforcing). Reuse the status legend above; do not invent a new one.

## Status Header (once per plan)

The plan's first line after its `#` title. ⛔ **The line starts `**Status:**` and lists every phase as `Phase <id> <mark>`, in order** — the `next-phase` and `adversarial-review` skills parse exactly that.

```markdown
**Status:** Phase 0 ⬜ · Phase 1 ⬜ · Phase 2 ⬜
```

## Per-Phase Skeleton (copy per phase)

```markdown
## Phase N — <title>
**Goal:** <one line>
**Build:** <steps · hosts · file anchors · REQ refs · blast radius · backup · rollback>
**Acceptance criteria:** <done when…>
**Completion log** — _status: ⬜ not started_
<!-- HANDOFF: what landed · acceptance evidence · host state left behind ·
     every decision/deviation/gotcha + exact name/value the next phase consumes -->
```

## The Implementation Queue

[`docs/proposals/_implementation-order.md`](../../docs/proposals/_implementation-order.md) is the
human-readable to-do list: **one table, one row per task, no history.** It answers *what do I do
next*, nothing else.

Columns are exactly `| # | Item | Sprint | Status | Notes |`.

⚠️ **Always run Prettier after editing the queue** —
`npx --yes prettier@3 --write docs/proposals/_implementation-order.md` — so the table's columns stay
aligned and the file stays readable to a human. ⛔ **That file only**; the rest of `docs/` is not
Prettier-formatted.

- **#** — a `QN-<n>` id ("queue item", `N` = network-config). ⛔ **Never `P<n>`** — that prefix means a
  plan's own phase. Another repo has its own prefix (`QK-` = `karens-database`, `QR-` =
  `readingorder.info-2025`), so an id names one repo's queue. ⛔ **Numbers never change.** A new task
  takes the next free number; rows are re-ordered freely into recommended-implementation order and
  are **never renumbered**. ⛔ **Ids are never reused** — including the ids of rows archived out of
  the table. The next free id is recorded in the queue's own header; bump it when you add a row.
  ⛔ **Wrong session:** an id with another repo's prefix, or one that is not a row here, means the
  prompt reached the wrong session. Stop and say so; never look for a near match.
- **Item** — the task, as a link to the doc that owns it (a proposal, later its plan). ⛔ **Never phases, never a description.**
- **Sprint** — `current` · `next` · `future` · `ON HOLD`. ⛔ **Only the operator changes a sprint value** — `ON HOLD` included: never set it, never clear it.
- **Status** — symbol + word, one of ⬜ not started · 🟡 partial · ✅ complete · ⛔ abandoned.
  ⛔ **No dates, no detail.** The status is *derived from* the plan's phase completion logs and never
  restates them.
- **Notes** — blockers, the next/remaining phase, and open questions **only**.
  ⛔ **100 characters max**, counted on the raw markdown — a fact that does not fit was never queue
  content, and lives in the linked doc. ⚠️ Trimming a cell is not deleting a fact: confirm the linked
  doc states it, in the same change. ⛔ Never write a negative state: no dependency list means no
  dependencies. An "open question" here is a decision the operator owes, not an unverified premise
  — an unverified premise is a Phase 0 spike ([Premise Spikes](#premise-spikes-precondition-not-acceptance)), which lives in the plan.

Three rules that shape the docs, not just the table:

- **The table carries no history.** Session logs, measurements, corrections and decisions belong in
  the linked doc. If a fact does not fit in a Notes cell, it was never queue content.
- **An intra-task dependency is never encoded in a note.** If a doc's phases are blocked part-way by
  *another* doc, **split that doc or merge the two**.
- **Archiving a row is an operator request, never routine housekeeping.** A ✅ complete or ⛔
  abandoned row **stays in the table** until the operator asks for it to be archived — ⛔ never
  remove one as a side effect of closing a phase, and never on your own initiative. When the operator
  does ask, archiving is **one change with four parts**: `git mv` the owning doc(s) into
  `docs/archive/plans/` (or `docs/archive/proposals/`), repoint every inbound link, move its
  `docs/index.md` row into the matching `## Archive` section with an
  `Implemented`/`Archived`/`Superseded` status, and only then delete the queue row. ⚠️ Work still
  outstanding on an archived row gets its **own new row first** — it must not vanish with its parent.

⚠️ **A status request is a read, not an audit.** Report what the table says. Do not re-verify
closures against hosts or the tree, and never silently upgrade or downgrade a status; if the table
and reality disagree, say so.
