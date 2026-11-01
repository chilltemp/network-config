# Backup adequacy proposal

**Queue:** QN-5 · **Affects:** furball shares and appdata, every host's config, Acronis True Image on
the licensed machines, `oversized`

## Why

Backups use Acronis True Image, which has a 5-computer license and can back up network shares. Some
furball shares are backed up by Acronis running on `oversized`, the Windows gaming PC. The Forgejo
stack's dumps go to a share described as "already cloud-backed". Nobody has checked whether all of
this adds up to adequate coverage.

## Requirements

- **REQ-BAK-01 — Backup inventory.** For each data set that QN-2 finds: what it is, what backs it up,
  how often, retention, where each copy lives (local, offsite or cloud), and whether the copy is
  encrypted.
- **REQ-BAK-02 — A target per data class.** Use home-grade 3-2-1 as the yardstick, with the target
  set per class:
  - **Irreplaceable:** documents, photos, Paperless.
  - **Config:** Unraid flash and appdata, Home Assistant, Unifi, AdGuard, Traefik, Pi SD cards.
  - **Rebuildable:** media, images.
- **REQ-BAK-03 — Gap list.** List every gap. Known suspects:
  - Jobs that depend on `oversized` being booted into Windows and awake.
  - Data sets with no copy at all.
  - Machines beyond the 5 licenses.
- **REQ-BAK-04 — Restore test.** At least one real restore per data class, with the result recorded.
- **REQ-BAK-05 — Failures are noticed.** A failed or missed backup reaches the operator without anyone
  having to check for it.
- **REQ-BAK-06 — Device config backups.** Unifi auto-backup is stored off the controller. AdGuard,
  Unraid flash, Home Assistant and the Pi SD images (scanner, birdpi, HA) each have a copy and a
  restore note.
- **REQ-BAK-07 — Gaps closed.** Each gap from REQ-BAK-03 ends in one of two states:
  - **Fixed and verified** against its class target: the backup has run, and for irreplaceable data
    a restore of that data set has been tested.
  - **Accepted by the operator**, explicitly, with its own new queue row.

  ⛔ This row is not complete while any gap is in neither state.

## Non-goals

- Replacing Acronis, unless the gap list forces it. That is an open question.
- Enterprise backup tooling.

## Offline behavior

Local backups must run with the internet down. Offsite copies may wait for the internet to come back.

## Depends on

QN-2, because the inventory is the list of what needs protecting.

## Open questions

1. Is there an Acronis cloud subscription, or is it local only?
2. Which machines hold the 5 licenses?
3. Is `oversized` reliably on, and in Windows, when its jobs run?
4. "Already cloud-backed": which share, to which cloud, and by what tool?
5. Is there any offsite copy today?

## Notes for planning

QN-3 (furball), QN-8 (Unifi) and QN-14 (hairball) each do their own pre-change backup. This row sets
the steady state that they should leave behind.
