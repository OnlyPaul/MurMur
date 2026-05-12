# Murmur — App UI kit

The in-product surface. Three screens are wired in `index.html` as a click-through:

1. **Menu bar dropdown** — opens from the macOS menu bar.
2. **Press-to-talk overlay** — the centered HUD that appears when ⌥ is held.
3. **Settings window** — General · Model · Shortcut · History.

Open `index.html` to walk through them. All components import `../../colors_and_type.css`.

## Components
- `MenubarDropdown.jsx` — the popover from the menu-bar icon.
- `TalkOverlay.jsx` — the floating press-to-talk HUD with live waveform.
- `SettingsWindow.jsx` — macOS-window-chromed settings panel with sidebar tabs.
- `Mark.jsx` — inline sound-wave SVG.
- `Keycap.jsx` — keyboard shortcut glyph.
