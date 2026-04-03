### 1. Plan Mode Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop

- After ANY correction from the user: update `.github/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: “Would a staff engineer approve this?”
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

================================
/init Incorporate the following, use referenced instruction files where appropriate

# Follow the Single Responsibility Principle (SRP):

- "Each function, class, or component must have only one responsibility or task."
- "If a function or class is performing more than one logical operation, split it into smaller, dedicated units."
- "Name functions and classes descriptively to clearly indicate their single purpose."

# Limit Scope and Size:

- "Functions should be small, ideally under 20 lines of code, and perform a single, well-defined action."
- "Avoid large, monolithic components; use composition to build larger functionalities from smaller, independent components."
- "Limit the number of dependencies a module or class has (Law of Demeter / Least Knowledge Principle)."

# Organize Files Logically:

- "Group related files by feature or functionality rather than by type (e.g., all authentication files in /features/auth instead of all controllers in /controllers)."
- "Use a consistent folder structure across the project to improve navigation and understanding."
- "Separate concerns into different modules (e.g., data handling, UI rendering, business logic) to enhance maintainability and reusability."
