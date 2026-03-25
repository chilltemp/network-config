# Focuuus AI Stack

## Deploy

Deploy this stack from Portainer Stack UI/API using docker-compose.yml in this folder.

## Purpose

Runs Ollama, Open WebUI, and Fooocus together behind an existing Traefik proxy network.

## Required Environment Variables

- WEBUI_SECRET_KEY
- FQDN_WEBUI
- FQDN_FOOOCUS

## Optional Environment Variables

- HOST_DATA_PATH (default: /data/focuuus-ai)
- OLLAMA_IMAGE (default: ollama/ollama:0.17.7)
- OPEN_WEBUI_IMAGE (default: ghcr.io/open-webui/open-webui:main)
- OLLAMA_BASE_URL (default: http://ollama:11434)
- OLLAMA_CONTEXT_LENGTH (default: 4096; safe baseline for RTX 3080 10GB)
- OLLAMA_GPU_COUNT (default: 1)
- FOOOCUS_GPU_COUNT (default: 1)
- ENABLE_SIGNUP (default: false)
- TRAEFIK_CERTRESOLVER (default: cloudflare)

## Host Setup

```bash
sudo mkdir -p /data/focuuus-ai/ollama /data/focuuus-ai/open-webui /data/focuuus-ai/fooocus
sudo chown -R 1000:1000 /data/focuuus-ai
```

## Host Requirements

- Docker network proxy (compose declares it by name).
- NVIDIA runtime support on hosts where GPU acceleration is desired.

## Notes

- This stack intentionally does not include Traefik, and assumes your existing Traefik stack handles routing and TLS.
- Fooocus image is set to the upstream project image: ghcr.io/lllyasviel/fooocus.
- For local Ollama on an RTX 3080 10GB, a safe default context length is 4096.
