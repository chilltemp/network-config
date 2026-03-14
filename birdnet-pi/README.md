# BirdNET-Pi Stack

## Deploy

Deploy this stack from Portainer Stack UI/API using `docker-compose.yml` in this folder.

## Purpose

Runs BirdNET-Pi with direct audio device access.

## Required Environment Variables

- `HOST_DATA_PATH`

## Optional Environment Variables

- `HOSTNAME` (used only if you enable commented Traefik host rule labels)
- `FQDN` (used only if you enable commented Traefik FQDN labels)

## Host Setup

```bash
sudo mkdir -p /data/birdnet-pi/config /data/birdnet-pi/ssl
```

If you use a custom path, set `HOST_DATA_PATH` to that same parent path.

## Host Requirements

- Audio device available at `/dev/snd`.
- PulseAudio socket and cookie mounted from host:
  - `/tmp/pulseaudio.socket`
  - `/tmp/pulseaudio.cookie`
- PulseAudio client config file available:
  - `/etc/pulse/client.conf`

## Notes

- Container runs privileged and adds `audio` group.
- Traefik labels are present but commented out in compose.
