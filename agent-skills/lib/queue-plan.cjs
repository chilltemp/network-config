// Resolve a queue id to its plan doc and the phases its **Status:** line declares.
// Shared by next-phase/scripts/next-phase.sh and adversarial-review/scripts/adversarial-review.sh.
// The repo is whichever one the caller runs in; see ../README.md §What a repo must provide.
const fs = require('fs');
const path = require('path');

const QUEUE = 'docs/proposals/_implementation-order.md';
const ID = /^[A-Z][A-Z0-9]*-[0-9]+$/;
const HEADER_PHASE = /Phase\s+([\w.-]+)\s+(⬜|🟡|⏸|✅|⚠️)/gu;

/** Prints `message` to stderr and exits 1: every caller is a CLI that stops on a bad id. */
function fail(message) {
  console.error(message);
  process.exit(1);
}

/**
 * `{ rel, status, phases }` for `id`: the doc path relative to `repo`, the queue row's Status
 * cell, and `[{ id, mark }]` in header order (empty when the doc or its header is missing).
 * The row match is an exact `#` cell match, so `QI-9` never finds `QI-90`.
 */
function resolvePlan(repo, id) {
  if (!ID.test(id)) fail(`${id}: not a queue id (expected PREFIX-<n>, e.g. QK-35)`);
  const queue = path.join(repo, QUEUE);
  if (!fs.existsSync(queue)) fail(`${path.basename(repo)} has no queue (${QUEUE} is missing)`);
  const row = fs
    .readFileSync(queue, 'utf8')
    .split('\n')
    .map((line) => line.split('|').map((cell) => cell.trim()))
    .find((cells) => cells[1] === id);
  if (!row) fail(`${id} not in queue (${QUEUE}) — wrong session? ids are per repo`);
  const link = (row[2] ?? '').match(/\]\(([^)#]+)/);
  if (!link) fail(`${id}: no doc link in the Item cell`);
  const doc = path.resolve(path.dirname(queue), link[1]);
  const statusLine = fs.existsSync(doc)
    ? fs.readFileSync(doc, 'utf8').split('\n').find((l) => l.startsWith('**Status:**'))
    : undefined;
  const phases = statusLine
    ? [...statusLine.matchAll(HEADER_PHASE)].map(([, phase, mark]) => ({ id: phase, mark }))
    : [];
  return { rel: path.relative(repo, doc), status: row[4] ?? '', phases };
}

module.exports = { HEADER_PHASE, ID, QUEUE, fail, resolvePlan };
