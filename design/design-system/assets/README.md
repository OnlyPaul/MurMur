# Murmur brand assets — canonical source of truth

The SVGs in this directory are the **canonical source of truth** for every
Murmur brand artifact shipped in the desktop app. Edit these files (not the
generated PNG/ICO/ICNS outputs).

| File                                          | Used for                                                      |
| --------------------------------------------- | ------------------------------------------------------------- |
| `app-icon.svg`                                | All packaged desktop/mobile app icons (`src-tauri/icons/**`). |
| `murmur-mark.svg`                             | Tray/menu-bar state icons (`src-tauri/resources/tray_*.png`). |
| `wordmark.svg`                                | In-app lockup (`src/components/icons/MurmurWordmark.tsx`).    |
| `hero-waveform.svg`, `listening-waveform.svg` | Marketing/preview surfaces.                                   |

## Regenerating shipped artifacts

The brand-asset pipeline reads these SVGs and emits every packaged icon and
runtime tray asset. Outputs are deterministic — running the script twice
produces byte-identical files.

```bash
bun run brand:gen     # regenerate everything from the SVGs
bun run brand:check   # CI-friendly: exit 1 if checked-in artifacts drift
bun run test:brand    # node:test harness around the same check
```

The pipeline implementation lives at `scripts/generate-brand-assets.ts`.

## Tray emphasis model

The tray/menu-bar follows a **restrained state model**: one Murmur mark with
emphasis changes — never unrelated pictograms. The three states differ only
in fill opacity (idle 55%, transcribing 85%, recording 100%) on the same
five-bar geometry from `murmur-mark.svg`.

| Theme                           | Fill      | Files                                            |
| ------------------------------- | --------- | ------------------------------------------------ |
| Dark UI (macOS/Win dark, Linux) | `#f4f4f6` | `tray_{idle,recording,transcribing}.png`         |
| Light UI (macOS/Win light)      | `#14161a` | `tray_{idle,recording,transcribing}_dark.png`    |
| Colored (Linux accent)          | `#f0b878` | `tray_{idle,recording,transcribing}_colored.png` |

If you change the mark geometry, update `murmur-mark.svg` **and** the matching
`TRAY_BARS` constant in `scripts/generate-brand-assets.ts`, then rerun the
pipeline.
