# AdGuard Home Stack

## Deploy

Deploy this stack from Portainer Stack UI/API using `docker-compose.yml` in this folder.

## Purpose

Runs AdGuard Home with DNS and DNS-over-TLS routing through Traefik.

## Required Environment Variables

- `IP` (host IP to bind DNS/DoT ports)
- `FQDN`

## Optional Environment Variables

- `HOST_DATA_PATH` (default: `/data/adguard`)
- `ADGUARD_PORT` (default: `80`; set `3000` during first-time setup if needed)

## Host Setup

```bash
sudo mkdir -p /data/adguard/work /data/adguard/conf
```

## Host Requirements

- Port bindings on `${IP}` for DNS and DoT:
- `53/tcp`
- `53/udp`
- `784/udp`
- `853/tcp`

## Network setup note

If you want AdGuard on a dedicated LAN IP, add a secondary IP to the host network interface (see comments in compose file for netplan example).

## Notes

- Stack expects Docker network `proxy`.
- DNS ports are published on `${IP}`.
