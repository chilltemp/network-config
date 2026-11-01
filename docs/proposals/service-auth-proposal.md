# Service auth proposal

**Queue:** QN-10 · **Affects:** every web service without a login, Traefik middlewares, the host that
runs the auth server

## Why

Some services have no login at all. Even at home grade, every service should require a login, and
logins must keep working offline.

## Requirements

- **REQ-AUTH-01 — Nothing is open.** Every web service requires a login. Use app-native auth where it
  is adequate, and Traefik forward-auth otherwise.
- **REQ-AUTH-02 — Choose a provider.** It must be self-hosted, work offline, and offer local MFA
  (TOTP or passkeys). Candidates:
  - Authelia: file-backed users, light.
  - Authentik: a full IdP, heavier.
  - Traefik basic-auth: the simplest option.

  ⛔ Providers that need a cloud OAuth account fail the offline requirement.
- **REQ-AUTH-03 — No new single point of failure.** If the auth server sits on furball, every login
  breaks when furball does. Choose its host deliberately, and document a break-glass path.
- **REQ-AUTH-04 — Exemptions are explicit.** Machine clients are listed with a reason and their own
  credential: homepage widgets, Uptime Kuma checks, the Home Assistant MCP endpoint, and health
  checks.
- **REQ-AUTH-05 — Rollout order.** Roll out to high-value services first (the QN-7 list), then the
  rest.
- **REQ-AUTH-06 — SSO where it's cheap.** Apps that support OIDC (Forgejo, Linkwarden, the container
  manager, possibly HA) may use the provider. This is optional.

## Non-goals

- Enterprise IAM, multi-tenant users, or internet exposure.

## Offline behavior

Login works with the WAN down. MFA is local (TOTP or passkey), never push.

## Depends on

QN-9, because forward-auth is a Traefik middleware and needs every service behind Traefik first.

## Open questions

1. Who are the users: just the operator, or also Karen?
2. Is SSO wanted, or is "a password on everything" enough?
3. Which provider?
