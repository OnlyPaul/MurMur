// scripts/generate-brand-assets.ts — Murmur brand-asset pipeline
//
// Canonical source-of-truth:
//   design/design-system/assets/app-icon.svg   → packaged app icons
//   design/design-system/assets/murmur-mark.svg → tray/menu-bar state icons
//
// Outputs are deterministic. CI uses `--check` to fail when checked-in
// artifacts have drifted from the SVG sources.
//
// Run:
//   bun run brand:gen     # regenerate and write
//   bun run brand:check   # verify checked-in artifacts match (no writes)

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import png2icons from "png2icons";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, "..");
const sourceDir = join(root, "design/design-system/assets");
const iconsDir = join(root, "src-tauri/icons");
const resourcesDir = join(root, "src-tauri/resources");

const appIconSvg = readFileSync(join(sourceDir, "app-icon.svg"), "utf8");

// Tray emphasis model — one Murmur mark, three emphasis levels.
// Sticking to the design-system mark geometry; only fill colour and opacity
// change between states. No unrelated pictograms.
const TRAY_BARS = [
  { x: 6, y: 26, w: 6, h: 12 },
  { x: 18, y: 18, w: 6, h: 28 },
  { x: 30, y: 10, w: 6, h: 44 },
  { x: 42, y: 18, w: 6, h: 28 },
  { x: 54, y: 26, w: 6, h: 12 },
] as const;

type TrayEmphasis = "idle" | "transcribing" | "recording";

function trayOpacity(state: TrayEmphasis): number {
  // Restrained emphasis ramp — same mark, only weight changes.
  return state === "idle" ? 0.55 : state === "transcribing" ? 0.85 : 1.0;
}

function buildTraySvg(color: string, state: TrayEmphasis): string {
  const opacity = trayOpacity(state);
  const bars = TRAY_BARS.map(
    (b) =>
      `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="3" fill="${color}" fill-opacity="${opacity}"/>`,
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${bars}</svg>`;
}

function renderSvg(svg: string, sizePx: number): Buffer {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: sizePx },
    background: "rgba(0,0,0,0)",
    font: { loadSystemFonts: false },
    shapeRendering: 2, // geometricPrecision
    textRendering: 2,
    imageRendering: 0,
  });
  return resvg.render().asPng();
}

function renderAppIcon(sizePx: number): Buffer {
  return renderSvg(appIconSvg, sizePx);
}

type Target = { path: string; data: Buffer };

function buildTargets(): Target[] {
  const targets: Target[] = [];

  // === Tray / menu-bar runtime assets ===
  // Dark UI (light template-tinted mark)
  const darkColor = "#f4f4f6";
  const lightColor = "#14161a";
  const coloredColor = "#f0b878";

  const trayStates: TrayEmphasis[] = ["idle", "recording", "transcribing"];
  for (const s of trayStates) {
    targets.push({
      path: join(resourcesDir, `tray_${s}.png`),
      data: renderSvg(buildTraySvg(darkColor, s), 64),
    });
    targets.push({
      path: join(resourcesDir, `tray_${s}_dark.png`),
      data: renderSvg(buildTraySvg(lightColor, s), 64),
    });
    targets.push({
      path: join(resourcesDir, `tray_${s}_colored.png`),
      data: renderSvg(buildTraySvg(coloredColor, s), 64),
    });
  }

  // === Desktop packaged icons ===
  const iconSizes: Array<{ name: string; size: number }> = [
    { name: "32x32.png", size: 32 },
    { name: "64x64.png", size: 64 },
    { name: "128x128.png", size: 128 },
    { name: "128x128@2x.png", size: 256 },
    { name: "icon.png", size: 512 },
    { name: "logo.png", size: 1024 },
    // Windows Store / MSIX surfaces — kept for parity with existing layout
    { name: "Square30x30Logo.png", size: 30 },
    { name: "Square44x44Logo.png", size: 44 },
    { name: "Square71x71Logo.png", size: 71 },
    { name: "Square89x89Logo.png", size: 89 },
    { name: "Square107x107Logo.png", size: 107 },
    { name: "Square142x142Logo.png", size: 142 },
    { name: "Square150x150Logo.png", size: 150 },
    { name: "Square284x284Logo.png", size: 284 },
    { name: "Square310x310Logo.png", size: 310 },
    { name: "StoreLogo.png", size: 50 },
  ];
  for (const s of iconSizes) {
    targets.push({
      path: join(iconsDir, s.name),
      data: renderAppIcon(s.size),
    });
  }

  // === iOS / Android scaffolding (kept Murmur-clean even if not shipped today) ===
  const iosSizes: Array<{ name: string; size: number }> = [
    { name: "AppIcon-20x20@1x.png", size: 20 },
    { name: "AppIcon-20x20@2x.png", size: 40 },
    { name: "AppIcon-20x20@2x-1.png", size: 40 },
    { name: "AppIcon-20x20@3x.png", size: 60 },
    { name: "AppIcon-29x29@1x.png", size: 29 },
    { name: "AppIcon-29x29@2x.png", size: 58 },
    { name: "AppIcon-29x29@2x-1.png", size: 58 },
    { name: "AppIcon-29x29@3x.png", size: 87 },
    { name: "AppIcon-40x40@1x.png", size: 40 },
    { name: "AppIcon-40x40@2x.png", size: 80 },
    { name: "AppIcon-40x40@2x-1.png", size: 80 },
    { name: "AppIcon-40x40@3x.png", size: 120 },
    { name: "AppIcon-60x60@2x.png", size: 120 },
    { name: "AppIcon-60x60@3x.png", size: 180 },
    { name: "AppIcon-76x76@1x.png", size: 76 },
    { name: "AppIcon-76x76@2x.png", size: 152 },
    { name: "AppIcon-83.5x83.5@2x.png", size: 167 },
    { name: "AppIcon-512@2x.png", size: 1024 },
  ];
  for (const s of iosSizes) {
    targets.push({
      path: join(iconsDir, "ios", s.name),
      data: renderAppIcon(s.size),
    });
  }

  const androidLaunchers: Array<{ dir: string; launcher: number; fg: number }> =
    [
      { dir: "mipmap-mdpi", launcher: 48, fg: 108 },
      { dir: "mipmap-hdpi", launcher: 49, fg: 162 },
      { dir: "mipmap-xhdpi", launcher: 96, fg: 216 },
      { dir: "mipmap-xxhdpi", launcher: 144, fg: 324 },
      { dir: "mipmap-xxxhdpi", launcher: 192, fg: 432 },
    ];
  for (const a of androidLaunchers) {
    const launcherData = renderAppIcon(a.launcher);
    const fgData = renderAppIcon(a.fg);
    targets.push({
      path: join(iconsDir, "android", a.dir, "ic_launcher.png"),
      data: launcherData,
    });
    targets.push({
      path: join(iconsDir, "android", a.dir, "ic_launcher_round.png"),
      data: launcherData,
    });
    targets.push({
      path: join(iconsDir, "android", a.dir, "ic_launcher_foreground.png"),
      data: fgData,
    });
  }

  // === Multi-resolution containers (.icns / .ico) ===
  // Render a 1024px source PNG once and let png2icons pack the variants.
  // This keeps the byte layout identical between runs.
  const masterPng = renderAppIcon(1024);
  const icnsBuf = png2icons.createICNS(
    masterPng,
    png2icons.BICUBIC2,
    0,
  ) as Buffer | null;
  if (!icnsBuf) throw new Error("png2icons.createICNS returned null");
  targets.push({ path: join(iconsDir, "icon.icns"), data: icnsBuf });

  const icoBuf = png2icons.createICO(
    masterPng,
    png2icons.BICUBIC2,
    0,
    false,
    true,
  ) as Buffer | null;
  if (!icoBuf) throw new Error("png2icons.createICO returned null");
  targets.push({ path: join(iconsDir, "icon.ico"), data: icoBuf });

  return targets;
}

function sha256(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

function writeAll(targets: Target[]): void {
  for (const t of targets) {
    mkdirSync(dirname(t.path), { recursive: true });
    writeFileSync(t.path, t.data);
  }
}

function checkAll(targets: Target[]): {
  ok: boolean;
  missing: string[];
  stale: string[];
} {
  const missing: string[] = [];
  const stale: string[] = [];
  for (const t of targets) {
    if (!existsSync(t.path)) {
      missing.push(t.path);
      continue;
    }
    const onDisk = readFileSync(t.path);
    if (sha256(onDisk) !== sha256(t.data)) stale.push(t.path);
  }
  return { ok: missing.length === 0 && stale.length === 0, missing, stale };
}

export function generate(): Target[] {
  return buildTargets();
}

export function check(): {
  ok: boolean;
  missing: string[];
  stale: string[];
} {
  return checkAll(buildTargets());
}

function main(): void {
  const mode = process.argv.includes("--check") ? "check" : "write";
  const targets = buildTargets();

  if (mode === "check") {
    const { ok, missing, stale } = checkAll(targets);
    if (ok) {
      console.log(
        `[brand-assets] OK — ${targets.length} artifacts up to date.`,
      );
      process.exit(0);
    }
    for (const m of missing) console.error(`[brand-assets] MISSING ${m}`);
    for (const s of stale) console.error(`[brand-assets] STALE   ${s}`);
    console.error(
      `[brand-assets] ${missing.length} missing, ${stale.length} stale. Run \`bun run brand:gen\`.`,
    );
    process.exit(1);
  }

  writeAll(targets);
  console.log(`[brand-assets] wrote ${targets.length} artifacts.`);
}

const invoked = process.argv[1] && resolve(process.argv[1]) === __filename;
if (invoked) main();
