#!/usr/bin/env bash
# Link the agent skills in this folder into every user-level skill directory, and write the Codex
# rule that lets their scripts reach Atrium. See README.md.
#
#   agent-skills/install.sh [--dry-run]               install, or repair; safe to re-run
#   agent-skills/install.sh --uninstall [--dry-run]   remove only what this script made
#
# Refuses, before changing anything, if a destination exists and is not this script's own link.
set -euo pipefail

usage() {
  echo "usage: $0 [--uninstall] [--dry-run]" >&2
  exit 2
}

UNINSTALL=0
DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --uninstall) UNINSTALL=1 ;;
    --dry-run) DRY_RUN=1 ;;
    *) usage ;;
  esac
done

SRC="$(cd -P "$(dirname "$0")" && pwd -P)"
RULES_FILE="$HOME/.codex/rules/agent-skills.rules"
RULES_MARK="# Written by network-config/agent-skills/install.sh"

# act <message> <command…>: runs the command and prints the message; with --dry-run, prints the
# command instead.
act() {
  local message="$1"
  shift
  if [[ "$DRY_RUN" == 1 ]]; then
    echo "would:  $*"
  else
    "$@"
    echo "$message"
  fi
}

SKILLS=()
for dir in "$SRC"/*/; do
  name="$(basename "$dir")"
  [[ -f "$dir/SKILL.md" ]] && SKILLS+=("$name")
done
((${#SKILLS[@]})) || { echo "no skills found under $SRC" >&2; exit 1; }

# ~/.agents/skills is required: every SKILL.md names its script by that path. The Claude Code
# directories are used only when that profile exists on this machine.
TARGETS=("$HOME/.agents/skills")
for config in "$HOME/.claude" "$HOME/.claude-secondary"; do
  if [[ -d "$config" ]]; then
    TARGETS+=("$config/skills")
  else
    echo "skip: $config does not exist"
  fi
done

# Pass 1: check every destination before touching any.
conflicts=0
for target in "${TARGETS[@]}"; do
  for name in "${SKILLS[@]}"; do
    dest="$target/$name"
    if [[ -L "$dest" ]]; then
      [[ "$(readlink "$dest")" == "$SRC/$name" ]] && continue
      echo "conflict: $dest is a link to $(readlink "$dest"), not to $SRC/$name" >&2
      conflicts=1
    elif [[ -e "$dest" ]]; then
      echo "conflict: $dest exists and is not a link" >&2
      conflicts=1
    fi
  done
done
# Ours is only ever a regular file. ⛔ Test -L first: -e is false for a dangling link, and writing
# through one would create the rules wherever it points.
if [[ -L "$RULES_FILE" ]]; then
  echo "conflict: $RULES_FILE is a symlink (to $(readlink "$RULES_FILE")); this script writes only a regular file" >&2
  conflicts=1
elif [[ -e "$RULES_FILE" ]] && ! { [[ -f "$RULES_FILE" ]] && head -1 "$RULES_FILE" | grep -qF "$RULES_MARK"; }; then
  echo "conflict: $RULES_FILE exists and was not written by this script" >&2
  conflicts=1
fi
if ((conflicts)); then
  echo "nothing changed: move the conflicting entries aside, then re-run" >&2
  exit 1
fi

# Pass 2: act.
if [[ "$UNINSTALL" == 1 ]]; then
  for target in "${TARGETS[@]}"; do
    for name in "${SKILLS[@]}"; do
      dest="$target/$name"
      if [[ -L "$dest" ]]; then
        act "unlinked: $dest" rm "$dest"
      fi
    done
  done
  if [[ -e "$RULES_FILE" ]]; then
    act "removed: $RULES_FILE" rm "$RULES_FILE"
  fi
  exit 0
fi

for target in "${TARGETS[@]}"; do
  [[ -d "$target" ]] || act "created: $target" mkdir -p "$target"
  for name in "${SKILLS[@]}"; do
    dest="$target/$name"
    if [[ -L "$dest" ]]; then
      echo "ok:     $dest"
    else
      act "linked: $dest -> $SRC/$name" ln -s "$SRC/$name" "$dest"
    fi
  done
done

# Codex runs a script in its sandbox, which refuses the Atrium socket. A prefix_rule lets one run
# outside it with no prompt, but only when the command is the absolute path: `~/…` is wrapped as
# `zsh -lc "<string>"` and never matches. So $HOME is expanded here, not in the rule.
if [[ -d "$HOME/.codex" ]]; then
  rules="$RULES_MARK — re-run it rather than editing this file."
  for name in "${SKILLS[@]}"; do
    for script in "$SRC/$name"/scripts/*.sh; do
      [[ -f "$script" ]] || continue
      rules+=$'\n'"prefix_rule(pattern=[\"$HOME/.agents/skills/$name/scripts/$(basename "$script")\"], decision=\"allow\")"
    done
  done
  if [[ -f "$RULES_FILE" && "$(cat "$RULES_FILE")" == "$rules" ]]; then
    echo "ok:     $RULES_FILE"
  elif [[ "$DRY_RUN" == 1 ]]; then
    echo "would write $RULES_FILE:"
    echo "$rules"
  else
    mkdir -p "$(dirname "$RULES_FILE")"
    printf '%s\n' "$rules" >"$RULES_FILE"
    echo "wrote:  $RULES_FILE"
  fi
else
  echo "skip: $HOME/.codex does not exist (no Codex rule written)"
fi
