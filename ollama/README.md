# Ollama Stack

## Deploy

Deploy this stack from Portainer Stack UI/API using `docker-compose.yml` in this folder.

## Purpose

Runs Ollama with GPU access and persistent model storage.

## Required Environment Variables

- `OLLAMA_BIND_IP` (set to host Tailscale IPv4, for example `100.x.y.z`)

## Optional Environment Variables

- `OLLAMA_IMAGE` (default: `ollama/ollama:0.12.2`)
- `OLLAMA_CONTAINER_NAME` (default: `ollama_server`)
- `OLLAMA_PORT` (default: `11434`)
- `OLLAMA_GPU_COUNT` (default: `1`)
- `HOST_DATA_PATH` (default: `/data/ollama`)

## Host setup

```bash
sudo mkdir -p /data/ollama/storage
```

## Host Requirements

- Docker with NVIDIA runtime available.

## Security intent

- Ollama should be reachable only via Tailscale.
- Use host firewall to allow `11434/tcp` only from `100.64.0.0/10`.
- Compose binds Ollama to `OLLAMA_BIND_IP` to avoid exposing on all host interfaces.

## Notes

- Health check uses `ollama list` because the upstream image may not include `curl`.
