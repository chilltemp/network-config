# VLAN AdGuard coverage proposal

**Queue:** QN-18 · **Affects:** DHCP and firewall rules on the Unifi gateway; the IoT (VLAN 20) and
Guest (VLAN 30) networks; AdGuard Home on furball, hairball and oldmac

## Why

The household AdGuard servers are the network's one place for DNS filtering and for seeing what
devices contact. Their logs and rules should cover every VLAN, including the IoT and Guest networks
that hold most of the household's devices. Those are also the devices least able to run any
protection of their own.

## Requirements

- **REQ-VLAN-01 — IoT uses the household AdGuard.** DHCP on VLAN 20 hands out the household AdGuard
  servers, so its clients are filtered and appear in the same query logs as the Default network.
- **REQ-VLAN-02 — Guest uses the household AdGuard.** The same for VLAN 30.
- **REQ-VLAN-03 — DNS only.** Each VLAN may reach AdGuard on the DNS port and nothing more on that
  host. VLAN isolation otherwise stays as it is.
- **REQ-VLAN-04 — Same redundancy as the Default network.** Each VLAN gets the resolver list that
  QN-6 settles on, so no single host's outage takes DNS away from it.
- **REQ-VLAN-05 — Devices keep working.** Filtering must not break a device that needs its cloud
  service. A device that breaks gets a recorded allow rule or a recorded exception.
- **REQ-VLAN-06 — Clients are identifiable.** Query logs name the devices on these VLANs, so a log
  review doesn't show a list of bare IPs.
- **REQ-VLAN-07 — Recorded.** The per-VLAN DNS settings and any exceptions are written up in the
  private docs home.

## Non-goals

- Redesigning the VLANs or moving devices between them.
- Stopping clients that bypass local DNS, such as hardcoded resolvers or DoH (same limit as QN-6).
- Per-device filtering policies, beyond the exceptions REQ-VLAN-05 needs.
- Retiring the AdGuard instance on Home Assistant. That is QN-19.

## Offline behavior

With the WAN down, devices on both VLANs still get local answers from AdGuard, and devices that work
locally keep working. Nothing in this change may make a LAN-only device depend on the internet.

## Depends on

QN-2, for the DNS map, and QN-6, for the resolver list each VLAN receives.

## Open questions

1. Should guests get the same filtering as the household, or a lighter rule set?
2. Should guests be able to resolve `*.home-lan.net` names, or should those stay hidden from them?
3. Should IoT devices get the same rule set, or a looser one to reduce breakage?

## Notes for planning

- Phase 0 spike: confirm what each VLAN's DHCP hands out today and which inter-VLAN rules apply. The
  plan must not assume either.
- Phase 0 spike: confirm that the installed Unifi controller and gateway can set per-VLAN DHCP DNS
  and the REQ-VLAN-03 rule. QN-8 may change that interface.
- Move one VLAN at a time, Guest or IoT in whichever order breaks least, and watch the query logs
  before moving the next. Phones and other Wi-Fi clients pick up new DNS only when their DHCP lease
  renews.
- These changes touch live hosts, so §Live-Host Safety in the planning rules applies.
