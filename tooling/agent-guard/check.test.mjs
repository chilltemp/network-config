/**
 * Fixtures for the agent-instructions guard: `node --test tooling/agent-guard/check.test.mjs`.
 * ⚠️ Name the file: Node 24 reads `node --test <dir>` as a module entry and fails.
 *
 * Two layers:
 * - **Isolation:** a temp git repo in the target layout passes every check; then one mutation per
 *   check must fail exactly that check and no other. That is the proof each check can fail.
 * - **Primitives:** table fixtures for the Markdown model, the frontmatter parser, the `@` model
 *   (QI-30 G1f), anchors, citations, rationale links, routing and budgets.
 *
 * Temp repos live in the repo's gitignored `.tmp/agent-guard-tests/`, never `/tmp`.
 */
import { execFileSync, spawnSync } from "node:child_process";
import {
  appendFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  CHECKS,
  anchorsOf,
  brokenAnchors,
  brokenLinks,
  citationHits,
  claudeImports,
  currentPhase,
  entriesWithoutBackLink,
  frontmatterProblems,
  markdownDestinations,
  overBudget,
  parseQueueRows,
  rationaleEntries,
  readHeader,
  readLogs,
  resolvingImports,
  retiredPathHits,
  routingProblems,
  routingRows,
  rowNext,
  ruleSizeTable,
  runChecks,
  slugify,
  statusDrift,
  strayWhyLinks,
  stripCode,
  trackedFiles,
  unlinkedEntries,
  withoutArchiveRows,
} from "./check.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHECK = join(HERE, "check.mjs");
const SCRATCH = join(HERE, "../../.tmp/agent-guard-tests");

// ---------------------------------------------------------------------------------------------
// Temp repos
// ---------------------------------------------------------------------------------------------

const made = [];
function tempRepo() {
  mkdirSync(SCRATCH, { recursive: true });
  const dir = mkdtempSync(join(SCRATCH, "repo-"));
  made.push(dir);
  execFileSync("git", ["init", "-q"], { cwd: dir });
  const repo = {
    dir,
    git: (...args) => execFileSync("git", args, { cwd: dir, stdio: "ignore" }),
    write(file, text = "x\n") {
      mkdirSync(dirname(join(dir, file)), { recursive: true });
      writeFileSync(join(dir, file), text);
      return repo;
    },
    read: (file) => readFileSync(join(dir, file), "utf8"),
    edit(file, from, to) {
      const text = repo.read(file);
      assert.ok(text.includes(from), `${file} lacks ${JSON.stringify(from)}`);
      return repo.write(file, text.split(from).join(to));
    },
    failing: (only) =>
      Object.entries(runChecks(dir, only))
        .filter(([, p]) => p.length)
        .map(([name]) => name),
  };
  return repo;
}
after(() => made.forEach((d) => rmSync(d, { recursive: true, force: true })));

const RULES = ["ansible-safety", "compose-stack-conventions", "editing", "planning", "proposals"];
const rule = (topic) =>
  [
    "---",
    `description: Use when working on ${topic}.`,
    "paths:",
    `  - '${topic}/**'`,
    "---",
    "",
    `# ${topic}`,
    "",
    "## Section",
    "",
    "A rule.",
    "",
  ].join("\n");

/** A repo in the post-Phase-2 target layout that passes every check. */
function goodRepo() {
  const r = tempRepo();
  r.write(
    "AGENTS.md",
    [
      "# Agents",
      "",
      "A core rule. ([why](docs/agents/rationale/agents.rationale.md#core-rule))",
      "",
      "See [planning](.claude/rules/planning.md#section) and `docs/ai-lessons.md#a-lesson`.",
      "",
      "## Rule files",
      "",
      "| When you… | Read |",
      "| --------- | ---- |",
      ...RULES.map((t) => `| touch ${t} | \`.claude/rules/${t}.md\` |`),
      "",
      "## Conventions",
      "",
      "Mail admin@example.com; run `@CLAUDE.md` never.",
      "",
    ].join("\n"),
  );
  r.write("CLAUDE.md", "@AGENTS.md\n\nClaude Code notes.\n");
  for (const t of RULES) {
    r.write(`.claude/rules/${t}.md`, rule(t));
    r.write(`docs/agents/rationale/${t}.rationale.md`, `# ${t} rationale\n`);
  }
  r.write("docs/agents/rationale/claude.rationale.md", "# CLAUDE.md rationale\n");
  r.write(
    "docs/agents/rationale/agents.rationale.md",
    [
      "# AGENTS.md rationale",
      "",
      '<a id="core-rule"></a>',
      "",
      "## Core rule",
      "",
      "**Rule:** [AGENTS.md §Agents](../../../AGENTS.md#agents)",
      "",
      "Because.",
      "",
    ].join("\n"),
  );
  r.write("docs/ai-lessons.md", '# Lessons\n\n<a id="a-lesson"></a>\n- A lesson.\n');
  r.write(
    "docs/plans/demo-plan.md",
    [
      "# Demo — plan",
      "",
      "**Status:** Phase 1 ✅ · Phase 2 ⬜",
      "",
      "## Phase 1 — First",
      "",
      "**Completion log** — _status: ✅ done_",
      "",
      "## Phase 2 — Second",
      "",
      "**Completion log** — _status: ⬜ not started_",
      "",
    ].join("\n"),
  );
  r.write(
    "docs/proposals/_implementation-order.md",
    [
      "# Implementation order",
      "",
      "| #    | Item                              | Sprint  | Status     | Notes                |",
      "| ---- | --------------------------------- | ------- | ---------- | -------------------- |",
      "| QN-1 | [`demo`](../plans/demo-plan.md)   | current | 🟡 partial | Next: Phase 2 — more |",
      "",
    ].join("\n"),
  );
  r.write(".agents/skills/demo/SKILL.md", "---\nname: demo\ndescription: d\n---\n\nBody.\n");
  mkdirSync(join(r.dir, ".claude/skills"), { recursive: true });
  symlinkSync("../../.agents/skills/demo", join(r.dir, ".claude/skills/demo"));
  r.write("README.md", "# Demo repo\n\nSee [AGENTS.md](AGENTS.md#agents).\n");
  r.write(
    "docs/handoffs/old.md",
    "History: `.github/copilot-instructions.md` and AGENTS.md §Gone.\n",
  );
  // QN-17's own record is exempt by name; the guard fails if a named file is missing.
  for (const f of [
    "docs/agents/qn-17-rule-ledger.md",
    "docs/plans/agent-instructions-migration-plan.md",
    "docs/proposals/agent-instructions-migration-proposal.md",
  ])
    r.write(f, "Record: `.github/instructions/` and `planning.instructions.md` §Old.\n");
  r.git("add", "-A");
  return r;
}

// ---------------------------------------------------------------------------------------------
// Isolation: every check passes on the good repo, and each mutation fails exactly one check
// ---------------------------------------------------------------------------------------------

/** check → [description, mutation]. Every check in CHECKS needs at least one. */
const MUTATIONS = {
  "plan-status": [
    ["a header/log mismatch", (r) => r.edit("docs/plans/demo-plan.md", "_status: ✅ done_", "_status: 🟡 in progress_")],
    ["a queue Next: that is not the current phase", (r) => r.edit("docs/proposals/_implementation-order.md", "Next: Phase 2", "Next: Phase 1")],
    [
      "two ⏸ phases",
      (r) => {
        r.edit("docs/plans/demo-plan.md", "Phase 1 ✅ · Phase 2 ⬜", "Phase 1 ⏸ · Phase 2 ⏸");
        r.edit("docs/plans/demo-plan.md", "_status: ✅ done_", "_status: ⏸ paused_");
        r.edit("docs/plans/demo-plan.md", "_status: ⬜ not started_", "_status: ⏸ paused_");
        r.edit("docs/proposals/_implementation-order.md", "Next: Phase 2", "Next: Phase 1");
      },
    ],
  ],
  layout: [
    ["an untracked *.instructions.md", (r) => r.write("docs/old.instructions.md", "x\n")],
    ["a non-.md file in .claude/rules/", (r) => r.write(".claude/rules/notes.txt", "x\n")],
    ["a retired surface", (r) => r.write(".github/copilot-instructions.md", "x\n")],
  ],
  frontmatter: [
    ["a flow-list paths:", (r) => r.edit(".claude/rules/planning.md", "paths:\n  - 'planning/**'", "paths: ['planning/**']")],
    ["a retired name: key", (r) => r.edit(".claude/rules/editing.md", "---\ndescription", "---\nname: editing\ndescription")],
  ],
  "retired-paths": [
    ["a bare copilot-instructions on a live surface", (r) => r.write("README.md", "Read copilot-instructions first.\n")],
    [
      "a missing named exemption",
      (r) => {
        unlinkSync(join(r.dir, "docs/agents/qn-17-rule-ledger.md"));
      },
    ],
  ],
  links: [["a broken relative link in a rule", (r) => r.edit(".claude/rules/ansible-safety.md", "A rule.", "A rule, see [x](../../docs/missing.md).")]],
  anchors: [
    ["a dead anchor into AGENTS.md", (r) => r.edit("README.md", "AGENTS.md#agents", "AGENTS.md#nope")],
    ["a dead anchor from one rule into another", (r) => r.edit(".claude/rules/proposals.md", "A rule.", "See [p](planning.md#gone).")],
  ],
  inbox: [
    ["a dead lesson slug", (r) => r.edit("AGENTS.md", "ai-lessons.md#a-lesson", "ai-lessons.md#deleted")],
    ["a 201-line inbox", (r) => appendFileSync(join(r.dir, "docs/ai-lessons.md"), "-\n".repeat(197))],
  ],
  citations: [["a § citation of a rule", (r) => r.edit("README.md", "See [AGENTS.md](AGENTS.md#agents).", "See AGENTS.md §Agents.")]],
  rationale: [
    ["an entry its rule does not link", (r) => r.edit("AGENTS.md", " ([why](docs/agents/rationale/agents.rationale.md#core-rule))", "")],
    ["a rule with no rationale file", (r) => rmSync(join(r.dir, "docs/agents/rationale/planning.rationale.md"))],
  ],
  routing: [["a rule with no row", (r) => r.edit("AGENTS.md", "| touch editing | `.claude/rules/editing.md` |\n", "")]],
  core: [["CLAUDE.md without the import", (r) => r.write("CLAUDE.md", "# Claude Code\n\nNotes.\n")]],
  "at-rule": [["an @ that imports a file", (r) => r.edit(".claude/rules/planning.md", "A rule.", "A rule, see **@../../CLAUDE.md** for more.")]],
  budgets: [["a 41-line CLAUDE.md", (r) => appendFileSync(join(r.dir, "CLAUDE.md"), "x\n".repeat(38))]],
  skills: [["a skill with no .claude/skills link", (r) => unlinkSync(join(r.dir, ".claude/skills/demo"))]],
};

describe("isolation", () => {
  let base;
  before(() => {
    base = goodRepo();
  });

  it("the good repo passes every check", () => {
    assert.deepEqual(runChecks(base.dir), Object.fromEntries(Object.keys(CHECKS).map((c) => [c, []])));
  });

  it("every check has a failing fixture", () => {
    assert.deepEqual(Object.keys(MUTATIONS).sort(), Object.keys(CHECKS).sort());
  });

  for (const [check, cases] of Object.entries(MUTATIONS))
    for (const [what, mutate] of cases)
      it(`${check}: ${what} fails ${check} and nothing else`, () => {
        const r = goodRepo();
        mutate(r);
        assert.deepEqual(r.failing(), [check]);
      });

  it("the CLI exits 0 on the good repo, 1 on a failure, 2 on an unknown check", () => {
    const r = goodRepo();
    const run = (...args) => spawnSync("node", [CHECK, ...args], { cwd: r.dir, encoding: "utf8" });
    const ok = run();
    assert.equal(ok.status, 0, ok.stdout);
    assert.match(ok.stdout, /Rule file sizes \(soft/);
    assert.equal(run("--only", "nope").status, 2);
    for (const inherited of ["constructor", "toString", "__proto__"]) assert.equal(run("--only", inherited).status, 2);
    r.edit("docs/plans/demo-plan.md", "_status: ✅ done_", "_status: ⬜ not started_");
    const bad = run("--only", "plan-status");
    assert.equal(bad.status, 1);
    assert.match(bad.stdout, /Phase 1: header ✅, completion log ⬜/);
    assert.equal(run("--only", "core").status, 0);
  });
});

// ---------------------------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------------------------

describe("discovery", () => {
  it("lists staged and untracked rules, never ignored ones, and sees dot-folders", () => {
    const r = tempRepo();
    r.write(".claude/rules/staged.md").write(".claude/rules/untracked.md").write(".claude/rules/ignored.md");
    r.write(".gitignore", ".claude/rules/ignored.md\n");
    r.git("add", ".claude/rules/staged.md");
    assert.deepEqual(trackedFiles(r.dir), [".claude/rules/staged.md"]);
    assert.deepEqual(trackedFiles(r.dir, { untracked: true, pathspecs: [".claude/rules"] }), [
      ".claude/rules/staged.md",
      ".claude/rules/untracked.md",
    ]);
  });

  it("drops an index entry whose file is gone, and lists a dangling symlink as itself", () => {
    const r = tempRepo();
    r.write("gone.md");
    mkdirSync(join(r.dir, ".claude/skills"), { recursive: true });
    symlinkSync("../../.agents/skills/missing", join(r.dir, ".claude/skills/missing"));
    r.git("add", "-A");
    rmSync(join(r.dir, "gone.md"));
    assert.deepEqual(trackedFiles(r.dir), [".claude/skills/missing"]);
  });
});

// ---------------------------------------------------------------------------------------------
// plan-status primitives
// ---------------------------------------------------------------------------------------------

describe("plan-status", () => {
  it("ignores a fenced example, so it cannot hide a stale header (H8)", () => {
    const text = [
      "```markdown",
      "**Status:** Phase 9 ✅",
      "```",
      "**Status:** Phase 1 ⬜",
      "## Phase 1 — Build",
      "**Completion log** — _status: ✅ done_",
      "```markdown",
      "## Phase 1 — Example",
      "**Completion log** — _status: ⬜ not started_",
      "```",
    ].join("\n");
    assert.deepEqual(readHeader(text), new Map([["1", "⬜"]]));
    assert.deepEqual(statusDrift(readHeader(text), readLogs(text)), ["Phase 1: header ⬜, completion log ✅"]);
  });

  it("reads ranges, named logs and the colon form", () => {
    const text = [
      "**Status:** Phase 0 ✅ · Phase 2a ⬜ · Phase 3.5 ⚠️",
      "## Phase 0: Spike",
      "**Completion log**: _status: ✅ done_",
      "## Phases 2a-2b — Diet",
      "**Completion log 2a** — _status: ⬜ not started_",
      "## Phase 3.5 — Rename",
      "**Completion log** — _status: ⚠️ done with caveats_",
      "## Risks",
      "**Completion log** — _status: ✅ not a phase_",
    ].join("\n");
    assert.deepEqual(statusDrift(readHeader(text), readLogs(text)), []);
    assert.equal(readHeader("**Status: 🟡 in progress — Phase 0 ✅.**"), undefined);
  });

  it("names 🟡 first, then ⏸, then the first ⬜", () => {
    const phases = (...marks) => new Map(marks.map((m, i) => [String(i), m]));
    assert.equal(currentPhase(phases("✅", "⬜", "⏸", "🟡")), "3");
    assert.equal(currentPhase(phases("✅", "⬜", "⏸")), "2");
    assert.equal(currentPhase(phases("✅", "⬜", "⬜")), "1");
    assert.equal(currentPhase(phases("✅", "⚠️")), undefined);
  });

  it("reads rows of any prefix, and a Next: ending in a full stop (H5)", () => {
    const rows = parseQueueRows(
      [
        "| # | Item | Sprint | Status | Notes |",
        "| --- | --- | --- | --- | --- |",
        "| QN-17 | [p](../plans/p.md) | current | 🟡 partial | Next: Phase 1. |",
        "| QR2-1 | [r](../proposals/r.md) | future | ⬜ not started |  |",
      ].join("\n"),
    );
    assert.deepEqual(rows.map((r) => r.id), ["QN-17", "QR2-1"]);
    assert.deepEqual(rowNext(rows[0]), { next: "1", plan: "docs/plans/p.md" });
    assert.equal(rowNext(rows[1]), undefined);
  });
});

// ---------------------------------------------------------------------------------------------
// Markdown primitives (H6, H10, H11)
// ---------------------------------------------------------------------------------------------

describe("markdown", () => {
  const link = "[x](y.md)";
  for (const [what, text] of [
    ["a tilde fence", "~~~\n[x](y.md)\n~~~"],
    ["an indented fence", "   ```\n[x](y.md)\n   ```"],
    ["a longer fence around a shorter one", "````\n```\n[x](y.md)\n```\n````"],
    ["a double-backtick span holding a backtick", "see ``a ` [x](y.md)`` here"],
  ])
    it(`stripCode blanks ${what}`, () => assert.ok(!stripCode(text).includes(link)));

  it("stripCode keeps offsets and lines", () => {
    const text = "one `two`\n```\nthree\n```\nfour";
    assert.equal(stripCode(text).length, text.length);
    assert.equal(stripCode(text).indexOf("four"), text.indexOf("four"));
  });

  it("finds inline, angled, titled, balanced-paren and reference destinations, skipping footnotes", () => {
    const text = '[a](b.md) [c](<d e.md>) [f](g.md "t") [h](a(b).md)\n[^1]: note.md\n[Q  r]: <i.md#j>';
    assert.deepEqual(
      markdownDestinations(text).map((d) => d.target),
      ["b.md", "d e.md", "g.md", "a(b).md", "i.md#j"],
    );
  });

  for (const [heading, slug] of [
    ["Code Organization", "code-organization"],
    ["Phase 2a — Move every file", "phase-2a--move-every-file"],
    ["`AGENTS.md` budget", "agentsmd-budget"],
    ["Über-rule", "über-rule"],
  ])
    it(`slugify ${heading} → ${slug}`, () => assert.equal(slugify(heading), slug));

  it("anchorsOf numbers repeats, takes <a id>, and ignores fenced headings and spans", () => {
    const text = '## Tests\n## Tests\n<a id="one"></a>\n````\n```\n## Nope\n```\n````\n`<a id="no">`';
    assert.deepEqual([...anchorsOf(text)].sort(), ["one", "tests", "tests-1"]);
  });

  it("brokenLinks URL-decodes, ignores code, anchors and URLs, and reads balanced parens", () => {
    const known = new Set(["app/a b/x.md", "docs/a(b).md"]);
    const text = [
      "[ok](../app/a%20b/x.md) [p](../docs/a(b).md)",
      "[anchor](#local) [url](https://example.com) [abs](/x)",
      "`[code](missing.md)`",
      "[bad](../docs/missing.md)",
    ].join("\n");
    assert.deepEqual(brokenLinks(".claude/x.md", text, (p) => known.has(p)), [".claude/x.md: ../docs/missing.md"]);
  });
});

// ---------------------------------------------------------------------------------------------
// frontmatter: the line parser that replaces js-yaml
// ---------------------------------------------------------------------------------------------

describe("frontmatter", () => {
  it("accepts the rule shape, quoted or not", () => {
    assert.deepEqual(frontmatterProblems("---\ndescription: 'x'\npaths:\n  - 'a/**'\n  - b/*.md\n---\n\nbody"), []);
    assert.deepEqual(frontmatterProblems('---\ndescription: "Use when x: y."\npaths:\n  - "**/docker-compose.yml"\n---\n'), []);
    assert.deepEqual(frontmatterProblems("---\ndescription: Use when it's x.\npaths:\n  - Ansible/**\n  - 'it''s/**'\n---\n"), []);
  });

  for (const [text, problem] of [
    ["# no frontmatter", "no frontmatter block"],
    ["---\ndescription: 'x'\npaths: ['src/**']\n---\n", "paths is not a YAML block list"],
    ["---\ndescription: 'x'\npaths: 'src/**'\n---\n", "paths is not a non-empty list"],
    ["---\ndescription: 'x'\npaths:\n---\n", "paths is not a non-empty list"],
    ["---\ndescription: 'x'\n---\n", "paths is not a non-empty list"],
    ["---\ndescription: 'x'\npaths:\n  - 'app/[key]/**'\n---\n", "literal [ in glob: app/[key]/**"],
    ["---\ndescription: 'x'\npaths:\n  - ''\n---\n", "empty glob"],
    ["---\ndescription: 'x'\npaths:\n  src/**\n---\n", "paths is not a YAML block list: src/**"],
    ["---\npaths:\n  - 'src/**'\n---\n", "missing description"],
    ["---\ndescription: ''\npaths:\n  - 'src/**'\n---\n", "missing description"],
    ["---\ndescription: 'a wrapped\n  one'\npaths:\n  - 'src/**'\n---\n", "description is not on one line"],
    ["---\ndescription: >-\n  folded\npaths:\n  - 'src/**'\n---\n", "description is not on one line"],
    ["---\ndescription: 'x\npaths:\n  - 'src/**'\n---\n", "description quote is not closed"],
    ["---\nname: 'n'\ndescription: 'x'\npaths:\n  - 'src/**'\n---\n", "retired key: name"],
    ["---\napplyTo: 'a'\ndescription: 'x'\npaths:\n  - 'src/**'\n---\n", "retired key: applyTo"],
    ["---\ndescription: 'x'\n- stray\npaths:\n  - 'src/**'\n---\n", "line 3 does not parse: - stray"],
    // Review M1: YAML js-yaml rejects or mis-types must not pass.
    ["---\ndescription: x\npaths:\n  - **/docker-compose.yml\n---\n", "glob starts with a YAML indicator; quote it: **/docker-compose.yml"],
    ["---\ndescription: x\npaths:\n  - 42\n---\n", "glob is not a string; quote it: 42"],
    ["---\ndescription: x\npaths:\n  - a #b\n---\n", "glob holds ': ' or ' #'; quote it: a #b"],
    ["---\ndescription: false\npaths:\n  - 'a/**'\n---\n", "description is not a string; quote it: false"],
    ["---\ndescription: Use when: x\npaths:\n  - 'a/**'\n---\n", "description holds ': ' or ' #'; quote it: Use when: x"],
    ["---\ndescription: &x d\npaths:\n  - 'a/**'\n---\n", "description starts with a YAML indicator; quote it: &x d"],
    ["---\ndescription: \"a\"b\"\npaths:\n  - 'a/**'\n---\n", "description quote is not closed"],
  ])
    it(`rejects ${JSON.stringify(text)}`, () => assert.deepEqual(frontmatterProblems(text), [problem]));
});

// ---------------------------------------------------------------------------------------------
// The @ rule: QI-30 Phase 0 G1f's table on Claude Code 2.1.316
// ---------------------------------------------------------------------------------------------

describe("at-rule", () => {
  const present = new Set(["/repo/docs/a.md", "/repo/docs/sub/b.md", "/etc/notes.md", "/home/u/.claude/x.md"]);
  const check = (text) =>
    resolvingImports("docs/x.md", text, (p) => present.has(p), { root: "/repo", home: "/home/u" });

  for (const [what, text] of [
    ["bare", "@a.md"],
    ["frag", "see @a.md#part"],
    ["bold", "**@a.md**"],
    ["italic", "*@a.md*"],
    ["underscore italic", "_@a.md_"],
    ["link", "[@sub/b.md](https://example.com)"],
    ["a table cell", "| x |\n| - |\n| y @a.md |"],
    ["a list item", "- see @a.md here"],
    ["an absolute path to a real file (H14)", "see @/etc/notes.md"],
    ["a ~/ path to a real file (H14)", "see @~/.claude/x.md"],
    ["a relative path out of the folder", "see @../docs/a.md"],
    // Review M2: strikethrough, blockquotes, lists and HTML blocks that end, as marked reads them.
    ["strikethrough", "~~@a.md~~"],
    ["a blockquote with no space", ">@a.md"],
    ["a nested blockquote", "> > @a.md"],
    ["a list item continued after a blank line", "- item\n\n    @a.md continues it"],
    ["a lazy paragraph continuation", "para\n    @a.md"],
    ["a line after an HTML block closes", "<details>\n\n@a.md\n\n</details>"],
    ["an inline tag mid-paragraph", "x\n<span>\n@a.md"],
  ])
    it(`${what} imports`, () => assert.equal(check(text).length, 1, JSON.stringify(claudeImports(text))));

  for (const [what, text] of [
    ["span", "see `see @a.md` here"],
    ["a span with no space before @", "`@a.md` and `@heroui-pro/react`"],
    ["punct", "see @a.md."],
    ["fence", "```\nrun @a.md\n```"],
    ["HTML", '<a id="@a.md"></a>'],
    ["an HTML comment", "<!-- @a.md -->"],
    ["a token that resolves to nothing", "see @missing.md and @/src/auth*"],
    ["an absolute path to nothing", "see @/docs/a.md"],
    ["an email-like token", "mail admin+test@a.md"],
    ["a link destination", "[x](@a.md)"],
    // Review M2: indented code and HTML blocks are not text.
    ["indented code", "    @a.md"],
    ["indented code after a paragraph and a blank line", "text\n\n    @a.md\n"],
    ["an HTML block", "<div>\n@a.md\n</div>"],
    ["a lone-tag HTML block", "<br>\n@a.md"],
  ])
    it(`${what} does not import`, () => assert.deepEqual(check(text), []));
});

// ---------------------------------------------------------------------------------------------
// anchors, citations, retired paths
// ---------------------------------------------------------------------------------------------

describe("anchors", () => {
  const targets = ["AGENTS.md", ".claude/rules/web.md", ".claude/rules/testing.md", "docs/specs/web.md"];
  const anchors = {
    "AGENTS.md": new Set(["code-organization"]),
    ".claude/rules/web.md": new Set(["save-status"]),
    ".claude/rules/testing.md": new Set(["fake-timers", "local"]),
    "docs/specs/web.md": new Set(["other"]),
  };
  const check = (file, text) => brokenAnchors(file, text, targets, (t) => anchors[t], () => false);

  it("accepts links and mentions that resolve, with sentence punctuation", () => {
    const ok = [
      "[x](../../AGENTS.md#code-organization)",
      "see `.claude/rules/testing.md#fake-timers`.",
      "(per AGENTS.md#code-organization), **AGENTS.md#code-organization**",
      "[e](../../AGENTS.md#%63ode-organization)",
    ].join("\n");
    assert.deepEqual(check("docs/specs/x.md", ok), []);
  });

  it("checks the whole fragment, decoding it, and flags ambiguity and non-resolving links", () => {
    const broken = [
      "[a](../../AGENTS.md#code-organization/does-not-exist)",
      "[d](../../AGENTS.md#code-organization%E0%A4%A)",
      "see AGENTS.md#code-organization.nope",
      "web.md#save-status",
      "[x](AGENTS.md#code-organization)",
    ].join("\n");
    assert.deepEqual(check("docs/specs/x.md", broken), [
      "docs/specs/x.md:1: ](../../AGENTS.md#code-organization/does-not-exist",
      "docs/specs/x.md:2: ](../../AGENTS.md#code-organization%E0%A4%A (undecodable)",
      "docs/specs/x.md:3: AGENTS.md#code-organization.nope",
      "docs/specs/x.md:4: web.md#save-status (ambiguous basename)",
      "docs/specs/x.md:5: ](AGENTS.md#code-organization (does not resolve)",
    ]);
  });

  it("checks ](#anchor) inside a target file only, and a reference definition as a link", () => {
    assert.deepEqual(check(".claude/rules/testing.md", "[a](#local) [b](#nowhere)"), [
      ".claude/rules/testing.md:1: ](#nowhere",
    ]);
    assert.deepEqual(check("docs/specs/x.md", "[b](#nowhere)"), []);
    assert.deepEqual(check(".claude/rules/ui.md", "[W][p]\n\n[p]: web.md#gone"), [".claude/rules/ui.md:3: ]: web.md#gone"]);
  });

  it("the placeholder #<slug> cannot match", () => {
    assert.deepEqual(brokenAnchors("docs/x.md", "`docs/ai-lessons.md#<slug>`", ["docs/ai-lessons.md"], () => new Set()), []);
  });
});

describe("citations", () => {
  const targets = ["AGENTS.md", ".claude/rules/web.md", ".claude/rules/testing.md", "docs/agents/rationale/testing.rationale.md"];
  for (const [what, file, text] of [
    ["file.md:N", "docs/x.md", "see `.claude/rules/web.md:40`"],
    ["file.md §Title", "docs/x.md", "per AGENTS.md §Code Organization"],
    ["a link without an anchor, then §", "docs/plans/x.md", "per [`testing.md`](../../.claude/rules/testing.md) §Fake timers"],
    ["a wrapped comment", "src/a.sh", "# `.claude/rules/testing.md`\n# §Fake timers"],
    ["a rationale file", "docs/x.md", "testing.rationale.md §Why"],
    ["a reference link whose definition has no anchor", "docs/x.md", "[AGENTS.md §Code][core]\n\n[core]: ../AGENTS.md"],
  ])
    it(`rejects ${what}`, () => assert.notDeepEqual(citationHits(file, text, targets), []));

  for (const [what, file, text] of [
    ["an anchored link keeping its §", "docs/x.md", "[`AGENTS.md` §Code](../AGENTS.md#code)"],
    ["an anchored titled link (H12)", "docs/x.md", '[AGENTS.md §Code](../AGENTS.md#code "t")'],
    ["an anchored link with parens in its path (H12)", "docs/x.md", "[AGENTS.md §Code](../a(b)/AGENTS.md#code)"],
    ["an anchored shortcut reference", "docs/x.md", "[AGENTS.md §Code]\n\n[agents.md  §code]: ../AGENTS.md#code"],
    ["a plain path#anchor", "src/a.sh", "# `.claude/rules/web.md#save-status`"],
    ["another file with the same basename", "docs/x.md", "`docs/specs/testing.md:12`"],
    ["a § with no file named", "docs/x.md", "see §Fake timers below"],
    ["a colon that is not a line number", "docs/x.md", "`AGENTS.md`: the core"],
  ])
    it(`accepts ${what}`, () => assert.deepEqual(citationHits(file, text, targets), []));
});

describe("retired paths", () => {
  for (const [file, text] of [
    ["docs/proposals/x-proposal.md", "see `.github/copilot-instructions.md` §Scope"],
    ["docs/plans/a-new-plan.md", "see copilot-instructions §Backend"],
    [".claude/rules/foo.md", "`.github/instructions/`"],
    ["AGENTS.md", "`planning.instructions`"],
    ["agent-skills/README.md", "read `editing.instructions.md`"],
    ["docs/index.md", "## Plans\n| row | `.github/instructions/` |"],
  ])
    it(`fails on ${file}`, () => assert.notDeepEqual(retiredPathHits(file, text), []));

  for (const file of [
    "docs/archive/plans/old-plan.md",
    "docs/handoffs/2026-11-01-x.md",
    "_IDEAS_/ai-instructions/README.md",
    "docs/agents/rationale/planning.rationale.md",
    "tooling/agent-guard/check.mjs",
    "docs/plans/agent-instructions-migration-plan.md",
    "docs/proposals/agent-instructions-migration-proposal.md",
    "docs/agents/qn-17-rule-ledger.md",
  ])
    it(`exempts ${file}`, () => assert.deepEqual(retiredPathHits(file, "see `.github/copilot-instructions.md`"), []));

  it("docs/index.md: only the ## Archive section is exempt", () => {
    const index = "## Plans\n| live | `x.instructions.md` |\n## Archive\n| old | `copilot-instructions` |";
    assert.deepEqual(retiredPathHits("docs/index.md", index), ["docs/index.md:2: .instructions"]);
    assert.equal(withoutArchiveRows("README.md", index), index);
  });
});

// ---------------------------------------------------------------------------------------------
// rationale, routing, budgets
// ---------------------------------------------------------------------------------------------

describe("rationale", () => {
  const RATIONALE = "docs/agents/rationale/agents.rationale.md";
  const entry = (rule) => `<a id="one"></a>\n\n## One\n\n**Rule:** ${rule}\n`;
  const good = entry("[AGENTS.md §X](../../../AGENTS.md#x)");
  const rule = (text) => ({ path: "AGENTS.md", text });

  it("reads an entry anchor only when alone on its line", () => {
    assert.deepEqual(rationaleEntries(good + '\ninline <a id="no"></a> text\n'), ["one"]);
  });

  it("accepts a real why link to the paired file", () => {
    const r = rule("x ([why](docs/agents/rationale/agents.rationale.md#one))");
    assert.deepEqual(unlinkedEntries({ path: RATIONALE, text: good }, r), []);
    assert.deepEqual(strayWhyLinks(r), []);
  });

  for (const [what, text] of [
    ["a bare mention", "Mention agents.rationale.md#one)"],
    ["a link in a code span", "`[why](docs/agents/rationale/agents.rationale.md#one)`"],
    ["a link to another anchor", "[why](docs/agents/rationale/agents.rationale.md#two)"],
  ])
    it(`catches an entry reached only by ${what} (H15)`, () =>
      assert.deepEqual(unlinkedEntries({ path: RATIONALE, text: good }, rule(text)), ["one"]));

  it("resolves reference-style why links through their definitions (review M3)", () => {
    const P = "docs/agents/rationale/planning.rationale.md#one";
    const A = "docs/agents/rationale/agents.rationale.md";
    assert.deepEqual(strayWhyLinks(rule(`x [why][w]\n\n[w]: ${P}`)), [P]);
    assert.deepEqual(strayWhyLinks(rule(`x [why][]\n\n[why]: ${A}`)), [A]);
    assert.deepEqual(strayWhyLinks(rule(`x [Why]\n\n[why]: ${P}`)), [P]);
    assert.deepEqual(strayWhyLinks(rule(`x [why][w] [why][]\n\n[w]: ${A}#one\n[why]: <${A}#two>`)), []);
    assert.deepEqual(strayWhyLinks(rule("x [why] with no definition is text")), []);
  });

  it("catches a why link to another rationale file, or with no anchor", () => {
    assert.deepEqual(
      strayWhyLinks(rule("[why](docs/agents/rationale/web.rationale.md#one) [Why](docs/agents/rationale/agents.rationale.md)")),
      ["docs/agents/rationale/web.rationale.md#one", "docs/agents/rationale/agents.rationale.md"],
    );
  });

  for (const [what, text] of [
    ["no Rule line", '<a id="one"></a>\n\n## One\n\nBody.\n'],
    ["a bare mention", entry("AGENTS.md#x")],
    ["an unrelated rule", entry("[web.md §X](../../../.claude/rules/web.md#x)")],
    ["no anchor", entry("[AGENTS.md](../../../AGENTS.md)")],
  ])
    it(`catches an entry with ${what}`, () =>
      assert.deepEqual(entriesWithoutBackLink({ path: RATIONALE, text }, "AGENTS.md"), ["one"]));
});

describe("routing", () => {
  const r = [".claude/rules/a.md", ".claude/rules/b.md"];
  const table = (rows) =>
    ["x", "## Rule files", "", "| When | Read |", "| --- | --- |", ...rows, "", "## Next", "| n | `.claude/rules/gone.md` |"].join("\n");
  const rowA = "| a | `.claude/rules/a.md` |";
  const rowB = "| b | `.claude/rules/b.md` |";

  it("passes one row per file, and stops at the next heading", () => {
    assert.deepEqual(routingProblems(routingRows(table([rowA, rowB])), r), []);
  });

  it("fails a missing, duplicate, empty or dangling row", () => {
    assert.deepEqual(routingProblems(routingRows(table([rowA])), r), [".claude/rules/b.md is in 0 rows"]);
    assert.deepEqual(
      routingProblems(routingRows(table([rowA, rowA, rowB, "| g | `.claude/rules/gone.md` |", "| none | x |"])), r),
      ["row 4 names a missing file: .claude/rules/gone.md", "row 5 names no rule file", ".claude/rules/a.md is in 2 rows"],
    );
  });
});

describe("budgets", () => {
  const line = (n) => "x".repeat(n);
  it("measures each hard budget", () => {
    const rule = ".claude/rules/x.md";
    assert.deepEqual(overBudget(rule, line(400)), []);
    assert.deepEqual(overBudget(rule, line(401)), ["line-length"]);
    assert.deepEqual(overBudget(rule, "é".repeat(400)), []);
    assert.deepEqual(overBudget(rule, "````\n```\n" + line(500) + "\n```\n````\n"), []);
    assert.deepEqual(overBudget("AGENTS.md", Array(201).fill("x").join("\n") + "\n"), ["lines"]);
    assert.deepEqual(overBudget("AGENTS.md", Array(200).fill("x").join("\n") + "\n"), []);
    assert.deepEqual(overBudget("AGENTS.md", Array(70).fill("é".repeat(200)).join("\n")), ["bytes"]);
    assert.deepEqual(overBudget("AGENTS.md", "```\n" + line(401) + "\n```"), ["line-length"]);
    assert.deepEqual(overBudget("CLAUDE.md", Array(41).fill("x").join("\n")), ["lines"]);
    assert.deepEqual(overBudget("CLAUDE.md", Array(40).fill(line(500)).join("\n") + "\n"), []);
  });

  it("a rule's size is reported, never a hard failure", () => {
    const big = Array(60).fill(line(399)).join("\n");
    assert.deepEqual(overBudget(".claude/rules/x.md", big), []);
    assert.match(ruleSizeTable([{ file: "a.md", text: big }])[0], / over /);
  });
});
