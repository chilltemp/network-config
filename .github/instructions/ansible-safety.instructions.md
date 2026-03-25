---
description: "Use when editing Ansible playbooks, roles, inventory, or vault files for this repo. Enforces provisioning-only scope, firewall intent, and secret safety for Oversized-LLM."
name: "Ansible Safety"
applyTo: "Ansible/**"
---

# Ansible Safety Guidelines

- Treat Ansible as host provisioning only. Do not add tasks, roles, or playbooks that create, update, or delete containers or Docker stacks.
- Keep the active provisioning path centered on [Ansible/playbooks/provision_gpu_server.yml](../../Ansible/playbooks/provision_gpu_server.yml).
- Preserve firewall intent from [Ansible/roles/base/tasks/main.yml](../../Ansible/roles/base/tasks/main.yml):
  - SSH only from management LAN.
  - Ollama port only from the Tailscale subnet.
  - Portainer Agent port only from the central Portainer Server LAN IP.
  - Deny other inbound traffic by default.
- Keep Oversized-LLM runtime model unchanged: only ollama_server and portainer_agent stacks managed in Portainer.
- Keep Tailscale usage limited to Ollama access. Portainer Agent must stay LAN-only.
- Keep secrets in ansible-vault managed files. Never write plaintext secret values into inventory, playbooks, or READMEs.
- Prefer linking to authoritative docs over duplicating process detail:
  - [Ansible/README.md](../../Ansible/README.md)
  - [Ansible/playbooks/provision_gpu_server.yml](../../Ansible/playbooks/provision_gpu_server.yml)
