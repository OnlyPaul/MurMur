---
name: murmur-design
description: Use this skill to generate well-branded interfaces and assets for Murmur (local, open-source speech-to-text — "speak softly. your voice stays home."), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI-kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. The fastest path is to start from one of the `ui_kits/` index files and adapt — they already wire in `colors_and_type.css`, the Inter+`ss03` setup, and Lucide.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Brand non-negotiables:
- Dark canvas only. No light mode in v1.
- Inter with `font-feature-settings: "calt","kern","liga","ss03"`.
- White CTA pill is the universal primary action. Amber `--signal` is the only saturated chrome color and is reserved for the voice-active state + hero waveform glow.
- No drop shadows. Elevation = surface ladder.
- No emoji. Lucide icons only.
- Lowercase-friendly hushed voice. Sentences are short.
