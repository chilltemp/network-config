---
description: "Create or refresh a stack README for a top-level compose service using this repo's conventions."
name: "New Stack README"
argument-hint: "Stack folder name and service purpose"
agent: "agent"
tools: [read, search, edit]
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
  - Deployment in Portainer
  - Networking and Traefik notes
  - Data persistence and host paths
  - Validation and troubleshooting
- Keep security posture aligned with workspace guardrails, especially around exposure and secrets.

Before writing:

- Inspect at least two existing stack READMEs for style and structure.
- Reuse terminology already established in this repository.
