import { test, expect } from "@playwright/test";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string) => readFileSync(join(repoRoot, p), "utf8");
const enTranslations = () =>
  JSON.parse(read("src/i18n/locales/en/translation.json"));

test.describe("Murmur branding smoke tests", () => {
  test("index.html title is Murmur", async () => {
    const html = read("index.html");
    expect(html).toMatch(/<title>\s*Murmur\s*<\/title>/i);
  });

  test("page <title> renders Murmur via Playwright", async ({ page }) => {
    await page.goto("/");
    expect(await page.title()).toMatch(/Murmur/i);
  });

  test("tauri productName is Murmur", () => {
    const conf = JSON.parse(read("src-tauri/tauri.conf.json"));
    expect(conf.productName).toBe("Murmur");
  });

  test("native window title is set to Murmur in lib.rs", () => {
    const libRs = read("src-tauri/src/lib.rs");
    expect(libRs).toContain('.title("Murmur")');
    expect(libRs).not.toContain('.title("Handy")');
  });

  test("tray version label says Murmur", () => {
    const trayRs = read("src-tauri/src/tray.rs");
    expect(trayRs).toMatch(/"Murmur v\{\}/);
    expect(trayRs).not.toMatch(/"Handy v\{\}/);
  });

  test("onboarding permissions and subtitle use Murmur, not Handy", () => {
    const t = enTranslations();
    expect(t.onboarding.permissions.description).toMatch(/Murmur/);
    expect(t.onboarding.permissions.description).not.toMatch(/Handy/);
  });

  test("About section uses Murmur copy", () => {
    const t = enTranslations();
    expect(t.settings.about.version.description).toMatch(/Murmur/);
    expect(t.settings.about.version.description).not.toMatch(/Handy/);
    expect(t.settings.about.appDataDirectory.description).toMatch(/Murmur/);
    expect(t.settings.about.appDataDirectory.description).not.toMatch(/Handy/);
  });

  test("About has fork attribution mentioning Handy (project-level)", () => {
    const t = enTranslations();
    expect(t.settings.about.fork).toBeDefined();
    expect(t.settings.about.fork.title).toBeTruthy();
    // Project-level mention of Handy, not person-level (no CJ Pais / cjpais)
    const blob = JSON.stringify(t.settings.about.fork);
    expect(blob).toMatch(/Handy/);
    expect(blob).not.toMatch(/cjpais/i);
    expect(blob).not.toMatch(/CJ Pais/i);
  });

  test("About settings source link points at OnlyPaul/MurMur and donate is removed", () => {
    const about = read("src/components/settings/about/AboutSettings.tsx");
    expect(about).toContain("github.com/OnlyPaul/MurMur");
    expect(about).not.toMatch(/github\.com\/cjpais\/Handy/);
    expect(about).not.toMatch(/handy\.computer\/donate/);
    // No "supportDevelopment" donate button block
    expect(about).not.toContain("supportDevelopment");
  });

  test("UpdateChecker UI component is removed", () => {
    expect(existsSync(join(repoRoot, "src/components/update-checker"))).toBe(
      false,
    );
  });

  test("Footer no longer renders UpdateChecker", () => {
    const footer = read("src/components/footer/Footer.tsx");
    expect(footer).not.toMatch(/UpdateChecker/);
    expect(footer).not.toMatch(/update-checker/);
  });

  test("DebugSettings no longer renders UpdateChecksToggle", () => {
    const debug = read("src/components/settings/debug/DebugSettings.tsx");
    expect(debug).not.toMatch(/UpdateChecksToggle/);
  });

  test("Tray menu does not include check_updates item", () => {
    const trayRs = read("src-tauri/src/tray.rs");
    expect(trayRs).not.toMatch(/check_updates/);
  });

  test("Tauri config does not point at Handy releases", () => {
    const conf = read("src-tauri/tauri.conf.json");
    expect(conf).not.toMatch(/cjpais\/Handy/);
  });

  test("No source file points at the Handy releases feed", () => {
    const candidates = [
      "src/components/settings/about/AboutSettings.tsx",
      "src/components/footer/Footer.tsx",
      "src-tauri/tauri.conf.json",
    ];
    for (const file of candidates) {
      const contents = read(file);
      expect(
        contents,
        `${file} should not reference Handy releases`,
      ).not.toMatch(/github\.com\/cjpais\/Handy\/releases/);
    }
  });

  test("Locale files: brand-token replacement (no literal 'Handy' product-name leakage)", () => {
    // The English source intentionally retains "Handy" in the About fork
    // attribution; that case is asserted by a dedicated test above. Every
    // other locale should have no "Handy" mentions at all.
    const localesDir = join(repoRoot, "src/i18n/locales");
    const langs = readdirSync(localesDir).filter((l) => l !== "en");
    const offenders: string[] = [];
    for (const lang of langs) {
      const file = join(localesDir, lang, "translation.json");
      if (!existsSync(file)) continue;
      const raw = readFileSync(file, "utf8");
      if (/Handy/.test(raw)) offenders.push(lang);
    }
    expect(
      offenders,
      `locales still contain 'Handy': ${offenders.join(", ")}`,
    ).toEqual([]);
  });
});
