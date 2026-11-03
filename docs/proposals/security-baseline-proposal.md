# Security baseline proposal

**Queue:** QN-7 · **Affects:** every host and service, the router/gateway, Tailscale, the Cloudflare
zone

## Why

The target is home-network-grade security that keeps working offline. Today there is no written
standard, so "secured" means different things per service. This row writes the standard and takes
the quick wins. The two large pieces have their own rows: HTTPS everywhere through Traefik (QN-9)
and auth on every service (QN-10).

## Requirements

- **REQ-SEC-01 — Written standard.** A short baseline. A generic version may be public; the
  per-service status is private (QN-1). The standard says:
  - Every web UI uses HTTPS with the wildcard cert.
  - Every service requires a login.
  - No default credentials.
  - Admin UIs are reachable only on the LAN or Tailscale.
  - Nothing is internet-exposed without explicit approval.
  - SSH uses keys only.
  - Hosts receive security updates.
- **REQ-SEC-02 — Perimeter.** Audit and fix WAN port forwards, UPnP, internet reachability of admin
  UIs (the Unifi controller especially), Tailscale ACLs, and the empty-Cloudflare-zone check.
- **REQ-SEC-03 — High-value targets first.** These are, in order:
  - PiKVM: full console and power control of furball.
  - The Unifi controller.
  - Portainer: the docker socket on every host means root.
  - The Unraid web UIs.
  - AdGuard: control of DNS.
  - Home Assistant.

  For each: non-default credentials, and local TOTP where offered.
- **REQ-SEC-04 — Patch sweep.** Bring exposed and critical components to supported versions: Unraid,
  AdGuard, Traefik, PiKVM, HA OS and Pi OS. The Unifi controller has its own row (QN-8), and the
  ongoing process is QN-13.
- **REQ-SEC-05 — Secrets hygiene.** List where secrets live, and confirm that none is in plaintext in
  this repo or its history.
- **REQ-SEC-06 — Offline-safe controls.** No control depends on a cloud service: no cloud SSO, no
  Cloudflare Access, and TOTP rather than push approval.

## Non-goals

- Enterprise tooling (SIEM, IDS, zero trust).
- HTTPS migration (QN-9) and the auth rollout (QN-10).
- A network redesign, unless the operator puts segmentation in scope (open question 1).

## Offline behavior

Every control in the baseline keeps working with the WAN down.

## Depends on

QN-2, for the exposure map and the service list.

## Open questions

1. Is IoT segmentation (a VLAN for cameras, TV and cheap devices) in scope at home grade?
2. Is a password manager the source of truth for credentials today?
3. Is any service intentionally reachable from the internet today?
4. Should the existing Ansible `base` role become a host baseline for every Linux host? That would
   change the Ansible scope rules.

## Notes for planning

Public safety: the per-service gap list belongs in the private docs home, never in this repo (see
[`proposals.md`](../../.claude/rules/proposals.md#public-safety)).
