# Traefik Stack

## Deploy

Deploy this stack from Portainer Stack UI/API using `docker-compose.yml` in this folder.

## Purpose

Provides reverse proxy, TLS termination, and optional dashboard/whoami test routes.

## Required Environment Variables

- `HOSTNAME`
- `DOMAIN`
- `FQDN`
- `CLOUDFLARE_DNS_API_TOKEN`
- `CLOUDFLARE_EMAIL`

## Optional Environment Variables

- `HOST_DATA_PATH` (default: `/data/traefik`)
- `TRAEFIK_LOG_LEVEL` (default: `INFO`)
- `CLOUDFLARE_ACME_SERVER` (default: LetsEncrypt production URL)

## Host Setup

```bash
sudo mkdir -p /data/traefik/letsencrypt
sudo sh -c 'echo {} > /data/traefik/letsencrypt/acme.json'
sudo chown -R 1000:1000 /data/traefik
sudo chmod 600 /data/traefik/letsencrypt/acme.json
```

## Host Requirements

- Ports `80/tcp` and `443/tcp` open to clients.
- Port `853/tcp` open if you route DNS-over-TLS through Traefik.

## Notes

- Stack expects Docker network `proxy` (compose declares it by name).
- Dashboard host rules use `proxy.${HOSTNAME}` and `proxy.${FQDN}`.
