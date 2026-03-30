# Project Guidelines

## Repository Scope

- This repository manages a multi-host homelab.
- Most top-level service folders are standalone Docker Compose stacks for hosts other than Oversized-LLM.
- Oversized-LLM active stack sources are [ollama](../ollama) and [portainer](../portainer).
- Host prerequisites for Oversized-LLM are managed in [Ansible](../Ansible).
- Stack/container lifecycle is managed in Portainer (UI/API), not by Ansible.

## Architecture

- Provisioning layer: [Ansible](../Ansible) roles/playbooks configure host baseline, Docker, NVIDIA runtime, Tailscale, and firewall rules.
- Runtime layer: top-level compose folders define service stacks and are deployed via Portainer.
- Separation of concerns is intentional:
  - Ansible handles host state.
  - Portainer handles container and stack lifecycle.

## Build And Test

- There is no traditional app build/test pipeline in this repo.
- Main provisioning flow:
  - Follow [Ansible/README.md](../Ansible/README.md) for SSH setup, inventory, and vault setup.
  - Run `ansible-playbook playbooks/provision_gpu_server.yml --ask-vault-pass` from [Ansible](../Ansible).
- Encrypt secrets with ansible-vault and keep secret values out of plaintext files.

## Conventions

- Each service folder README is the source of truth for that stack's prerequisites and variables.
- Environment values documented in repo files are reference-only; runtime values are typically entered in Portainer Stack UI.
- Many stacks rely on host path variables (for example `HOST_DATA_PATH`) and stack-specific host prerequisites.
- Traefik-centric networking is common across stacks (shared `proxy` network and labels where applicable).
- When setting up Traefik on a new server, include the host in AdGuardHome DNS records for required FQDN routing.

## Oversized-LLM Guardrails

- Keep scope focused on Oversized-LLM unless explicitly asked to modify other stacks.
- Oversized-LLM should run only:
  - `ollama_server`
  - `portainer_agent`
- Do not deploy a local Portainer Server on Oversized-LLM.
- Keep Portainer Agent LAN-only and independent of Tailscale.
- Use Tailscale only for Ollama access.
- Preserve firewall intent in [Ansible/roles/base/tasks/main.yml](../Ansible/roles/base/tasks/main.yml):
  - SSH from management LAN only
  - Ollama port from Tailscale subnet only
  - Portainer Agent port from central Portainer Server LAN IP only
  - deny other inbound traffic by default

## Change Safety Rules

- Do not use Ansible to create/update/delete containers or stacks.
- Do not reintroduce removed service-deployment roles/playbooks without explicit request.
- Do not broaden Ollama exposure beyond Tailscale without explicit approval.
- Preserve `OLLAMA_BIND_IP` behavior for Ollama unless explicitly asked to change it.
- Do not commit plaintext secrets.
- Avoid mass-normalizing compose files unless explicitly requested.

## Key References

- Provisioning workflow: [Ansible/README.md](../Ansible/README.md)
- Primary provisioning playbook: [Ansible/playbooks/provision_gpu_server.yml](../Ansible/playbooks/provision_gpu_server.yml)
- Ollama stack details: [ollama/README.md](../ollama/README.md)
- Portainer Agent details: [portainer/README.md](../portainer/README.md)
- Traefik and networking patterns: [traefik/README.md](../traefik/README.md)
