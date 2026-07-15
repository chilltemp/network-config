# bin/

Personal PATH-invokable scripts.

## ccl

Interactive launcher: open Claude Code in its own named tmux session, choosing a
project, account profile, and session — with the shared MCP secrets from `bin/.env`
loaded into the session.

```
ccl [extra claude args...]
```

Three arrow-key selects, each defaulted so **pressing Enter three times** launches the
highlighted project under the Primary account in a fresh session:

1. **Project** — one of the aliases below.
2. **Account profile** — `Primary` (`~/.claude`, default) or `Secondary`
   (`~/.claude-secondary`). Selected via `CLAUDE_CONFIG_DIR`.
3. **Session** — `New session` (default) or resume one of the 10 most recent sessions
   for that project, drawn from **both** profiles.

| Alias          | Directory                              |
| -------------- | -------------------------------------- |
| `medical`      | `~/github/medical-wiki`                |
| `reading-code` | `~/github/readingorder.info-2025`      |
| `reading-wiki` | `~/github/readingorder.wiki`           |
| `network`      | `~/github/network-config`              |

Behavior:
- **One shared name** across all surfaces: the tmux session name = the alias (`network`,
  then `network-2`, …; Secondary-account sessions use an `-alt` suffix, `network-alt`), and
  that same name is also passed to `claude --name` and set as the tmux window / terminal-tab
  title (`set-titles` + `allow-rename off`, so Claude's own title updates don't override it).
- **Cross-profile resume**: pick a session that lives under the *other* account and its
  transcript (`<config>/projects/<encoded-cwd>/<uuid>.jsonl`) is copied into the target
  profile before `claude --resume <uuid>` runs.
- **Secrets**: `bin/.env` is loaded **inside** the session (keeps values off `ps` output)
  so the `${VAR}` references in each project's `.mcp.json` resolve.
- **Auto-attaches** (or `switch-client` if you're already inside tmux).

### Why `bin/.env` is read literally (not via dotenv)

Values are parsed **literally** — read line by line and exported without any shell
`eval`/`source` and without a dotenv loader. This is deliberate:

- Every special character survives verbatim — `& $ * % ^ " ' ` `` ( ) ; | < > = \` and
  backslashes — and `$(...)`/backticks are stored as literal text with no expansion or
  execution.
- A dotenv-style loader would **regress** this: it strips surrounding quotes and expands
  `$VAR` inside values, mangling raw tokens.

So: paste raw token values as-is — **no quoting or escaping**, even for shell
metacharacters. `#` starts a comment only at the very start of a line.

### Setup

One-time dependency install (the launcher uses `@clack/prompts`; `bin/node_modules/` is
gitignored):

```sh
cd bin && npm install
```

Secrets file (`bin/.env` is gitignored):

```sh
cp bin/.env.example bin/.env
chmod 600 bin/.env             # fill in the real token values
```

Put the dir on your PATH (add to `~/.zshrc`):

```sh
export PATH="$HOME/github/network-config/bin:$PATH"
```
