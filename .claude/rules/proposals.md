---
description: "Use when authoring or revising a proposal in docs/proposals/. Covers required sections, the offline and home-grade requirements, public-safety limits for this public repo, and the Q&A → proposal → design split."
paths:
  - 'docs/proposals/**'
---

# Proposal Authoring Rules

What a document in `docs/proposals/` must contain. `AGENTS.md` holds the
workspace-wide defaults; this file owns proposal structure.

A **proposal** describes work that does not exist yet, as requirements with ids. ⛔ **It is not a
plan:** no phases, no step lists, no commands to run. A later planning session turns it into a plan
in `docs/plans/` — see [From Proposal to Plan](planning.md#from-proposal-to-plan).

⛔ **`_implementation-order.md` is not a proposal.** It is the queue, governed by
[The Implementation Queue](planning.md#the-implementation-queue).

## Every Proposal

- File name `<topic>-proposal.md`. The line after the `#` title is
  `**Queue:** QN-<n> · **Affects:** <hosts, stacks, external systems>`.
- Sections, in order: **Why** · **Requirements** · **Non-goals** · **Offline behavior** ·
  **Depends on** · **Open questions** · **Decisions** (operator rulings, dated, once any are made) ·
  **Notes for planning** (optional) · **Outcome** (only for
  single-session work done without a plan; it carries the live-host safety items before the change —
  [Live-Host Safety](planning.md#live-host-safety)).
- Requirements carry ids `REQ-<AREA>-<nn>` with a bold short name. `<AREA>` is unique to the proposal
  (`DOCS`, `DISC`, `FURB`, …). ⛔ Ids are never renumbered; a dropped requirement is struck through,
  not reused.
- **Offline behavior** says what the result does with the internet down. "Must work offline" is a
  project requirement: ⛔ no control may depend on a cloud service to keep working on the LAN.
- **Home-grade, not enterprise.** Prefer the simplest thing that meets the requirement; name
  enterprise options only to reject them.
- **Open questions** are decisions the operator owes. An unverified vendor or platform behaviour is a
  premise for a Phase 0 spike and goes under **Notes for planning**.
- Reference other proposals by queue id (`QN-6`) and their requirements by id (`REQ-DNS-02`).
- Carry a row in [`_implementation-order.md`](../../docs/proposals/_implementation-order.md) and a row
  in [`docs/index.md`](../../docs/index.md).

## Public Safety

This repo is public. Until QN-1 decides the private docs home (its REQ-DOCS-05 replaces this
section):

- ⛔ **No per-service security findings** — which services lack auth, serve plain HTTP, expose ports,
  keep default credentials, or run vulnerable versions. A proposal names the class of problem; the
  list waits for the private home.
- ⛔ **No secrets, public IPs, MAC addresses, serial numbers, license keys, Tailscale addresses, or
  WAN port-forward details.**
- ⛔ **No troubleshooting or investigation logs that name household devices, people or LAN IPs.**
  They go in `private/<repo path>` (QN-1 §Decisions, 2026-11-01).
- ✅ Hostnames, `home-lan.net` names ([Internal Domain](../../AGENTS.md#internal-domain)), product names, and the
  shape of the network are fine.
- For a **named** host or service, state the requirement, never the installed state that makes it
  necessary ("bring X to a supported release", not "X is N versions behind"). The installed state
  goes private.
- Until then, local-only notes go in the gitignored `private/` folder ([Docs
  Lifecycle](../../AGENTS.md#docs-lifecycle)), named as a code span, never linked.

## Keep the Q&A → Proposal → Design Split

The process that produced `karens-database`'s best artifact:

1. **Ask.** Write questions inline in a `QA*.md` next to the proposal (or in the session), and let
   the operator answer them inline under each one. Answers may contradict earlier answers — keep the
   contradiction visible until it is resolved.
2. **Resolve.** Fold the _what_ and _why_ into the proposal: scope, terminology, intent, reversals of
   non-goals. Keep it short — the proposal must not grow into the transcript. Strike resolved open
   questions and state the answer where it applies.
3. **Split out the _how_.** Hardware, versions, config shapes, cutover mechanics and rollback go into
   the plan, written as **facts, not as Q&A**.
4. **Flag what did not resolve.** An answer that could not be placed cleanly is an open question the
   operator still owes — say so rather than guessing.

⚠️ When a question gets **two different answers**, record both the outcome and the fact that it was a
reversal where the decision lands. Without that note, a later reader finds the superseded answer and
reintroduces it.

## References

- [AGENTS.md](../../AGENTS.md) — workspace-wide defaults.
- [planning.md](planning.md) — the queue format and the multi-phase plan
  protocol.
- [../../docs/index.md](../../docs/index.md) — the curated index every new proposal must join.
