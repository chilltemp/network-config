# Copilot Instructions

## Repository Usage

- This repo is a multi-host homelab configuration repo.
- Most top-level service folders are standalone Docker Compose stacks for hosts other than Oversized-LLM:
  - [traefik](traefik)
  - [adguard-home](adguard-home)
  - [linkwarden](linkwarden)
  - [openobserve](openobserve)
  - [birdnet-go](birdnet-go)
  - [birdnet-pi](birdnet-pi)
  - [git-sync](git-sync)
- [ollama](ollama) is the active Ollama stack source.
- [portainer](portainer) is the active Portainer Agent stack source.
- Oversized-LLM host prerequisites are managed by Ansible in [Ansible](Ansible).
- Stack/container lifecycle is managed in Portainer (UI/API), not by Ansible.
- [windows-scripts](windows-scripts) contains Windows-to-Debian boot control scripts for the dual-boot machine.

## Session Decisions (March 11, 2026)

- Scope is Oversized-LLM first. Do not refactor unrelated service stacks unless explicitly requested.
- Oversized-LLM should run only these two containers:
  - ollama_server
  - portainer_agent
- Do not deploy a local Portainer Server on Oversized-LLM.
- Central Portainer Server already exists and remains authoritative.
- Portainer Agent must not depend on Tailscale.
- Portainer Agent connectivity is LAN-only from the central Portainer Server.
- Tailscale is used only for Ollama access.
- Store sensitive values in Ansible Vault, including:
  - tailscale_auth_key
  - portainer_agent_secret
- Windows remains the default boot target.
- Debian boot support must include:
  - one-time boot into Debian
  - optional persistent Debian mode on command
  - explicit rollback to Windows default

## Ansible Direction For Oversized-LLM

- Use role/playbook model under [Ansible](Ansible).
- Use [Ansible/playbooks/provision_gpu_server.yml](Ansible/playbooks/provision_gpu_server.yml) for base host provisioning.
- Do not use Ansible to create/update/delete containers or stacks.
- [Ansible/playbooks/deploy_ollama.yml](Ansible/playbooks/deploy_ollama.yml) and [Ansible/playbooks/deploy_portainer.yml](Ansible/playbooks/deploy_portainer.yml) intentionally fail with guidance.
- [Ansible/playbooks/site.yml](Ansible/playbooks/site.yml) should include only provisioning playbooks, not stack deployment playbooks.
- Keep firewall intent from [Ansible/roles/base/tasks/main.yml](Ansible/roles/base/tasks/main.yml):
  - allow SSH from management LAN
  - allow Ollama port from Tailscale subnet only
  - allow Portainer Agent port from central Portainer Server LAN IP only
  - deny other inbound traffic by default

## Session Learnings (March 13, 2026)

- User explicitly changed direction to prerequisites-only Ansible.
- Removed Ansible stack/container roles for Oversized-LLM:
  - `Ansible/roles/ollama_service`
  - `Ansible/roles/portainer_agent`
  - `Ansible/roles/portainer_stack_api`
- Top-level stack compose files are now the source of truth for these services:
  - [ollama/docker-compose.yml](ollama/docker-compose.yml)
  - [portainer/docker-compose.yml](portainer/docker-compose.yml)
- Every stack folder now has its own README with env vars and host setup steps.
- Ansible secrets template is now [Ansible/secrets/vault.template.yml](Ansible/secrets/vault.template.yml).
- Tailscale hardening for Ollama requires binding the published port to Tailscale IP via:
  - `OLLAMA_BIND_IP` in [ollama/docker-compose.yml](ollama/docker-compose.yml)
- Portainer behavior clarification:
  - Endpoint add wizard may not prompt for `AGENT_SECRET`.
  - `AGENT_SECRET` must be configured on Portainer Server deployment.
  - `PORTAINER_AGENT_SECRET` must be set in Portainer Agent stack env vars.

## Compose Stack Conventions Across Repo

- Traefik-centric routing:
  - Multiple stacks join a shared Docker network named proxy.
  - Many services use Traefik labels and cloudflare certresolver.
- Env files in this repo are reference-only documentation.
- Runtime environment variables are set manually in Portainer Stack UI and are the authoritative source.
- Most stacks persist data under configurable host paths, commonly via HOST_DATA_PATH.
- Stack-specific READMEs are authoritative for per-stack setup steps, required vars, and host permissions.
- Some stacks require host-level prerequisites:
  - network aliasing for adguard-home
  - device mounts for bird audio stacks
  - writable certificate/data directories for traefik
- Do not assume all stacks run on one host.

## Service Notes From Current Repo

- [traefik/docker-compose.yml](traefik/docker-compose.yml): shared edge proxy, Cloudflare DNS challenge, whoami test route.
- [adguard-home/docker-compose.yml](adguard-home/docker-compose.yml): binds DNS ports to a specific host IP and integrates with Traefik for dashboard/DoT routing.
- [linkwarden/docker-compose.yml](linkwarden/docker-compose.yml): app + postgres + meilisearch + optional pgadmin, Traefik labels enabled.
- [openobserve/docker-compose.yml](openobserve/docker-compose.yml): OpenObserve + syslog-ng with ingestion ports and proxy route.
- [birdnet-go/docker-compose.yml](birdnet-go/docker-compose.yml): nightly image, audio device mount, proxy route.
- [birdnet-pi/docker-compose.yml](birdnet-pi/docker-compose.yml): privileged container and audio integrations for Pi-focused deployment.
- [git-sync/docker-compose.yml](git-sync/docker-compose.yml): periodic sync sidecar pattern for repository pull workflows.
- [ollama/docker-compose.yml](ollama/docker-compose.yml): GPU-enabled Ollama with Tailscale-IP-bound publish via `OLLAMA_BIND_IP`.
- [portainer/docker-compose.yml](portainer/docker-compose.yml): Portainer Agent with required `PORTAINER_AGENT_SECRET`.

## Guardrails For Future Changes

- Do not mass-normalize all compose files unless explicitly requested.
- Preserve stack-specific env vars, labels, and storage paths.
- Treat repo env placeholders as examples; do not assume they are deployed as .env files.
- Keep image tags pinned where already pinned; avoid introducing latest tags without user approval.
- Do not commit plaintext secrets.
- Do not reintroduce Ansible-managed stack/container lifecycle unless user asks.
- Do not reintroduce local Portainer Server on Oversized-LLM unless user asks.
- Do not route Portainer Agent traffic through Tailscale unless user asks.
- Do not broaden Ollama exposure beyond Tailscale without explicit approval.
- Do not remove `OLLAMA_BIND_IP` requirement from Ollama stack without explicit approval.
- Preserve Windows-default boot policy unless explicitly changed by user.
