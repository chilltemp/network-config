# Forgejo Stack

Self-hosted [Forgejo](https://forgejo.org/) Git server with SQLite and optional Git LFS.

## Deploy

Create this stack from the **Portainer UI in GitOps (repository) mode**, pointing it at this
repo and `forgejo/docker-compose.yml`, with env vars entered in the UI. This is the only way to
use Portainer's GitOps auto-update feature — do **not** deploy via CLI/API.

## Purpose

Runs Forgejo on the high-CPU app server with all live data (repos, LFS objects, SQLite DB,
config) on the host SSD. A bundled [Ofelia](https://github.com/mcuadros/ofelia) scheduler runs a
nightly `forgejo dump` to a CIFS volume backed by the Unraid Samba share (already cloud-backed),
and prunes old dumps.

- **HTTPS** (web UI, Git over HTTPS, LFS) is routed through Traefik on `FQDN`.
- **Git over SSH** is published directly on host port `2222` (it does not — and cannot usefully
  — route through Traefik, since plain SSH has no Host header / TLS SNI for Traefik to match on).

## Required Environment Variables

- `FQDN` — e.g. `forgejo.<app-server-host>.home-lan.net`
- `SMB_HOST` — Unraid host/IP serving the backup share
- `SMB_SHARE` — Samba share name for dumps
- `SMB_USERNAME`
- `SMB_PASSWORD`

## Optional Environment Variables

- `HOST_DATA_PATH` (default: `/data/forgejo`)
- `SSH_PORT` (default: `2222`)
- `LFS_ENABLED` (default: `false`; set `true` to enable the Git LFS server)
- `DISABLE_REGISTRATION` (default: `true`; set `false` to allow self-service signup)
- `BACKUP_RETENTION_DAYS` (default: `14`)

## Host Setup

```bash
sudo mkdir -p /data/forgejo
sudo chown -R 1000:1000 /data/forgejo
```

The host also needs CIFS support (`cifs-utils` on most distros) for the `backup-smb` volume.

## Host Requirements

- Docker networks `proxy` and `forgejo` (compose declares both by name).
- Traefik fronting the app server (the stack uses the shared `proxy` network + `cloudflare`
  certresolver).
- AdGuardHome DNS A/CNAME for `FQDN` → app server. Keep it **local / not Cloudflare-proxied** so
  large LFS uploads aren't subject to Cloudflare's request-size cap.
- Host port `SSH_PORT` (default `2222`) free for git-over-SSH (the host's own admin `sshd` keeps
  port 22).

## First Run

Config is declarative (`INSTALL_LOCK=true`), so the web installer is skipped. Create the first
admin user via the CLI, then sign in at `https://<FQDN>/`:

```bash
docker exec -u git forgejo forgejo admin user create \
  --admin --username <admin> --email <admin@example.com> --random-password
```

Clone URLs:

- HTTPS — `https://<FQDN>/<owner>/<repo>.git`
- SSH — `ssh://git@<FQDN>:2222/<owner>/<repo>.git`

## Git LFS

Off by default. To enable, set `LFS_ENABLED=true` and redeploy, then per repo:

```bash
git lfs install
git lfs track "*.bin"
```

## Backups & Restore

Ofelia runs `forgejo dump` nightly at 03:00 into the SMB-mounted `/backups`, producing
`forgejo-dump-<timestamp>.tar.zst`; a 03:30 job deletes dumps older than `BACKUP_RETENTION_DAYS`.
Trigger a dump manually with:

```bash
docker exec -u git -w /backups forgejo forgejo dump -c /data/gitea/conf/app.ini --type tar.zst
```

To restore, stop the stack, unpack a dump into a fresh `HOST_DATA_PATH` (repos under `repos/`,
the SQLite DB and `app.ini` into place), fix ownership to `1000:1000`, and start the stack.

## Notes

- Image is pinned to Forgejo `15.0.3` (current stable; `11.x` is the LTS line). Keep images
  pinned — no floating `latest`.
- LFS, when enabled, rides the HTTPS router through Traefik (not SSH).
