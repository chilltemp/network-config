# Home Assistant AdGuard retirement proposal

**Queue:** QN-19 · **Affects:** the AdGuard Home add-on on Home Assistant; `homepage` on furball and
hairball; DHCP on the Unifi gateway

## Why

The AdGuard Home add-on on Home Assistant is deprecated. The operator plans to disable it eventually
in favour of the household AdGuard servers on furball, hairball and oldmac, so that DNS filtering
lives in one set of servers kept in step by adguard-sync.

## Requirements

- **REQ-HADNS-01 — Nothing depends on it.** Before it is turned off, no client, DHCP scope or
  service still uses this instance for DNS.
- **REQ-HADNS-02 — Nothing is lost.** Any rule, rewrite or client setting that exists only on this
  instance is either moved to the household servers or deliberately dropped, and the choice is
  recorded.
- **REQ-HADNS-03 — Disabled.** The add-on is stopped and kept from starting at boot, and it stays
  that way through a Home Assistant restart.
- **REQ-HADNS-04 — References removed.** `homepage` entries and widgets for this instance, its
  monitoring checks and its credentials are removed.
- **REQ-HADNS-05 — Recorded.** The DNS records in the private docs home show it as retired.

## Non-goals

- Changing Home Assistant itself, or how it is hosted.
- Moving VLAN clients to the household servers. That is QN-18.

## Offline behavior

DNS on every VLAN keeps working with the WAN down once this instance is gone, because the household
servers answer local names on their own.

## Depends on

QN-18, which moves the IoT network onto the household servers.

## Open questions

1. Once it is disabled, should the add-on be uninstalled, or left stopped for a while as a fallback?

## Notes for planning

- Phase 0 spike: list what still points at this instance by reading its query log, then let that
  log go quiet for a set period before disabling it.
- Home Assistant's own DNS setting must point at a household server before the add-on stops.
- These changes touch a live host, so [Live-Host Safety](../../.claude/rules/planning.md#live-host-safety) applies.
