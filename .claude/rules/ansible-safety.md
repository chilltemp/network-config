---
description: "Use when editing Ansible playbooks, roles, inventory, or vault files for this repo. Enforces provisioning-only scope and secret safety for Oversized-LLM."
paths:
  - 'Ansible/**'
---

# Ansible Safety Guidelines

Rules for `Ansible/**`. `AGENTS.md` holds the global rules.

- Treat Ansible as host provisioning only. Do not add tasks, roles, or playbooks that create, update, or delete containers or Docker stacks.
- Keep the active provisioning path centered on [Ansible/playbooks/provision_gpu_server.yml](../../Ansible/playbooks/provision_gpu_server.yml).
- Oversized-LLM firewall intent, runtime model and exposure limits → [oversized-llm.md](oversized-llm.md).
- Keep secrets in ansible-vault managed files. Never write plaintext secret values into inventory, playbooks, or READMEs.
- Prefer linking to authoritative docs over duplicating process detail:
  - [Ansible/README.md](../../Ansible/README.md)
  - [Ansible/playbooks/provision_gpu_server.yml](../../Ansible/playbooks/provision_gpu_server.yml)
