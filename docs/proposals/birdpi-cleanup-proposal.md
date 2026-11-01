# BirdPi cleanup proposal

**Queue:** QN-16 · **Affects:** birdpi, [`birdnet-go`](../../birdnet-go/README.md),
[`birdnet-pi`](../../birdnet-pi/README.md)

## Why

Birdpi works, but the operator doesn't remember which variant is running. This repo has stacks for
both BirdNET-Go and BirdNET-Pi. The repo and its docs should match reality.

## Requirements

- **REQ-BIRD-01 — Know what runs.** Record the variant, version, deploy method, audio device, data
  path and URL on birdpi.
- **REQ-BIRD-02 — One stack folder.** Keep the folder that matches, and remove the other or mark it
  unused.
- **REQ-BIRD-03 — The README is as-built.** It covers host setup, env vars, the audio device, Traefik
  and AdGuard entries, and a pinned image.
- **REQ-BIRD-04 — Backup noted.** The detections data is listed for QN-5.

## Non-goals

- Switching variants, or adding features.

## Offline behavior

Detection runs locally. Any online species-lookup features are optional.

## Depends on

Nothing.

## Open questions

1. Keep the unused variant's folder for a future switch, or delete it?

## Notes for planning

This is a single-session task and probably needs no multi-phase plan.
