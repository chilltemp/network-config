# Furball boot-to-SSD proposal

**Queue:** QN-3 · **Affects:** furball (Unraid NAS, primary AdGuard, many critical services), PiKVM

## Why

Furball has occasional system crashes. The operator suspects USB, because this machine had USB
problems before it became a server. Unraid boots from a USB flash drive. The operator reports that
Unraid now supports booting from an SSD, and has bought a dedicated SSD for it so that no existing
drive is wiped.

Every furball crash takes local DNS with it: `*.home-lan.net` stops resolving until furball is back
(QN-6 owns that blast radius). PiKVM is attached and can press the power button.

## Requirements

- **REQ-FURB-01 — Safe start.** Before the change, there is a verified copy of the flash `config`,
  a verified appdata backup, and a record of every array and pool assignment.
- **REQ-FURB-02 — Supported path only.** Boot moves to the dedicated SSD using Unraid's documented
  procedure for the installed version. ⛔ No existing array or pool drive is touched.
- **REQ-FURB-03 — Licensing.** Understand how the license moves, since it is tied to the flash
  drive's GUID, before starting.
- **REQ-FURB-04 — Rollback.** The original USB drive is kept untouched and bootable until furball has
  run stably for an agreed period.
- **REQ-FURB-05 — Crash baseline.** Persistent logging is turned on, and crash frequency is recorded
  before the change, so that "it's fixed" can be shown rather than assumed. If crashes continue
  afterwards, that becomes its own investigation (other USB devices, BIOS power states, RAM), not
  part of this row.
- **REQ-FURB-06 — Window.** The change runs in an agreed maintenance window, with the DNS impact
  stated ahead of time.
- **REQ-FURB-07 — Recorded.** The new boot setup and the rollback steps are written up in the
  gitignored `private/` folder, and move to the private docs home once QN-1 picks one.
  ⛔ Never in this public repo.

## Non-goals

- Replacing array drives, or moving services off furball.
- An Unraid version upgrade beyond what SSD boot requires. That is an open question.
- Fixing DNS resilience (QN-6).

## Offline behavior

Furball must boot and serve with the internet down. Check whether the SSD-boot path, or the license,
needs online registration at boot or only once at setup.

## Depends on

Nothing else in the queue. It may run alongside QN-2.

- REQ-FURB-01 is its own backup check, so it doesn't wait for QN-5.
- REQ-FURB-07 writes to `private/` (operator decision, 2026-11-01), so it doesn't wait for QN-1.

## Open questions

1. Which Unraid version is installed, and does SSD boot require an upgrade first?
2. Is the SSD internal (SATA or NVMe), or USB-attached? A USB-attached SSD doesn't remove USB from
   the boot path.
3. Where should persistent logs go: a syslog server on another host, or mirrored to flash?
4. How long must furball run stably before the old USB drive is retired?

## Notes for planning

- Phase 0 spike: read Unraid's documentation and release notes for the installed version. It must
  confirm that SSD boot is supported, how it is set up, and how licensing works. No change is made.
- The crash baseline should start well before the migration, so it has data to compare against.
