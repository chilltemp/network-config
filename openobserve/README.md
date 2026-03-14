# OpenObserve Stack

## Deploy

Deploy this stack from Portainer Stack UI/API using `docker-compose.yml` in this folder.

## Purpose

Runs OpenObserve and syslog-ng for log ingestion and visualization.

## Required Environment Variables

- `ZO_ROOT_USER_EMAIL`
- `ZO_ROOT_USER_PASSWORD`
- `FQDN`

## Optional Environment Variables

- `HOST_DATA_PATH` (default: `/data/openobserve`)

## Host Setup

```bash
sudo mkdir -p /data/openobserve /data/openobserve/syslog-ng
sudo chown -R 1000:1000 /data/openobserve
```

## Host Requirements

- Host ports for syslog ingestion:
- `514/udp`
- `601/tcp`
- `6514/tcp`

## Notes

- Stack expects Docker networks `proxy` and `openobserve`.
- Syslog ports are published directly on host:
  - UDP `514` -> container `5514`
  - TCP `601` -> container `6601`
  - TCP `6514` (TLS)
