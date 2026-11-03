# Implementation order

The project to-do list: **one row per task, in recommended implementation order.** It answers _what do
I do next_ and nothing else — ⛔ **it carries no history.** Every session log, measurement, decision
and correction lives in the linked doc.

Rules for editing this table (numbering, sprint, status, notes, and when to split a doc) are in
[The Implementation Queue](../../.claude/rules/planning.md#the-implementation-queue). ⚠️ **A status request is a read, not an audit.**

**Status:** ⬜ not started · 🟡 partial · ✅ complete · ⛔ abandoned
**Sprint:** `current` · `next` · `future` · `ON HOLD` — ⛔ **only the operator changes a sprint value.**
**Id:** `QN-<n>` — a queue row (`N` = network-config). ⛔ Not a phase, a priority, or a plan part. An id
with another repo's prefix (`QK-` is `karens-database`, `QR-` is `readingorder.info-2025`), or one not
in this table, means the wrong session: stop and say so, never look for a near match.
**Notes:** blockers · the next/remaining phase · open questions — ⛔ **100 characters max**, counted
on the raw markdown. A fact that does not fit was never queue content: it lives in the linked doc.
**Next free id: QN-20.** ⛔ Ids are never reused, including the ones whose rows have been archived
out of this table.

⚠️ **Always run Prettier on this file after editing it** —
`npx --yes prettier@3 --write docs/proposals/_implementation-order.md` — so the table's columns stay
aligned and the file stays readable to a human. This applies to **this file only**; the rest of
`docs/` is not Prettier-formatted.

⛔ **Rows leave this table only when the operator asks.** A ✅/⛔ row stays until then; archiving it
means moving its doc to `docs/archive/` and its `docs/index.md` row to the matching Archive section
in the same change — never deleting the row on its own.

| #     | Item                                                                                       | Sprint  | Status         | Notes                                                                    |
| ----- | ------------------------------------------------------------------------------------------ | ------- | -------------- | ------------------------------------------------------------------------ |
| QN-17 | [`plans/agent-instructions-migration-plan`](../plans/agent-instructions-migration-plan.md) | current | ✅ complete    |                                                                          |
| QN-1  | [`proposals/network-documentation-proposal`](network-documentation-proposal.md)            | current | ⬜ not started | Open: private home (GitHub, Forgejo, both)? LLM wiki or plain docs?      |
| QN-2  | [`proposals/network-discovery-proposal`](network-discovery-proposal.md)                    | current | ⬜ not started | Blocked: QN-1. Open: may discovery run active LAN scans?                 |
| QN-3  | [`proposals/furball-boot-ssd-proposal`](furball-boot-ssd-proposal.md)                      | current | ⬜ not started | Open: installed Unraid version; is the SSD internal or USB-attached?     |
| QN-4  | [`proposals/openobserve-decommission-proposal`](openobserve-decommission-proposal.md)      | current | ⬜ not started | Open: does anything still send syslog to it?                             |
| QN-5  | [`proposals/backup-adequacy-proposal`](backup-adequacy-proposal.md)                        | current | ⬜ not started | Blocked: QN-2. Open: Acronis cloud or local only?                        |
| QN-6  | [`proposals/dns-resilience-proposal`](dns-resilience-proposal.md)                          | next    | ⬜ not started | Blocked: QN-2                                                            |
| QN-18 | [`proposals/vlan-adguard-proposal`](vlan-adguard-proposal.md)                              | next    | ⬜ not started | Blocked: QN-6. Open: guest filtering and local names; IoT rule set?      |
| QN-7  | [`proposals/security-baseline-proposal`](security-baseline-proposal.md)                    | next    | ⬜ not started | Blocked: QN-2. Open: IoT segmentation in scope?                          |
| QN-8  | [`proposals/unifi-controller-upgrade-proposal`](unifi-controller-upgrade-proposal.md)      | next    | ⬜ not started | Blocked: QN-2. Open: hardware console or self-hosted?                    |
| QN-9  | [`proposals/traefik-consolidation-proposal`](traefik-consolidation-proposal.md)            | next    | ⬜ not started | Blocked: QN-2. Open: per-host wildcard certs vs the single-wildcard rule |
| QN-10 | [`proposals/service-auth-proposal`](service-auth-proposal.md)                              | next    | ⬜ not started | Blocked: QN-9. Open: which provider; SSO or a password on everything?    |
| QN-11 | [`proposals/oversized-llm-retirement-proposal`](oversized-llm-retirement-proposal.md)      | next    | ⬜ not started | Open: park or retire?                                                    |
| QN-12 | [`proposals/container-manager-proposal`](container-manager-proposal.md)                    | future  | ⬜ not started | Blocked: QN-2. Open: Komodo front-runner or open evaluation?             |
| QN-13 | [`proposals/service-updates-proposal`](service-updates-proposal.md)                        | future  | ⬜ not started | Blocked: QN-12                                                           |
| QN-14 | [`proposals/hairball-rebuild-proposal`](hairball-rebuild-proposal.md)                      | future  | ⬜ not started | Blocked: QN-6, QN-12. Open: Debian or Ubuntu?                            |
| QN-15 | [`proposals/scanner-pi-docker-proposal`](scanner-pi-docker-proposal.md)                    | future  | ⬜ not started | Open: code home — this repo or `scanner-control-nodered`?                |
| QN-16 | [`proposals/birdpi-cleanup-proposal`](birdpi-cleanup-proposal.md)                          | future  | ⬜ not started |                                                                          |
| QN-19 | [`proposals/hass-adguard-retirement-proposal`](hass-adguard-retirement-proposal.md)        | future  | ⬜ not started | Blocked: QN-18. Open: uninstall, or leave stopped as a fallback?         |
