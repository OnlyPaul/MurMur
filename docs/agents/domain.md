# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

Treat this repository as a single-context repo.

## Before exploring, read these

- `AGENTS.md` for the current architecture overview and development constraints.
- Root-level `CONTEXT.md` if it exists.
- `docs/adr/` if it exists.

If any of these files do not exist, proceed silently and continue with the repo's existing documentation and code.

## Preferred vocabulary

Use the repo's existing language when writing issues and PRDs:

- Tauri app
- managers
- onboarding
- tray
- overlay
- portable mode
- transcription history
- model manager
- settings store
- command-event architecture
- local / offline / on-device
