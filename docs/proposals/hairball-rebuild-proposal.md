# Hairball rebuild proposal

**Queue:** QN-14 · **Affects:** hairball and every secondary service it runs (AdGuard replica,
homepage replica, others from QN-2)

## Why

Hairball runs Unraid, but it isn't a NAS. It runs secondaries of furball's critical services. It
would be easier to manage as a plain Debian or Ubuntu host with the chosen container manager, and
with its host config in git.

## Requirements

- **REQ-HAIR-01 — Inventory.** List hairball's services, data and hardware from QN-2, and mark which
  are secondaries of furball.
- **REQ-HAIR-02 — Target OS.** Debian or Ubuntu, with the host baseline (Docker, Tailscale if used,
  firewall, SSH) applied from git.
- **REQ-HAIR-03 — Secondaries stay covered.** While hairball is down, furball and oldmac carry DNS
  and the other secondaries. This requires QN-6.
- **REQ-HAIR-04 — Safe wipe.** Data is copied and verified before the wipe. The Unraid USB is kept as
  the rollback.
- **REQ-HAIR-05 — Redeploy from the repo.** Services come back through the manager chosen in QN-12,
  from this repo's compose files.
- **REQ-HAIR-06 — Replicas reconnected.** adguard-sync, Syncthing (homepage config) and monitors
  point at the rebuilt host.

## Non-goals

- Changing furball.
- Adding new services during the rebuild.

## Offline behavior

Once rebuilt, hairball serves its secondaries with the WAN down, the same as today.

## Depends on

QN-6 (DNS must survive hairball being down) and QN-12 (the deploy target).

## Open questions

1. Debian or Ubuntu?
2. Should the Ansible roles be generalized to provision hairball (see QN-11 and QN-7)?
3. Does hairball have hardware that matters, such as a GPU or extra disks?
