# `AGENTS.md` — rationale

Why the rules in [`AGENTS.md`](../../../AGENTS.md) exist. No tool loads this file automatically. Read an entry
when you must apply its rule in an unusual case, or change the rule. Format:
[Rule and Rationale](../../../.claude/rules/editing.md#rule-and-rationale).

<a id="commit-to-main"></a>

## Commit on `main`

**Rule:** [AGENTS.md §Agent Workflow](../../../AGENTS.md#commit-to-main)

Promoted from a Claude Code memory note by QN-17 D7. This repo's history has no merge commits, checked 2026-11-02; both sibling repos use branches. The note read:

> When asked to commit in this repo, commit directly on `main` — no feature branch.
>
> **Why:** User's own workflow is direct-to-main (no merge commits in history); on 2026-10-28 they asked to undo a branch I created and "commit straight to main".
>
> **How to apply:** For commits here, stay on `main`. Pushing still needs an explicit ask.

<a id="portainer-gitops"></a>

## Portainer UI in GitOps mode

**Rule:** [AGENTS.md §Commands](../../../AGENTS.md#portainer-gitops)

Promoted from a Claude Code memory note by QN-17 D20, as a practice. Stack READMEs change wording only as they are touched. The note read:

> In this homelab, Docker Compose stacks are deployed by creating the stack in the **Portainer web UI using GitOps (repository) mode** — pointing the stack at this repo + the stack's `docker-compose.yml`, with env vars entered in the UI.
>
> **Why:** Portainer's GitOps auto-update feature (Portainer polls the repo and re-deploys on change) can only be configured through the UI. The CLI/API path does not enable GitOps updates.
>
> **How to apply:** When planning/documenting a new stack, the README "Deploy" section and any verification steps must say "deploy via the Portainer UI in GitOps/repository mode," not "deploy via Portainer UI/API" or any CLI method. Existing stack READMEs still say "UI/API" — prefer UI+GitOps wording going forward.

⚠️ The "**Why**" above is the operator's reported reason, and it is unverified. A check on 2026-11-02 found third-party tutorials showing an `autoUpdate` object on Portainer's repository-stack API call, which contradicts it, but no official API reference, and the installed version was not checked. The rule stands as a practice either way.
