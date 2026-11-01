# Service updates proposal

**Queue:** QN-13 · **Affects:** every stack's pinned images, host operating systems (Unraid, Ubuntu,
Pi OS, HA OS, PiKVM)

## Why

Services need to be brought up to date, and kept there. Images are pinned on purpose (see the
compose-stack conventions), so every update is a deliberate change. That needs a way to know when an
update exists, and a safe way to apply it.

## Requirements

- **REQ-UPD-01 — Notification.** The operator learns when a pinned image or a host OS has updates.
  Options: the manager's native checks (QN-12), DIUN (already in `_IDEAS_/TODO.md`), or Renovate PRs
  against this repo.
- **REQ-UPD-02 — Policy.** Security patches are applied promptly. Major versions go through a
  proposal or a plan. Pin bumps go through git.
- **REQ-UPD-03 — Catch-up.** Every stack moves to a supported version, using QN-2's version column.
  Risky majors are listed separately.
- **REQ-UPD-04 — Rollback.** Before a major update, record the previous pin and take a data backup.

## Non-goals

- Auto-updating to `latest`. This is against the compose-stack conventions.
- The first patch sweep of critical components (QN-7) and the Unifi controller (QN-8).

## Offline behavior

Checking for and pulling updates needs the internet. Nothing breaks while it is down.

## Depends on

QN-12, because the chosen manager may already provide update detection.

## Open questions

1. How should the operator be notified: email, Home Assistant, or something else?
2. Should host OS security updates install unattended?
