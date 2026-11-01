# Scanner Pi to Docker proposal

**Queue:** QN-15 · **Affects:** the scanner Pi 4 (Fujitsu ScanSnap S1500, 7" touch display), the
Paperless consume share, the `scanner-control-nodered` repo, the `chillweb.net` scanner page

## Why

The scanner Pi was built by hand, and the `chillweb.net` scanner page documents it only partly. The
build includes:

- SANE, scanbd and `sane-scan-pdf`.
- Custom trigger and per-page scripts.
- A Node-RED dashboard, with its flows in the `scanner-control-nodered` repo.
- A Chromium kiosk.
- A CIFS mount to the Paperless consume folder.

Rebuilding it means repeating every step. The goal is Docker, with code and config in git.

## Requirements

- **REQ-SCAN-01 — Capture the as-built state.** Before any change, record what is actually on the Pi
  and compare it with the `chillweb.net` page.
- **REQ-SCAN-02 — Containerized scan pipeline.** SANE and scanbd run in a container with USB access.
  The scan scripts upload to Paperless.
- **REQ-SCAN-03 — Containerized UI.** Node-RED, or a replacement, runs in a container with its flows
  from git.
- **REQ-SCAN-04 — Host bits in git.** What can't be containerized (the kiosk browser, display
  settings, USB permissions) is written as code or as a script in git.
- **REQ-SCAN-05 — Secrets out of git.** SMB credentials follow the Secret tier (QN-1).
- **REQ-SCAN-06 — Tested rebuild.** A rebuild on a spare SD card works from the repo alone. The old
  card is kept as the rollback.
- **REQ-SCAN-07 — One source of docs.** The `chillweb.net` page points at the repo instead of
  duplicating it.

## Non-goals

- Replacing the scanner or Paperless.
- Fixing the on-screen keyboard in kiosk mode, unless it is cheap once containerized.

## Offline behavior

Scanning to the share and OCR (tesseract) are LAN-only and must work with the WAN down.

## Depends on

Nothing hard. QN-12 decides how the stack is deployed, and plain compose works in the meantime.

## Open questions

1. Where does the code live: this repo, or `scanner-control-nodered`?
2. Keep Node-RED, or replace it with a small purpose-built UI?
3. Upload over a CIFS mount, or through Paperless's API?

## Notes for planning

Phase 0 spike: on the Pi, confirm that scanbd sees the button presses and that SANE reaches the
S1500 from inside a container. This is the premise everything else rests on.
