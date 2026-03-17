# Ollama Stack

## Deploy

Deploy this stack from Portainer Stack UI/API using `docker-compose.yml` in this folder.

## Purpose

Runs Ollama with GPU access and persistent model storage.

## Required Environment Variables

- `OLLAMA_BIND_IP` (set to host Tailscale IPv4, for example `100.x.y.z`)

## Optional Environment Variables

- `OLLAMA_IMAGE` (default: `ollama/ollama:0.17.7`)
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

## Troubleshooting

If stack deploy fails with:

`could not select device driver "nvidia" with capabilities: [[gpu]]`

the host Docker engine does not currently have a working NVIDIA runtime.

### Quick checks on the host

```bash
nvidia-smi
docker info | grep -i runtime
docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi
```

Expected results:

- `nvidia-smi` shows your GPU details.
- `docker info` lists `nvidia` in available runtimes.
- The CUDA test container prints GPU info.

### Fix with this repo's Ansible

From [Ansible](../Ansible), run:

```bash
ansible-playbook playbooks/provision_gpu_server.yml --ask-vault-pass
```

This installs/updates the NVIDIA driver and container toolkit, configures Docker runtime, and validates GPU availability.

### If Docker runtime still missing

Restart Docker and retry:

```bash
sudo systemctl restart docker
docker info | grep -i runtime
```

Then redeploy the stack in Portainer.

## Security intent

- Ollama should be reachable only via Tailscale.
- Use host firewall to allow `11434/tcp` only from `100.64.0.0/10`.
- Compose binds Ollama to `OLLAMA_BIND_IP` to avoid exposing on all host interfaces.

## Notes

- Health check uses `ollama list` because the upstream image may not include `curl`.

- Testing with Talescale IP
  `curl http://100.86.151.98:11434/api/tags`
