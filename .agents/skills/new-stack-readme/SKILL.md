---
name: new-stack-readme
description: "Create or refresh a stack README for a top-level compose service using this repo's conventions."
argument-hint: "Stack folder name and service purpose"
---

Create or update a README for the requested top-level stack folder.

Requirements:

- Follow conventions used by existing stack docs in this workspace.
- Include only practical sections that help deploy safely in Portainer.
- Prefer links to existing docs over duplicated background content.

Output requirements:

- Provide a complete README draft in markdown.
- Include these sections when relevant:
  - Overview
  - Prerequisites
  - Required variables
  - Deployment in Portainer: from the Portainer UI in GitOps (repository) mode, pointing at this repo and the folder's `docker-compose.yml`, with env vars entered in the UI, not from the CLI ([rule](../../../AGENTS.md#portainer-gitops))
  - Networking and Traefik notes
  - Data persistence and host paths
  - Validation and troubleshooting
- Keep security posture aligned with the guardrails in [AGENTS.md](../../../AGENTS.md), especially around exposure and secrets.

Before writing:

- Inspect at least two existing stack READMEs for style and structure.
- Reuse terminology already established in this repository.
