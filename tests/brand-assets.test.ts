// tests/brand-assets.test.ts — Verifies checked-in brand artifacts match
// what the pipeline produces from the design-system SVG sources.
//
// Run with the project's node-based test runner:
//   bun test tests/brand-assets.test.ts
//   node --test --import tsx tests/brand-assets.test.ts
//
// The test deliberately fails loudly when:
//   - a required output is missing from the repo
//   - a checked-in output's bytes diverge from what the SVG source produces
//
// Both conditions mean the brand-asset pipeline drifted and must be re-run.

import { strict as assert } from "node:assert";
import { test } from "node:test";
import { check, generate } from "../scripts/generate-brand-assets.ts";

test("brand-asset pipeline produces at least one tray + one app-icon artifact", () => {
  const targets = generate();
  assert.ok(targets.length > 0, "no brand-asset targets defined");
  assert.ok(
    targets.some((t) =>
      /tray_(idle|recording|transcribing)\.png$/.test(t.path),
    ),
    "expected tray state PNGs in target set",
  );
  assert.ok(
    targets.some((t) => /icon\.icns$/.test(t.path)),
    "expected icon.icns in target set",
  );
  assert.ok(
    targets.some((t) => /icon\.ico$/.test(t.path)),
    "expected icon.ico in target set",
  );
});

test("checked-in brand artifacts are up to date with design-system SVGs", () => {
  const { ok, missing, stale } = check();
  if (!ok) {
    const lines: string[] = [];
    if (missing.length)
      lines.push(`Missing artifacts:\n  ${missing.join("\n  ")}`);
    if (stale.length) lines.push(`Stale artifacts:\n  ${stale.join("\n  ")}`);
    lines.push("Run `bun run brand:gen` and commit the regenerated files.");
    assert.fail(lines.join("\n\n"));
  }
});
