#!/usr/bin/env bash
# Open a new atrium room running Claude Code and start the next phase of a queue item.
#
#   ~/.agents/skills/next-phase/scripts/next-phase.sh <ID> [--dry-run]
#
# Runs against the git repo of the current directory. Looks up <ID> (e.g. QK-35) in that repo's
# docs/proposals/_implementation-order.md, reads the linked doc's **Status:** line and picks the
# phase: the ⏸ paused one ("resume Phase <N> of <ID>", room "<ID> Phase <N> (resume)"), else the
# first ⬜ ("do Phase <N> of <ID>"). Unparsable → "do next phase of <ID>", with a warning.
# Refuses while a phase is 🟡 (another pane may be on it) or more than one is ⏸.
# Driven by ../SKILL.md; the parser is ../../lib/queue-plan.cjs.
set -euo pipefail

usage() {
  echo "usage: $0 <ID> [--dry-run]   (ID like QK-35)" >&2
  exit 2
}

ID=''
DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    -*) usage ;;
    *) [[ -z "$ID" && "$arg" =~ ^[A-Z][A-Z0-9]*-[0-9]+$ ]] || usage; ID="$arg" ;;
  esac
done
[[ -n "$ID" ]] || usage

# This script runs through a symlink (~/.agents/skills/…): find lib/ through the real path.
# ⛔ Not `cd "$(dirname "$0")/../.."`: bash resolves `..` textually, so that lands in ~/.agents/skills.
SELF_DIR="$(cd -P "$(dirname "$0")" && pwd -P)"
SKILLS_ROOT="$(dirname "$(dirname "$SELF_DIR")")"
REPO="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "not in a git repo ($PWD): run this from the repo whose queue holds $ID" >&2
  exit 1
}

# Prints four lines: plan path (repo-relative), room name, prompt, then a warning (may be empty).
# Read into a variable first: bash mis-parses a heredoc inside $( ) when the code has unbalanced parens.
read -r -d '' RESOLVE_JS <<'EOF' || true
const { ID, REPO, LIB } = process.env;
const { resolvePlan } = require(LIB);
const { rel, status, phases } = resolvePlan(REPO, ID);
if (/✅|⛔/.test(status)) {
  console.error(`${ID} is "${status}" — nothing to do`);
  process.exit(1);
}
let room = `${ID} next phase`;
let prompt = `do next phase of ${ID}`;
let warning = '';
const ids = (mark) => phases.filter((p) => p.mark === mark).map((p) => `Phase ${p.id}`);
if (ids('🟡').length) {
  console.error(`${rel}: ${ids('🟡').join(', ')} 🟡 in progress — another pane may be on it; mark it ⏸ to resume`);
  process.exit(1);
}
if (ids('⏸').length > 1) {
  console.error(`${rel}: ${ids('⏸').join(', ')} all ⏸ paused — leave one ⏸ to pick which to resume`);
  process.exit(1);
}
const paused = phases.find((p) => p.mark === '⏸');
const next = phases.find((p) => p.mark === '⬜');
if (paused) {
  room = `${ID} Phase ${paused.id} (resume)`;
  prompt = `resume Phase ${paused.id} of ${ID}`;
} else if (next) {
  room = `${ID} Phase ${next.id}`;
  prompt = `do Phase ${next.id} of ${ID}`;
} else {
  warning = `⚠️ no ⬜ or ⏸ phase parsed from the **Status:** line — sending the generic prompt`;
}
console.log(rel);
console.log(room);
console.log(prompt);
console.log(warning);
EOF
RESOLVED="$(ID="$ID" REPO="$REPO" LIB="$SKILLS_ROOT/lib/queue-plan.cjs" node -e "$RESOLVE_JS")"

PLAN="$(sed -n 1p <<<"$RESOLVED")"
ROOM="$(sed -n 2p <<<"$RESOLVED")"
PROMPT="$(sed -n 3p <<<"$RESOLVED")"
WARNING="$(sed -n 4p <<<"$RESOLVED")"

echo "repo:   $REPO"
echo "plan:   $PLAN"
echo "room:   $ROOM"
echo "prompt: $PROMPT"
[[ -n "$WARNING" ]] && echo "$WARNING"

if [[ "$DRY_RUN" == 1 ]]; then
  exit 0
fi

CLI="${ATRIUM_CLI_PATH:-atrium}"
command -v "$CLI" >/dev/null 2>&1 || {
  echo "atrium CLI not found (set ATRIUM_CLI_PATH or put atrium on PATH)" >&2
  exit 1
}

PANE_JSON="$("$CLI" pane create --adapter claude-code --name "$ROOM" --cwd "$REPO" --json)"
PANE_ID="$(node -e 'console.log(JSON.parse(process.argv[1]).paneId ?? "")' "$PANE_JSON")"
if [[ -z "$PANE_ID" ]]; then
  echo "pane create returned no paneId: $PANE_JSON" >&2
  exit 1
fi

# A freshly created pane can take a moment to accept input.
for attempt in 1 2 3 4 5; do
  if "$CLI" agent message "$PANE_ID" --no-frame "$PROMPT" 2>&1 | grep -q 'submitted: true'; then
    echo "started: room \"$ROOM\", pane $PANE_ID"
    exit 0
  fi
  sleep 2
done
echo "pane $PANE_ID created but the prompt was not submitted after $attempt tries; send it by hand: $PROMPT" >&2
exit 1
