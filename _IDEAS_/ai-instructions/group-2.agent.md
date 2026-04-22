# Follow the Single Responsibility Principle (SRP):

- "Each function, class, or component must have only one responsibility or task."
- "If a function or class is performing more than one logical operation, split it into smaller, dedicated units."
- "Name functions and classes descriptively to clearly indicate their single purpose."

# Limit Scope and Size:

- "Functions should be small, ideally under 40 lines of code, and perform a single, well-defined action."
- "Avoid large, monolithic components; use composition to build larger functionalities from smaller, independent components."
- "Limit the number of dependencies a module or class has (Law of Demeter / Least Knowledge Principle)."

# Organize Files Logically:

- "Group related files by feature or functionality rather than by type (e.g., all authentication files in /features/auth instead of all controllers in /controllers)."
- "Use a consistent folder structure across the project to improve navigation and understanding."
- "Separate concerns into different modules (e.g., data handling, UI rendering, business logic) to enhance maintainability and reusability."
