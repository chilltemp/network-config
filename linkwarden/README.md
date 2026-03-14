# Linkwarden Stack

## Deploy

Deploy this stack from Portainer Stack UI/API using `docker-compose.yml` in this folder.

## Purpose

Runs Linkwarden with PostgreSQL, Meilisearch, and optional pgAdmin.

## Required Environment Variables

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `MEILI_MASTER_KEY`
- `FQDN`

## Optional Environment Variables

- `POSTGRES_DB` (recommended; compose has a fallback)
- `HOST_DATA_PATH` (default: `/data/linkwarden`)
- `PGADMIN_DEFAULT_EMAIL`
- `PGADMIN_DEFAULT_PASSWORD`

## Host Setup

```bash
sudo mkdir -p /data/linkwarden/data /data/linkwarden/postgres /data/linkwarden/meilisearch
sudo chown -R 1000:1000 /data/linkwarden
```

## Host Requirements

- Docker networks `proxy` and `linkwarden` (compose declares both by name).

## Notes

- pgAdmin is `restart: no` and is intended for on-demand use.
