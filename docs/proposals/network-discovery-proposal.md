# Network discovery proposal

**Queue:** QN-2 · **Affects:** every host. Read-only.

## Why

No complete map of the network exists. The security, backup, DNS, proxy and upgrade proposals all
start from the same questions: what runs where, how it is reached, and what protects it. Discovery
answers those questions once, in a form that can be refreshed.

Hosts known from the operator's 2026-11-01 brain dump (local-only,
`private/handoffs/2026-11-01-network-stuff-i-remember.md`):
furball (Unraid NAS, primary AdGuard), hairball (Unraid, secondaries), oldmac (Ubuntu on a T2 Mac),
the Home Assistant Pi 5, the scanner Pi 4, birdpi, PiKVM, the Unifi controller, and oversized /
oversized-llm (dual boot, usually Windows). AdGuard's client list shows more than one subnet and
several unidentified devices.

## Requirements

- **REQ-DISC-01 — Host inventory.** For each host: name, role, hardware, OS and version, address, how
  it is managed, criticality, and what breaks while it is down.
- **REQ-DISC-02 — Service inventory.** For each service: host, how it is deployed (Portainer stack,
  Unraid template, native or systemd), image and version, URLs, proxy (Traefik, nginx or none), TLS,
  auth (none, app or forward-auth), exposure (LAN, Tailscale or internet), data path, and backup
  coverage. Backup coverage is filled in by QN-5.
- **REQ-DISC-03 — DNS map.** Every AdGuard rewrite and the host it targets, the upstreams, which
  resolvers DHCP hands out, and how adguard-sync is set up. This feeds QN-6.
- **REQ-DISC-04 — Exposure map.** WAN port forwards, UPnP, Tailscale nodes and ACLs, the Cloudflare
  zone check from copilot-instructions §Internal Domain, and anything reachable from the internet.
- **REQ-DISC-05 — Drift.** Stacks that are deployed differently from this repo, and deployed stacks
  that are missing from it.
- **REQ-DISC-06 — Sources kept.** Raw exports are kept in the format QN-1 chooses, with secrets
  stripped, so the inventory can be rebuilt instead of hand-maintained.
- **REQ-DISC-07 — Refresh recipe.** A written way to re-run discovery so the inventory doesn't rot.
- **REQ-DISC-08 — Findings go private.** Missing auth, plain HTTP, open ports, default credentials
  and old versions are recorded only in the private home (QN-1). They are never recorded in this
  repo.

## Sources, read-only

| Source                           | Yields                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------- |
| Unifi controller                 | clients, DHCP reservations, networks/VLANs, port forwards, firewall, devices |
| AdGuard Home (furball + replicas) | rewrites, clients, upstreams, sync setup                                     |
| `homepage` config                | the operator's own service list                                              |
| Portainer + Unraid Docker pages  | stacks and containers per host, versions                                     |
| Traefik and nginx config         | routes, TLS, middlewares                                                     |
| Per-host shell (read-only)       | OS versions, `docker ps`, listening ports                                    |
| Active LAN scan (approval only)  | listening ports, HTTP vs HTTPS, login prompts                                |
| Tailscale admin, Cloudflare zone | nodes, ACLs, public records (should be none)                                 |
| `chillweb.net`, this repo        | how things were meant to be set up                                           |

## Non-goals

- Fixing anything that discovery finds. Fixes belong to the rows that own them.
- Upgrading the Unifi controller before its config is exported (QN-8).
- Enterprise CMDB or monitoring tooling.

## Offline behavior

Discovery runs on the LAN, and exports are stored locally.

## Depends on

QN-1, because the inventory needs a decided home.

## Open questions

1. May discovery run active scans (`nmap`) on the LAN, and when? Some cheap IoT devices misbehave
   when scanned.
2. Should Unifi and AdGuard get read-only accounts for exports, or should exports use the admin login?
3. How deep should the IoT inventory go: just named, or classified and owned?

## Notes for planning

- Discovery will take several sessions. Split the phases by source, not by host.
- Phase 0 spike: confirm that the old Unifi controller can still export clients and config, through
  the UI or its API, before planning around it.
- Unidentified devices already listed in the AdGuard troubleshooting log are good first targets.
