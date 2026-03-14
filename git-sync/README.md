# Git Sync Stack

## Deploy

Deploy this stack from Portainer Stack UI/API using `docker-compose.yml` in this folder.

## Purpose

Runs `git-sync` to periodically mirror a Git repository onto host storage.

## Required Environment Variables

- None.

## Optional Environment Variables

- `HOST_DATA_PATH` (default: `/data/network-config`)
- `GITSYNC_PERIOD` (default: `6h`)

## Host Setup

```bash
sudo mkdir -p /data/network-config
sudo chown -R 1000:1000 /data/network-config
```

## Host Requirements

- Outbound network access to `https://github.com/chilltemp/home-network.git`.

## Notes

- Current compose tracks `https://github.com/chilltemp/home-network.git` on branch `main`.
- Output is available through symlink path `/git/sync` inside the container.
