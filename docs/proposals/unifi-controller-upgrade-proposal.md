# Unifi controller upgrade proposal

**Queue:** QN-8 · **Affects:** the Unifi controller, every Unifi device it manages, DHCP/firewall if
the gateway is Unifi

## Why

The goal is to bring the Unifi controller to a current, supported release, and keep it there. A
supported controller gets security fixes, manages current devices, and lets device firmware move
forward. An in-place upgrade may not be possible; REQ-UNIFI-03 lists the options. The installed
version and hardware are recorded in the private docs home, not here (REQ-UNIFI-01).

## Requirements

- **REQ-UNIFI-01 — Current state known.** Record the hardware, OS, controller version and supported
  upgrade path (multi-hop, migration, or new hardware) in the private docs home (QN-1).
- **REQ-UNIFI-02 — Backup first.** A full backup with history is stored off the controller, and
  QN-2's export of its config exists, before any change.
- **REQ-UNIFI-03 — Choose a target.** The options are:
  - **(a) An in-place upgrade**, if a path exists.
  - **(b) A UniFi hardware console.** It is independent of the servers.
  - **(c) A self-hosted Network Application in Docker.** It needs MongoDB, and ties network
    management to a server that can be down.
- **REQ-UNIFI-04 — No surprise outage.** Devices are re-adopted, or pointed at the new inform URL, in
  a window. The old controller is kept intact and powered off as the rollback.
- **REQ-UNIFI-05 — Firmware.** Once the controller is current, bring device firmware up to date in
  stages.
- **REQ-UNIFI-06 — Local control.** A local admin account exists, and management works without a
  cloud account or the internet.
- **REQ-UNIFI-07 — Auto-backup off the box.** Feeds QN-5.

## Non-goals

- Replacing Unifi gear, or redesigning networks and VLANs (see QN-7, open question 1).

## Offline behavior

Devices keep forwarding traffic if the controller is down. The controller must work with the WAN
down.

## Depends on

QN-2, so the old config is captured before anything changes.

## Open questions

1. What hardware runs the controller today?
2. Is the gateway/router a Unifi device, or something else?
3. Is there budget for a hardware console, or is self-hosted preferred?

## Notes for planning

Phase 0 spike: confirm the supported path from the installed version, using Ubiquiti's release notes
and migration docs, before choosing a target.
