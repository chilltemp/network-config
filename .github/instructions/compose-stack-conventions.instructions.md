---
description: "Use when editing docker-compose stacks in this repo. Covers Portainer-first runtime conventions, Traefik networking patterns, and safe change boundaries."
name: "Compose Stack Conventions"
applyTo: "*/docker-compose.yml"
---

# Compose Stack Conventions

- Top-level stack folders are standalone services. Avoid mass-normalizing compose files across the repo unless explicitly requested.
- Runtime stack lifecycle is managed in Portainer UI/API, not by Ansible.
- Preserve existing stack-specific env vars, labels, and host storage paths.
- Treat repository env values as reference documentation; deployed runtime values are typically entered in Portainer Stack UI.
- Preserve Traefik-centric patterns when present:
  - Shared proxy network usage.
  - Existing Traefik labels and certresolver settings.
  - For new Traefik servers, ensure host entries are added in AdGuardHome for FQDN routing.
- Keep image pinning posture consistent. Do not switch pinned images to floating latest tags unless requested.
- Preserve Oversized-LLM guardrails for relevant stacks:
  - Keep Ollama exposure constrained to Tailscale binding behavior.
  - Keep Portainer Agent LAN-only and independent of Tailscale.
- Link to stack READMEs for service-specific prerequisites instead of duplicating details.
