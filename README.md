# Murmur

_speak softly. your voice stays home._

Murmur is a macOS-first desktop speech-to-text app. Press a shortcut, speak, and your words appear in whatever app you're typing into. Transcription runs locally on your machine — no audio is sent to the cloud.

Murmur `0.1.0` is officially a macOS release. The codebase still builds on Windows and Linux, but those platforms aren't shipped as supported targets yet.

## What it does

1. **Press** a configurable keyboard shortcut to start or stop recording (push-to-talk also supported).
2. **Speak** while the shortcut is held or active.
3. **Release**, and Murmur runs your audio through a local speech-to-text model.
4. **Paste** — the transcribed text lands in whatever text field had focus.

Under the hood:

- Silence is filtered with Silero VAD.
- Transcription uses your choice of model:
  - **Whisper** (Small / Medium / Turbo / Large), GPU-accelerated where available.
  - **Parakeet V3**, CPU-optimized with automatic language detection.
- Everything stays on your machine.

## Install

Murmur `0.1.0` is the first official release. macOS builds are published on the [Releases page](https://github.com/OnlyPaul/MurMur/releases) of this repository.

There are no other official distribution channels yet — no Homebrew cask, no winget package, no third-party mirrors. If you see Murmur elsewhere, it isn't us.

After installing:

1. Launch Murmur and grant microphone and accessibility permissions when prompted.
2. Open Settings and pick your keyboard shortcut and model.
3. Start transcribing.

## Build from source

For development setup and full platform-specific build instructions, see [BUILD.md](BUILD.md).

Quick version:

```bash
bun install
bun run tauri dev
# If you hit a cmake error on macOS:
CMAKE_POLICY_VERSION_MINIMUM=3.5 bun run tauri dev
```

You'll also need to fetch the VAD model once before running:

```bash
mkdir -p src-tauri/resources/models
curl -o src-tauri/resources/models/silero_vad_v4.onnx https://blob.handy.computer/silero_vad_v4.onnx
```

The model blob host is upstream infrastructure inherited from the Handy fork; Murmur will move to its own hosting in a later release.

## Architecture

Murmur is a Tauri 2.x app:

- **Frontend**: React + TypeScript + Tailwind CSS (settings, onboarding, overlay).
- **Backend**: Rust for audio, VAD, model inference, shortcuts, and OS integration.
- **Core libraries**:
  - `whisper-rs` — local Whisper inference with GPU acceleration.
  - `transcribe-rs` — CPU-optimized Parakeet inference.
  - `cpal` — cross-platform audio I/O.
  - `vad-rs` — Voice Activity Detection.
  - `rdev` — global keyboard shortcuts.
  - `rubato` — audio resampling.

For a deeper map of the codebase, see [AGENTS.md](AGENTS.md).

### Debug mode

Open the debug panel with:

- **macOS**: `Cmd+Shift+D`
- **Windows / Linux**: `Ctrl+Shift+D`

### CLI flags

Murmur supports command-line flags for controlling a running instance and customizing startup. They work on all platforms the codebase builds on.

**Remote control** (sent to the already-running instance via the single-instance plugin):

```bash
murmur --toggle-transcription    # Toggle recording on/off
murmur --toggle-post-process     # Toggle recording with post-processing on/off
murmur --cancel                  # Cancel the current operation
```

**Startup:**

```bash
murmur --start-hidden            # Start without showing the main window
murmur --no-tray                 # Start without the system tray icon
murmur --debug                   # Enable debug mode with verbose logging
murmur --help                    # Show all available flags
```

Flags compose:

```bash
murmur --start-hidden --no-tray
```

> **macOS tip:** when running from the app bundle, invoke the binary directly:
>
> ```bash
> /Applications/Murmur.app/Contents/MacOS/Murmur --toggle-transcription
> ```

## Troubleshooting

### Manual model installation (proxies / restricted networks)

If Murmur can't reach the model host automatically, you can drop model files in by hand.

**1. Find your app data directory** — open Settings → About and copy the "App Data Directory" path. Typical locations:

- **macOS**: `~/Library/Application Support/com.paul.murmur/`
- **Windows**: `C:\Users\{username}\AppData\Roaming\com.paul.murmur\`
- **Linux**: `~/.config/com.paul.murmur/`

**2. Create a `models` directory inside it:**

```bash
# macOS / Linux
mkdir -p ~/Library/Application\ Support/com.paul.murmur/models

# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "$env:APPDATA\com.paul.murmur\models"
```

**3. Download the model files you want:**

Whisper (single `.bin` files):

- Small (487 MB): `https://blob.handy.computer/ggml-small.bin`
- Medium (492 MB): `https://blob.handy.computer/whisper-medium-q4_1.bin`
- Turbo (1600 MB): `https://blob.handy.computer/ggml-large-v3-turbo.bin`
- Large (1100 MB): `https://blob.handy.computer/ggml-large-v3-q5_0.bin`

Parakeet (compressed archives):

- V2 (473 MB): `https://blob.handy.computer/parakeet-v2-int8.tar.gz`
- V3 (478 MB): `https://blob.handy.computer/parakeet-v3-int8.tar.gz`

These URLs are temporary upstream infrastructure inherited from Handy; they will move once Murmur hosts its own.

**4. Install the files:**

For Whisper, drop the `.bin` files directly into `models/` with their original filenames:

```
{app_data_dir}/models/
├── ggml-small.bin
├── whisper-medium-q4_1.bin
├── ggml-large-v3-turbo.bin
└── ggml-large-v3-q5_0.bin
```

For Parakeet, extract the archive and place the resulting directory in `models/` with its exact name:

- **Parakeet V2**: `parakeet-tdt-0.6b-v2-int8`
- **Parakeet V3**: `parakeet-tdt-0.6b-v3-int8`

```
{app_data_dir}/models/
├── parakeet-tdt-0.6b-v2-int8/
└── parakeet-tdt-0.6b-v3-int8/
```

Restart Murmur. Models should appear as "Downloaded" in Settings → Models.

### Custom Whisper models

Murmur auto-discovers Whisper GGML `.bin` files placed in the `models` directory above. Useful for fine-tuned or community models.

- Drop a valid Whisper GGML `.bin` file into `models/`.
- Restart Murmur.
- The model appears under "Custom Models" in the Models settings page.
- The display name comes from the filename (`my-model.bin` → "My Model").

Community models are user-provided and may not be supported in bug reports.

## Verifying release signatures

Murmur release artifacts are signed with Tauri's updater signature format. The public key lives in [`src-tauri/tauri.conf.json`](src-tauri/tauri.conf.json) under `plugins.updater.pubkey`.

To verify a download, set `ARTIFACT` to the file you downloaded, save the `pubkey` value to `murmur.pub.b64`, then verify with `minisign`:

```bash
ARTIFACT="Murmur_0.1.0_aarch64.dmg"

python3 - "$ARTIFACT" <<'PY'
import base64, pathlib, sys

artifact = sys.argv[1]

pub = pathlib.Path("murmur.pub.b64").read_text().strip()
pathlib.Path("murmur.pub").write_bytes(base64.b64decode(pub))

sig = pathlib.Path(f"{artifact}.sig").read_text().strip()
pathlib.Path(f"{artifact}.minisig").write_bytes(base64.b64decode(sig))
PY

minisign -Vm "$ARTIFACT" \
  -p murmur.pub \
  -x "$ARTIFACT.minisig"
```

On success, `minisign` prints:

```text
Signature and comment signature verified
```

Do not use `gpg` for these `.sig` files.

## Contributing

Bug reports, fixes, and feature ideas all go through [GitHub Issues](https://github.com/OnlyPaul/MurMur/issues). See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow.

## Fork attribution

Murmur is a fork of the [Handy](https://github.com/cjpais/Handy) project by CJ Pais and contributors, released under the MIT License. The original copyright is preserved in [LICENSE](LICENSE); Murmur adds its own work on top under the same license.

## License

MIT License — see [LICENSE](LICENSE).

## Acknowledgments

- **Handy** — the upstream project this fork was built on.
- **Whisper** by OpenAI for the speech recognition model.
- **whisper.cpp / ggml** for cross-platform Whisper inference and acceleration.
- **Silero** for the lightweight VAD model.
- **Tauri** for the app framework.
