# Traefik consolidation proposal

**Queue:** QN-9 · **Affects:** nginx (wherever it runs), the [`traefik`](../../traefik/README.md) stack
on each host, every service reached over plain HTTP, AdGuard rewrites

## Why

The network runs both nginx and Traefik, and Traefik is preferred. nginx serves some internal
services over HTTPS. It also runs a string-replacement hack so that Uptime Kuma pages can be embedded
in iframes (documented on `chillweb.net`). Some services are still reached over plain HTTP.

## Requirements

- **REQ-PROXY-01 — Every nginx route moves.** Each nginx route from QN-2 gets a Traefik equivalent on
  the host that runs the service, plus its AdGuard record, following the existing per-host pattern.
- **REQ-PROXY-02 — The rewrite hack is replaced or dropped.** Replace it with a Traefik middleware or
  plugin, or drop it if it's no longer needed. Plugins are fetched at startup by default, so a plugin
  must be vendored locally to meet the offline requirement.
- **REQ-PROXY-03 — HTTPS for plain-HTTP services.** Services reached over plain HTTP get HTTPS through
  Traefik. Where feasible, the direct `host:port` path is closed or bound to localhost.
- **REQ-PROXY-04 — Certificates match the documented rule.** copilot-instructions §Internal Domain
  says to use one `*.home-lan.net` wildcard. But
  [`traefik/docker-compose.yml:60-61`](../../traefik/docker-compose.yml) also requests `${FQDN}` and
  `*.${FQDN}` on each host, and service names are two levels deep (`adguard.furball.home-lan.net`),
  which a `*.home-lan.net` cert doesn't cover. Reconcile the two, and update whichever one is wrong.
- **REQ-PROXY-05 — Non-HTTP stays explicit.** DNS-over-TLS, Forgejo's SSH, and database ports are
  each listed as a Traefik TCP route or a direct port.
- **REQ-PROXY-06 — Exceptions are recorded.** Devices that can't sit behind a proxy, such as the
  Unifi controller, PiKVM or printers, each get a recorded decision.
- **REQ-PROXY-07 — nginx is gone.** Remove its container or stack, its records and its docs.

## Non-goals

- Auth (QN-10).
- New services.
- Normalizing every compose file. That is against the compose-stack conventions.

## Offline behavior

Traefik keeps serving its existing certs offline. Renewal needs the internet within the certificate's
lifetime. Plugins are vendored so that startup doesn't need the internet.

## Depends on

QN-2, for the nginx route list and the plain-HTTP list.

## Open questions

1. Per-host wildcard certs or one shared cert? This decides REQ-PROXY-04. Per-host wildcards publish
   each host name in Certificate Transparency logs.
2. Is the Uptime Kuma iframe embedding still wanted?

## Notes for planning

Run the crt.sh check from copilot-instructions §Internal Domain first. It shows which certs have
actually been issued.
