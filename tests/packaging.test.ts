import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const read = (p: string) => readFileSync(join(root, p), "utf8");
const tauriConf = () => JSON.parse(read("src-tauri/tauri.conf.json"));

describe("Murmur 0.1.0 packaging identity", () => {
  test("tauri.conf.json declares Murmur 0.1.0 identity", () => {
    const conf = tauriConf();
    expect(conf.productName).toBe("Murmur");
    expect(conf.version).toBe("0.1.0");
    expect(conf.identifier).toBe("com.paul.murmur");
  });

  test("Rust crate is versioned 0.1.0", () => {
    expect(read("src-tauri/Cargo.toml")).toContain('version = "0.1.0"');
  });
});

describe("Updater surfaces are removed", () => {
  test("tauri.conf.json has no updater plugin and no updater artifacts", () => {
    const conf = tauriConf();
    expect(conf.plugins?.updater).toBeUndefined();
    expect(conf.bundle?.createUpdaterArtifacts).not.toBe(true);
  });

  test("tauri.conf.json does not reference Handy release endpoints", () => {
    const raw = read("src-tauri/tauri.conf.json");
    expect(raw).not.toContain("cjpais/Handy");
    expect(raw).not.toContain("handy.computer/donate");
  });

  test("tauri-plugin-updater is not a Rust dependency", () => {
    expect(read("src-tauri/Cargo.toml")).not.toContain("tauri-plugin-updater");
  });

  test("updater plugin is not registered in lib.rs", () => {
    expect(read("src-tauri/src/lib.rs")).not.toContain("tauri_plugin_updater");
  });

  test("capabilities do not grant updater permissions", () => {
    for (const cap of [
      "src-tauri/capabilities/default.json",
      "src-tauri/capabilities/desktop.json",
    ]) {
      expect(read(cap)).not.toContain("updater:");
    }
  });

  test("@tauri-apps/plugin-updater is not a JS dependency", () => {
    expect(read("package.json")).not.toContain("@tauri-apps/plugin-updater");
  });
});

describe("Release workflow scopes Murmur to macOS-first", () => {
  const release = () => read(".github/workflows/release.yml");

  test("release.yml does not promise non-macOS official artifacts", () => {
    const raw = release();
    expect(raw).not.toContain("linux-gnu");
    expect(raw).not.toContain("pc-windows-msvc");
    expect(raw).not.toContain('platform: "ubuntu-');
    expect(raw).not.toContain('platform: "windows-');
  });

  test("release.yml still ships macOS artifacts", () => {
    expect(release()).toContain("apple-darwin");
  });

  test("release.yml uses the murmur asset prefix", () => {
    expect(release()).not.toContain('asset-prefix: "handy"');
  });
});
