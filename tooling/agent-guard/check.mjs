#!/usr/bin/env node
/**
 * Agent-instructions guard (QN-17). Hand-run, never hooked:
 *
 *   node tooling/agent-guard/check.mjs                 # every check; exits 1 on any hard failure
 *   node tooling/agent-guard/check.mjs --only <check>  # one check
 *   node --test tooling/agent-guard/check.test.mjs     # the fixtures
 *
 * Ported from karens-database's `tooling/agent-guard/src/` (QI-30, TypeScript, vitest, js-yaml,
 * marked), with its Handback H5–H15 fixes. Here it is plain ESM with no dependencies, so the
 * frontmatter and Claude Code's `@` import model are strict line parsers. The design is the plan's
 * §Design → Guard (docs/plans/agent-instructions-migration-plan.md).
 *
 * The repo root is `git rev-parse --show-toplevel` of the working directory, so the guard checks
 * whichever checkout it is run from.
 */
import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join, posix } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------------------------
// Markdown primitives (karens-database markdown.ts, unchanged in behaviour)
// ---------------------------------------------------------------------------------------------

const blank = (s) => s.replace(/[^\n]/g, " ");

/** `text` with each range blanked to spaces, keeping line breaks so offsets and lines hold. */
export function blankRanges(text, ranges) {
  let out = "";
  let at = 0;
  for (const r of [...ranges].sort((a, b) => a.index - b.index)) {
    out += text.slice(at, r.index) + blank(text.slice(r.index, r.index + r.length));
    at = r.index + r.length;
  }
  return out + text.slice(at);
}

/** Fenced blocks blanked. A fence may be indented ≤3 spaces and closes only on a run ≥ its opener (H6, H11). */
export function stripFences(text) {
  return text.replace(/^ {0,3}((`|~)\2{2,})[^\n]*\n[\s\S]*?^ {0,3}\1\2*[ \t]*$/gm, blank);
}

/** Fences and inline code spans blanked. A span closes only on a backtick run as long as its opener. */
export function stripCode(text) {
  return stripFences(text).replace(/(?<!`)(`+)(?!`)[^\n]*?(?<!`)\1(?!`)/g, blank);
}

/** CommonMark's label match: case-insensitive, whitespace runs collapsed. */
export const normalizeLabel = (label) => label.trim().replace(/\s+/g, " ").toLowerCase();

/** A bare link destination: no whitespace, parentheses only when balanced (H10). */
const BARE_DESTINATION = [1, 2, 3].reduce(
  (inner) => String.raw`(?:[^\s()]|\(${inner}*\))`,
  String.raw`[^\s()]`,
);
const INLINE_LINK = new RegExp(
  String.raw`\]\(\s*(?:<([^>\n]*)>|(${BARE_DESTINATION}+))(?:\s+(?:"[^"\n]*"|'[^'\n]*'))?\s*\)`,
  "g",
);
const INLINE_LINK_WITH_LABEL = new RegExp(
  String.raw`\[((?:[^[\]]|\[[^\]]*\])*)\](\(\s*(?:<([^>\n]*)>|(${BARE_DESTINATION}+))(?:\s+(?:"[^"\n]*"|'[^'\n]*'))?\s*\))`,
  "g",
);

/**
 * Every link destination outside code: inline `](dest)`, `](<dest>)`, and reference definitions
 * `[label]: dest` (not a `[^n]:` footnote). `{ index, target, label? }`, sorted by offset.
 */
export function markdownDestinations(text) {
  const body = stripCode(text);
  const found = [];
  for (const m of body.matchAll(INLINE_LINK)) {
    const target = m[1] ?? m[2];
    found.push({ index: m.index + m[0].indexOf(target, 2), target });
  }
  for (const m of body.matchAll(
    /^( {0,3}\[)([^\]\n]+)(\]:[ \t]*(?:\n[ \t]*)?)(?:<([^>\n]*)>|(\S+))/gm,
  )) {
    const [, open, label, colon, angled, bare] = m;
    if (label.startsWith("^")) continue;
    const labelIndex = m.index + open.length;
    found.push({
      index: labelIndex + label.length + colon.length + (angled === undefined ? 0 : 1),
      target: angled ?? bare,
      label: { key: normalizeLabel(label), index: labelIndex, length: label.length },
    });
  }
  return found.sort((a, b) => a.index - b.index);
}

/** GitHub's heading slug: lowercased, punctuation dropped, each space → `-`. */
export const slugify = (heading) =>
  heading
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, "")
    .replace(/ /g, "-");

/** Heading slugs (de-duplicated as GitHub does) and `<a id|name>`s outside code (H6). */
export function anchorsOf(text) {
  const anchors = new Set();
  const seen = new Map();
  for (const m of stripFences(text).matchAll(/^#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/gm)) {
    const base = slugify(m[1].replace(/\[([^\]]*)\]\([^)]*\)/g, "$1"));
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    anchors.add(n === 0 ? base : `${base}-${n}`);
  }
  for (const m of stripCode(text).matchAll(/<a\s+(?:id|name)="([^"]+)"/g)) anchors.add(m[1]);
  return anchors;
}

const tryDecode = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return null;
  }
};
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const basename = (f) => f.slice(f.lastIndexOf("/") + 1);
const lineAt = (text, i) => text.slice(0, i).split("\n").length;

// ---------------------------------------------------------------------------------------------
// Discovery: git is the walker, never a directory walk (a dot-folder-skipping walker checks nothing)
// ---------------------------------------------------------------------------------------------

export const repoRoot = (cwd = process.cwd()) =>
  execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd, encoding: "utf8" }).trim();

/** The instruction surfaces. Checks over these also see untracked, non-ignored files. */
export const GOVERNED_PATHSPECS = [
  "AGENTS.md",
  "CLAUDE.md",
  ".claude/rules",
  ".claude/skills",
  ".agents/skills",
  "docs/agents/rationale",
];

function lsFiles(root, extra, pathspecs) {
  return execFileSync("git", ["ls-files", "-z", ...extra, "--", ...pathspecs], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
    .split("\0")
    .filter(Boolean);
}

/** Repo-relative files git knows, sorted. Symlinks listed as themselves; a deleted index entry dropped. */
export function trackedFiles(root, { untracked = false, pathspecs = [] } = {}) {
  const files = lsFiles(root, [], pathspecs);
  if (untracked) files.push(...lsFiles(root, ["--others", "--exclude-standard"], pathspecs));
  const present = files.filter((f) => {
    try {
      lstatSync(join(root, f));
      return true;
    } catch {
      return false;
    }
  });
  return [...new Set(present)].sort();
}

export const governedFiles = (root) =>
  trackedFiles(root, { untracked: true, pathspecs: GOVERNED_PATHSPECS });

// ---------------------------------------------------------------------------------------------
// Repo constants
// ---------------------------------------------------------------------------------------------

export const QUEUE = "docs/proposals/_implementation-order.md";
export const PLANS_DIR = "docs/plans";
export const INBOX = "docs/ai-lessons.md";
export const INBOX_MAX_LINES = 200;
export const RATIONALE_DIR = "docs/agents/rationale/";

/** Rule files that must exist. */
export const REQUIRED_RULES = [
  "ansible-safety",
  "compose-stack-conventions",
  "editing",
  "oversized-llm",
  "planning",
  "proposals",
].map((t) => `.claude/rules/${t}.md`);

/** Retired instruction surfaces. */
export const RETIRED_SURFACES = [
  ".github/copilot-instructions.md",
  ".github/instructions",
  ".github/agents",
  ".github/prompts",
  ".github/hooks",
];

/** Retired paths in any spelling: full path, basename, no `.md`. */
export const RETIRED_PATTERNS = [
  /copilot-instructions/,
  /\.instructions\b/,
  /\.github\/instructions/,
  /\.github\/(?:agents|prompts|hooks)(?![\w-])/,
];

/** History keeps the paths that were true when it was written (D13). */
const HISTORY_PREFIXES = ["docs/archive/", "docs/handoffs/", "_IDEAS_/"];
/** Exempt for good: rationale is history by design, and the guard must name what it rejects. */
const PERMANENT_PREFIXES = ["docs/agents/rationale/", "tooling/agent-guard/"];
/** QN-17's own record, exempt until the operator archives it. One that no longer exists fails as stale. */
export const NAMED_EXEMPTIONS = [
  "docs/agents/qn-17-rule-ledger.md",
  "docs/plans/agent-instructions-migration-plan.md",
  "docs/proposals/agent-instructions-migration-proposal.md",
];

export const isExempt = (file) =>
  NAMED_EXEMPTIONS.includes(file) ||
  [...HISTORY_PREFIXES, ...PERMANENT_PREFIXES].some((p) => file.startsWith(p));

/** `docs/index.md` keeps its `## Archive` section as history: blanked, so line numbers hold. */
export function withoutArchiveRows(file, text) {
  if (file !== "docs/index.md") return text;
  let archived = false;
  return text
    .split("\n")
    .map((line) => {
      if (line.startsWith("## ")) archived = /^## Archive\b/.test(line);
      return archived ? "" : line;
    })
    .join("\n");
}

const BINARY_EXT =
  /\.(png|jpe?g|gif|webp|avif|ico|svg|woff2?|ttf|otf|eot|pdf|zip|gz|mp4|webm|enc|lock)$/i;

const isInstructionFile = (f) =>
  f === "AGENTS.md" || f === "CLAUDE.md" || (f.startsWith(".claude/rules/") && f.endsWith(".md"));

/** The rationale file paired with an instruction file. */
export function rationalePathFor(file) {
  if (file === "AGENTS.md") return `${RATIONALE_DIR}agents.rationale.md`;
  if (file === "CLAUDE.md") return `${RATIONALE_DIR}claude.rationale.md`;
  return file.replace(/^\.claude\/rules\//, RATIONALE_DIR).replace(/\.md$/, ".rationale.md");
}

/** One repo snapshot: memoized file lists and reads. */
export function openRepo(root) {
  const cache = new Map();
  const once = (fn) => {
    let v;
    return () => (v ??= fn());
  };
  const isLink = (f) => lstatSync(join(root, f)).isSymbolicLink();
  const repo = {
    root,
    has: (f) => existsSync(join(root, f)),
    read: (f) => {
      if (!cache.has(f)) cache.set(f, readFileSync(join(root, f), "utf8"));
      return cache.get(f);
    },
    governed: once(() => governedFiles(root)),
    /** Tracked text files only, so another pane's unstaged draft cannot fail a run. */
    live: once(() => trackedFiles(root).filter((f) => !BINARY_EXT.test(f) && !isLink(f))),
    /** Live files plus the governed ones, so a new rule is scanned before it is staged (H13). */
    scanned: once(() =>
      [...new Set([...repo.live(), ...repo.governed().filter((f) => !isLink(f))])].sort(),
    ),
    instructions: once(() => repo.governed().filter(isInstructionFile)),
    rationale: once(() => repo.governed().filter((f) => f.startsWith(RATIONALE_DIR))),
  };
  return repo;
}

// ---------------------------------------------------------------------------------------------
// plan-status (karens-database plan-status-sync.test.ts, with H5, H7, H8)
// ---------------------------------------------------------------------------------------------

const MARK = "(⬜|🟡|⏸|✅|⚠️)";
const HEADER_PHASE = new RegExp(String.raw`Phase\s+([\w.-]+)\s+${MARK}`, "gu");
// The id capture is lazy, so `## Phases 2a-2b —` is a range, not one id (H7). Older plans use `:`.
const PHASE_HEADING = /^## Phases?\s+([\w.-]+?)(?:[–-]([\w.-]+))?(?:\s+—|:)/u;
const COMPLETION_LOG =
  /^\*\*Completion log(?:\s+([\w.-]+))?\*\*(?:\s+—|:)\s+_status:\s*(⬜|🟡|⏸|✅|⚠️|⛔)/u;
/** Any repo's prefix, so a row with a new prefix is read rather than skipped (H5). */
const ROW_ID = /^[A-Z][A-Z0-9]*-[0-9]+$/;

/** The `**Status:**` header's phase marks, fences stripped (H8); `undefined` when there is none. */
export function readHeader(text) {
  const line = stripFences(text)
    .split("\n")
    .find((l) => l.startsWith("**Status:**"));
  if (!line) return undefined;
  const phases = new Map([...line.matchAll(HEADER_PHASE)].map(([, id, mark]) => [id, mark]));
  return phases.size ? phases : undefined;
}

/** Each phase's completion-log mark, fences stripped (H8). */
export function readLogs(text) {
  const logs = new Map();
  let headingId;
  for (const line of stripFences(text).split("\n")) {
    const heading = line.match(PHASE_HEADING);
    if (heading) {
      headingId = heading[2] ? undefined : heading[1];
      continue;
    }
    if (line.startsWith("## ")) headingId = undefined;
    const log = line.match(COMPLETION_LOG);
    if (!log) continue;
    const id = log[1] ?? headingId;
    if (id) logs.set(id, log[2]);
  }
  return logs;
}

/** Every way a header and its logs disagree. */
export function statusDrift(header, logs) {
  const drift = [];
  for (const [id, mark] of logs)
    if (header.get(id) !== mark)
      drift.push(`Phase ${id}: header ${header.get(id) ?? "(missing)"}, completion log ${mark}`);
  for (const id of header.keys())
    if (!logs.has(id)) drift.push(`Phase ${id}: in the header, but no completion log was found`);
  return drift;
}

/** The phase a queue `Next:` names: 🟡, else ⏸, else the first ⬜. */
export function currentPhase(header) {
  const phases = [...header];
  const first = (mark) => phases.find(([, m]) => m === mark);
  return (first("🟡") ?? first("⏸") ?? first("⬜"))?.[0];
}

/** Rows of a `| # | Item | Sprint | Status | Notes |` table. */
export function parseQueueRows(text) {
  return text
    .split("\n")
    .map((line) => line.split("|").map((c) => c.trim()))
    .filter((cells) => ROW_ID.test(cells[1] ?? ""))
    .map(([, id, item, sprint, status, notes]) => ({ id, item, sprint, status, notes }));
}

/** The phase a row's Notes name (`Next: Phase 1.` → `1`, H5), and the plan its Item links. */
export function rowNext({ item, notes }) {
  const next = notes?.match(/Next: Phase ([\w-]+(?:\.[\w-]+)*)/u)?.[1];
  const link = item?.match(/\]\(\.\.\/(plans\/[^)#]+)/)?.[1];
  return next && link ? { next, plan: posix.join("docs", link) } : undefined;
}

function checkPlanStatus(repo) {
  const problems = [];
  const headers = new Map();
  for (const path of trackedFiles(repo.root, { pathspecs: [PLANS_DIR] })) {
    if (!path.endsWith(".md")) continue;
    const text = repo.read(path);
    const header = readHeader(text);
    if (!header) continue;
    headers.set(path, header);
    for (const d of statusDrift(header, readLogs(text))) problems.push(`${path}: ${d}`);
    const paused = [...header.values()].filter((m) => m === "⏸").length;
    if (paused > 1) problems.push(`${path}: ${paused} phases are ⏸; at most one`);
  }
  if (!repo.has(QUEUE)) return [...problems, `${QUEUE}: missing`];
  const rows = parseQueueRows(repo.read(QUEUE));
  if (rows.length === 0) problems.push(`${QUEUE}: no queue rows read`);
  for (const row of rows) {
    const r = rowNext(row);
    const header = r && headers.get(r.plan);
    if (!header) continue;
    const current = currentPhase(header);
    if (current !== r.next)
      problems.push(`${row.id}: the queue says Next: Phase ${r.next}, the plan's current phase is ${current ?? "(none)"}`);
  }
  return problems;
}

// ---------------------------------------------------------------------------------------------
// layout
// ---------------------------------------------------------------------------------------------

function checkLayout(repo) {
  const problems = [];
  for (const f of ["AGENTS.md", "CLAUDE.md", ...REQUIRED_RULES])
    if (!repo.has(f)) problems.push(`${f}: missing`);
  for (const f of RETIRED_SURFACES) if (repo.has(f)) problems.push(`${f}: retired surface still exists`);
  for (const f of trackedFiles(repo.root, { untracked: true }))
    if (f.endsWith(".instructions.md")) problems.push(`${f}: retired *.instructions.md file`);
  // Claude Code loads every .md under .claude/rules/ as a rule.
  for (const f of trackedFiles(repo.root, { untracked: true, pathspecs: [".claude/rules"] }))
    if (!f.endsWith(".md")) problems.push(`${f}: .claude/rules/ holds rule files only`);
  return problems;
}

// ---------------------------------------------------------------------------------------------
// frontmatter: a strict line parser in place of js-yaml
// ---------------------------------------------------------------------------------------------

/**
 * A one-line YAML scalar read as js-yaml would: `{ value }` when it is a string, else `{ problem }`.
 * Quoted forms are strings. A plain scalar fails when YAML would read it as something else: an
 * indicator start (`*` opens an alias, so a `**` glob must be quoted), a mapping or comment inside, or a
 * boolean, null or number (review M1).
 */
export function yamlString(raw) {
  const q = raw[0];
  if (q === "'" || q === '"') {
    const inner = raw.slice(1, -1);
    const closed =
      raw.length >= 2 &&
      raw.endsWith(q) &&
      (q === "'" ? !inner.replace(/''/g, "").includes("'") : !/(?<!\\)(?:\\\\)*"/.test(inner));
    return closed ? { value: q === "'" ? inner.replace(/''/g, "'") : inner } : { problem: "quote is not closed" };
  }
  if (/^[,[\]{}#&*!|>%@`'"]/.test(raw) || /^[-?:](\s|$)/.test(raw))
    return { problem: `starts with a YAML indicator; quote it: ${raw}` };
  if (/:(\s|$)/.test(raw) || /\s#/.test(raw)) return { problem: `holds ': ' or ' #'; quote it: ${raw}` };
  if (
    /^(true|false|yes|no|on|off|y|n|null|~)$/i.test(raw) ||
    /^[-+]?(\d[\d_]*(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/.test(raw) ||
    /^0[xo][\da-f_]+$/i.test(raw) ||
    /^[-+]?\.(inf|nan)$/i.test(raw)
  )
    return { problem: `is not a string; quote it: ${raw}` };
  return { value: raw };
}

/**
 * Problems with a rule file's frontmatter; empty when valid. Accepts only the shape the rules use:
 * top-level `key: value` lines, a one-line `description:`, and `paths:` as a block list of
 * `  - glob` lines. Anything else is reported rather than guessed at.
 */
export function frontmatterProblems(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!m) return ["no frontmatter block"];
  const problems = [];
  const keys = new Map();
  let current;
  m[1].split("\n").forEach((line, i) => {
    const key = line.match(/^([A-Za-z_][\w-]*):(?:[ \t]+(.*?))?[ \t]*$/);
    if (key) {
      if (keys.has(key[1])) problems.push(`duplicate key: ${key[1]}`);
      current = { value: key[2] ?? "", more: [] };
      keys.set(key[1], current);
    } else if (current && (/^[ \t]/.test(line) || line === "")) current.more.push(line);
    else problems.push(`line ${i + 2} does not parse: ${line}`);
  });
  for (const k of ["name", "applyTo"]) if (keys.has(k)) problems.push(`retired key: ${k}`);

  const d = keys.get("description");
  const dMore = d?.more.filter((l) => l.trim()) ?? [];
  if (!d || (d.value === "" && dMore.length === 0)) problems.push("missing description");
  // Claude Code 2.1.312 read a wrapped description as no frontmatter; one line is safe everywhere.
  else if (d.value === "" || /^[>|]/.test(d.value) || dMore.length > 0)
    problems.push("description is not on one line");
  else {
    const s = yamlString(d.value);
    if (s.problem) problems.push(`description ${s.problem}`);
    else if (!s.value.trim()) problems.push("missing description");
  }

  const p = keys.get("paths");
  const items = (p?.more ?? []).filter((l) => l.trim());
  if (!p || (p.value === "" && items.length === 0)) problems.push("paths is not a non-empty list");
  else if (p.value.startsWith("[")) problems.push("paths is not a YAML block list");
  else if (p.value !== "") problems.push("paths is not a non-empty list");
  else
    for (const l of items) {
      const item = l.match(/^[ \t]+- (.*?)[ \t]*$/);
      if (!item) {
        problems.push(`paths is not a YAML block list: ${l.trim()}`);
        continue;
      }
      const s = yamlString(item[1]);
      const glob = s.value;
      if (s.problem) problems.push(`glob ${s.problem}${s.problem.includes(item[1]) ? "" : `: ${item[1]}`}`);
      else if (!glob.trim()) problems.push("empty glob");
      else if (glob.includes("[")) problems.push(`literal [ in glob: ${glob}`);
    }
  return problems;
}

function checkFrontmatter(repo) {
  return repo
    .governed()
    .filter((f) => f.startsWith(".claude/rules/") && f.endsWith(".md"))
    .flatMap((f) => frontmatterProblems(repo.read(f)).map((p) => `${f}: ${p}`));
}

// ---------------------------------------------------------------------------------------------
// retired-paths
// ---------------------------------------------------------------------------------------------

/** `file:line: match` for every retired-path mention on a live surface. */
export function retiredPathHits(file, text) {
  if (isExempt(file)) return [];
  const hits = [];
  withoutArchiveRows(file, text)
    .split("\n")
    .forEach((line, i) => {
      for (const re of RETIRED_PATTERNS) {
        const m = line.match(re);
        if (m) hits.push(`${file}:${i + 1}: ${m[0]}`);
      }
    });
  return hits;
}

function checkRetiredPaths(repo) {
  const stale = NAMED_EXEMPTIONS.filter((f) => !repo.has(f)).map(
    (f) => `${f}: exempted by name but does not exist`,
  );
  return [...stale, ...repo.scanned().flatMap((f) => retiredPathHits(f, repo.read(f)))];
}

// ---------------------------------------------------------------------------------------------
// links
// ---------------------------------------------------------------------------------------------

/** The repo path a relative link in `file` points at, URL-decoded, anchor and query dropped. */
export function resolveLink(file, target) {
  const path = target.split("#")[0].split("?")[0];
  return posix.normalize(posix.join(posix.dirname(file), tryDecode(path) ?? path));
}

/** `file: target` for every relative link in `text` that resolves to nothing. */
export function brokenLinks(file, text, exists) {
  return markdownDestinations(text)
    .map((d) => d.target)
    .filter((t) => !/^([a-z][a-z0-9+.-]*:|#|\/)/i.test(t))
    .filter((t) => t.split("#")[0] !== "")
    .filter((t) => !exists(resolveLink(file, t)))
    .map((t) => `${file}: ${t}`);
}

function checkLinks(repo) {
  return repo
    .governed()
    .filter((f) => f.endsWith(".md") && !lstatSync(join(repo.root, f)).isSymbolicLink())
    .flatMap((f) => brokenLinks(f, repo.read(f), repo.has));
}

// ---------------------------------------------------------------------------------------------
// anchors and inbox (karens-database anchors.ts)
// ---------------------------------------------------------------------------------------------

/** A plain mention's fragment ends at whitespace, a quote, bracket, brace, `,`, `;`, `|` or `*`. */
const MENTION_FRAGMENT = "#([^\\s`'\"()[\\]<>{},;|*]*)";

/** Every `#anchor` reference in `file` into one of `targets`, with its whole fragment. */
function anchorRefs(file, text, targets, exists) {
  if (targets.length === 0) return [];
  const targetSet = new Set(targets);
  const names = new Set(targets.map(basename));
  const refs = [];
  const push = (index, raw, target, fragment, problem) => {
    const anchor = tryDecode(fragment);
    refs.push({
      index,
      line: lineAt(text, index),
      target,
      anchor: anchor ?? fragment,
      raw,
      problem: problem ?? (anchor === null ? "undecodable" : undefined),
    });
  };
  const links = file.endsWith(".md") ? markdownDestinations(text) : [];
  for (const d of links) {
    const hash = d.target.indexOf("#");
    if (hash === -1) continue;
    const path = d.target.slice(0, hash);
    const fragment = d.target.slice(hash + 1);
    const raw = `${d.label ? "]: " : "]("}${d.target}`;
    if (path === "") {
      if (targetSet.has(file)) push(d.index, raw, file, fragment);
      continue;
    }
    if (/^([a-z][a-z0-9+.-]*:|\/)/i.test(path)) continue;
    const target = resolveLink(file, path);
    if (targetSet.has(target)) push(d.index, raw, target, fragment);
    else if (names.has(basename(target)) && !exists(target))
      push(d.index, raw, null, fragment, "does not resolve");
  }
  // Link destinations are blanked, so a link is never read a second time as a mention.
  const mentions = blankRanges(
    text,
    links.map((d) => ({ index: d.index, length: d.target.length })),
  );
  const re = new RegExp(
    `(?<![\\w.@%/-])((?:[\\w.@%-]+/)*(?:${[...names].map(escapeRe).join("|")}))` + MENTION_FRAGMENT,
    "gu",
  );
  for (const m of mentions.matchAll(re)) {
    const path = m[1];
    const fragment = m[2].replace(/[.:!?]+$/, "");
    if (fragment === "") continue;
    const raw = `${path}#${fragment}`;
    let target = /^\.\.?\//.test(path) ? resolveLink(file, path) : path;
    if (!targetSet.has(target) && !path.includes("/")) {
      const candidates = targets.filter((t) => basename(t) === path);
      if (candidates.length === 0) continue;
      if (candidates.length > 1) {
        push(m.index, raw, null, fragment, "ambiguous basename");
        continue;
      }
      target = candidates[0];
    }
    if (targetSet.has(target)) push(m.index, raw, target, fragment);
  }
  return refs.sort((a, b) => a.index - b.index);
}

/** `file:line: ref` for every anchor reference into `targets` that does not resolve. */
export function brokenAnchors(file, text, targets, anchorsFor, exists = () => true) {
  return anchorRefs(file, text, targets, exists)
    .filter((r) => r.problem !== undefined || r.target === null || !anchorsFor(r.target).has(r.anchor))
    .map((r) => `${file}:${r.line}: ${r.raw}${r.problem ? ` (${r.problem})` : ""}`);
}

/** Rationale files are exempt history for the path checks, but their links are checked here. */
function anchorScan(repo, targets) {
  const cache = new Map();
  const anchorsFor = (t) => {
    if (!cache.has(t)) cache.set(t, repo.has(t) ? anchorsOf(repo.read(t)) : new Set());
    return cache.get(t);
  };
  const rationale = new Set(repo.rationale());
  return repo
    .scanned()
    .filter((f) => !isExempt(f) || rationale.has(f))
    .flatMap((f) =>
      brokenAnchors(f, withoutArchiveRows(f, repo.read(f)), targets, anchorsFor, repo.has),
    );
}

function checkAnchors(repo) {
  return anchorScan(repo, [...repo.instructions(), ...repo.rationale()]);
}

function checkInbox(repo) {
  if (!repo.has(INBOX)) return [`${INBOX}: missing`];
  const lines = repo.read(INBOX).replace(/\n$/, "").split("\n").length;
  const cap = lines > INBOX_MAX_LINES ? [`${INBOX}: ${lines} lines, over ${INBOX_MAX_LINES}`] : [];
  return [...cap, ...anchorScan(repo, [INBOX])];
}

// ---------------------------------------------------------------------------------------------
// citations (karens-database anchors.ts citationHits, with H12)
// ---------------------------------------------------------------------------------------------

/**
 * `file:line: match` for every `file.md:N` or `file.md §Section` citation of a target, on one line
 * or across a comment break. A link whose target carries an `#anchor` is allowed whatever its text
 * says, reference-style links included.
 */
export function citationHits(file, text, targets) {
  if (targets.length === 0) return [];
  const targetSet = new Set(targets);
  const anchoredDefs = file.endsWith(".md")
    ? markdownDestinations(text).filter((d) => d.label !== undefined && d.target.includes("#"))
    : [];
  const anchoredLabels = new Set(anchoredDefs.map((d) => d.label.key));
  let body = blankRanges(
    text,
    anchoredDefs.map((d) => d.label),
  ).replace(INLINE_LINK_WITH_LABEL, (whole, label, tail, angled, bare) =>
    (angled ?? bare ?? "").includes("#") ? `[${blank(label)}]${tail}` : whole,
  );
  if (anchoredLabels.size > 0)
    body = body.replace(/\[((?:[^[\]]|\[[^\]]*\])+)\](?:\[([^\]]*)\])?(?![(:[])/g, (whole, label, ref) =>
      anchoredLabels.has(normalizeLabel(ref || label))
        ? `[${blank(label)}]${whole.slice(label.length + 2)}`
        : whole,
    );
  const names = [...new Set(targets.map(basename))].map(escapeRe).join("|");
  const re = new RegExp(
    `(?<![\\w.@%/-])((?:[\\w.@%-]+/)*(?:${names}))` +
      "[`'\"*\\]]*(?:\\]\\([^)]*\\))?[`'\"*)]*" +
      "[ \\t]*(?:\\n[ \\t]*(?://|\\*|#|--|;)?[ \\t]*)?(§|:\\d)",
    "g",
  );
  const hits = [];
  for (const m of body.matchAll(re)) {
    const path = m[1];
    if (path.includes("/") && ![path, resolveLink(file, path)].some((c) => targetSet.has(c))) continue;
    hits.push(`${file}:${lineAt(body, m.index)}: ${m[0].replace(/\s+/g, " ")}`);
  }
  return hits;
}

function checkCitations(repo) {
  const targets = [...repo.instructions(), ...repo.rationale()];
  return repo
    .scanned()
    .filter((f) => !isExempt(f))
    .flatMap((f) => citationHits(f, withoutArchiveRows(f, repo.read(f)), targets));
}

// ---------------------------------------------------------------------------------------------
// rationale (karens-database rationale.ts, with H15: real link destinations, not text)
// ---------------------------------------------------------------------------------------------

const ENTRY_ANCHOR = /^<a id="([^"]+)"><\/a>$/gm;

/** The anchors of a rationale file's entries: an `<a id>` alone on its line. */
export const rationaleEntries = (text) => [...text.matchAll(ENTRY_ANCHOR)].map((m) => m[1]);

/** Every real Markdown link with a fragment, resolved from the doc's folder. */
function linkTargets({ path, text }) {
  return markdownDestinations(text).flatMap(({ target }) => {
    const hash = target.indexOf("#");
    if (hash <= 0) return [];
    return [{ path: resolveLink(path, target.slice(0, hash)), fragment: target.slice(hash + 1) }];
  });
}

/** Entries the paired rule does not link. */
export function unlinkedEntries(rationale, rule) {
  const linked = new Set(
    linkTargets(rule)
      .filter((l) => l.path === rationale.path)
      .map((l) => l.fragment),
  );
  return rationaleEntries(rationale.text).filter((a) => !linked.has(a));
}

/** Entries whose `**Rule:**` line carries no anchored link to the paired rule. */
export function entriesWithoutBackLink(rationale, rulePath) {
  const parts = rationale.text.split(ENTRY_ANCHOR);
  const missing = [];
  for (let i = 1; i < parts.length; i += 2) {
    const line = (parts[i + 1] ?? "").split("\n").find((l) => l.startsWith("**Rule:**"));
    const ok =
      line !== undefined &&
      linkTargets({ path: rationale.path, text: line }).some(
        (l) => l.path === rulePath && l.fragment !== "",
      );
    if (!ok) missing.push(parts[i]);
  }
  return missing;
}

/**
 * `why` links in a rule that point anywhere but an anchor of its paired rationale file. Inline
 * links, and full (`[why][w]`), collapsed (`[why][]`) and shortcut (`[why]`) references resolved
 * through their definitions (review M3). A reference with no definition is literal text, not a
 * link. New here: QI-30 had none.
 */
export function strayWhyLinks(rule) {
  const paired = rationalePathFor(rule.path);
  const body = stripCode(rule.text);
  const defs = new Map();
  for (const d of markdownDestinations(rule.text))
    if (d.label && !defs.has(d.label.key)) defs.set(d.label.key, d.target);
  const dests = [];
  for (const m of body.matchAll(INLINE_LINK_WITH_LABEL))
    if (normalizeLabel(m[1]) === "why") dests.push(m[3] ?? m[4]);
  for (const m of body.matchAll(/\[([^\]\n]*)\](?:\[([^\]\n]*)\])?(?![(:[])/g)) {
    if (normalizeLabel(m[1]) !== "why") continue;
    const dest = defs.get(normalizeLabel(m[2] || m[1]));
    if (dest !== undefined) dests.push(dest);
  }
  return dests.filter((dest) => {
    const hash = dest.indexOf("#");
    return hash <= 0 || resolveLink(rule.path, dest.slice(0, hash)) !== paired;
  });
}

function checkRationale(repo) {
  const problems = [];
  const rationale = new Set(repo.rationale());
  const paired = new Set(repo.instructions().map(rationalePathFor));
  for (const f of repo.instructions()) {
    const path = rationalePathFor(f);
    const rule = { path: f, text: repo.read(f) };
    for (const dest of strayWhyLinks(rule)) problems.push(`${f}: why link not to ${path}#…: ${dest}`);
    if (!rationale.has(path)) {
      problems.push(`${f}: no rationale file ${path}`);
      continue;
    }
    const doc = { path, text: repo.read(path) };
    for (const a of unlinkedEntries(doc, rule)) problems.push(`${path}#${a}: not linked from ${f}`);
    for (const a of entriesWithoutBackLink(doc, f))
      problems.push(`${path}#${a}: its **Rule:** line has no anchored link to ${f}`);
  }
  for (const r of rationale) if (!paired.has(r)) problems.push(`${r}: no instruction file pairs with it`);
  return problems;
}

// ---------------------------------------------------------------------------------------------
// routing and core (karens-database core.ts)
// ---------------------------------------------------------------------------------------------

export const ROUTING_HEADING = "## Rule files";
/** Codex reads 32 KiB of `AGENTS.md`; the table starts well inside it. */
export const ROUTING_MAX_OFFSET = 16_384;

/** Byte offset of the routing heading, or -1. */
export function routingOffset(agents) {
  const at = agents.indexOf(`\n${ROUTING_HEADING}\n`);
  return at === -1 ? -1 : Buffer.byteLength(agents.slice(0, at), "utf8");
}

/** Each row's `.claude/rules/…` paths, from the table under `## Rule files`. */
export function routingRows(agents) {
  const start = agents.indexOf(`\n${ROUTING_HEADING}\n`);
  if (start === -1) return [];
  return agents
    .slice(start + 1)
    .split(/\n## /)[0]
    .split("\n")
    .filter((l) => l.startsWith("|") && !/^\|\s*-+/.test(l))
    .slice(1)
    .map((row) => [...row.matchAll(/`(\.claude\/rules\/[^`]+\.md)`/g)].map((m) => m[1]));
}

/** Each rule file in exactly one row, every named path real. */
export function routingProblems(rows, rules) {
  const seen = new Map();
  const problems = [];
  rows.forEach((paths, i) => {
    if (paths.length === 0) problems.push(`row ${i + 1} names no rule file`);
    for (const p of paths) {
      if (!rules.includes(p)) problems.push(`row ${i + 1} names a missing file: ${p}`);
      seen.set(p, (seen.get(p) ?? 0) + 1);
    }
  });
  for (const r of rules) {
    const n = seen.get(r) ?? 0;
    if (n !== 1) problems.push(`${r} is in ${n} rows`);
  }
  return problems;
}

function checkRouting(repo) {
  if (!repo.has("AGENTS.md")) return ["AGENTS.md: missing"];
  const agents = repo.read("AGENTS.md");
  const at = routingOffset(agents);
  if (at === -1) return [`AGENTS.md: no "${ROUTING_HEADING}" heading`];
  const problems = [];
  if (at >= ROUTING_MAX_OFFSET) problems.push(`AGENTS.md: routing table starts at byte ${at}, not within ${ROUTING_MAX_OFFSET}`);
  const rows = routingRows(agents);
  if (rows.length === 0) problems.push("AGENTS.md: the routing table has no rows");
  const rules = repo.instructions().filter((f) => f.startsWith(".claude/rules/"));
  return [...problems, ...routingProblems(rows, rules).map((p) => `AGENTS.md: ${p}`)];
}

function checkCore(repo) {
  if (!repo.has("CLAUDE.md")) return ["CLAUDE.md: missing"];
  const first = repo.read("CLAUDE.md").split("\n")[0];
  return first === "@AGENTS.md" ? [] : [`CLAUDE.md: line 1 is "${first}", not "@AGENTS.md"`];
}

// ---------------------------------------------------------------------------------------------
// at-rule: Claude Code's `@` import model as a line parser, in place of `marked`
// ---------------------------------------------------------------------------------------------

const HTML_BLOCK_TAG =
  /^ {0,3}<\/?(address|article|aside|blockquote|body|details|dialog|div|dl|dd|dt|fieldset|figcaption|figure|footer|form|h[1-6]|head|header|hr|html|li|main|nav|ol|p|pre|section|summary|table|tbody|td|tfoot|th|thead|tr|ul)(?=[\s/>]|$)/i;
/** A line that is one complete open or close tag and nothing else (CommonMark HTML block type 7). */
const HTML_LONE_TAG = /^ {0,3}<\/?[A-Za-z][\w-]*(?:\s[^<>]*)?\/?>[ \t]*$/;
const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s/;

/**
 * Markdown with its non-text blocks blanked, line by line, as `marked` reads them (review M2):
 * - an HTML block: a block-level tag line, or a lone-tag line after a blank one, runs to a blank line;
 * - an indented code block: lines indented ≥4 after a blank line, unless they continue a list;
 * - blockquote markers, so a quoted line reads as text from its first character.
 */
export function blankBlocks(text) {
  const lines = text.split("\n");
  let html = false;
  let code = false;
  let lastText = ""; // the last non-blank line outside code
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prevBlank = i === 0 || lines[i - 1].trim() === "";
    if (line.trim() === "") {
      html = false;
      continue;
    }
    if (!html && (HTML_BLOCK_TAG.test(line) || (prevBlank && HTML_LONE_TAG.test(line)))) html = true;
    if (html) {
      lines[i] = blank(line);
      continue;
    }
    const indented = /^(?: {4}|\t)/.test(line);
    if (indented && (code || (prevBlank && !LIST_ITEM.test(lastText) && !/^\s/.test(lastText)))) {
      code = true;
      lines[i] = blank(line);
      continue;
    }
    code = false;
    lastText = line;
    lines[i] = line.replace(/^(?: {0,3}>[ \t]?)+/, blank);
  }
  return lines.join("\n");
}

/**
 * Every path Claude Code 2.1.316 would try to import from `text` (QI-30 Phase 0 G1f). Fences, code
 * spans, HTML and non-text blocks are blanked; then `@path` imports at a line start, after
 * whitespace, or where `marked` starts a text run inside emphasis, strikethrough or link text (`*`,
 * `_`, `~`, `[`). The path stops at whitespace, `*` or `]`; a trailing `_` or `~` closes emphasis
 * or strikethrough; the `#fragment` is dropped. Trailing punctuation stays in the path, so `@a.md.`
 * names a file that does not exist. Re-measure on a Claude Code upgrade.
 */
export function claudeImports(text) {
  const body = blankBlocks(stripFences(text))
    .replace(/(?<!`)(`+)(?!`)[^\n]*?(?<!`)\1(?!`)/g, blank)
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/<\/?[A-Za-z][^>\n]*>/g, blank);
  return [...body.matchAll(/(?:^|[\s*_~[])@((?:[^\s\\*\]]|\\ )+)/gm)].map((m) =>
    m[1].replace(/\\ /g, " ").split("#")[0].replace(/[_~]+$/, ""),
  );
}

/** Where Claude Code looks for `@path` written in `file`: absolute, `~/` under home, else from `file`'s folder (H14). */
export function importTarget(file, path, root, home) {
  if (path.startsWith("/")) return posix.normalize(path);
  if (path.startsWith("~/")) return posix.join(home, path.slice(2));
  return posix.join(root, posix.dirname(file), path);
}

/** `file: @path` for every import that resolves to a file. */
export function resolvingImports(file, text, exists, { root, home }) {
  return claudeImports(text)
    .filter((p) => p !== "")
    .filter((p) => exists(importTarget(file, p, root, home)))
    .map((p) => `${file}: @${p}`);
}

const isRealFile = (p) => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
};

function checkAtRule(repo) {
  const where = { root: repo.root, home: homedir() };
  return repo.instructions().flatMap((f) => {
    let text = repo.read(f);
    // CLAUDE.md's line 1 is the one intended import (the `core` check owns it); blank it.
    if (f === "CLAUDE.md") text = text.replace(/^[^\n]*/, "");
    return resolvingImports(f, text, isRealFile, where);
  });
}

// ---------------------------------------------------------------------------------------------
// budgets (karens-database budgets.ts). The inbox's 200-line cap is the `inbox` check's.
// ---------------------------------------------------------------------------------------------

const AGENTS_MAX_LINES = 200;
const AGENTS_MAX_BYTES = 24_576; // Codex reads 32,768 B and cuts mid-line.
const CLAUDE_MAX_LINES = 40;
const MAX_LINE_CHARS = 400;
/** Soft: reported, ⛔ never a failure (QI-30 D28). */
export const RULE_TARGET_CHARS = 20_000;

const chars = (s) => [...s].length;
const lineCount = (t) => t.replace(/\n$/, "").split("\n").length;
const hasLongLine = (t) => t.split("\n").some((l) => chars(l.trimEnd()) > MAX_LINE_CHARS);

/** The hard budgets `file` is over. */
export function overBudget(file, text) {
  const over = [];
  if (file === "CLAUDE.md") {
    if (lineCount(text) > CLAUDE_MAX_LINES) over.push("lines");
  } else if (file === "AGENTS.md") {
    if (lineCount(text) > AGENTS_MAX_LINES) over.push("lines");
    if (Buffer.byteLength(text, "utf8") > AGENTS_MAX_BYTES) over.push("bytes");
    if (hasLongLine(text)) over.push("line-length");
  } else if (file.startsWith(".claude/rules/")) {
    if (hasLongLine(stripFences(text))) over.push("line-length");
  }
  return over;
}

/** One line per rule file against the soft target, largest first. */
export function ruleSizeTable(rules) {
  return rules
    .map(({ file, text }) => ({ file, n: chars(text) }))
    .sort((a, b) => b.n - a.n)
    .map(({ file, n }) => `${String(n).padStart(6)} / ${RULE_TARGET_CHARS} ${(n > RULE_TARGET_CHARS ? "over" : "ok").padEnd(4)} ${file}`);
}

function checkBudgets(repo) {
  return repo
    .instructions()
    .flatMap((f) => overBudget(f, repo.read(f)).map((b) => `${f}: over its ${b} budget`));
}

// ---------------------------------------------------------------------------------------------
// skills (karens-database skills.ts, with H9)
// ---------------------------------------------------------------------------------------------

/** Top-level `name:` lines outside code: a skill pasted twice has two. */
export const skillNameCount = (text) => (stripCode(text).match(/^name:/gm) ?? []).length;

function skillEntries(root, prefix, pick) {
  return [
    ...new Set(
      trackedFiles(root, { untracked: true, pathspecs: [prefix] })
        .map((f) => f.slice(prefix.length + 1).split("/"))
        .filter(pick)
        .map((rest) => rest[0]),
    ),
  ];
}

/** Repo skills live in `.agents/skills/<n>/` and reach Claude Code through a `.claude/skills/<n>` symlink. */
export function skillProblems(root) {
  const problems = [];
  // A folder is a skill whether or not its SKILL.md survived (H9).
  for (const name of skillEntries(root, ".agents/skills", (r) => r.length > 1)) {
    const link = join(root, ".claude/skills", name);
    const target = join(root, ".agents/skills", name);
    if (!existsSync(link)) problems.push(`${name}: no .claude/skills link`);
    else if (!lstatSync(link).isSymbolicLink()) problems.push(`${name}: .claude/skills entry is not a symlink`);
    else if (realpathSync(link) !== realpathSync(target)) problems.push(`${name}: .claude/skills link points elsewhere`);
    const entry = join(target, "SKILL.md");
    if (!existsSync(entry)) {
      problems.push(`${name}: no SKILL.md`);
      continue;
    }
    const n = skillNameCount(readFileSync(entry, "utf8"));
    if (n !== 1) problems.push(`${name}: ${n} top-level name: lines`);
  }
  for (const name of skillEntries(root, ".claude/skills", () => true)) {
    const entry = join(root, ".claude/skills", name);
    if (!lstatSync(entry).isSymbolicLink()) problems.push(`${name}: real directory in .claude/skills`);
    else if (!existsSync(entry)) problems.push(`${name}: dangling link`);
  }
  return problems;
}

const checkSkills = (repo) => skillProblems(repo.root);

// ---------------------------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------------------------

export const CHECKS = {
  "plan-status": checkPlanStatus,
  layout: checkLayout,
  frontmatter: checkFrontmatter,
  "retired-paths": checkRetiredPaths,
  links: checkLinks,
  anchors: checkAnchors,
  inbox: checkInbox,
  citations: checkCitations,
  rationale: checkRationale,
  routing: checkRouting,
  core: checkCore,
  "at-rule": checkAtRule,
  budgets: checkBudgets,
  skills: checkSkills,
};

/** `{ check: problems[] }` for `only` (default: every check) against the repo at `root`. */
export function runChecks(root, only = Object.keys(CHECKS)) {
  const repo = openRepo(root);
  return Object.fromEntries(only.map((name) => [name, CHECKS[name](repo)]));
}

function main(argv) {
  const i = argv.indexOf("--only");
  const only = i === -1 ? undefined : [argv[i + 1]];
  if (only && !Object.hasOwn(CHECKS, only[0] ?? "")) {
    console.error(`Unknown check: ${only[0] ?? "(none)"}. Checks: ${Object.keys(CHECKS).join(", ")}`);
    return 2;
  }
  const root = repoRoot();
  const results = runChecks(root, only);
  let failed = 0;
  for (const [name, problems] of Object.entries(results)) {
    console.log(`${problems.length ? "✗" : "✓"} ${name}${problems.length ? ` (${problems.length})` : ""}`);
    for (const p of problems) console.log(`    ${p}`);
    if (problems.length) failed++;
  }
  if (!only || only[0] === "budgets") {
    const repo = openRepo(root);
    const rules = repo.instructions().filter((f) => f.startsWith(".claude/rules/"));
    console.log(`\nRule file sizes (soft, never a failure):`);
    const table = ruleSizeTable(rules.map((file) => ({ file, text: repo.read(file) })));
    console.log(table.length ? table.map((l) => `    ${l}`).join("\n") : "    (no rule files)");
  }
  console.log(`\n${failed ? `${failed} check(s) failed` : "All checks passed"}.`);
  return failed ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  process.exitCode = main(process.argv.slice(2));
}
