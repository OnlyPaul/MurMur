# Murmur Design System

> Speak softly. Your voice stays home.

Murmur is local, open-source speech-to-text. Hold a key, speak, and your words land wherever your cursor is — nothing leaves the machine. The brand is **quiet, private, and craftsman-like**: a small native-feeling utility that earns trust by feeling restrained.

## Brand premise
- **Local-first**: everything happens on-device. The visual system mirrors this with no ornament, no cloud iconography, no excess color.
- **Quiet**: "Murmur" is a low-volume word. The chrome is dark, hairline-bordered, and never shouts. The only saturated color in the chrome is the **voice-active signal** — a warm amber that pulses when the mic is listening.
- **Native macOS / keyboard-first**: the press-to-talk overlay borrows the language of native HUDs and command palettes — rounded inner panel, blurred backdrop, keycap glyphs.

## Source material
This system is derived from a single reference document the user supplied:
- `uploads/Raycast-DESIGN.md` — full Raycast marketing-site design system (dark mode, hairline borders, white CTA, surface-ladder elevation, Inter `ss03`).

Murmur **borrows the Raycast structural vocabulary** (dark canvas, surface ladder, hairlines, keycaps, no shadows, Inter with `ss03`) and **departs in three places**:
1. **Mark**: a sound-wave glyph — not a stylized geometric letter.
2. **Signal color**: warm amber `--signal` (`#f0b878`) replaces Raycast's red hero stripe. Used for the live-mic dot, the hero waveform glow, and category accents. Restraint is the same — one moment of color per page.
3. **Voice**: copy is hushed, lowercase-friendly, and explicit about privacy. Where Raycast says "Built for the perfect tools," Murmur says "speak softly. your voice stays home."

There is no codebase or Figma attached. The brand is bootstrapped from the description plus the Raycast doc.

---

## Index

| File | What's in it |
|---|---|
| `README.md` | This file — overview, content + visual foundations, iconography. |
| `SKILL.md` | Agent-Skills-compatible entry point. |
| `colors_and_type.css` | Token CSS variables + semantic element styles. |
| `fonts/` | Inter (variable) + JetBrains Mono for inline `<code>`. |
| `assets/` | Logos (svg), waveform marks, keycap glyphs, a couple of generic backgrounds. |
| `preview/` | Small specimen HTML cards that populate the Design System tab. |
| `ui_kits/app/` | Press-to-talk overlay + Settings window UI kit (the in-product surface). |
| `ui_kits/site/` | Marketing site UI kit — hero, features, install, footer. |

---

## CONTENT FUNDAMENTALS

### Voice
Murmur is **calm, hushed, and matter-of-fact**. Copy is short. Sentences are simple. The brand does not boast and does not threaten ("YOUR DATA IS SAFE!"); it states facts quietly.

### Tone examples

| ✅ Murmur | ❌ Not Murmur |
|---|---|
| "speak softly. your voice stays home." | "Revolutionary AI-powered dictation!" |
| "hold ⌥, talk, release. that's it." | "Effortless transcription powered by cutting-edge tech." |
| "nothing leaves your machine." | "Privacy-first cloud architecture." |
| "open source. inspect the model." | "Built on enterprise-grade security." |

### Casing
- **Headlines & UI labels**: lowercase by default (`hold to talk`, `local model`, `settings`).
- **Exceptions**: proper nouns (macOS, GitHub, Whisper), key glyphs (`⌥ Option`, `⌘ K`), and the first word of a sentence in body prose.
- The wordmark "Murmur" is **always capitalized** — it is a name.

### Person
**You / your**, never "we" in product copy. "We" appears only in the "about" / docs voice — and even there, sparingly.

### Punctuation
- Sentence-case body copy with full punctuation.
- Headlines often omit terminal periods when they sit as standalone phrases.
- Em-dashes are encouraged for asides; ellipses signal the listening state (`listening…`).

### Emoji
**No emoji** in chrome or product copy. The waveform mark and keycap glyphs are the only "icons" that carry feeling.

### Vocabulary
- Prefer "talk" over "speak"; "your machine" over "your device"; "model" over "AI".
- Avoid: "seamless", "revolutionary", "leverage", "powered by", "harness".
- Loved words: *quiet, local, on-device, hold, release, type, hush, hear, listen, transcribe*.

### Microcopy patterns
- Empty states: `nothing yet. hold ⌥ to start.`
- Errors: `couldn't hear you. try again.`
- Success (transient toast): `pasted.` or `done.`
- Loading: `listening…` (three dots, not a spinner).

---

## VISUAL FOUNDATIONS

### Color
Dark only. There is no light mode in v1. Surface ladder borrowed from Raycast and re-tuned slightly cooler (Murmur's canvas leans almost-blue-black to suggest night/silence).

```
--canvas:           #08090b
--surface:          #0e0f12
--surface-elevated: #14161a
--surface-card:     #181a1f
--hairline:         #23262c
--hairline-strong:  rgba(255,255,255,0.14)
--hairline-soft:    rgba(255,255,255,0.07)

--ink:              #f4f4f6   /* headlines */
--body:             #cdcdd2   /* paragraphs */
--mute:             #9b9da2   /* metadata */
--ash:              #6a6c72   /* disabled */
--stone:            #43454a   /* lowest emphasis */

--signal:           #f0b878   /* warm amber — the only saturated chrome color */
--signal-soft:      rgba(240,184,120,0.16)
--signal-pressed:   #d8a262
--ok:               #6fcf9c
--err:              #ff7a7a
```

The CTA pill stays Raycast-white (`#ffffff` on `#000`). Amber is reserved for the **mic-active state** and the hero waveform glow — never on chrome buttons or body text.

### Type
- **Inter** for everything, with `font-feature-settings: "calt","kern","liga","ss03"` enabled. (Inherits Raycast's signature `ss03` open-`g`.)
- **JetBrains Mono** for inline `<code>` and keycap labels longer than one glyph.
- Display sizes scale 56 → 44 → 32; body sits at 16/1.6; metadata at 13/1.4. Letter-spacing is gently positive (0.1–0.3px).

### Spacing
8px base. Scale: 2 / 4 / 8 / 12 / 16 / 24 / 32 / 96. Section rhythm is **96px** vertical — identical to the reference doc.

### Backgrounds
- Pages are flat dark canvas, edge-to-edge. No textures, no patterns, no full-bleed photography.
- **One decorative moment per page**: a softly-glowing waveform line drawn behind the hero headline — the visual analog of the audio it captures. Built from an SVG path with a single amber `radial-gradient` glow; never repeated below the fold.
- No marketing photography. No stock illustration. App screenshots and the waveform mark are the only imagery.

### Animation
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` for everything that moves.
- Durations: 120ms (state flips), 220ms (panel show/hide), 600ms (waveform loop).
- The hero waveform **breathes** — opacity 0.55 → 0.85 over 4s, ease-in-out, infinite. Never moves horizontally.
- No bouncing. No spring. No parallax. The brand is quiet — motion is subliminal.

### States
- **Hover**: lighten the surface by one notch in the ladder (e.g. `surface` → `surface-elevated`). Never use opacity dims.
- **Press**: drop one notch back down + scale `0.98` over 80ms.
- **Focus**: replace `--hairline` with `--hairline-strong` — no colored ring.
- **Disabled**: text drops to `--ash`, background stays.

### Borders
1px hairlines everywhere. No 2px borders. No dashed. No double.

### Shadows
**None.** Elevation comes from the surface ladder — exactly as in the reference.

### Radii
- 4 (keycaps, tiny chips)
- 6 (palette rows)
- 8 (buttons, inputs, tiles)
- 10 (cards)
- 16 (the press-to-talk overlay, large mockup containers)
- 9999 (pill chips, avatars, the hold-to-talk mic dot)

### Transparency & blur
- The press-to-talk overlay sits on `rgba(20,22,26,0.78)` with `backdrop-filter: blur(24px) saturate(140%)` — the only place blur appears in the system.
- Marketing chrome is opaque.

### Imagery vibe
There is essentially no photography. When in-product screenshots appear they are captured against the actual app canvas (dark, hairline-bordered). If a generic image is ever needed it should be **cool, low-contrast, slightly grainy** — never warm sunlit lifestyle photography.

### Layout rules
- Content max-width 1180px; gutters 24px desktop / 16px mobile.
- The top nav is sticky, 56px, with a 1px hairline bottom rule.
- The press-to-talk overlay is fixed, centered, 480px wide, 16px above the dock.

### Corner radius cards
A "Murmur card" is: `background: var(--surface)`, `border: 1px solid var(--hairline)`, `border-radius: 10px`, `padding: 24px`. No shadow. Hover lifts to `--surface-elevated`.

---

## ICONOGRAPHY

- **Mark**: a sound-wave glyph — five vertical bars of varying heights, centered, with the middle bar tallest. Symmetric. Stored as `assets/murmur-mark.svg`. This is **the** brand mark. There is no letter-based wordmark glyph; the wordmark is the plain word "Murmur" set in Inter 600 with the `ss03` alternate.
- **Icon set**: [**Lucide**](https://lucide.dev) (1.5px stroke, 24×24 default) is loaded via CDN. Picked because: open-source, monoline, sober — matches Murmur's hush. Stroke weight matches our 1px hairline vocabulary. **Substitution flagged**: no in-house icon set exists yet; Lucide is the standard until/unless Murmur ships its own.
- **Format**: SVG only. Never PNG icons, never icon fonts. Icons inherit `currentColor`.
- **Emoji**: **never** used in chrome.
- **Unicode glyphs as icons**: used for keycaps and modifier symbols (`⌥ ⌘ ⇧ ⏎ ⎋`). Single-glyph symbols only — never strings.
- **App icon**: a rounded-rect macOS-style tile, dark canvas (`--canvas`) inside, the amber waveform mark centered. See `assets/app-icon.svg`.

### When to use which
| Need | Use |
|---|---|
| Brand mark | `assets/murmur-mark.svg` |
| App tile (macOS dock, install card) | `assets/app-icon.svg` |
| UI glyphs (settings cog, mic, paste, copy, x) | Lucide via `<i data-lucide="…">` |
| Keyboard shortcuts | Inline `<span class="keycap">⌥</span>` |

---

## Known caveats / asks

- **No real codebase or Figma was provided.** The system is interpolated from the brand description + Raycast doc. If a real Murmur repo exists, attach it and the agent will re-derive from it.
- **No in-house icons.** Lucide is the placeholder.
- **Inter & JetBrains Mono** are bundled from Google Fonts. If Murmur has commissioned custom faces, drop the files into `fonts/` and update `colors_and_type.css`.
- **Light mode is not designed.** v1 is dark-only.
