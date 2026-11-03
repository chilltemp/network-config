# Network documentation proposal

**Queue:** QN-1 · **Affects:** this repo (public), `chillweb.net` (public site), a new private docs home,
`homepage` config on furball and hairball

## Why

Knowledge about the network is spread across five places, and none of them is complete:

- **This repo**, which is public on GitHub. It holds compose stacks and the Oversized-LLM Ansible.
  Its AdGuard investigation log moved to the gitignored `private/adguard-home/troubleshooting-log.md`
  on 2026-11-01 (see the Decisions section).
- **`chillweb.net`**, a public Nextra site on Vercel with how-to notes: homepage tweaks, Uptime Kuma,
  and the scanner Pi build. It is written as tutorials, not as an inventory.
- **`homepage` config** on furball and hairball, synced by Syncthing. It is the operator's real index
  of services.
- **Portainer's Stack UI**, which holds every runtime env value.
- **The operator's memory.**

Discovery (QN-2) will produce an inventory that is sensitive: which services lack auth, which ports
are open, and what is unpatched. That output needs a decided home before anyone writes it.

## Requirements

- **REQ-DOCS-01 — Three tiers.** Classify network content as **Public**, **Private** or **Secret**,
  with a written rule for each. Starting point for the operator to correct:

  | Tier    | Lives in                         | Examples                                                                                                                |
  | ------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
  | Public  | this repo, `chillweb.net`        | compose stacks, READMEs without secrets, generic how-tos, `home-lan.net` names, the shape of the network                |
  | Private | the private home (REQ-DOCS-02)   | full inventory (IPs, MACs, ports, VLANs), auth/TLS status per service, known weaknesses, backup map, internal runbooks, troubleshooting and investigation logs that name household devices, people or LAN IPs |
  | Secret  | a vault or password manager only | passwords, API tokens, ansible-vault files, Portainer env values, homepage widget API keys                              |

- **REQ-DOCS-02 — A private home.** Choose one: a private GitHub repo, a repo on the homelab's Forgejo,
  or both, with one primary and one mirror. ⚠️ Runbooks are most needed when the homelab is down, and
  a down furball takes local DNS with it. Whatever is chosen must stay readable from a laptop's local
  clone with the homelab offline.
- **REQ-DOCS-03 — A format.** Choose between an LLM wiki and a plain docs folder. The LLM wiki
  follows the `readingorder.wiki` pattern: raw sources, LLM-maintained wiki pages, and a schema file.
  Discovery output fits that pattern naturally. Raw exports from Unifi, AdGuard, homepage and Portainer
  become the raw sources, and host and service pages become the wiki.
- **REQ-DOCS-04 — `chillweb.net`'s role.** Decide what stays there. The proposed answer: it stays the
  public how-to site, the inventory never goes there, and pages for systems that move into git (such
  as the scanner Pi, QN-15) link to their repo instead of duplicating it.
- **REQ-DOCS-05 — This repo's role.** Decide what stays public here. The proposed answer: stacks,
  Ansible, the queue and proposals stay here, while findings and the inventory go private. When it
  lands, replace the interim public-safety rule in
  [`proposals.md`](../../.claude/rules/proposals.md#public-safety) with the outcome.
- **REQ-DOCS-06 — Homepage config.** Decide whether homepage's config goes into git, and in which
  tier. It probably holds widget API keys, which would make it Secret unless they are split out.
- **REQ-DOCS-07 — Agent access.** The private home gets its own agent rules (`CLAUDE.md` or
  `AGENTS.md`) and a `ccl` entry. The queue stays in this repo.
- **REQ-DOCS-08 — `private/`'s future.** The gitignored `private/` folder in this repo was added on
  2026-11-01 as an interim local-only home. It holds the brain dump and the AdGuard troubleshooting
  log, and QN-3's furball notes will go there. Either retire it, moving its contents to the chosen
  home, or keep it with a defined role.

## Non-goals

- Writing the inventory. That is QN-2.
- Migrating `chillweb.net` content.
- Choosing a secrets manager beyond naming where Secret content lives today.

## Offline behavior

All three tiers must be readable from local copies with the internet and the homelab both down.

## Depends on

Nothing. QN-2 is blocked on this.

## Open questions

1. Private home: GitHub private, Forgejo, or both? Is Forgejo deployed today, and on which host?
2. LLM wiki or plain docs?
3. Does homepage's config hold API keys?
4. Where do Secret values live today, apart from ansible-vault and Portainer? Is there a password
   manager?
5. ~~Should the existing troubleshooting logs, which name LAN IPs and devices, stay public?~~
   Decided: no (see Decisions).
6. `private/`: retire it once the private home exists, or keep it, and if so, for what?

## Decisions

- **2026-11-01 — Troubleshooting and investigation logs are Private.** These are logs that name
  household devices, people or LAN IPs, such as the AdGuard filtering log, with its phones, apps and
  per-device rules. They don't go in this public repo. Until REQ-DOCS-02 picks the private home, they
  live in the gitignored `private/` folder, mirroring the repo path
  (`private/adguard-home/troubleshooting-log.md`). The stack's README says where the log is, without
  linking to it. This answers open question 5 and fills one Private row of REQ-DOCS-01.

## Notes for planning

- This is a decision proposal and may need only one session: a Q&A, then a short outcome doc. It may
  not need a multi-phase plan.
- The `readingorder.wiki` schema (`LLM-WIKI.md`, its `CLAUDE.md`) is the reference if the wiki
  option is chosen.
