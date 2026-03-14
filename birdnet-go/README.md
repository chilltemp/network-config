# BirdNET-Go Stack

## Deploy

Deploy this stack from Portainer Stack UI/API using `docker-compose.yml` in this folder.

## Purpose

Runs BirdNET-Go for bird audio detection with optional Traefik exposure.

## Required Environment Variables

- `FQDN`

## Optional Environment Variables

- `HOST_DATA_PATH` (default: `/data/birdnet-go`)
- `TZ` (default: `US/Eastern`)
- `BIRDNET_UID` (default: `1000`)
- `BIRDNET_GID` (default: `1000`)

## Host Setup

```bash
sudo mkdir -p /data/birdnet-go/config /data/birdnet-go/data/clips
sudo chown -R 1000:1000 /data/birdnet-go
```

## Host Requirements

- ALSA audio device available at `/dev/snd`.
- Docker host gateway support for `host.docker.internal:host-gateway`.

## Notes

- Stack expects Docker network `proxy`.
- Many BirdNET tuning settings are present in compose and can be uncommented as needed.
