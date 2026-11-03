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
