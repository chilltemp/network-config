# QN-17 — rule ledger

The zero-drops evidence for the [agent instructions migration](../plans/agent-instructions-migration-plan.md)
(D2): every rule in a touched file, and where it went. `How` is one of: kept · moved · duplicate of … ·
changed (D#) · changed (drift) · promoted from memory · retired (D#). `moved (repointed)` means the rule
text moved with only its paths or links changed.

## Phase 2 — Move every rule file, one core

Rows are built from the pre-move commit `0d39078`, one per list item, paragraph or table row. A `moved`
row was matched by text against the target file; every other row was mapped by hand. Unchanged in this
phase: `.vscode/settings.json`, `_IDEAS_/`, `.github/agents/`, `.github/prompts/`, `.github/hooks/`.

### `.github/copilot-instructions.md`

| Before (file §section · first words) | After (file §section) | Rationale anchor | How |
| ---- | ---- | ---- | ---- |
| copilot-instructions.md §Repository Scope · this repository manages a multi-host homelab. | AGENTS.md §Repository Scope | — | moved |
| copilot-instructions.md §Repository Scope · most top-level service folders are standalone | AGENTS.md §Repository Scope | — | moved |
| copilot-instructions.md §Repository Scope · oversized-llm active stack sources are ollama | AGENTS.md §Repository Scope | — | moved |
| copilot-instructions.md §Repository Scope · host prerequisites for oversized-llm are managed | AGENTS.md §Repository Scope | — | moved |
| copilot-instructions.md §Repository Scope · stack/container lifecycle is managed in portainer | AGENTS.md §Repository Scope | — | moved |
| copilot-instructions.md §Architecture · provisioning layer: ansible roles/playbooks configure host | AGENTS.md §Architecture | — | moved (repointed) |
| copilot-instructions.md §Architecture · runtime layer: top-level compose folders define | AGENTS.md §Architecture | — | kept, merged with CLAUDE.md §Architecture runtime layer |
| copilot-instructions.md §Architecture · separation of concerns is intentional: | AGENTS.md §Architecture | — | moved |
| copilot-instructions.md §Architecture · ansible handles host state. | AGENTS.md §Architecture | — | moved |
| copilot-instructions.md §Architecture · portainer handles container and stack lifecycle. | AGENTS.md §Architecture | — | moved |
| copilot-instructions.md §Build And Test · there is no traditional app build/test | AGENTS.md §Commands | — | moved |
| copilot-instructions.md §Build And Test · main provisioning flow: | AGENTS.md §Commands | — | kept, merged with CLAUDE.md §Commands |
| copilot-instructions.md §Build And Test · follow ansible/readme.md for ssh setup, inventory, | AGENTS.md §Commands | — | moved |
| copilot-instructions.md §Build And Test · run ansible-playbook playbooks/provision_gpu_server.yml --ask-vault-pass from ansible. | AGENTS.md §Commands (bash block) | — | duplicate of CLAUDE.md §Commands block |
| copilot-instructions.md §Build And Test · encrypt secrets with ansible-vault and keep | AGENTS.md §Commands | — | moved |
| copilot-instructions.md §Collaboration Preference · don't assume when requirements are ambiguous. | AGENTS.md §Collaboration Preference | — | moved |
| copilot-instructions.md §Collaboration Preference · when several valid approaches exist, present | AGENTS.md §Collaboration Preference | — | moved |
| copilot-instructions.md §Collaboration Preference · prefer explicit confirmation over inferred intent | AGENTS.md §Collaboration Preference | — | moved |
| copilot-instructions.md §Collaboration Preference · exception — breakage with evidence: given | AGENTS.md §Collaboration Preference | — | moved (repointed) |
| copilot-instructions.md §Agent Workflow · plan first for any non-trivial task | AGENTS.md §Agent Workflow | — | moved |
| copilot-instructions.md §Agent Workflow · delegate exploration to read-only sub-agents where | AGENTS.md §Agent Workflow | — | moved |
| copilot-instructions.md §Agent Workflow · scratch goes in .tmp/: sub-agent briefs, | AGENTS.md §Agent Workflow | — | moved (repointed) |
| copilot-instructions.md §Agent Workflow · lessons: check docs/ai-lessons.md before implementing. after | AGENTS.md §Agent Workflow | — | moved (repointed) |
| copilot-instructions.md §Agent Workflow · verification before done: prove it with | AGENTS.md §Agent Workflow | — | moved |
| copilot-instructions.md §Agent Workflow · the queue: docs/proposals/_implementation-order.md is the to-do | AGENTS.md §Agent Workflow | — | moved |
| copilot-instructions.md §Agent Workflow · wrong session: queue ids are per | AGENTS.md §Agent Workflow | — | moved |
| copilot-instructions.md §Docs Lifecycle · docs/index.md — curated index of every | AGENTS.md §Docs Lifecycle | — | moved |
| copilot-instructions.md §Docs Lifecycle · docs/proposals/ — unbuilt work as req- | AGENTS.md §Docs Lifecycle | — | moved (repointed) |
| copilot-instructions.md §Docs Lifecycle · docs/plans/ — multi-phase implementation plans, one | AGENTS.md §Docs Lifecycle | — | moved (repointed) |
| copilot-instructions.md §Docs Lifecycle · docs/handoffs/ — snapshots taken to be | AGENTS.md §Docs Lifecycle | — | moved |
| copilot-instructions.md §Docs Lifecycle · service-folder readmes stay the source of | AGENTS.md §Docs Lifecycle | — | moved |
| copilot-instructions.md §Docs Lifecycle · this repo is public. until qn-1 | AGENTS.md §Docs Lifecycle | — | moved (repointed) |
| copilot-instructions.md §Docs Lifecycle · private/ (gitignored) — local-only notes that | AGENTS.md §Docs Lifecycle | — | moved |
| copilot-instructions.md §Scoped Instructions · instructions/planning.instructions.md — a qn- id, turning | AGENTS.md §Rule files | — | changed (D1): routing row |
| copilot-instructions.md §Scoped Instructions · instructions/proposals.instructions.md — authoring or revising a | AGENTS.md §Rule files | — | changed (D1): routing row |
| copilot-instructions.md §Scoped Instructions · instructions/editing.instructions.md — editing this file, a | AGENTS.md §Rule files | — | changed (D1): routing row |
| copilot-instructions.md §Scoped Instructions · instructions/ansible-safety.instructions.md — anything under ansible/. | AGENTS.md §Rule files | — | changed (D1): routing row |
| copilot-instructions.md §Scoped Instructions · instructions/compose-stack-conventions.instructions.md — any /docker-compose.yml. | AGENTS.md §Rule files | — | changed (D1): routing row |
| copilot-instructions.md §Conventions · each service folder readme is the | AGENTS.md §Conventions | — | moved |
| copilot-instructions.md §Conventions · environment values documented in repo files | AGENTS.md §Conventions | — | moved |
| copilot-instructions.md §Conventions · many stacks rely on host path | AGENTS.md §Conventions | — | moved |
| copilot-instructions.md §Conventions · traefik-centric networking is common across stacks | AGENTS.md §Conventions | — | moved |
| copilot-instructions.md §Conventions · when setting up traefik on a | AGENTS.md §Conventions | — | moved |
| copilot-instructions.md §Conventions · keep instructions, handoffs, and investigation logs | AGENTS.md §Conventions | — | moved (repointed) |
| copilot-instructions.md §Internal Domain (`home-lan.net`) · home-lan.net is internal-only. it was registered | AGENTS.md §Internal Domain (`home-lan.net`) | — | moved |
| copilot-instructions.md §Internal Domain (`home-lan.net`) · host records exist only on the | AGENTS.md §Internal Domain (`home-lan.net`) | — | moved |
| copilot-instructions.md §Internal Domain (`home-lan.net`) · tls uses a single .home-lan.net wildcard | AGENTS.md §Internal Domain (`home-lan.net`) | — | moved |
| copilot-instructions.md §Internal Domain (`home-lan.net`) · committing home-lan.net hostnames and internal urls | AGENTS.md §Internal Domain (`home-lan.net`) | — | moved |
| copilot-instructions.md §Internal Domain (`home-lan.net`) · do not add public records to | AGENTS.md §Internal Domain (`home-lan.net`) | — | moved (repointed) |
| copilot-instructions.md §Internal Domain (`home-lan.net`) · certificate transparency entries dated before 2024-09-27 | AGENTS.md §Internal Domain (`home-lan.net`) | — | moved |
| copilot-instructions.md §Internal Domain (`home-lan.net`) · to check public exposure, run dig | AGENTS.md §Internal Domain (`home-lan.net`) | — | moved |
| copilot-instructions.md §Oversized-LLM Guardrails · keep scope focused on oversized-llm unless | AGENTS.md §Oversized-LLM Guardrails | — | moved |
| copilot-instructions.md §Oversized-LLM Guardrails · oversized-llm should run only: | AGENTS.md §Oversized-LLM Guardrails | — | moved |
| copilot-instructions.md §Oversized-LLM Guardrails · ollama_server | AGENTS.md §Oversized-LLM Guardrails | — | moved |
| copilot-instructions.md §Oversized-LLM Guardrails · portainer_agent | AGENTS.md §Oversized-LLM Guardrails | — | moved |
| copilot-instructions.md §Oversized-LLM Guardrails · do not deploy a local portainer | AGENTS.md §Oversized-LLM Guardrails | — | moved |
| copilot-instructions.md §Oversized-LLM Guardrails · keep portainer agent lan-only and independent | AGENTS.md §Oversized-LLM Guardrails | — | moved |
| copilot-instructions.md §Oversized-LLM Guardrails · use tailscale only for ollama access. | AGENTS.md §Oversized-LLM Guardrails | — | moved |
| copilot-instructions.md §Oversized-LLM Guardrails · preserve firewall intent in ansible/roles/base/tasks/main.yml: | AGENTS.md §Oversized-LLM Guardrails | — | moved |
| copilot-instructions.md §Oversized-LLM Guardrails · ssh from management lan only | AGENTS.md §Oversized-LLM Guardrails | — | moved |
| copilot-instructions.md §Oversized-LLM Guardrails · ollama port from tailscale subnet only | AGENTS.md §Oversized-LLM Guardrails | — | moved |
| copilot-instructions.md §Oversized-LLM Guardrails · portainer agent port from central portainer | AGENTS.md §Oversized-LLM Guardrails | — | moved |
| copilot-instructions.md §Oversized-LLM Guardrails · deny other inbound traffic by default | AGENTS.md §Oversized-LLM Guardrails | — | moved |
| copilot-instructions.md §Change Safety Rules · do not use ansible to create/update/delete | AGENTS.md §Change Safety Rules | — | moved |
| copilot-instructions.md §Change Safety Rules · do not reintroduce removed service-deployment roles/playbooks | AGENTS.md §Change Safety Rules | — | moved |
| copilot-instructions.md §Change Safety Rules · do not broaden ollama exposure beyond | AGENTS.md §Change Safety Rules | — | moved |
| copilot-instructions.md §Change Safety Rules · preserve ollama_bind_ip behavior for ollama unless | AGENTS.md §Change Safety Rules | — | moved |
| copilot-instructions.md §Change Safety Rules · do not commit plaintext secrets. | AGENTS.md §Change Safety Rules | — | moved |
| copilot-instructions.md §Change Safety Rules · avoid mass-normalizing compose files unless explicitly | AGENTS.md §Change Safety Rules | — | moved |
| copilot-instructions.md §Agent Skills (`agent-skills/`) · agent-skills holds machine-wide skills for claude | AGENTS.md §Agent Skills (`agent-skills/`) | — | moved |
| copilot-instructions.md §Agent Skills (`agent-skills/`) · they are not homelab infrastructure: they | AGENTS.md §Agent Skills (`agent-skills/`) | — | moved |
| copilot-instructions.md §Agent Skills (`agent-skills/`) · install.sh links them into ~/.agents/skills, ~/.claude/skills | AGENTS.md §Agent Skills (`agent-skills/`) | — | moved |
| copilot-instructions.md §Agent Skills (`agent-skills/`) · keep each skill.md, script and brief | AGENTS.md §Agent Skills (`agent-skills/`) | — | moved |
| copilot-instructions.md §Agent Skills (`agent-skills/`) · this repo is public. nothing private | AGENTS.md §Agent Skills (`agent-skills/`) | — | moved |
| copilot-instructions.md §Key References · provisioning workflow: ansible/readme.md | AGENTS.md §Key References | — | moved |
| copilot-instructions.md §Key References · primary provisioning playbook: ansible/playbooks/provision_gpu_server.yml | AGENTS.md §Key References | — | moved |
| copilot-instructions.md §Key References · ollama stack details: ollama/readme.md | AGENTS.md §Key References | — | moved |
| copilot-instructions.md §Key References · portainer agent details: portainer/readme.md | AGENTS.md §Key References | — | moved |
| copilot-instructions.md §Key References · traefik and networking patterns: traefik/readme.md | AGENTS.md §Key References | — | moved |

### `.github/instructions/ansible-safety.instructions.md`

| Before (file §section · first words) | After (file §section) | Rationale anchor | How |
| ---- | ---- | ---- | ---- |
| ansible-safety §(lead) · treat ansible as host provisioning only. | .claude/rules/ansible-safety.md §(lead) | — | moved |
| ansible-safety §(lead) · keep the active provisioning path centered | .claude/rules/ansible-safety.md §(lead) | — | moved |
| ansible-safety §(lead) · preserve firewall intent from ansible/roles/base/tasks/main.yml: | .claude/rules/ansible-safety.md §(lead) | — | moved |
| ansible-safety §(lead) · ssh only from management lan. | .claude/rules/ansible-safety.md §(lead) | — | moved |
| ansible-safety §(lead) · ollama port only from the tailscale | .claude/rules/ansible-safety.md §(lead) | — | moved |
| ansible-safety §(lead) · portainer agent port only from the | .claude/rules/ansible-safety.md §(lead) | — | moved |
| ansible-safety §(lead) · deny other inbound traffic by default. | .claude/rules/ansible-safety.md §(lead) | — | moved |
| ansible-safety §(lead) · keep oversized-llm runtime model unchanged: only | .claude/rules/ansible-safety.md §(lead) | — | moved |
| ansible-safety §(lead) · keep tailscale usage limited to ollama | .claude/rules/ansible-safety.md §(lead) | — | moved |
| ansible-safety §(lead) · keep secrets in ansible-vault managed files. | .claude/rules/ansible-safety.md §(lead) | — | moved |
| ansible-safety §(lead) · prefer linking to authoritative docs over | .claude/rules/ansible-safety.md §(lead) | — | moved |
| ansible-safety §(lead) · ansible/readme.md | .claude/rules/ansible-safety.md §(lead) | — | moved |
| ansible-safety §(lead) · ansible/playbooks/provision_gpu_server.yml | .claude/rules/ansible-safety.md §(lead) | — | moved |

### `.github/instructions/compose-stack-conventions.instructions.md`

| Before (file §section · first words) | After (file §section) | Rationale anchor | How |
| ---- | ---- | ---- | ---- |
| compose-stack-conventions §(lead) · top-level stack folders are standalone services. | .claude/rules/compose-stack-conventions.md §(lead) | — | moved |
| compose-stack-conventions §(lead) · runtime stack lifecycle is managed in | .claude/rules/compose-stack-conventions.md §(lead) | — | moved |
| compose-stack-conventions §(lead) · preserve existing stack-specific env vars, labels, | .claude/rules/compose-stack-conventions.md §(lead) | — | moved |
| compose-stack-conventions §(lead) · treat repository env values as reference | .claude/rules/compose-stack-conventions.md §(lead) | — | moved |
| compose-stack-conventions §(lead) · preserve traefik-centric patterns when present: | .claude/rules/compose-stack-conventions.md §(lead) | — | moved |
| compose-stack-conventions §(lead) · shared proxy network usage. | .claude/rules/compose-stack-conventions.md §(lead) | — | moved |
| compose-stack-conventions §(lead) · existing traefik labels and certresolver settings. | .claude/rules/compose-stack-conventions.md §(lead) | — | moved |
| compose-stack-conventions §(lead) · for new traefik servers, ensure host | .claude/rules/compose-stack-conventions.md §(lead) | — | moved |
| compose-stack-conventions §(lead) · keep image pinning posture consistent. do | .claude/rules/compose-stack-conventions.md §(lead) | — | moved |
| compose-stack-conventions §(lead) · preserve oversized-llm guardrails for relevant stacks: | .claude/rules/compose-stack-conventions.md §(lead) | — | moved |
| compose-stack-conventions §(lead) · keep ollama exposure constrained to tailscale | .claude/rules/compose-stack-conventions.md §(lead) | — | moved |
| compose-stack-conventions §(lead) · keep portainer agent lan-only and independent | .claude/rules/compose-stack-conventions.md §(lead) | — | moved |
| compose-stack-conventions §(lead) · link to stack readmes for service-specific | .claude/rules/compose-stack-conventions.md §(lead) | — | moved |

### `.github/instructions/planning.instructions.md`

| Before (file §section · first words) | After (file §section) | Rationale anchor | How |
| ---- | ---- | ---- | ---- |
| planning §(lead) · start with the project-wide rules in | .claude/rules/planning.md (lead) | — | moved (repointed) |
| planning §(lead) · this file governs the internal structure | .claude/rules/planning.md §(lead) | — | moved (repointed) |
| planning §(lead) · adapted from karens-database and readingorder.info-2025. the | .claude/rules/planning.md §(lead) | — | moved (repointed) |
| planning §From Proposal to Plan · every queue row starts as a | .claude/rules/planning.md §From Proposal to Plan | — | moved (repointed) |
| planning §From Proposal to Plan · resolve the proposal's open questions with | .claude/rules/planning.md §From Proposal to Plan | — | moved (repointed) |
| planning §From Proposal to Plan · one proposal per planning session. never | .claude/rules/planning.md §From Proposal to Plan | — | moved |
| planning §From Proposal to Plan · a proposal marked "single session" may | .claude/rules/planning.md §From Proposal to Plan | — | moved (repointed) |
| planning §When This Applies · plans with ≥2 phases. single-step plans | .claude/rules/planning.md §When This Applies | — | moved |
| planning §When This Applies · each phase = one working session, | .claude/rules/planning.md §When This Applies | — | moved |
| planning §When This Applies · exception: §live-host safety applies to every | .claude/rules/planning.md §When This Applies | — | moved (repointed) |
| planning §Phase Anatomy · every phase carries four parts: | .claude/rules/planning.md §Phase Anatomy | — | moved |
| planning §Phase Anatomy · goal — one line. | .claude/rules/planning.md §Phase Anatomy | — | moved |
| planning §Phase Anatomy · build — steps with host names, | .claude/rules/planning.md §Phase Anatomy | — | moved |
| planning §Phase Anatomy · acceptance criteria — the "done when" | .claude/rules/planning.md §Phase Anatomy | — | moved |
| planning §Phase Anatomy · completion log — written back when | .claude/rules/planning.md §Phase Anatomy | — | moved |
| planning §Live-Host Safety · every change to a running host, | .claude/rules/planning.md §Live-Host Safety | — | moved |
| planning §Live-Host Safety · blast radius — hosts touched, expected | .claude/rules/planning.md §Live-Host Safety | — | moved |
| planning §Live-Host Safety · backup — a current backup of | .claude/rules/planning.md §Live-Host Safety | — | moved |
| planning §Live-Host Safety · rollback — written before the change, | .claude/rules/planning.md §Live-Host Safety | — | moved |
| planning §Live-Host Safety · operator gate — reboots, wipes, dns/dhcp | .claude/rules/planning.md §Live-Host Safety | — | moved |
| planning §Live-Host Safety · capture first — export the current | .claude/rules/planning.md §Live-Host Safety | — | moved |
| planning §Premise Spikes (precondition, not acceptance) · if a phase's premise is vendor | .claude/rules/planning.md §Premise Spikes (precondition, not acceptance) | — | moved |
| planning §Premise Spikes (precondition, not acceptance) · the tell is mechanical, and it | .claude/rules/planning.md §Premise Spikes (precondition, not acceptance) | — | moved |
| planning §Premise Spikes (precondition, not acceptance) · a phase 0 spike changes nothing | .claude/rules/planning.md §Premise Spikes (precondition, not acceptance) | — | moved |
| planning §Premise Spikes (precondition, not acceptance) · give it explicit pass/fail gates, and | .claude/rules/planning.md §Premise Spikes (precondition, not acceptance) | — | moved |
| planning §Premise Spikes (precondition, not acceptance) · read the vendor's docs or release | .claude/rules/planning.md §Premise Spikes (precondition, not acceptance) | — | moved |
| planning §Premise Spikes (precondition, not acceptance) · origin: readingorder.info-2025 reverted a whole phase | .claude/rules/planning.md §Premise Spikes (precondition, not acceptance) | — | moved |
| planning §Before Starting a Phase · read copilot-instructions.md + the scoped .instructions.md | .claude/rules/planning.md §Before Starting a Phase | — | moved (repointed) |
| planning §Before Starting a Phase · set the phase to 🟡 in | .claude/rules/planning.md §Before Starting a Phase | — | moved (repointed) |
| planning §Before Starting a Phase · read the completion logs of all | .claude/rules/planning.md §Before Starting a Phase | — | moved |
| planning §Before Ending a Phase (required) · evidence, not assertion. there is no | .claude/rules/planning.md §Before Ending a Phase (required) | — | moved |
| planning §Before Ending a Phase (required) · confirm the acceptance criteria with that | .claude/rules/planning.md §Before Ending a Phase (required) | — | moved |
| planning §Before Ending a Phase (required) · write back the completion log: set | .claude/rules/planning.md §Before Ending a Phase (required) | — | moved |
| planning §Before Ending a Phase (required) · if the plan text was wrong, | .claude/rules/planning.md §Before Ending a Phase (required) | — | moved |
| planning §Before Ending a Phase (required) · public-safety check: the diff carries no | .claude/rules/planning.md §Before Ending a Phase (required) | — | moved (repointed) |
| planning §Before Ending a Phase (required) · a plan's last phase sweeps the | .claude/rules/planning.md §Before Ending a Phase (required) | — | moved |
| planning §Before Ending a Phase (required) · update the plan's row in the | .claude/rules/planning.md §Before Ending a Phase (required) | — | moved |
| planning §Status Legend · ⬜ not started · 🟡 in | .claude/rules/planning.md §Status Legend | — | moved |
| planning §Status Legend · 🟡 = an agent is working | .claude/rules/planning.md §Status Legend | — | moved |
| planning §Status Legend · pausing a phase: set ⏸ in | .claude/rules/planning.md §Status Legend | — | moved |
| planning §Status Legend · resuming a ⏸ phase: read its | .claude/rules/planning.md §Status Legend | — | moved |
| planning §Status Legend · starting or ending a phase updates | .claude/rules/planning.md §Status Legend | — | moved |
| planning §Status Legend · the machine-wide next-phase skill (agent-skills/next-phase) reads | .claude/rules/planning.md §Status Legend | — | moved |
| planning §Authoring Rule · every multi-phase plan embeds this protocol | .claude/rules/planning.md §Authoring Rule | — | moved |
| planning §Status Header (once per plan) · the plan's first line after its | .claude/rules/planning.md §Status Header (once per plan) | — | moved |
| planning §The Implementation Queue · docs/proposals/_implementation-order.md is the human-readable to-do list: | .claude/rules/planning.md §(wrapped) | — | moved |
| planning §The Implementation Queue · columns are exactly \| # \| | .claude/rules/planning.md §The Implementation Queue | — | moved |
| planning §The Implementation Queue · always run prettier after editing the | .claude/rules/planning.md §The Implementation Queue | — | moved |
| planning §The Implementation Queue · # — a qn-<n> id ("queue | .claude/rules/planning.md §The Implementation Queue | — | moved |
| planning §The Implementation Queue · item — the task, as a | .claude/rules/planning.md §The Implementation Queue | — | moved |
| planning §The Implementation Queue · sprint — current · next · | .claude/rules/planning.md §The Implementation Queue | — | moved |
| planning §The Implementation Queue · status — symbol + word, one | .claude/rules/planning.md §The Implementation Queue | — | moved |
| planning §The Implementation Queue · notes — blockers, the next/remaining phase, | .claude/rules/planning.md §The Implementation Queue | — | moved (repointed) |
| planning §The Implementation Queue · three rules that shape the docs, | .claude/rules/planning.md §The Implementation Queue | — | moved |
| planning §The Implementation Queue · the table carries no history. session | .claude/rules/planning.md §The Implementation Queue | — | moved |
| planning §The Implementation Queue · an intra-task dependency is never encoded | .claude/rules/planning.md §The Implementation Queue | — | moved |
| planning §The Implementation Queue · archiving a row is an operator | .claude/rules/planning.md §The Implementation Queue | — | moved |
| planning §The Implementation Queue · a status request is a read, | .claude/rules/planning.md §The Implementation Queue | — | moved |

### `.github/instructions/proposals.instructions.md`

| Before (file §section · first words) | After (file §section) | Rationale anchor | How |
| ---- | ---- | ---- | ---- |
| proposals §(lead) · what a document in docs/proposals/ must | .claude/rules/proposals.md (lead) | — | moved (repointed) |
| proposals §(lead) · a proposal describes work that does | .claude/rules/proposals.md §(lead) | — | moved (repointed) |
| proposals §(lead) · _implementation-order.md is not a proposal. it | .claude/rules/proposals.md §(lead) | — | moved (repointed) |
| proposals §Every Proposal · file name <topic>-proposal.md. the line after | .claude/rules/proposals.md §Every Proposal | — | moved |
| proposals §Every Proposal · sections, in order: why · requirements | .claude/rules/proposals.md §Every Proposal | — | moved (repointed) |
| proposals §Every Proposal · requirements carry ids req-<area>-<nn> with a | .claude/rules/proposals.md §Every Proposal | — | moved |
| proposals §Every Proposal · offline behavior says what the result | .claude/rules/proposals.md §Every Proposal | — | moved |
| proposals §Every Proposal · home-grade, not enterprise. prefer the simplest | .claude/rules/proposals.md §Every Proposal | — | moved |
| proposals §Every Proposal · open questions are decisions the operator | .claude/rules/proposals.md §Every Proposal | — | moved |
| proposals §Every Proposal · reference other proposals by queue id | .claude/rules/proposals.md §Every Proposal | — | moved |
| proposals §Every Proposal · carry a row in _implementation-order.md and | .claude/rules/proposals.md §Every Proposal | — | moved |
| proposals §Public Safety · this repo is public. until qn-1 | .claude/rules/proposals.md §Public Safety | — | moved |
| proposals §Public Safety · no per-service security findings — which | .claude/rules/proposals.md §Public Safety | — | moved |
| proposals §Public Safety · no secrets, public ips, mac addresses, | .claude/rules/proposals.md §Public Safety | — | moved |
| proposals §Public Safety · no troubleshooting or investigation logs that | .claude/rules/proposals.md §Public Safety | — | moved |
| proposals §Public Safety · hostnames, home-lan.net names (copilot-instructions §internal domain), | .claude/rules/proposals.md §Public Safety | — | moved (repointed) |
| proposals §Public Safety · for a named host or service, | .claude/rules/proposals.md §Public Safety | — | moved |
| proposals §Public Safety · until then, local-only notes go in | .claude/rules/proposals.md §Public Safety | — | moved (repointed) |
| proposals §Keep the Q&A → Proposal → Design Split · the process that produced karens-database's best | .claude/rules/proposals.md §Keep the Q&A → Proposal → Design Split | — | moved |
| proposals §Keep the Q&A → Proposal → Design Split · ask. write questions inline in a | .claude/rules/proposals.md §Keep the Q&A → Proposal → Design Split | — | moved |
| proposals §Keep the Q&A → Proposal → Design Split · resolve. fold the _what_ and _why_ | .claude/rules/proposals.md §Keep the Q&A → Proposal → Design Split | — | moved |
| proposals §Keep the Q&A → Proposal → Design Split · split out the _how_. hardware, versions, | .claude/rules/proposals.md §Keep the Q&A → Proposal → Design Split | — | moved |
| proposals §Keep the Q&A → Proposal → Design Split · flag what did not resolve. an | .claude/rules/proposals.md §Keep the Q&A → Proposal → Design Split | — | moved |
| proposals §Keep the Q&A → Proposal → Design Split · when a question gets two different | .claude/rules/proposals.md §Keep the Q&A → Proposal → Design Split | — | moved |
| proposals §References · ../copilot-instructions.md — workspace-wide defaults. | .claude/rules/proposals.md §References | — | moved (repointed) |
| proposals §References · planning.instructions.md — the queue format and | .claude/rules/proposals.md §References | — | moved (repointed) |
| proposals §References · ../../docs/index.md — the curated index every | .claude/rules/proposals.md §References | — | moved |

### `.github/instructions/editing.instructions.md`

| Before (file §section · first words) | After (file §section) | Rationale anchor | How |
| ---- | ---- | ---- | ---- |
| editing §(lead) · authoritative reference for editing copilot-instructions.md, scoped | .claude/rules/editing.md (lead) | — | changed (D1): new paths |
| editing §Where Rules Live · several agents work this repo: claude | .claude/rules/editing.md §Where Rules Live | — | moved (repointed) |
| editing §Where Rules Live · .github/copilot-instructions.md → global rules: scope, architecture, | .claude/rules/editing.md §Where Rules Live | — | changed (D1): AGENTS.md |
| editing §Where Rules Live · .github/instructions/<topic>.instructions.md → one area's rules, loaded | .claude/rules/editing.md §Where Rules Live | — | changed (D1): .claude/rules/, paths: |
| editing §Where Rules Live · claude.md → claude code entry point: | .claude/rules/editing.md §Where Rules Live | — | changed (D1): @AGENTS.md + notes; /init line kept |
| editing §Where Rules Live · docs/ai-lessons.md → staging for new lessons, | .claude/rules/editing.md §Where Rules Live | — | kept, sibling wording |
| editing §Where Rules Live · never in agent memory. memory is | .claude/rules/editing.md §Where Rules Live | — | moved |
| editing §Externalization Rule · domain-specific addition >5 lines → .github/instructions/<topic>.instructions.md | .claude/rules/editing.md §Externalization Rule | — | changed (D1): rule file |
| editing §Externalization Rule · copilot-instructions.md gets a one-line pointer in | .claude/rules/editing.md §Externalization Rule | — | changed (D1): routing row, four-part new area |
| editing §Externalization Rule · an addition spanning unrelated domains is | .claude/rules/editing.md §Externalization Rule | — | kept |
| editing §Topic-File Header Convention · open with the frontmatter block (description, | .claude/rules/editing.md §Topic-File Header Convention | — | changed (D1): description, paths |
| editing §Topic-File Header Convention · first sentence states the file's domain | .claude/rules/editing.md §Topic-File Header Convention | — | changed (D1): AGENTS.md |
| editing §Style Rules (every instruction file) · short, direct sentences. cut filler words. | .claude/rules/editing.md §Style Rules (every instruction file) | — | moved |
| editing §Style Rules (every instruction file) · no explanations unless the rationale changes | .claude/rules/editing.md §Style Rules (every instruction file) | — | moved |
| editing §Style Rules (every instruction file) · technical terms exact. code blocks unchanged | .claude/rules/editing.md §Style Rules (every instruction file) | — | moved |
| editing §Style Rules (every instruction file) · prioritize: [thing] [action] [result]. | .claude/rules/editing.md §Style Rules (every instruction file) | — | moved |
| editing §Style Rules (every instruction file) · use symbols where clear: →, =, | .claude/rules/editing.md §Style Rules (every instruction file) | — | moved |
| editing §Style Rules (every instruction file) · non-negotiable: zero rule drops — every | .claude/rules/editing.md §Style Rules (every instruction file) | — | moved |
| editing §Self-Improvement Loop · after any user correction or agent | .claude/rules/editing.md §Lessons Inbox | — | moved: Self-Improvement Loop merged into Capture |
| editing §Self-Improvement Loop · capture the pattern in docs/ai-lessons.md. | .claude/rules/editing.md §Lessons Inbox | — | moved |
| editing §Self-Improvement Loop · promote a durable rule into the | .claude/rules/editing.md §Lessons Inbox | — | moved |
| editing §Self-Improvement Loop · prune the staging note once the | .claude/rules/editing.md §Lessons Inbox | — | moved |
| editing §Cross-Reference Discipline · when content moves between instruction files, | .claude/rules/editing.md §Cross-Reference Discipline | — | changed (D5): grep + guard's link check |
| editing §Cross-Reference Discipline · a new scoped file gets an | .claude/rules/editing.md §Cross-Reference Discipline | — | changed (D1): routing table only |
| editing §Cross-Reference Discipline · a git mv of a doc | .claude/rules/editing.md §Cross-Reference Discipline | — | moved |

### `CLAUDE.md`

| Before (file §section · first words) | After (file §section) | Rationale anchor | How |
| ---- | ---- | ---- | ---- |
| CLAUDE.md §(lead) · this file provides guidance to claude | — | — | retired (D1): CLAUDE.md is an import plus notes |
| CLAUDE.md §Mandatory Context · before starting any task, read .github/copilot-instructions.md. | AGENTS.md (lead), CLAUDE.md line 1 | — | changed (D1, D4): import replaces the instruction; override line kept; Copilot sync retired |
| CLAUDE.md §Mandatory Context · when /init is invoked, update .github/copilot-instructions.md | CLAUDE.md, .claude/rules/editing.md §Where Rules Live | — | changed (D1) |
| CLAUDE.md §Critical Rules (from copilot-instructions.md) · two layers, strictly separated: ansible provisions | AGENTS.md §Architecture, §Change Safety Rules | — | duplicate of copilot §Architecture and §Change Safety Rules |
| CLAUDE.md §Critical Rules (from copilot-instructions.md) · oversized-llm should run only ollama_server and | AGENTS.md §Oversized-LLM Guardrails | — | duplicate of copilot §Oversized-LLM Guardrails |
| CLAUDE.md §Critical Rules (from copilot-instructions.md) · exposure boundaries: ollama is reachable only | AGENTS.md §Oversized-LLM Guardrails, §Change Safety Rules | — | duplicate of copilot §Oversized-LLM Guardrails and §Change Safety Rules |
| CLAUDE.md §Critical Rules (from copilot-instructions.md) · firewall intent in ansible/roles/base/tasks/main.yml must be | AGENTS.md §Oversized-LLM Guardrails | — | duplicate of copilot §Oversized-LLM Guardrails |
| CLAUDE.md §Critical Rules (from copilot-instructions.md) · secrets: never commit plaintext secrets. secret | AGENTS.md §Change Safety Rules, §Conventions | — | kept: vault and .env wording merged into copilot's secrets line; runtime values duplicate of §Conventions |
| CLAUDE.md §Critical Rules (from copilot-instructions.md) · internal domain: home-lan.net is internal-only (records | AGENTS.md §Internal Domain | — | kept: "no per-host cert without approval" merged in; rest duplicate of §Internal Domain |
| CLAUDE.md §Critical Rules (from copilot-instructions.md) · compose stacks are standalone — don't | AGENTS.md §Change Safety Rules | — | kept: image-pinning line added; mass-normalize duplicate of copilot |
| CLAUDE.md §Critical Rules (from copilot-instructions.md) · the queue is docs/proposals/_implementation-order.md, ids qn-<n>. | AGENTS.md §Agent Workflow | — | duplicate of copilot §Agent Workflow |
| CLAUDE.md §Critical Rules (from copilot-instructions.md) · proposals, not plans: each queue row | AGENTS.md §Docs Lifecycle, §Change Safety Rules | — | kept: live-host line added; rest duplicate of §Docs Lifecycle |
| CLAUDE.md §Critical Rules (from copilot-instructions.md) · public repo: until qn-1 decides the | AGENTS.md §Docs Lifecycle, §Conventions | — | kept: example list and link reason merged in; rest duplicate of copilot |
| CLAUDE.md §Critical Rules (from copilot-instructions.md) · scratch goes in the gitignored .tmp/<task>/ | AGENTS.md §Agent Workflow | — | duplicate of copilot §Agent Workflow |
| CLAUDE.md §Scoped Rules (load before working in these areas) · \| editing any /docker-compose.yml stack \| | AGENTS.md §Rule files | — | changed (D1): routing row |
| CLAUDE.md §Scoped Rules (load before working in these areas) · \| editing anything under ansible/ \| | AGENTS.md §Rule files | — | changed (D1): routing row |
| CLAUDE.md §Scoped Rules (load before working in these areas) · \| a qn-<n> id, a plan | AGENTS.md §Rule files | — | changed (D1): routing row |
| CLAUDE.md §Scoped Rules (load before working in these areas) · \| authoring or revising a proposal | AGENTS.md §Rule files | — | changed (D1): routing row |
| CLAUDE.md §Scoped Rules (load before working in these areas) · \| editing copilot-instructions.md, a scoped rule | AGENTS.md §Rule files | — | changed (D1): routing row |
| CLAUDE.md §Scoped Rules (load before working in these areas) · for reviewing infra changes, an infra-reviewer | — | — | retired (D6): the pointer goes now, the agent file in Phase 4 |
| CLAUDE.md §Commands · there is no app build/test pipeline. | AGENTS.md §Commands | — | kept, merged with copilot §Build And Test |
| CLAUDE.md §Commands · stacks themselves are deployed from the | AGENTS.md §Commands | — | moved |
| CLAUDE.md §Architecture · provisioning layer — ansible/ roles/playbooks configure | AGENTS.md §Architecture | — | kept, merged with copilot §Architecture |
| CLAUDE.md §Architecture · runtime layer — each top-level folder | AGENTS.md §Architecture | — | kept, merged with copilot §Architecture |
| CLAUDE.md §Architecture · networking — traefik is the common | AGENTS.md §Architecture | — | moved |
| CLAUDE.md §Architecture · per-stack source of truth — each | AGENTS.md §Architecture | — | moved |
| CLAUDE.md §Notes · _ideas_/ holds reference/sample ai-instruction material only; | AGENTS.md §Conventions | — | moved |

## Phase 3 — Rule content

Rows are built from the Phase 2 commit `c27611f`, one per list item, paragraph or table row of a touched file. A `kept` row's line is unchanged. `editing.md` and `CLAUDE.md` are unchanged. The frontmatter `description:` of `ansible-safety.md` drops "firewall intent", which the new routing row carries. New in this phase: `.claude/rules/oversized-llm.md`, its rationale file, and the `AGENTS.md` lines for commit-to-`main` and the `oversized-llm` routing row.

### `AGENTS.md`

| Before (file §section · first words) | After (file §section) | Rationale anchor | How |
| ---- | ---- | ---- | ---- |
| AGENTS.md §Project Guidelines · The core rules for every agent in | AGENTS.md §Project Guidelines | — | kept |
| AGENTS.md §Repository Scope · - This repository manages a multi-host homelab. | AGENTS.md §Repository Scope | — | kept |
| AGENTS.md §Repository Scope · - Most top-level service folders are standalone | AGENTS.md §Repository Scope | — | kept |
| AGENTS.md §Repository Scope · - Oversized-LLM active stack sources are [ollama](ollama) | .claude/rules/oversized-llm.md §Scope | — | moved (D8) |
| AGENTS.md §Repository Scope · - Host prerequisites for Oversized-LLM are managed | .claude/rules/oversized-llm.md §Scope | — | moved (D8) |
| AGENTS.md §Repository Scope · - Stack/container lifecycle is managed in Portainer | AGENTS.md §Repository Scope | — | changed (D20): "(UI/API)" dropped; the boundary is unchanged |
| AGENTS.md §Architecture · - Provisioning layer: [Ansible](Ansible) roles/playbooks configure host | AGENTS.md §Architecture | — | kept |
| AGENTS.md §Architecture · - Runtime layer: top-level compose folders (`ollama/`, | AGENTS.md §Architecture | — | kept |
| AGENTS.md §Architecture · - Networking: Traefik is the common reverse | AGENTS.md §Architecture | — | kept |
| AGENTS.md §Architecture · - Per-stack source of truth: each service | AGENTS.md §Architecture | — | kept |
| AGENTS.md §Architecture · - Separation of concerns is intentional: | AGENTS.md §Architecture | — | kept |
| AGENTS.md §Architecture · - Ansible handles host state. | AGENTS.md §Architecture | — | kept |
| AGENTS.md §Architecture · - Portainer handles container and stack lifecycle. | AGENTS.md §Architecture | — | kept |
| AGENTS.md §Commands · There is no traditional app build/test pipeline | AGENTS.md §Commands | — | kept |
| AGENTS.md §Commands · - Encrypt secrets with ansible-vault and keep | AGENTS.md §Commands | — | kept |
| AGENTS.md §Commands · - Stacks are deployed from the Portainer | AGENTS.md §Commands | agents.rationale.md#portainer-gitops | changed (D20): UI in GitOps mode; promoted from memory |
| AGENTS.md §Commands · - After editing an instruction file, run | AGENTS.md §Commands | — | kept |
| AGENTS.md §Collaboration Preference · - Don't assume when requirements are ambiguous. | AGENTS.md §Collaboration Preference | — | kept |
| AGENTS.md §Collaboration Preference · - When several valid approaches exist, present | AGENTS.md §Collaboration Preference | — | kept |
| AGENTS.md §Collaboration Preference · - Prefer explicit confirmation over inferred intent | AGENTS.md §Collaboration Preference | — | kept |
| AGENTS.md §Collaboration Preference · - **Exception — breakage with evidence:** given | AGENTS.md §Collaboration Preference | — | kept |
| AGENTS.md §Agent Workflow · - **Plan first** for any non-trivial task | AGENTS.md §Agent Workflow | — | kept |
| AGENTS.md §Agent Workflow · - **Delegate exploration** to read-only sub-agents where | AGENTS.md §Agent Workflow | — | kept |
| AGENTS.md §Agent Workflow · - **Scratch goes in `.tmp/`:** sub-agent briefs, | AGENTS.md §Agent Workflow | — | kept |
| AGENTS.md §Agent Workflow · - Give each download its own new | AGENTS.md §Agent Workflow | — | kept |
| AGENTS.md §Agent Workflow · - **Lessons:** check [docs/ai-lessons.md](docs/ai-lessons.md) before implementing. After | AGENTS.md §Agent Workflow | — | kept |
| AGENTS.md §Agent Workflow · - **Verification before done:** prove it with | AGENTS.md §Agent Workflow | — | kept |
| AGENTS.md §Agent Workflow · - **The queue:** [docs/proposals/_implementation-order.md](docs/proposals/_implementation-order.md) is the to-do | AGENTS.md §Agent Workflow | — | kept; the guardrail is now a link to oversized-llm.md#scope |
| AGENTS.md §Agent Workflow · - ⛔ **Wrong session:** queue ids are | AGENTS.md §Agent Workflow | — | kept |
| AGENTS.md §Docs Lifecycle · - [docs/index.md](docs/index.md) — curated index of every | AGENTS.md §Docs Lifecycle | — | kept |
| AGENTS.md §Docs Lifecycle · - `docs/proposals/` — unbuilt work as `REQ-` | AGENTS.md §Docs Lifecycle | — | kept |
| AGENTS.md §Docs Lifecycle · - `docs/plans/` — multi-phase implementation plans, one | AGENTS.md §Docs Lifecycle | — | kept |
| AGENTS.md §Docs Lifecycle · - `docs/handoffs/` — snapshots taken to be | AGENTS.md §Docs Lifecycle | — | kept |
| AGENTS.md §Docs Lifecycle · - Service-folder READMEs stay the source of | AGENTS.md §Docs Lifecycle | — | kept |
| AGENTS.md §Docs Lifecycle · - ⛔ This repo is public. Until | AGENTS.md §Docs Lifecycle | — | kept |
| AGENTS.md §Docs Lifecycle · - `private/` (gitignored) — local-only notes that | AGENTS.md §Docs Lifecycle | — | kept |
| AGENTS.md §Rule files · Claude Code loads these automatically when you | AGENTS.md §Rule files | — | kept |
| AGENTS.md §Rule files · \| When you… \| Read \| | AGENTS.md §Rule files | — | kept |
| AGENTS.md §Rule files · \| author or work a plan, read | AGENTS.md §Rule files | — | kept |
| AGENTS.md §Rule files · \| author or revise a proposal in | AGENTS.md §Rule files | — | kept |
| AGENTS.md §Rule files · \| edit `AGENTS.md`, `CLAUDE.md`, a rule, a | AGENTS.md §Rule files | — | kept |
| AGENTS.md §Rule files · \| edit anything under `Ansible/`, or run | AGENTS.md §Rule files | — | kept |
| AGENTS.md §Rule files · \| edit a stack's `docker-compose.yml`, or add | AGENTS.md §Rule files | — | kept |
| AGENTS.md §Conventions · - Each service folder README is the | AGENTS.md §Conventions | — | kept |
| AGENTS.md §Conventions · - Environment values documented in repo files | AGENTS.md §Conventions | — | kept |
| AGENTS.md §Conventions · - Many stacks rely on host path | AGENTS.md §Conventions | — | kept |
| AGENTS.md §Conventions · - Traefik-centric networking is common across stacks | AGENTS.md §Conventions | — | kept |
| AGENTS.md §Conventions · - When setting up Traefik on a | AGENTS.md §Conventions | — | kept |
| AGENTS.md §Conventions · - Keep instructions, handoffs, and investigation logs | AGENTS.md §Conventions | — | kept |
| AGENTS.md §Conventions · - ⛔ A troubleshooting or investigation log | AGENTS.md §Conventions | — | kept |
| AGENTS.md §Conventions · - `_IDEAS_/` holds reference/sample AI-instruction material only; | AGENTS.md §Conventions | — | kept |
| AGENTS.md §Internal Domain (`home-lan.net`) · - `home-lan.net` is internal-only. It was registered | AGENTS.md §Internal Domain (`home-lan.net`) | — | kept |
| AGENTS.md §Internal Domain (`home-lan.net`) · - Host records exist only on the | AGENTS.md §Internal Domain (`home-lan.net`) | — | kept |
| AGENTS.md §Internal Domain (`home-lan.net`) · - TLS uses a single `*.home-lan.net` wildcard | AGENTS.md §Internal Domain (`home-lan.net`) | — | kept |
| AGENTS.md §Internal Domain (`home-lan.net`) · - Committing `home-lan.net` hostnames and internal URLs | AGENTS.md §Internal Domain (`home-lan.net`) | — | kept |
| AGENTS.md §Internal Domain (`home-lan.net`) · - Do not add public records to | AGENTS.md §Internal Domain (`home-lan.net`) | — | kept |
| AGENTS.md §Internal Domain (`home-lan.net`) · - Certificate Transparency entries dated before 2024-09-27 | AGENTS.md §Internal Domain (`home-lan.net`) | — | kept |
| AGENTS.md §Internal Domain (`home-lan.net`) · - To check public exposure, run `dig | AGENTS.md §Internal Domain (`home-lan.net`) | — | kept |
| AGENTS.md §Oversized-LLM Guardrails · - Keep scope focused on Oversized-LLM unless | .claude/rules/oversized-llm.md §Scope | — | moved (D8) |
| AGENTS.md §Oversized-LLM Guardrails · - Oversized-LLM should run only: | .claude/rules/oversized-llm.md §Runtime | — | moved (D8); "managed in Portainer" merged in from ansible-safety |
| AGENTS.md §Oversized-LLM Guardrails · - `ollama_server` | .claude/rules/oversized-llm.md §Runtime | — | moved (D8) |
| AGENTS.md §Oversized-LLM Guardrails · - `portainer_agent` | .claude/rules/oversized-llm.md §Runtime | — | moved (D8) |
| AGENTS.md §Oversized-LLM Guardrails · - Do not deploy a local Portainer | .claude/rules/oversized-llm.md §Runtime | — | moved (D8) |
| AGENTS.md §Oversized-LLM Guardrails · - Keep Portainer Agent LAN-only and independent | .claude/rules/oversized-llm.md §Exposure | — | moved (D8) |
| AGENTS.md §Oversized-LLM Guardrails · - Use Tailscale only for Ollama access. | .claude/rules/oversized-llm.md §Exposure | — | moved (D8) |
| AGENTS.md §Oversized-LLM Guardrails · - Preserve firewall intent in [Ansible/roles/base/tasks/main.yml](Ansible/roles/base/tasks/main.yml): | .claude/rules/oversized-llm.md §Firewall | — | moved (D8) |
| AGENTS.md §Oversized-LLM Guardrails · - SSH from management LAN only | .claude/rules/oversized-llm.md §Firewall | — | moved (D8) |
| AGENTS.md §Oversized-LLM Guardrails · - Ollama port from Tailscale subnet only | .claude/rules/oversized-llm.md §Firewall | — | moved (D8) |
| AGENTS.md §Oversized-LLM Guardrails · - Portainer Agent port from central Portainer | .claude/rules/oversized-llm.md §Firewall | — | moved (D8) |
| AGENTS.md §Oversized-LLM Guardrails · - deny other inbound traffic by default | .claude/rules/oversized-llm.md §Firewall | — | moved (D8) |
| AGENTS.md §Change Safety Rules · - Do not use Ansible to create/update/delete | AGENTS.md §Change Safety Rules | — | kept |
| AGENTS.md §Change Safety Rules · - Do not reintroduce removed service-deployment roles/playbooks | AGENTS.md §Change Safety Rules | — | kept |
| AGENTS.md §Change Safety Rules · - Do not broaden Ollama exposure beyond | .claude/rules/oversized-llm.md §Exposure | — | moved (D8) |
| AGENTS.md §Change Safety Rules · - Preserve `OLLAMA_BIND_IP` behavior for Ollama unless | .claude/rules/oversized-llm.md §Exposure | — | moved (D8) |
| AGENTS.md §Change Safety Rules · - Do not commit plaintext secrets. Secret | AGENTS.md §Change Safety Rules | — | kept |
| AGENTS.md §Change Safety Rules · - Avoid mass-normalizing compose files unless explicitly | AGENTS.md §Change Safety Rules | — | kept |
| AGENTS.md §Change Safety Rules · - Keep image pinning (no floating `latest`) | AGENTS.md §Change Safety Rules | — | kept |
| AGENTS.md §Change Safety Rules · - Every change to a live host | AGENTS.md §Change Safety Rules | — | kept |
| AGENTS.md §Agent Skills (`agent-skills/`) · - [agent-skills](agent-skills) holds machine-wide skills for Claude | AGENTS.md §Agent Skills (`agent-skills/`) | — | kept |
| AGENTS.md §Agent Skills (`agent-skills/`) · - They are not homelab infrastructure: they | AGENTS.md §Agent Skills (`agent-skills/`) | — | kept |
| AGENTS.md §Agent Skills (`agent-skills/`) · - `install.sh` links them into `~/.agents/skills`, `~/.claude/skills` | AGENTS.md §Agent Skills (`agent-skills/`) | — | kept |
| AGENTS.md §Agent Skills (`agent-skills/`) · - Keep each `SKILL.md`, script and brief | AGENTS.md §Agent Skills (`agent-skills/`) | — | kept |
| AGENTS.md §Agent Skills (`agent-skills/`) · - This repo is public. Nothing private | AGENTS.md §Agent Skills (`agent-skills/`) | — | kept |
| AGENTS.md §Key References · - Provisioning workflow: [Ansible/README.md](Ansible/README.md) | AGENTS.md §Key References | — | kept |
| AGENTS.md §Key References · - Primary provisioning playbook: [Ansible/playbooks/provision_gpu_server.yml](Ansible/playbooks/provision_gpu_server.yml) | AGENTS.md §Key References | — | kept |
| AGENTS.md §Key References · - Ollama stack details: [ollama/README.md](ollama/README.md) | AGENTS.md §Key References | — | kept |
| AGENTS.md §Key References · - Portainer Agent details: [portainer/README.md](portainer/README.md) | AGENTS.md §Key References | — | kept |
| AGENTS.md §Key References · - Traefik and networking patterns: [traefik/README.md](traefik/README.md) | AGENTS.md §Key References | — | kept |

### `.claude/rules/ansible-safety.md`

| Before (file §section · first words) | After (file §section) | Rationale anchor | How |
| ---- | ---- | ---- | ---- |
| ansible-safety.md §Ansible Safety Guidelines · Rules for `Ansible/**`. `AGENTS.md` holds the global | ansible-safety.md §Ansible Safety Guidelines | — | kept |
| ansible-safety.md §Ansible Safety Guidelines · - Treat Ansible as host provisioning only. | ansible-safety.md §Ansible Safety Guidelines | — | kept |
| ansible-safety.md §Ansible Safety Guidelines · - Keep the active provisioning path centered | ansible-safety.md §Ansible Safety Guidelines | — | kept |
| ansible-safety.md §Ansible Safety Guidelines · - Preserve firewall intent from [Ansible/roles/base/tasks/main.yml](../../Ansible/roles/base/tasks/main.yml): | .claude/rules/oversized-llm.md §Firewall | — | duplicate of AGENTS.md §Oversized-LLM Guardrails, now oversized-llm.md; pointer left |
| ansible-safety.md §Ansible Safety Guidelines · - SSH only from management LAN. | .claude/rules/oversized-llm.md §Firewall | — | duplicate of the same list |
| ansible-safety.md §Ansible Safety Guidelines · - Ollama port only from the Tailscale | .claude/rules/oversized-llm.md §Firewall | — | duplicate of the same list |
| ansible-safety.md §Ansible Safety Guidelines · - Portainer Agent port only from the | .claude/rules/oversized-llm.md §Firewall | — | duplicate of the same list |
| ansible-safety.md §Ansible Safety Guidelines · - Deny other inbound traffic by default. | .claude/rules/oversized-llm.md §Firewall | — | duplicate of the same list |
| ansible-safety.md §Ansible Safety Guidelines · - Keep Oversized-LLM runtime model unchanged: only | .claude/rules/oversized-llm.md §Runtime | — | duplicate of §Runtime; "managed in Portainer" merged there |
| ansible-safety.md §Ansible Safety Guidelines · - Keep Tailscale usage limited to Ollama | .claude/rules/oversized-llm.md §Exposure | — | duplicate of the two §Exposure lines on Tailscale and the Agent |
| ansible-safety.md §Ansible Safety Guidelines · - Keep secrets in ansible-vault managed files. | ansible-safety.md §Ansible Safety Guidelines | — | kept |
| ansible-safety.md §Ansible Safety Guidelines · - Prefer linking to authoritative docs over | ansible-safety.md §Ansible Safety Guidelines | — | kept |
| ansible-safety.md §Ansible Safety Guidelines · - [Ansible/README.md](../../Ansible/README.md) | ansible-safety.md §Ansible Safety Guidelines | — | kept |
| ansible-safety.md §Ansible Safety Guidelines · - [Ansible/playbooks/provision_gpu_server.yml](../../Ansible/playbooks/provision_gpu_server.yml) | ansible-safety.md §Ansible Safety Guidelines | — | kept |

### `.claude/rules/compose-stack-conventions.md`

| Before (file §section · first words) | After (file §section) | Rationale anchor | How |
| ---- | ---- | ---- | ---- |
| compose-stack-conventions.md §Compose Stack Conventions · Rules for each stack's `docker-compose.yml`. `AGENTS.md` holds | compose-stack-conventions.md §Compose Stack Conventions | — | kept |
| compose-stack-conventions.md §Compose Stack Conventions · - Top-level stack folders are standalone services. | compose-stack-conventions.md §Compose Stack Conventions | — | kept |
| compose-stack-conventions.md §Compose Stack Conventions · - Runtime stack lifecycle is managed in | .claude/rules/compose-stack-conventions.md | agents.rationale.md#portainer-gitops | changed (D20): UI, GitOps mode; the boundary is unchanged |
| compose-stack-conventions.md §Compose Stack Conventions · - Preserve existing stack-specific env vars, labels, | compose-stack-conventions.md §Compose Stack Conventions | — | kept |
| compose-stack-conventions.md §Compose Stack Conventions · - Treat repository env values as reference | compose-stack-conventions.md §Compose Stack Conventions | — | kept |
| compose-stack-conventions.md §Compose Stack Conventions · - Preserve Traefik-centric patterns when present: | compose-stack-conventions.md §Compose Stack Conventions | — | kept |
| compose-stack-conventions.md §Compose Stack Conventions · - Shared proxy network usage. | compose-stack-conventions.md §Compose Stack Conventions | — | kept |
| compose-stack-conventions.md §Compose Stack Conventions · - Existing Traefik labels and certresolver settings. | compose-stack-conventions.md §Compose Stack Conventions | — | kept |
| compose-stack-conventions.md §Compose Stack Conventions · - For new Traefik servers, ensure host | compose-stack-conventions.md §Compose Stack Conventions | — | kept |
| compose-stack-conventions.md §Compose Stack Conventions · - Keep image pinning posture consistent. Do | compose-stack-conventions.md §Compose Stack Conventions | — | kept |
| compose-stack-conventions.md §Compose Stack Conventions · - Preserve Oversized-LLM guardrails for relevant stacks: | .claude/rules/compose-stack-conventions.md | — | changed (D8): now a pointer to oversized-llm.md |
| compose-stack-conventions.md §Compose Stack Conventions · - Keep Ollama exposure constrained to Tailscale | .claude/rules/oversized-llm.md §Exposure | — | duplicate of "do not broaden" and the `OLLAMA_BIND_IP` line |
| compose-stack-conventions.md §Compose Stack Conventions · - Keep Portainer Agent LAN-only and independent | .claude/rules/oversized-llm.md §Exposure | — | duplicate of §Exposure |
| compose-stack-conventions.md §Compose Stack Conventions · - Link to stack READMEs for service-specific | compose-stack-conventions.md §Compose Stack Conventions | — | kept |

### `.claude/rules/planning.md`

| Before (file §section · first words) | After (file §section) | Rationale anchor | How |
| ---- | ---- | ---- | ---- |
| planning.md §Phased Plan Guidelines · - Start with the project-wide rules in | planning.md §Phased Plan Guidelines | — | kept |
| planning.md §Phased Plan Guidelines · - This file governs the **internal structure** | planning.md §Phased Plan Guidelines | — | kept |
| planning.md §Phased Plan Guidelines · - Adapted from `karens-database` and `readingorder.info-2025`. The | .claude/rules/planning.md (lead) | planning.rationale.md#sibling-formats | kept; "Adapted from" moved to rationale |
| planning.md §From Proposal to Plan · - Every queue row starts as a | planning.md §From Proposal to Plan | — | kept |
| planning.md §From Proposal to Plan · - Resolve the proposal's open questions with | planning.md §From Proposal to Plan | — | kept |
| planning.md §From Proposal to Plan · - ⛔ **One proposal per planning session.** | planning.md §From Proposal to Plan | — | kept |
| planning.md §From Proposal to Plan · - A proposal marked "single session" may | planning.md §From Proposal to Plan | — | kept |
| planning.md §When This Applies · - Plans with **≥2 phases**. Single-step plans | planning.md §When This Applies | — | kept |
| planning.md §When This Applies · - Each phase = **one working session**, | planning.md §When This Applies | — | kept |
| planning.md §When This Applies · - ⛔ **Exception: [Live-Host Safety](#live-host-safety) applies to | planning.md §When This Applies | — | kept |
| planning.md §Phase Anatomy · Every phase carries four parts: | planning.md §Phase Anatomy | — | kept |
| planning.md §Phase Anatomy · - **Goal** — one line. | planning.md §Phase Anatomy | — | kept |
| planning.md §Phase Anatomy · - **Build** — steps with host names, | planning.md §Phase Anatomy | — | kept |
| planning.md §Phase Anatomy · - **Acceptance criteria** — the "done when" | planning.md §Phase Anatomy | — | kept |
| planning.md §Phase Anatomy · - **Completion log** — written back when | planning.md §Phase Anatomy | — | kept |
| planning.md §Live-Host Safety · Every change to a running host, service, | planning.md §Live-Host Safety | — | kept |
| planning.md §Live-Host Safety · - **Blast radius** — hosts touched, expected | planning.md §Live-Host Safety | — | kept |
| planning.md §Live-Host Safety · - **Backup** — a current backup of | planning.md §Live-Host Safety | — | kept |
| planning.md §Live-Host Safety · - **Rollback** — written before the change, | planning.md §Live-Host Safety | — | kept |
| planning.md §Live-Host Safety · - **Operator gate** — reboots, wipes, DNS/DHCP | planning.md §Live-Host Safety | — | kept |
| planning.md §Live-Host Safety · - **Capture first** — export the current | planning.md §Live-Host Safety | — | kept |
| planning.md §Premise Spikes (precondition, not acceptance) · **If a phase's premise is vendor or | .claude/rules/planning.md §Premise Spikes | planning.rationale.md#premise-spikes | kept; why link added |
| planning.md §Premise Spikes (precondition, not acceptance) · The tell is mechanical, and it is | planning.md §Premise Spikes (precondition, not acceptance) | — | kept |
| planning.md §Premise Spikes (precondition, not acceptance) · - A Phase 0 spike changes **nothing | planning.md §Premise Spikes (precondition, not acceptance) | — | kept |
| planning.md §Premise Spikes (precondition, not acceptance) · - Give it explicit pass/fail gates, and | planning.md §Premise Spikes (precondition, not acceptance) | — | kept |
| planning.md §Premise Spikes (precondition, not acceptance) · - Read the vendor's docs or release | planning.md §Premise Spikes (precondition, not acceptance) | — | kept |
| planning.md §Premise Spikes (precondition, not acceptance) · - Origin: `readingorder.info-2025` reverted a whole phase | planning.rationale.md | planning.rationale.md#premise-spikes | moved: history |
| planning.md §Before Starting a Phase · 1. Read `AGENTS.md` + the rule file | planning.md §Before Starting a Phase | — | kept |
| planning.md §Before Starting a Phase · 2. Set the phase to 🟡 in | planning.md §Before Starting a Phase | — | kept |
| planning.md §Before Starting a Phase · 3. Read the **completion logs of all | planning.md §Before Starting a Phase | — | kept |
| planning.md §Before Ending a Phase (required) · 1. **Evidence, not assertion.** There is no | planning.md §Before Ending a Phase (required) | — | kept |
| planning.md §Before Ending a Phase (required) · 2. Confirm the acceptance criteria with that | planning.md §Before Ending a Phase (required) | — | kept |
| planning.md §Before Ending a Phase (required) · 3. **Write back the completion log:** set | planning.md §Before Ending a Phase (required) | — | kept |
| planning.md §Before Ending a Phase (required) · 4. If the plan text was wrong, | planning.md §Before Ending a Phase (required) | — | kept |
| planning.md §Before Ending a Phase (required) · 5. **Public-safety check:** the diff carries no | planning.md §Before Ending a Phase (required) | — | kept |
| planning.md §Before Ending a Phase (required) · 6. **A plan's last phase sweeps the | planning.md §Before Ending a Phase (required) | — | kept |
| planning.md §Before Ending a Phase (required) · 7. **Update the plan's row in the | planning.md §Before Ending a Phase (required) | — | kept |
| planning.md §Before Ending a Phase (required) · 8. **Run the guard last**, after every | planning.md §Before Ending a Phase (required) | — | kept |
| planning.md §Status Legend · ⬜ not started · 🟡 in progress | planning.md §Status Legend | — | kept |
| planning.md §Status Legend · - 🟡 = an agent is working | planning.md §Status Legend | — | kept |
| planning.md §Status Legend · - **Pausing a phase:** set ⏸ in | planning.md §Status Legend | — | kept |
| planning.md §Status Legend · - **Resuming a ⏸ phase:** read its | planning.md §Status Legend | — | kept |
| planning.md §Status Legend · - **Starting or ending a phase updates | planning.md §Status Legend | — | kept |
| planning.md §Status Legend · - The machine-wide `next-phase` skill ([agent-skills/next-phase](../../agent-skills/next-phase/SKILL.md)) reads | planning.md §Status Legend | — | kept |
| planning.md §Authoring Rule · Every multi-phase plan **embeds this protocol inline** | planning.md §Authoring Rule | — | kept |
| planning.md §Status Header (once per plan) · The plan's first line after its `#` | planning.md §Status Header (once per plan) | — | kept |
| planning.md §The Implementation Queue · [`docs/proposals/_implementation-order.md`](../../docs/proposals/_implementation-order.md) is the | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · human-readable to-do list: **one table, one row | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · next*, nothing else. | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · Columns are exactly `\| # \| Item | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · ⚠️ **Always run Prettier after editing the | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · `npx --yes prettier@3 --write docs/proposals/_implementation-order.md` — so | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · aligned and the file stays readable to | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · Prettier-formatted. | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · - **#** — a `QN-<n>` id ("queue | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · plan's own phase. Another repo has its | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · `readingorder.info-2025`), so an id names one repo's | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · takes the next free number; rows are | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · are **never renumbered**. ⛔ **Ids are never | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · the table. The next free id is | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · ⛔ **Wrong session:** an id with another | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · prompt reached the wrong session. Stop and | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · - **Item** — the task, as a | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · - **Sprint** — `current` · `next` · | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · - **Status** — symbol + word, one | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · ⛔ **No dates, no detail.** The status | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · restates them. | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · - **Notes** — blockers, the next/remaining phase, | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · ⛔ **100 characters max**, counted on the | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · content, and lives in the linked doc. | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · doc states it, in the same change. | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · dependencies. An "open question" here is a | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · — an unverified premise is a Phase | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · Three rules that shape the docs, not | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · - **The table carries no history.** Session | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · the linked doc. If a fact does | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · - **An intra-task dependency is never encoded | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · *another* doc, **split that doc or merge | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · - **Archiving a row is an operator | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · abandoned row **stays in the table** until | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · remove one as a side effect of | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · does ask, archiving is **one change with | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · `docs/archive/plans/` (or `docs/archive/proposals/`), repoint every inbound link, | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · `docs/index.md` row into the matching `## Archive` | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · `Implemented`/`Archived`/`Superseded` status, and only then delete the | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · outstanding on an archived row gets its | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · ⚠️ **A status request is a read, | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · closures against hosts or the tree, and | planning.md §The Implementation Queue | — | kept |
| planning.md §The Implementation Queue · and reality disagree, say so. | planning.md §The Implementation Queue | — | kept |

### `.claude/rules/proposals.md`

| Before (file §section · first words) | After (file §section) | Rationale anchor | How |
| ---- | ---- | ---- | ---- |
| proposals.md §Proposal Authoring Rules · What a document in `docs/proposals/` must contain. | proposals.md §Proposal Authoring Rules | — | kept |
| proposals.md §Proposal Authoring Rules · workspace-wide defaults; this file owns proposal structure. | proposals.md §Proposal Authoring Rules | — | kept |
| proposals.md §Proposal Authoring Rules · A **proposal** describes work that does not | proposals.md §Proposal Authoring Rules | — | kept |
| proposals.md §Proposal Authoring Rules · plan:** no phases, no step lists, no | proposals.md §Proposal Authoring Rules | — | kept |
| proposals.md §Proposal Authoring Rules · in `docs/plans/` — see [From Proposal to | proposals.md §Proposal Authoring Rules | — | kept |
| proposals.md §Proposal Authoring Rules · ⛔ **`_implementation-order.md` is not a proposal.** It | proposals.md §Proposal Authoring Rules | — | kept |
| proposals.md §Proposal Authoring Rules · [The Implementation Queue](planning.md#the-implementation-queue). | proposals.md §Proposal Authoring Rules | — | kept |
| proposals.md §Every Proposal · - File name `<topic>-proposal.md`. The line after | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · `**Queue:** QN-<n> · **Affects:** <hosts, stacks, external | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · - Sections, in order: **Why** · **Requirements** | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · **Depends on** · **Open questions** · **Decisions** | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · **Notes for planning** (optional) · **Outcome** (only | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · single-session work done without a plan; it | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · [Live-Host Safety](planning.md#live-host-safety)). | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · - Requirements carry ids `REQ-<AREA>-<nn>` with a | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · (`DOCS`, `DISC`, `FURB`, …). ⛔ Ids are | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · not reused. | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · - **Offline behavior** says what the result | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · project requirement: ⛔ no control may depend | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · - **Home-grade, not enterprise.** Prefer the simplest | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · enterprise options only to reject them. | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · - **Open questions** are decisions the operator | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · premise for a Phase 0 spike and | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · - Reference other proposals by queue id | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · - Carry a row in [`_implementation-order.md`](../../docs/proposals/_implementation-order.md) and | proposals.md §Every Proposal | — | kept |
| proposals.md §Every Proposal · in [`docs/index.md`](../../docs/index.md). | proposals.md §Every Proposal | — | kept |
| proposals.md §Public Safety · This repo is public. Until QN-1 decides | proposals.md §Public Safety | — | kept |
| proposals.md §Public Safety · section): | proposals.md §Public Safety | — | kept |
| proposals.md §Public Safety · - ⛔ **No per-service security findings** — | proposals.md §Public Safety | — | kept |
| proposals.md §Public Safety · keep default credentials, or run vulnerable versions. | proposals.md §Public Safety | — | kept |
| proposals.md §Public Safety · list waits for the private home. | proposals.md §Public Safety | — | kept |
| proposals.md §Public Safety · - ⛔ **No secrets, public IPs, MAC | proposals.md §Public Safety | — | kept |
| proposals.md §Public Safety · WAN port-forward details.** | proposals.md §Public Safety | — | kept |
| proposals.md §Public Safety · - ⛔ **No troubleshooting or investigation logs | proposals.md §Public Safety | — | kept |
| proposals.md §Public Safety · They go in `private/<repo path>` (QN-1 §Decisions, | .claude/rules/proposals.md §Public Safety | proposals.rationale.md#private-logs | kept; decision citation moved to rationale |
| proposals.md §Public Safety · - ✅ Hostnames, `home-lan.net` names ([Internal Domain](../../AGENTS.md#internal-domain)), | proposals.md §Public Safety | — | kept |
| proposals.md §Public Safety · shape of the network are fine. | proposals.md §Public Safety | — | kept |
| proposals.md §Public Safety · - For a **named** host or service, | proposals.md §Public Safety | — | kept |
| proposals.md §Public Safety · necessary ("bring X to a supported release", | proposals.md §Public Safety | — | kept |
| proposals.md §Public Safety · goes private. | proposals.md §Public Safety | — | kept |
| proposals.md §Public Safety · - Until then, local-only notes go in | proposals.md §Public Safety | — | kept |
| proposals.md §Public Safety · Lifecycle](../../AGENTS.md#docs-lifecycle)), named as a code span, never | proposals.md §Public Safety | — | kept |
| proposals.md §Keep the Q&A → Proposal → Design Split · The process that produced `karens-database`'s best artifact: | .claude/rules/proposals.md §Keep the Q&A → Proposal → Design Split | proposals.rationale.md#qa-split | changed (history): lead reworded, origin moved to rationale |
| proposals.md §Keep the Q&A → Proposal → Design Split · 1. **Ask.** Write questions inline in a | proposals.md §Keep the Q&A → Proposal → Design Split | — | kept |
| proposals.md §Keep the Q&A → Proposal → Design Split · the operator answer them inline under each | proposals.md §Keep the Q&A → Proposal → Design Split | — | kept |
| proposals.md §Keep the Q&A → Proposal → Design Split · contradiction visible until it is resolved. | proposals.md §Keep the Q&A → Proposal → Design Split | — | kept |
| proposals.md §Keep the Q&A → Proposal → Design Split · 2. **Resolve.** Fold the _what_ and _why_ | proposals.md §Keep the Q&A → Proposal → Design Split | — | kept |
| proposals.md §Keep the Q&A → Proposal → Design Split · non-goals. Keep it short — the proposal | proposals.md §Keep the Q&A → Proposal → Design Split | — | kept |
| proposals.md §Keep the Q&A → Proposal → Design Split · questions and state the answer where it | proposals.md §Keep the Q&A → Proposal → Design Split | — | kept |
| proposals.md §Keep the Q&A → Proposal → Design Split · 3. **Split out the _how_.** Hardware, versions, | proposals.md §Keep the Q&A → Proposal → Design Split | — | kept |
| proposals.md §Keep the Q&A → Proposal → Design Split · the plan, written as **facts, not as | proposals.md §Keep the Q&A → Proposal → Design Split | — | kept |
| proposals.md §Keep the Q&A → Proposal → Design Split · 4. **Flag what did not resolve.** An | proposals.md §Keep the Q&A → Proposal → Design Split | — | kept |
| proposals.md §Keep the Q&A → Proposal → Design Split · operator still owes — say so rather | proposals.md §Keep the Q&A → Proposal → Design Split | — | kept |
| proposals.md §Keep the Q&A → Proposal → Design Split · ⚠️ When a question gets **two different | proposals.md §Keep the Q&A → Proposal → Design Split | — | kept |
| proposals.md §Keep the Q&A → Proposal → Design Split · reversal where the decision lands. Without that | proposals.md §Keep the Q&A → Proposal → Design Split | — | kept |
| proposals.md §Keep the Q&A → Proposal → Design Split · reintroduces it. | proposals.md §Keep the Q&A → Proposal → Design Split | — | kept |
| proposals.md §References · - [AGENTS.md](../../AGENTS.md) — workspace-wide defaults. | proposals.md §References | — | kept |
| proposals.md §References · - [planning.md](planning.md) — the queue format and | proposals.md §References | — | kept |
| proposals.md §References · protocol. | proposals.md §References | — | kept |
| proposals.md §References · - [../../docs/index.md](../../docs/index.md) — the curated index every | proposals.md §References | — | kept |

### Carried rules (REQ-AGENT-10)

The rules added on 2026-11-01 (`b2fcd31`, `762734b`), each checked by text against its home.

| Rule | Home | Intent |
| ---- | ---- | ---- |
| Collaboration Preference: ask, options, confirmation, breakage exception | AGENTS.md | survived |
| Plan first | AGENTS.md | survived |
| Delegate exploration | AGENTS.md | survived |
| Scratch in `.tmp/`, never `/tmp` | AGENTS.md | survived |
| A new empty folder per download | AGENTS.md | survived |
| Lessons | AGENTS.md | survived |
| Verification before done | AGENTS.md | survived |
| The queue; a `QN-` row is the explicit request | AGENTS.md | survived |
| A `QN-` row counts, in the scope guardrail | .claude/rules/oversized-llm.md | survived |
| Wrong session | AGENTS.md | survived |
| Docs lifecycle: proposals, plans, handoffs | AGENTS.md | survived |
| Public repo: no per-service findings | AGENTS.md | survived |
| `private/` notes, never linked | AGENTS.md | survived |
| `private/` logs that name household devices | AGENTS.md | survived |
| `private/` logs, in the proposal rules | .claude/rules/proposals.md | survived |
| Agent skills run against the caller's repo | AGENTS.md | survived |
| Live-host line | AGENTS.md | survived |
| Planning rules, whole file | .claude/rules/planning.md | survived |
| Proposal rules, whole file | .claude/rules/proposals.md | survived |
| Editing rules, whole file | .claude/rules/editing.md | survived |

## Phase 4 — Surfaces and closeout

`planning.md` gains one line; `git diff` shows no other line changed, and `AGENTS.md`, `editing.md` and the other rule files are unchanged.

### `.github/agents/infra-reviewer.agent.md`

| Before | After | Rationale anchor | How |
| ------ | ----- | ---------------- | --- |
| Check 1 · Ansible changes remain provisioning-only | AGENTS.md §Change Safety Rules · ansible-safety.md | — | retired (D6) |
| Check 2 · Ollama constrained to Tailscale | oversized-llm.md §Exposure | — | retired (D6) |
| Check 2 · Portainer Agent LAN-only, not dependent on Tailscale | oversized-llm.md §Exposure | — | retired (D6) |
| Check 3 · Firewall intent preserved | oversized-llm.md §Firewall | — | retired (D6) |
| Check 4 · No plaintext secrets | AGENTS.md §Change Safety Rules · ansible-safety.md | — | retired (D6) |
| Check 5 · Compose edits preserve env, labels, storage | compose-stack-conventions.md | — | retired (D6) |
| Focus · regressions first, findings over summaries | `agent-skills/adversarial-review/reviewer.md` | — | retired (D6) |
| Output format · severity, evidence, why | `agent-skills/adversarial-review/reviewer.md` | — | retired (D6) |

### `.github/prompts/new-stack-readme.prompt.md`

| Before | After | Rationale anchor | How |
| ------ | ----- | ---------------- | --- |
| `description`, `argument-hint` | `.agents/skills/new-stack-readme/SKILL.md` | — | kept |
| `name: "New Stack README"` | `name: new-stack-readme` | — | changed (D10): a skill's name is its command |
| `agent`, `tools` | — | — | retired (D10) |
| Requirements, the section list, Before writing | SKILL.md | — | kept |
| Deployment in Portainer | SKILL.md: the UI in GitOps mode, linked to `AGENTS.md#portainer-gitops` | agents.rationale.md#portainer-gitops | changed (D20) |
| "workspace guardrails" | SKILL.md: links to `AGENTS.md` | — | changed (D10) |

### `.github/hooks/block-plaintext-secrets.json.DISABLED`

| Before | After | Rationale anchor | How |
| ------ | ----- | ---------------- | --- |
| Deny tool input matching a secret pattern (disabled) | AGENTS.md §Change Safety Rules · ansible-safety.md | — | retired (D11) |

### `docs/ai-lessons.md`

| Before | After | Rationale anchor | How |
| ------ | ----- | ---------------- | --- |
| QN-17 · Before a plan names a command, run it once | planning.md §Authoring Rule | planning.rationale.md#run-named-commands | moved |

### Surface dispositions (as built)

| Surface | Outcome | Phase | Now |
| ------- | ------- | ----- | --- |
| `CLAUDE.md` | Merged | 2 | `@AGENTS.md` plus three notes |
| `.github/copilot-instructions.md` | Merged | 2 | `AGENTS.md` |
| `.github/instructions/ansible-safety.instructions.md` | Moved | 2 | `.claude/rules/ansible-safety.md` |
| `.github/instructions/compose-stack-conventions.instructions.md` | Moved | 2 | `.claude/rules/compose-stack-conventions.md` |
| `.github/instructions/editing.instructions.md` | Moved | 2 | `.claude/rules/editing.md` |
| `.github/instructions/planning.instructions.md` | Moved | 2 | `.claude/rules/planning.md` |
| `.github/instructions/proposals.instructions.md` | Moved | 2 | `.claude/rules/proposals.md` |
| `infra-reviewer` agent | Retired (D6) | 4 | Deleted; its checks are mapped above |
| `new-stack-readme` prompt | Converted (D10) | 4 | `.agents/skills/new-stack-readme/` and its `.claude/skills/` link |
| Disabled secrets hook | Retired (D11) | 4 | Deleted; the rule stays |
| `.vscode/settings.json` | Unchanged (D4) | — | `cSpell.words` only |
| `_IDEAS_/ai-instructions/` | Unchanged | — | Reference-only |
