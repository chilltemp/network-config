# Sample AI instructions files

## Credits

Here are the sources for each prompt group, if I could relocate it. I have edited some of them to my preferences. Don't copy paste this list into to your ai, you'll just confuse it.

- `_IDEAS_/ai-instructions/group-1.agent.md `
  - https://levelup.gitconnected.com/level-up-your-claude-code-with-this-claude-md-374521f1e1ab

- `_IDEAS_/ai-instructions/group-2.agent.md`
  - forgot source
  - changed 20 line functions to 40

- `_IDEAS_/ai-instructions/group-3.agent.md`
  - https://github.com/Robotti-io/copilot-security-instructions/blob/main/copilot-instructions.md
  - removed languages I don't use
  - edited for the tools/packages I prefer
  - yes, I intentionally left the human instructions in

## The Prompt

Ccopy and pasted into the copilot prompt.

====================================================================
START OF PROMPT
====================================================================

/init
You are updating this project’s instruction set.

Your task is to incorporate the following external instruction files into this project WITHOUT directly copy‑pasting their full contents into the root instructions file:

- https://raw.githubusercontent.com/chilltemp/network-config/refs/heads/main/_IDEAS_/ai-instructions/group-1.agent.md
- https://raw.githubusercontent.com/chilltemp/network-config/refs/heads/main/_IDEAS_/ai-instructions/group-2.agent.md
- https://raw.githubusercontent.com/chilltemp/network-config/refs/heads/main/_IDEAS_/ai-instructions/group-3.agent.md

Follow all rules below to safely integrate, validate, and reconcile these files.

====================================================================
SECTION 1 — GENERAL INTEGRATION RULES
====================================================================

1. Do NOT paste the full contents of external files into the root instructions file.
2. Use nested, referenced, or domain-scoped instruction files as appropriate.
3. Preserve existing project rules unless explicitly approved for modification.
4. Before overwriting or merging any conflicting rules, STOP and ask for clarification.
5. Normalize terminology and structure where possible, but never change meaning without confirmation.
6. Produce a summary of detected overlaps, contradictions, or redundancies before applying changes.
7. Maintain the project’s existing hierarchy and intent unless instructed otherwise.

====================================================================
SECTION 2 — RULESET DESTINATION LOGIC
====================================================================

Determine where the unified ruleset should live based on the repository’s established patterns:

1. If the repo contains **copilot-instructions.md**, use that as the primary ruleset file.
2. If the repo contains **AGENTS.md**, use that instead.
3. If the repo contains **CLAUDE.md**, use that instead.
4. If multiple exist, STOP and ask which one is authoritative.
5. If none exist, STOP and ask where the unified ruleset should be placed.
6. Never create a new root-level rules file without explicit approval.

====================================================================
SECTION 3 — DOMAIN-SCOPED INSTRUCTION FILE LOGIC
====================================================================

When integrating rules that apply to a specific domain, subsystem, or area of responsibility:

1. Detect whether the repository already uses domain-scoped instruction files.
   Examples:
   - ./github/instructions/frontend.instructions.md
   - ./github/instructions/backend.instructions.md
   - ./github/instructions/security.instructions.md

2. If such files exist, follow the established naming and placement conventions.

3. If the repo does NOT have domain-scoped instruction files:
   - Use the default pattern:
     `./github/instructions/DOMAIN.instructions.md`
   - Do NOT create new domain files unless the domain is clearly defined or approved.

4. When unsure whether a rule belongs in a domain file or the primary ruleset:
   - STOP and ask for clarification.

5. Domain-scoped files must be referenced from the primary ruleset file, not duplicated.

====================================================================
SECTION 4 — LANGUAGE-SCOPED RULE FILTERING
====================================================================

This repository may use a programming language from the imported
multi-language ruleset.

When processing instruction files that contain multiple language-specific
sections:

1. Detect the primary language of this repository based on:
   - existing source files,
   - existing configuration files,
   - or explicit user confirmation.

2. Load ONLY the rules for the detected language.

3. EXCLUDE all rules for languages that are not used in this repository.
   - Do NOT merge them.
   - Do NOT reference them.
   - Do NOT apply them implicitly or by analogy.

4. If the repository’s language cannot be determined with certainty:
   - STOP and ask which language should be used.

5. Do NOT create new language-specific instruction files unless the
   repository already uses that pattern or explicit approval is given.

6. If the multi-language file is kept intact:
   - Add a clarification block to the primary ruleset explaining that only
     the relevant language section should be applied.

====================================================================
SECTION 5 — CONFLICT DETECTION RULES
====================================================================

Detect and report the following types of conflicts:

A. Direct Contradictions  
B. Implicit Contradictions  
C. Terminology Conflicts  
D. Scope Conflicts  
E. Redundancy & Duplication  
F. Missing Precedence

For each conflict, generate a structured report:

### Conflict Detected

- Type:
- Source A:
- Source B:
- Description:
- Proposed Resolutions:
  1. …
  2. …
  3. …
  4. Request clarification

Do not merge until conflicts are resolved.

====================================================================
SECTION 6 — VALIDATION CHECKLIST
====================================================================

For every rule in every file, evaluate:

1. Does this rule contradict an existing rule?
2. Does this rule implicitly undermine another rule?
3. Does this rule use inconsistent terminology?
4. Does this rule overlap in scope with another rule?
5. Is this rule a duplicate?
6. Does this rule require a precedence decision?
7. Does this rule introduce a workflow that conflicts with existing workflows?
8. Does this rule assume tools or environments not present in the project?
9. Does this rule require user approval before merging?
10. Does this rule require normalization or restructuring?

If any answer is “yes,” flag it before merging.

====================================================================
SECTION 7 — INTEGRATION WORKFLOW
====================================================================

Follow this workflow exactly:

1. Detect the repository’s existing primary instruction file:
   - copilot-instructions.md
   - AGENTS.md
   - CLAUDE.md
   - or ask if unclear.

2. Detect whether domain-scoped instruction files exist and follow their conventions.

3. Load all instruction files (project + imported).

4. Normalize formatting (headings, lists, indentation).

5. Extract all rules into a structured list.

6. Run the full conflict‑detection checklist.

7. Generate a conflict report.

8. STOP and request user approval before merging.

9. After approval:
   - Write the unified ruleset into the repo’s existing primary instruction file.
   - Write domain-specific rules into the appropriate domain-scoped files.
   - Create new domain-scoped files ONLY if explicitly approved.

10. Document:

- rules merged
- conflicts found
- unresolved questions
- any terminology normalization performed

11. Do NOT modify unrelated files unless explicitly instructed.

====================================================================
END OF PROMPT
====================================================================
