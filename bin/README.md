# bin/

Personal PATH-invokable scripts.

## claude-launch

Open Claude Code in its own named tmux session for a project, with the shared MCP
secrets loaded from `bin/.env`.

```
claude-launch <alias> [extra claude args...]
```

| Alias          | Directory                              |
| -------------- | -------------------------------------- |
| `medical`      | `~/github/medical-wiki`                |
| `reading-code` | `~/github/readingorder.info-2025`      |
| `reading-wiki` | `~/github/readingorder.wiki`           |
| `network`      | `~/github/network-config`              |

Behavior:
- Creates a tmux session named after the alias; if one already exists it appends a
  number (`network`, `network-2`, `network-3`, …).
- Sources `bin/.env` **inside** the session (keeps secrets off `ps` output) so the
  `${VAR}` references in each project's `.mcp.json` resolve.
- Auto-attaches (or `switch-client` if you're already inside tmux).

### Setup

```sh
cp bin/.env.example bin/.env   # bin/.env is gitignored
chmod 600 bin/.env             # fill in the real token values
```

Put the dir on your PATH (add to `~/.zshrc`):

```sh
export PATH="$HOME/github/network-config/bin:$PATH"
```
