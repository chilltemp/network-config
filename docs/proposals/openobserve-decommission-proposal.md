# OpenObserve decommission proposal

**Queue:** QN-4 · **Affects:** the [`openobserve`](../../openobserve/README.md) stack (OpenObserve +
syslog-ng), anything that sends syslog to it

## Why

OpenObserve isn't actually used. It still uses resources, holds a root login, and is one more service
to patch.

## Requirements

- **REQ-OO-01 — Find the senders.** Find the host that runs it and everything that sends logs to its
  syslog-ng listener, such as Unifi devices or Unraid. Repoint or disable each sender.
- **REQ-OO-02 — Keep nothing by default.** Confirm with the operator that no stored logs need
  exporting.
- **REQ-OO-03 — Remove every trace on the network.** Remove the stack, its data path, its Traefik
  route, its AdGuard record, its homepage tile and any Uptime Kuma monitor.
- **REQ-OO-04 — Remove it from the repo.** Delete `openobserve/` (git history keeps it) and repoint any
  references.

## Non-goals

- Choosing a replacement logging stack. Furball's crash logs are handled in QN-3.

## Offline behavior

No effect.

## Depends on

Nothing.

## Open questions

1. Is anything configured to send syslog to it today?
2. Delete `openobserve/` outright, or keep it under an archive folder?

## Notes for planning

This is a single-session task and probably needs no multi-phase plan.
