---
description: "Use when editing docker-compose stacks in this repo. Covers Portainer-first runtime conventions, Traefik networking patterns, and safe change boundaries."
paths:
  - '**/docker-compose.yml'
---

# Compose Stack Conventions

Rules for each stack's `docker-compose.yml`. `AGENTS.md` holds the global rules.

- Top-level stack folders are standalone services. Avoid mass-normalizing compose files across the repo unless explicitly requested.
- Runtime stack lifecycle is managed in Portainer (UI, GitOps mode), not by Ansible.
- Preserve existing stack-specific env vars, labels, and host storage paths.
- Treat repository env values as reference documentation; deployed runtime values are typically entered in Portainer Stack UI.
- Preserve Traefik-centric patterns when present:
  - Shared proxy network usage.
  - Existing Traefik labels and certresolver settings.
  - For new Traefik servers, ensure host entries are added in AdGuardHome for FQDN routing.
- Keep image pinning posture consistent. Do not switch pinned images to floating latest tags unless requested.
- Oversized-LLM stacks keep their exposure limits → [oversized-llm.md](oversized-llm.md).
- Link to stack READMEs for service-specific prerequisites instead of duplicating details.
