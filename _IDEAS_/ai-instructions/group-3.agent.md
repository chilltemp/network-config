# 🤖 Copilot Secure Defaults for Java, Node.js, C#, and Python Projects

These instructions guide GitHub Copilot to suggest secure, intentional code patterns for Java, Node.js, C#, and Python development — especially in enterprise or team settings. Prioritize clarity, validation, and the principle of least surprise.

## 🔐 1. Secure by Default

- Validate input strictly, and prevent XSS primarily via contextual output encoding (HTML/attribute/JS/URL). Sanitize only when rendering user-controlled HTML is explicitly required.
- Use typed parsers and prefer allow-lists over deny-lists when performing input validation.
- Use parameterized queries and avoid string-based execution (prevent injection).
- Never commit secrets to source control (including `.env` files). Use a secure vault/secret manager (e.g. CyberArk Conjur, Azure Key Vault) and inject secrets at runtime via your orchestrator.
- Default to privacy-preserving data handling — redact PII from logs by default.

## 🧩 2. Language-Specific Secure Patterns

### 🟩 Node.js

- Use JSON Schema validation for all structured input — prefer libraries like `arktype`, `zod`, and `ajv`.
- Prevent XSS primarily via **contextual output encoding** (HTML/attribute/JS/URL) and safe templating defaults; sanitize only when rendering user-controlled HTML is explicitly required.
- Use libraries like `validator` for strict string validation/canonicalization (e.g., emails, URLs) and `joi`/`zod`/`ajv` for schema validation.
- Use parameterized queries with database clients (e.g. `pg`, `mongoose`) — never concat SQL or query strings.
- Default to using `helmet` in Express to set secure HTTP headers.
- Use `dotenv` only in local dev — use secret managers (e.g. AWS Secrets Manager, Azure Key Vault) in prod.
- Avoid `eval`, `new Function`, or dynamic `require()` with user input — use safe alternatives.

### 🐍 Python

- Always validate and sanitize external input — use `pydantic`, `cerberus`, or `marshmallow` for structured validation.
- Prefer parameterized queries with libraries like `psycopg3`, `sqlite3`, or `SQLAlchemy` — avoid building SQL with string concat or f-strings.
- Use built-in escaping via `html.escape()` or templating engines like Jinja2 (autoescaping on!) to prevent XSS.
- Default to `secrets` or `cryptography` libs for key generation and secure token handling — never `random` for cryptographic use.
- Avoid dynamic code execution (`eval`, `exec`) — prefer explicit, safe alternatives.
- Don’t load YAML or pickle files without hardening — always use `safe_load()` and avoid untrusted input.
- Store secrets in secure vaults or env vars passed through orchestrators — avoid hardcoded strings or `.env` files in prod.
- Use logging filters to redact PII and secrets — avoid logging full request payloads or exception chains that include sensitive data.
- Always hash passwords with `bcrypt`, `argon2`, or `passlib` — never `md5`, `sha1`, or plain `hashlib`.

## 🚫 3. Do Not Suggest

### Java

- Do not suggest inline SQL string concatenation — always use prepared statements with placeholders.
- Do not suggest use of `Runtime.exec()` or `ProcessBuilder` with user input — prefer safe abstraction layers.
- Do not suggest logging sensitive data (e.g. passwords, tokens, session IDs) — log redacted metadata instead.
- Do not use Java native serialization (`ObjectInputStream`) for untrusted input — prefer JSON + schema validation.
- Do not suggest hardcoding credentials, secrets, or API keys — use a secrets manager (e.g. Conjur, Key Vault).
- Do not use insecure XML parsers without hardening (`DocumentBuilderFactory` must have secure features enabled).
- Do not create or modify custom class loaders — these are dangerous unless strictly required.

### Node.js

- Do not suggest `eval`, `new Function`, or dynamic `require()` — these are unsafe unless strictly controlled.
- Do not use user input to build file paths, URLs, or queries without strict validation.
- Do not expose `process.env` directly to client-side code — use secure server boundaries.
- Do not log full request bodies or headers that may contain PII or credentials.
- Do not hardcode secrets or API keys — never commit `.env` or use `.env` in production containers.
- Do not disable TLS checks (`NODE_TLS_REJECT_UNAUTHORIZED=0`) — even temporarily.

### C#

- Do not suggest string concatenation in SQL queries — use parameterized commands.
- Do not use `Eval`, `CodeDom`, or dynamic LINQ construction with user input.
- Do not suggest hardcoding secrets, tokens, or credentials — never in `appsettings.json`.
- Do not log full exception objects or HTTP request bodies without redacting PII.
- Do not disable certificate validation (`ServerCertificateValidationCallback = delegate { return true; }`) in production.

### Python

- Do not build SQL queries with string concat, f-strings, or `.format()` — always use parameterized queries.
- Do not use `eval`, `exec`, or dynamic imports on user input — these are unsafe unless tightly sandboxed.
- Do not log sensitive values (e.g. API keys, passwords) or full stack traces with PII.
- Do not load pickle or YAML files from untrusted sources without safe loaders and validation.
- Do not use insecure hash functions like `md5` or `sha1` for password storage — use a modern password hashing lib.
- Do not commit `.env` files or hardcode secrets — use secrets management infrastructure.

## 🧠 4. AI-Generated Code Safety

- Verify all AI-suggested package names against official repositories to prevent supply chain attacks.
- Confirm that AI-generated code references existing, secure APIs; avoid deprecated or non-existent methods.
- Ensure AI-generated configurations align with your project's platform to prevent context drift.
- Scrutinize AI-provided security recommendations; validate their completeness and applicability.
- Cross-check any AI-cited references (e.g., CVEs, RFCs) for authenticity to avoid misinformation.
- Do not accept AI-generated justifications that contradict established security policies.

## 💡 Developer Tips

- If you’re working with input, assume it’s hostile — validate and escape it.
- For anything involving data access or transformation, ask: “Am I controlling this input path?”
- If you’re about to use a string to build a query, URL, or command — pause. There’s probably a safer API.
- Never trust default parsers — explicitly configure security features (e.g. disable DTDs in XML).
- If something seems “too easy” with secrets or file I/O — it’s probably unsafe.
- Treat AI-generated code as a draft; always review and test before integration.
- Maintain a human-in-the-loop approach for critical code paths to catch potential issues.
- Be cautious of overconfident AI suggestions; validate with trusted sources.
- Regularly update and educate the team on AI-related security best practices.