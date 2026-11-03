# Project Guidelines

The core rules for every agent in this repo. They override generic defaults.

## Repository Scope

- This repository manages a multi-host homelab.
- Most top-level service folders are standalone Docker Compose stacks for hosts other than Oversized-LLM.
- Stack/container lifecycle is managed in Portainer, not by Ansible.

## Architecture

- Provisioning layer: [Ansible](Ansible) roles/playbooks configure host baseline, Docker, NVIDIA runtime, Tailscale, and firewall rules (`roles/base`, `roles/docker`, `roles/nvidia_gpu`, `roles/tailscale`). The active path is `playbooks/provision_gpu_server.yml`. Ansible is a special, narrow use case today (host prep for Oversized-LLM), not stack management.
- Runtime layer: top-level compose folders (`ollama/`, `portainer/`, `traefik/`, `adguard-home/`, `linkwarden/`, `birdnet-*/`, etc.) define service stacks and are deployed via Portainer. The network spans multiple hosts, including an Unraid box running many of these images.
- Networking: Traefik is the common reverse proxy. Stacks share a `proxy` network and use Traefik labels and a Cloudflare ACME certresolver.
- Per-stack source of truth: each service folder's `README.md` documents that stack's required/optional env vars, host path prerequisites (e.g. `HOST_DATA_PATH`) and host setup. Link to those rather than duplicating details.
- Separation of concerns is intentional:
  - Ansible handles host state.
  - Portainer handles container and stack lifecycle.

## Commands

There is no traditional app build/test pipeline in this repo. The only automated workflow is host provisioning, run from the [Ansible](Ansible) directory. Follow [Ansible/README.md](Ansible/README.md) for SSH setup, inventory, and vault setup.

```bash
# One-time SSH/inventory/vault setup is documented in Ansible/README.md
ansible-playbook playbooks/provision_gpu_server.yml --ask-vault-pass   # provision Oversized-LLM host baseline
ansible-vault edit secrets/<file>.yml                                   # edit encrypted secrets
```

- Encrypt secrets with ansible-vault and keep secret values out of plaintext files.
- <a id="portainer-gitops"></a>Stacks are deployed from the Portainer UI in GitOps (repository) mode, pointing at this repo and the `docker-compose.yml` in each service folder, with env vars entered in the UI, not from the CLI. A new stack's README, or one you touch, says this. ([why](docs/agents/rationale/agents.rationale.md#portainer-gitops))
- After editing an instruction file, run the guard by hand: `node tooling/agent-guard/check.mjs`. Nothing runs it automatically.

## Collaboration Preference

- Don't assume when requirements are ambiguous. Ask clarifying questions until you are confident; batch 3–5 focused questions per round, with no overall cap.
- When several valid approaches exist, present concise options and ask.
- Prefer explicit confirmation over inferred intent for scope, naming, and any change to a live host.
- **Exception — breakage with evidence:** given a concrete failure (error, log, failing check), investigate and fix it without hand-holding — but disruptive steps on live hosts still need the operator (see [Live-Host Safety](.claude/rules/planning.md#live-host-safety)).

## Agent Workflow

- **Plan first** for any non-trivial task (3+ steps, ambiguity, or a change to a live host). If something goes sideways, stop and re-plan.
- **Delegate exploration** to read-only sub-agents where your tool has them, one task each, to keep the main context clean.
- **Scratch goes in `.tmp/`:** sub-agent briefs, downloads, exports, rendered previews and any other scratch go in the repo's gitignored `.tmp/<task>/` — ⛔ never `/tmp` or another path outside the repo. Outside the working directory, every agent read or write needs a permission approval.
- Give each download its own new empty folder in `.tmp/`. `.tmp/` is disposable: anything worth keeping moves into a real doc.
- **Lessons:** check [docs/ai-lessons.md](docs/ai-lessons.md) before implementing. After any user correction, capture the pattern there and promote a durable rule ([Lessons Inbox](.claude/rules/editing.md#lessons-inbox)).
- **Verification before done:** prove it with evidence — command output, `dig`, screenshots, exports. Ask: "would a careful sysadmin sign off on this?"
- **The queue:** [docs/proposals/_implementation-order.md](docs/proposals/_implementation-order.md) is the to-do list; ids are `QN-<n>`. A `QN-` row that names other hosts or stacks is the explicit request the [Oversized-LLM scope guardrail](.claude/rules/oversized-llm.md#scope) asks for.
- <a id="commit-to-main"></a>**Commit on `main`:** no feature branch, and only when the operator asks. Pushing needs its own explicit ask. ([why](docs/agents/rationale/agents.rationale.md#commit-to-main))
- ⛔ **Wrong session:** queue ids are per repo — `QN-<n>` here, `QK-<n>` in `karens-database`, `QR-<n>` in `readingorder.info-2025`. An id with another repo's prefix, or one not in [the queue](docs/proposals/_implementation-order.md), means the wrong session. **Stop and say so; never look for a near match.**

<a id="docs-lifecycle"></a>

## Docs Lifecycle

- [docs/index.md](docs/index.md) — curated index of every doc in `docs/`. Update it whenever a doc is added, moved, archived, or re-scoped.
- `docs/proposals/` — unbuilt work as `REQ-` requirements, one queue row each ([proposals.md](.claude/rules/proposals.md)). Proposals, not plans.
- `docs/plans/` — multi-phase implementation plans, one per proposal, written in their own session ([planning.md](.claude/rules/planning.md)). They stay live until the operator asks to archive them; then `git mv` to `docs/archive/plans/` and repoint inbound links.
- `docs/handoffs/` — snapshots taken to be carried elsewhere; deliberately **not** maintained to reality.
- Service-folder READMEs stay the source of truth for each stack; plans link to them rather than duplicating.
- ⛔ This repo is public. Until QN-1 decides the private docs home, docs here carry no per-service security findings (missing auth, plain HTTP, open ports, old versions) — see [Public Safety](.claude/rules/proposals.md#public-safety).
- `private/` (gitignored) — local-only notes that must not be published, until QN-1 picks a private home. Not in git, so it has no history and exists only on this machine. Name a file there as a code span; never link to it from a tracked file, because the link breaks on GitHub.

## Rule files

Claude Code loads these automatically when you touch a matching file. If your tool does not, read the file yourself before you start.

| When you… | Read |
| --------- | ---- |
| author or work a plan, read or update the queue, or see a `QN-<n>` id in a prompt | `.claude/rules/planning.md` |
| author or revise a proposal in `docs/proposals/` | `.claude/rules/proposals.md` |
| edit `AGENTS.md`, `CLAUDE.md`, a rule, a rationale file, a repo skill, the guard or `docs/ai-lessons.md`, or are asked to codify a rule | `.claude/rules/editing.md` |
| edit anything under `Ansible/`, or run a playbook or `ansible-vault` | `.claude/rules/ansible-safety.md` |
| edit a stack's `docker-compose.yml`, or add a stack | `.claude/rules/compose-stack-conventions.md` |
| touch `Ansible/`, `ollama/` or `portainer/`, or a task names Oversized-LLM, `oversized`, Ollama, `OLLAMA_BIND_IP`, the Portainer Agent, Tailscale, the firewall, inbound ports or exposure | `.claude/rules/oversized-llm.md` |

## Conventions

- Each service folder README is the source of truth for that stack's prerequisites and variables.
- Environment values documented in repo files are reference-only; runtime values are typically entered in Portainer Stack UI.
- Many stacks rely on host path variables (for example `HOST_DATA_PATH`) and stack-specific host prerequisites.
- Traefik-centric networking is common across stacks (shared `proxy` network and labels where applicable).
- When setting up Traefik on a new server, include the host in AdGuardHome DNS records for required FQDN routing.
- Keep instructions, handoffs, and investigation logs in discoverable repo files, not in agent memory. Multiple agents work in this repo, and memory is only visible to the agent that wrote it.
- ⛔ A troubleshooting or investigation log that names household devices, people or LAN IPs goes in the gitignored `private/` folder at its repo path (e.g. `private/adguard-home/troubleshooting-log.md`), never in tracked files. The stack's README says where the log is, without linking to it.
- `_IDEAS_/` holds reference/sample AI-instruction material only; it is not active project guidance.

<a id="internal-domain"></a>

## Internal Domain (`home-lan.net`)

- `home-lan.net` is internal-only. It was registered on 2024-09-27 through Cloudflare, which also hosts its zone. That public zone deliberately has no A/AAAA/MX/TXT records, including no wildcard record.
- Host records exist only on the homelab's own DNS servers (AdGuardHome). No `*.home-lan.net` name resolves on public resolvers.
- TLS uses a single `*.home-lan.net` wildcard certificate (Let's Encrypt, DNS-01 via Cloudflare). Prefer the wildcard over per-host certificates, because every per-host certificate publishes its hostname in public Certificate Transparency logs.
- Committing `home-lan.net` hostnames and internal URLs is acceptable: the names are unreachable without the internal DNS. This does not relax the plaintext-secrets rule.
- Do not add public records to the Cloudflare zone, add a per-host certificate, or expose an internal host publicly, without explicit approval.
- Certificate Transparency entries dated before 2024-09-27 (bare `home-lan.net` only, 2023-04 to 2024-05) belong to a previous registrant and are not part of this setup.
- To check public exposure, run `dig +short @1.1.1.1 <name>.home-lan.net` (should return nothing) and search crt.sh for `%.home-lan.net` (should show only `home-lan.net` and `*.home-lan.net`).

## Change Safety Rules

- Do not use Ansible to create/update/delete containers or stacks.
- Do not reintroduce removed service-deployment roles/playbooks without explicit request.
- Do not commit plaintext secrets. Secret values live in `ansible-vault`-managed files. Repo `.env` and READMEs are reference-only (`.env` is gitignored).
- Avoid mass-normalizing compose files unless explicitly requested.
- Keep image pinning (no floating `latest`) unless explicitly requested.
- Every change to a live host follows [Live-Host Safety](.claude/rules/planning.md#live-host-safety).

## Agent Skills (`agent-skills/`)

- [agent-skills](agent-skills) holds machine-wide skills for Claude Code and Codex (`next-phase`, `adversarial-review`), kept as one generic copy. [agent-skills/README.md](agent-skills/README.md) is the source of truth for setup and for what a repo must provide.
- They are not homelab infrastructure: they run against the git repo of the caller's current directory. That is this repo only when the caller is in it; its queue uses `QN-`.
- `install.sh` links them into `~/.agents/skills`, `~/.claude/skills` and `~/.claude-secondary/skills`, and writes `~/.codex/rules/agent-skills.rules`. Re-run it after adding a skill; never hand-edit the links or the rules file.
- Keep each `SKILL.md`, script and brief generic: no repo names, user names or expanded home paths. A `SKILL.md` names its script by `~/.agents/skills/<skill>/scripts/…`, and tells Codex to write the home directory out, because only the absolute path matches the Codex rule.
- This repo is public. Nothing private goes in a skill or its README.

## Key References

- Provisioning workflow: [Ansible/README.md](Ansible/README.md)
- Primary provisioning playbook: [Ansible/playbooks/provision_gpu_server.yml](Ansible/playbooks/provision_gpu_server.yml)
- Ollama stack details: [ollama/README.md](ollama/README.md)
- Portainer Agent details: [portainer/README.md](portainer/README.md)
- Traefik and networking patterns: [traefik/README.md](traefik/README.md)
