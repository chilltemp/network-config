---
description: "Use when touching Ansible/, ollama/ or portainer/, or when a task names Oversized-LLM, oversized, Ollama, OLLAMA_BIND_IP, the Portainer Agent, Tailscale, the firewall, inbound ports or exposure. Covers scope, the allowed stacks, firewall intent and exposure limits for Oversized-LLM."
paths:
  - 'Ansible/**'
  - 'ollama/**'
  - 'portainer/**'
---

# Oversized-LLM Guardrails

Dormant until QN-11: the host is offline, but every rule here still binds any change to these files. ([why](../../docs/agents/rationale/oversized-llm.rationale.md#dormant-until-qn-11)) `AGENTS.md` holds the global rules.

## Scope

- <a id="scope"></a>Keep scope focused on Oversized-LLM unless explicitly asked to modify other stacks. A `QN-` queue row naming other hosts or stacks counts as that request.
- Oversized-LLM active stack sources are [ollama](../../ollama) and [portainer](../../portainer).
- Host prerequisites for Oversized-LLM are managed in [Ansible](../../Ansible).

## Runtime

- Oversized-LLM should run only these stacks, managed in Portainer:
  - `ollama_server`
  - `portainer_agent`
- Do not deploy a local Portainer Server on Oversized-LLM.

## Exposure

- Keep Portainer Agent LAN-only and independent of Tailscale.
- Use Tailscale only for Ollama access.
- Do not broaden Ollama exposure beyond Tailscale without explicit approval.
- Preserve `OLLAMA_BIND_IP` behavior for Ollama unless explicitly asked to change it.

## Firewall

Preserve firewall intent in [Ansible/roles/base/tasks/main.yml](../../Ansible/roles/base/tasks/main.yml):

- SSH from management LAN only
- Ollama port from Tailscale subnet only
- Portainer Agent port from central Portainer Server LAN IP only
- deny other inbound traffic by default
