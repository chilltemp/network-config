# Oversized-LLM retirement proposal

**Queue:** QN-11 · **Affects:** `oversized` (Windows gaming PC with the Linux dual boot),
[`Ansible`](../../Ansible/README.md), [`ollama`](../../ollama/README.md),
[`focuuus-ai`](../../focuuus-ai/README.md), [`windows-scripts`](../../windows-scripts), Portainer, monitors,
this repo's agent instructions

## Why

The oversized-llm experiment is over: the hardware isn't adequate for a local LLM. The Linux side is
still installed, but the machine only boots Windows now, so it always shows as offline. Meanwhile,
most of this repo's agent instructions are Oversized-LLM guardrails (`CLAUDE.md`,
copilot-instructions, `ansible-safety.instructions.md`). Ansible exists only for this host.

## Requirements

- **REQ-OLLM-01 — Park or retire.** The operator chooses:
  - **(a) Park.** Mark the host dormant, keep the install and the docs.
  - **(b) Retire.** Remove the Linux install, and archive `Ansible/`, `ollama/`, `focuuus-ai/` and
    `windows-scripts/`.
- **REQ-OLLM-02 — Stop the noise.** Remove or pause its monitors, its Portainer environment, its
  homepage tile, and, if retired, its AdGuard record and Tailscale node.
- **REQ-OLLM-03 — Instructions match reality.** Agent instructions stop carrying active guardrails
  for a dormant host. Either trim them, or mark them dormant in one place.
- **REQ-OLLM-04 — Windows unaffected.** The Windows boot, and the Acronis jobs that run on
  `oversized` (QN-5), keep working.
- **REQ-OLLM-05 — Reusable parts kept.** If QN-14 (hairball) or QN-7 wants the Ansible `base`,
  `docker` or `tailscale` roles, keep them, generalized rather than deleted.

## Non-goals

- Changing the Windows setup or the Acronis jobs.

## Offline behavior

No effect.

## Depends on

Nothing.

## Open questions

1. Park or retire?
2. Should the Ansible roles be kept as a general host baseline?
