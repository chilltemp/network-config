# DNS resilience proposal

**Queue:** QN-6 · **Affects:** AdGuard Home on furball, hairball and oldmac; adguard-sync; DHCP on
the router/Unifi; Traefik routing on each host

## Why

When furball is down, `*.home-lan.net` names stop resolving, while public names keep resolving
through the network's other DNS servers. AdGuard replicas already run on hairball and oldmac, kept in
step by adguard-sync, so the cause isn't obvious. Candidates:

- DHCP hands out furball plus a resolver that is not AdGuard.
- Rewrites don't reach the replicas.
- The names do resolve, but point at services that run on, or are proxied through, furball.

## Requirements

- **REQ-DNS-01 — Known cause.** Establish the cause from QN-2's DNS map plus one controlled test.
- **REQ-DNS-02 — No single DNS host.** With any one host down, local names still resolve. That needs
  at least two AdGuard instances, on different hosts, both handed out by DHCP.
- **REQ-DNS-03 — Fallbacks understood.** Any resolver in the DHCP list that is not AdGuard is either
  removed or kept as a recorded trade-off. A public fallback keeps the internet working, but skips
  filtering and local names.
- **REQ-DNS-04 — Sync is visible.** Rewrites and rules reach every replica, and a sync failure gets
  noticed.
- **REQ-DNS-05 — Routing doesn't funnel through furball.** Each host's names point at that host's own
  Traefik, unless a recorded reason says otherwise.
- **REQ-DNS-06 — Recorded.** The DHCP DNS options and the replica layout are written up in the
  private docs home.

## Non-goals

- Replacing AdGuard Home.
- Public DNS records. These are forbidden by copilot-instructions §Internal Domain.
- Stopping clients that bypass local DNS (DoH, iCloud Private Relay).

## Offline behavior

Local names must resolve with the WAN down. AdGuard rewrites are local, so verify that this holds,
and record what clients see when the upstreams fail.

## Depends on

QN-2, for the DNS map.

## Open questions

1. Should the gateway or router be in the DHCP DNS list at all?
2. Should oldmac's replica be handed out by DHCP, or stay a warm spare?
3. Where does adguard-sync run? If it runs on furball, sync pauses when furball is down. Is that
   acceptable?

## Notes for planning

Finish this before QN-14 (hairball rebuild), because hairball hosts a replica.
