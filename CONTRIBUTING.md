# Contributing to Murmur

Thanks for your interest in contributing. Murmur is a small, macOS-first fork; the workflow is intentionally lightweight.

## Philosophy

Murmur isn't trying to be the loudest speech-to-text app. The goal is something quiet, local, and forkable:

- **Local** — audio and transcripts stay on your machine.
- **Simple** — one tool, one job.
- **Forkable** — clear, well-patterned code that other people can take in their own direction.
- **macOS-first today** — cross-platform code stays in the tree, but `0.1.0` is officially a macOS release.

## How we use GitHub

Murmur uses **GitHub Issues** as its only public tracker. There's no Discord, no Discussions program, no separate forum.

- Bugs → open a [Bug Report](https://github.com/OnlyPaul/MurMur/issues/new?template=bug_report.md).
- Feature ideas → open a [Feature Request](https://github.com/OnlyPaul/MurMur/issues/new?template=feature_request.md).
- Questions → open an issue and we'll either answer it or convert it.

Maintainer: [@OnlyPaul](https://github.com/OnlyPaul). The canonical repo is [`OnlyPaul/MurMur`](https://github.com/OnlyPaul/MurMur).

## Reporting bugs

Before filing:

1. Search [existing issues](https://github.com/OnlyPaul/MurMur/issues) (open and closed).
2. Try the latest release.
3. Open Settings → About to grab the version and app data path; enable debug mode (`Cmd+Shift+D` on macOS, `Ctrl+Shift+D` elsewhere) if it helps reproduce the issue.

A good bug report includes:

- App version and platform (e.g. macOS 14.4 / Apple Silicon).
- What you did, what you expected, what happened.
- Logs or screenshots if you have them.

The [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) prompts for the essentials.

## Suggesting features

Feature requests are welcome but Murmur stays small on purpose — not every idea will ship. Open a [Feature Request issue](https://github.com/OnlyPaul/MurMur/issues/new?template=feature_request.md) describing:

- The problem you're trying to solve.
- A rough sketch of what a fix would look like.
- Anything you've already tried or considered.

If an idea isn't going to land soon, expect a polite "not now" rather than silence.

## Code contributions

### Setup

Prerequisites:

- [Rust](https://rustup.rs/) (latest stable)
- [Bun](https://bun.sh/)
- Platform-specific build tools — see [BUILD.md](BUILD.md).

```bash
git clone git@github.com:YOUR_USERNAME/MurMur.git
cd MurMur
git remote add upstream git@github.com:OnlyPaul/MurMur.git

bun install

mkdir -p src-tauri/resources/models
curl -o src-tauri/resources/models/silero_vad_v4.onnx https://blob.handy.computer/silero_vad_v4.onnx

bun run tauri dev
# On macOS if you hit a cmake error:
CMAKE_POLICY_VERSION_MINIMUM=3.5 bun run tauri dev
```

### Workflow

1. Open or comment on an issue first if the change isn't trivial — a few sentences about your plan is enough.
2. Branch off `main`: `git checkout -b fix/short-description` or `feat/short-description`.
3. Keep commits focused. Conventional prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
4. Run the lint/format checks before pushing:

   ```bash
   bun run lint
   bun run format
   ```

5. Push to your fork and open a PR against `OnlyPaul/MurMur:main`. Fill in the PR template.
6. Rebase on `upstream/main` if your branch falls behind.

### Code style

**Rust:**

- `cargo fmt` and `cargo clippy` clean.
- Handle errors explicitly; avoid `unwrap` in production paths.
- Descriptive names; doc comments on public APIs.

**TypeScript / React:**

- Strict TypeScript; no `any` unless you really mean it.
- Functional components with hooks.
- Tailwind for styling. Path alias `@/` → `./src/`.

**General:**

- Write self-documenting code; comment the _why_, not the _what_.
- Keep functions small and single-purpose.
- All user-facing strings go through i18next — see [CONTRIBUTING_TRANSLATIONS.md](CONTRIBUTING_TRANSLATIONS.md).

### Testing

- Run the app: `bun run tauri dev`. Use debug mode to inspect audio and transcription.
- For UI changes, exercise the feature end-to-end before marking the PR ready.
- Build the release artifact for sanity if your change touches packaging:

  ```bash
  bun run tauri build
  ```

### AI assistance

AI-assisted PRs are welcome — just say so in the PR description: which tool you used and roughly how heavily.

## License

By contributing to Murmur you agree your contributions are licensed under the MIT License. See [LICENSE](LICENSE).

---

Thanks for helping out.
