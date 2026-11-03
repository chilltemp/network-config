# `.claude/rules/oversized-llm.md` — rationale

Why the rules in [`.claude/rules/oversized-llm.md`](../../../.claude/rules/oversized-llm.md) exist. No tool loads this file automatically. Read an entry
when you must apply its rule in an unusual case, or change the rule. Format:
[Rule and Rationale](../../../.claude/rules/editing.md#rule-and-rationale).

<a id="dormant-until-qn-11"></a>

## Dormant, and still binding

**Rule:** [oversized-llm.md §Oversized-LLM Guardrails](../../../.claude/rules/oversized-llm.md#oversized-llm-guardrails)

QN-17 D8 moved these guardrails out of the always-loaded core into one file, so QN-11 edits one place when it decides to park or retire the host. "Dormant" describes the host, not the rules: on 2026-11-02 the operator ruled that every rule still binds a change to these files, because changing the intent of a firewall or exposure rule is a non-goal of QN-17. The routing row names the words a task can carry without touching a file (firewall, inbound ports, exposure, `OLLAMA_BIND_IP`, Tailscale).
