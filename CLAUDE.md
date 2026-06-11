# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Mandatory Context

Before starting any task, read `.github/copilot-instructions.md`. It is the source of truth for repository scope, architecture, change-safety rules, and the Oversized-LLM guardrails. Rules there override any generic defaults. This repo is also used with GitHub Copilot — keep both agents in sync by editing the shared instruction files, not this file.

When `/init` is invoked, update `.github/copilot-instructions.md` and the relevant `.github/instructions/*.instructions.md` file(s) — not this file — so all agents see the change.

## Critical Rules (from copilot-instructions.md)

- **Two layers, strictly separated**: Ansible provisions *host* state only; Portainer manages *container/stack* lifecycle. Never add Ansible tasks/roles/playbooks that create, update, or delete containers or stacks.
- **Oversized-LLM** should run only `ollama_server` and `portainer_agent`. No local Portainer Server on that host.
- **Exposure boundaries**: Ollama is reachable only via Tailscale (preserve `OLLAMA_BIND_IP`); Portainer Agent stays LAN-only and independent of Tailscale. Don't broaden Ollama exposure without explicit approval.
- **Firewall intent** in `Ansible/roles/base/tasks/main.yml` must be preserved: SSH from management LAN only, Ollama port from Tailscale subnet only, Portainer Agent port from the central Portainer Server LAN IP only, deny other inbound by default.
- **Secrets**: never commit plaintext secrets. Secret values live in `ansible-vault`-managed files; repo `.env` and READMEs are reference-only (`.env` is gitignored). Runtime values are entered in the Portainer Stack UI.
- **Compose stacks** are standalone — don't mass-normalize compose files across the repo, and keep image pinning (no floating `latest`) unless explicitly requested.

## Scoped Rules (load before working in these areas)

| Scenario                                              | File                                                                  |
| ----------------------------------------------------- | --------------------------------------------------------------------- |
| Editing any `*/docker-compose.yml` stack              | `.github/instructions/compose-stack-conventions.instructions.md`      |
| Editing anything under `Ansible/**`                   | `.github/instructions/ansible-safety.instructions.md`                 |

For reviewing infra changes, an `infra-reviewer` agent definition exists at `.github/agents/infra-reviewer.agent.md` (Copilot agent; checks exposure/firewall/secret regressions and the Ansible-vs-Portainer boundary).

## Commands

There is no app build/test pipeline. The only automated workflow is host provisioning (run from the `Ansible/` directory):

```bash
# One-time SSH/inventory/vault setup is documented in Ansible/README.md
ansible-playbook playbooks/provision_gpu_server.yml --ask-vault-pass   # provision Oversized-LLM host baseline
ansible-vault edit secrets/<file>.yml                                   # edit encrypted secrets
```

Stacks themselves are deployed from the Portainer Stack UI/API using the `docker-compose.yml` in each service folder — not from the CLI.

## Architecture

- **Provisioning layer** — `Ansible/` roles/playbooks configure the host baseline: Docker, NVIDIA runtime, Tailscale, and firewall (`roles/base`, `roles/docker`, `roles/nvidia_gpu`, `roles/tailscale`). The active path is `playbooks/provision_gpu_server.yml`. Ansible is a special, narrow use case today (host prep for Oversized-LLM), not stack management.
- **Runtime layer** — each top-level folder (`ollama/`, `portainer/`, `traefik/`, `adguard-home/`, `linkwarden/`, `birdnet-*/`, etc.) is a standalone Docker Compose stack deployed via Portainer. The network spans multiple hosts including an Unraid box running many of these images.
- **Networking** — Traefik is the common reverse proxy: stacks share a `proxy` network and use Traefik labels + a Cloudflare ACME certresolver. When standing up Traefik on a new host, add the host's FQDN to AdGuardHome DNS records so routing resolves.
- **Per-stack source of truth** — each service folder's `README.md` documents that stack's required/optional env vars, host path prerequisites (e.g. `HOST_DATA_PATH`), and host setup. Link to those rather than duplicating details.

## Notes

- `_IDEAS_/` holds reference/sample AI-instruction material only; it is not active project guidance.
