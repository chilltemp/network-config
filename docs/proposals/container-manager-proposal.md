# Container manager proposal

**Queue:** QN-12 · **Affects:** Portainer Server and agents on every host, every stack README's Deploy
section, this repo's "Portainer manages lifecycle" rules, Unraid-managed containers

## Why

Portainer is focusing on enterprise customers and will give the community edition minimal support.
The operator is considering Komodo or something else. This repo encodes Portainer throughout:
`AGENTS.md`, every stack README, and the GitOps-mode deploy habit.

## Requirements

- **REQ-CM-01 — Criteria first.** Agree the criteria before comparing:
  - GitOps from this repo's compose files.
  - Multi-host agents that stay on the LAN.
  - Env values and secrets kept outside git.
  - Update detection.
  - No cloud or licence check needed to run.
  - Local auth or OIDC.
  - Its own state is easy to back up.
  - Healthy community support.
- **REQ-CM-02 — Compare.** Compare Komodo, Dockge, Arcane, Portainer CE (staying put) and a plain
  compose + git-pull approach against the criteria.
- **REQ-CM-03 — Unraid boundary.** Decide which containers on the Unraid hosts stay as Unraid
  templates, and which move to the manager.
- **REQ-CM-04 — Migration shape, if switching.** Migrate host by host and stack by stack, keeping
  Portainer until the last stack moves.
- **REQ-CM-05 — Rules follow.** Update `AGENTS.md`, the Ansible guardrails, and
  each README's Deploy section in the same change as the switch. That change is the exception to
  "don't mass-normalize compose files", and it touches Deploy sections only.

## Non-goals

- Kubernetes.
- Moving stacks between hosts.

## Offline behavior

Running stacks don't depend on the manager. The manager itself must start and work with the WAN
down.

## Depends on

QN-2, which shows what each host runs and how it is deployed.

## Open questions

1. Is Komodo the front-runner, or is this an open evaluation?
2. Must Unraid-managed containers move at all?
3. Should the switch happen before QN-14 (hairball rebuild), so that hairball is built on the new
   manager?
