#!/usr/bin/env bash
# Open a new atrium room running Codex (the code-reviews launch profile) and start an adversarial
# review there. The reviewer follows ../reviewer.md, named by its absolute path, and messages its
# findings back to the pane that ran this script.
#
#   ~/.agents/skills/adversarial-review/scripts/adversarial-review.sh session [--profile <slug>] [--dry-run]
#   ~/.agents/skills/adversarial-review/scripts/adversarial-review.sh phase <ID> [--phase <id>] [--profile <slug>] [--dry-run]
#   ~/.agents/skills/adversarial-review/scripts/adversarial-review.sh plan <ID> [--profile <slug>] [--dry-run]
#
# Runs against the git repo of the current directory; <ID> is a row of its queue (e.g. QK-35).
# phase: --phase, else the 🟡 phase, else the ⏸ one, else the first ⬜. A ⬜ phase gets a plan-text
# review; any other mark an implementation review. A header the parser cannot read still takes an
# explicit --phase (kind=from-log). plan: all ⬜ → plan-text, else mixed.
# Unlike next-phase.sh a 🟡 phase is not refused: it is what an implementation review looks at.
# Driven by ../SKILL.md; the parser is ../../lib/queue-plan.cjs.
set -euo pipefail

usage() {
  echo "usage: $0 session|phase|plan [<ID>] [--phase <id>] [--profile <slug>] [--dry-run]   (ID like QK-35)" >&2
  exit 2
}

MODE=''
ID=''
PHASE=''
PROFILE='code-reviews'
DRY_RUN=0
while (($#)); do
  case "$1" in
    session | phase | plan) [[ -z "$MODE" ]] || usage; MODE="$1" ;;
    --phase) (($# > 1)) || usage; PHASE="$2"; shift ;;
    --profile) (($# > 1)) || usage; PROFILE="$2"; shift ;;
    --dry-run) DRY_RUN=1 ;;
    -*) usage ;;
    *) [[ -z "$ID" && "$1" =~ ^[A-Z][A-Z0-9]*-[0-9]+$ ]] || usage; ID="$1" ;;
  esac
  shift
done
[[ -n "$MODE" ]] || usage
if [[ "$MODE" == session ]]; then
  [[ -z "$ID" && -z "$PHASE" ]] || usage
else
  [[ -n "$ID" ]] || usage
  [[ "$MODE" == phase || -z "$PHASE" ]] || usage
fi

ORIGIN="${ATRIUM_PANE_ID:-}"
if [[ -z "$ORIGIN" ]]; then
  if [[ "$DRY_RUN" == 1 ]]; then
    ORIGIN='<origin-pane-id>'
  else
    echo "ATRIUM_PANE_ID is unset: run this from an atrium agent pane so the findings have a pane to come back to" >&2
    exit 1
  fi
fi

# A reviewer never starts a review. Every reviewer opens in a room named "Review: …" (below), and a
# session reviewer reads a transcript that shows /adversarial-review being typed: without this, a
# Codex reviewer that takes that as a request would chain reviewers with no prompt, because the
# Codex rule lets this script run unsandboxed. next-phase has no such guard: it is chained on purpose.
REVIEW_ROOM_PREFIX='Review: '
CLI="${ATRIUM_CLI_PATH:-atrium}"
if [[ -n "${ATRIUM_PANE_ID:-}" ]]; then
  # Fails closed on a real run: no listing, no row for this pane, or an empty room all refuse, since
  # none of them shows the caller is outside a reviewer room. A dry-run starts nothing, so it goes on.
  ROOM_OF_ORIGIN=''
  if PANES_JSON="$("$CLI" pane list --json 2>/dev/null)"; then
    ROOM_OF_ORIGIN="$(node -e '
      let p;
      try { p = JSON.parse(process.argv[1]).find((x) => x.id === process.argv[2]); } catch {}
      console.log(typeof p?.room === "string" ? p.room : "");
    ' "$PANES_JSON" "$ATRIUM_PANE_ID")"
    [[ -n "$ROOM_OF_ORIGIN" ]] || WHY="no room found for pane $ATRIUM_PANE_ID in the atrium pane list"
  else
    WHY='cannot list atrium panes (in Codex, run by the absolute path)'
  fi
  if [[ -z "$ROOM_OF_ORIGIN" && "$DRY_RUN" != 1 ]]; then
    echo "refused: $WHY, so this pane cannot be shown not to be a reviewer" >&2
    exit 1
  fi
  if [[ "$ROOM_OF_ORIGIN" == "$REVIEW_ROOM_PREFIX"* ]]; then
    echo "refused: this pane is in room \"$ROOM_OF_ORIGIN\", so it is a reviewer — a reviewer never starts a review" >&2
    exit 1
  fi
fi

# This script runs through a symlink (~/.agents/skills/…): find the brief and lib/ through the real
# path. ⛔ Not `cd "$(dirname "$0")/.."`: bash resolves `..` textually, so that stays on the link.
SELF_DIR="$(cd -P "$(dirname "$0")" && pwd -P)"
SKILL_DIR="$(dirname "$SELF_DIR")"
SKILLS_ROOT="$(dirname "$SKILL_DIR")"
REPO="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "not in a git repo ($PWD): run this from the repo to review" >&2
  exit 1
}

# Prints three lines: room name, prompt, then a warning (may be empty).
read -r -d '' RESOLVE_JS <<'EOF' || true
const { MODE, ID, PHASE, ORIGIN, REPO, LIB, BRIEF } = process.env;
const { fail, resolvePlan } = require(LIB);
let warning = '';
let fields;
let room;
if (MODE === 'session') {
  fields = { mode: 'session', kind: 'session' };
  room = 'Review: session';
} else {
  const { rel, status, phases } = resolvePlan(REPO, ID);
  if (MODE === 'phase' && !phases.length) {
    // An unparsable header (`**Status: …**`) cannot say the mark; the phase's completion log can.
    if (!PHASE) fail(`${rel}: no phases parsed from the **Status:** line — pass --phase <id>, or run "plan ${ID}"`);
    fields = { mode: 'phase', kind: 'from-log', id: ID, plan: rel, phase: PHASE };
    room = `Review: ${ID} Phase ${PHASE}`;
    warning = `⚠️ no phases parsed from the **Status:** line — the reviewer reads Phase ${PHASE}'s mark from its completion log`;
  } else if (MODE === 'phase') {
    const first = (mark) => phases.find((p) => p.mark === mark);
    const picked = PHASE
      ? phases.find((p) => p.id === PHASE)
      : first('🟡') ?? first('⏸') ?? first('⬜');
    if (!picked) fail(PHASE ? `${rel}: no Phase ${PHASE} in the **Status:** line` : `${rel}: every phase is done — pass --phase <id>`);
    const kind = picked.mark === '⬜' ? 'plan-text' : 'implementation';
    fields = { mode: 'phase', kind, id: ID, plan: rel, phase: `${picked.id} ${picked.mark}` };
    room = `Review: ${ID} Phase ${picked.id}`;
  } else {
    let started;
    if (phases.length) {
      started = phases.some((p) => p.mark !== '⬜');
    } else {
      started = !/⬜/.test(status);
      warning = `⚠️ no phases parsed from the **Status:** line — judged "${status}" from the queue row`;
    }
    fields = { mode: 'plan', kind: started ? 'mixed' : 'plan-text', id: ID, plan: rel };
    room = `Review: ${ID} plan`;
  }
}
fields.origin = ORIGIN;
const args = Object.entries(fields).map(([k, v]) => `${k}=${v}`).join('; ');
console.log(room);
console.log(`Read ${BRIEF} and follow it. ${args}`);
console.log(warning);
EOF
RESOLVED="$(MODE="$MODE" ID="$ID" PHASE="$PHASE" ORIGIN="$ORIGIN" REPO="$REPO" \
  LIB="$SKILLS_ROOT/lib/queue-plan.cjs" BRIEF="$SKILL_DIR/reviewer.md" node -e "$RESOLVE_JS")"

ROOM="$(sed -n 1p <<<"$RESOLVED")"
PROMPT="$(sed -n 2p <<<"$RESOLVED")"
WARNING="$(sed -n 3p <<<"$RESOLVED")"

echo "repo:    $REPO"
echo "room:    $ROOM"
echo "profile: codex/$PROFILE"
echo "prompt:  $PROMPT"
[[ -n "$WARNING" ]] && echo "$WARNING"

if [[ "$DRY_RUN" == 1 ]]; then
  exit 0
fi

command -v "$CLI" >/dev/null 2>&1 || {
  echo "atrium CLI not found (set ATRIUM_CLI_PATH or put atrium on PATH)" >&2
  exit 1
}

PANE_JSON="$("$CLI" pane create --adapter codex --profile "$PROFILE" --name "$ROOM" --cwd "$REPO" --json)"
PANE_ID="$(node -e 'console.log(JSON.parse(process.argv[1]).paneId ?? "")' "$PANE_JSON")"
if [[ -z "$PANE_ID" ]]; then
  echo "pane create returned no paneId: $PANE_JSON" >&2
  exit 1
fi

# A freshly created pane can take a moment to accept input.
for attempt in 1 2 3 4 5; do
  if "$CLI" agent message "$PANE_ID" --no-frame "$PROMPT" 2>&1 | grep -q 'submitted: true'; then
    echo "started: room \"$ROOM\", pane $PANE_ID — findings will be messaged back to pane $ORIGIN"
    exit 0
  fi
  sleep 2
done
echo "pane $PANE_ID created but the prompt was not submitted after $attempt tries; send it by hand: $PROMPT" >&2
exit 1
