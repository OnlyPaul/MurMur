// Packaging and release-posture guarantees for Murmur 0.1.0.
//
// These tests pin the externally observable identity that ships in
// release artifacts (product name, version, bundle identifier) and
// assert that updater/release surfaces inherited from Handy have been
// removed. They read the on-disk config files so they fail when those
// files drift back toward Handy's release channels.

use std::fs;
use std::path::PathBuf;

fn repo_root() -> PathBuf {
    // CARGO_MANIFEST_DIR points at src-tauri/; parent is the repo root.
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("repo root")
        .to_path_buf()
}

fn read(path: &str) -> String {
    let full = repo_root().join(path);
    fs::read_to_string(&full).unwrap_or_else(|e| panic!("read {}: {}", full.display(), e))
}

fn tauri_conf() -> serde_json::Value {
    serde_json::from_str(&read("src-tauri/tauri.conf.json")).expect("parse tauri.conf.json")
}

#[test]
fn tauri_conf_identity_is_murmur_0_1_0() {
    let conf = tauri_conf();
    assert_eq!(conf["productName"], "Murmur", "productName must be Murmur");
    assert_eq!(conf["version"], "0.1.0", "version must be 0.1.0");
    assert_eq!(
        conf["identifier"], "com.paul.murmur",
        "bundle identifier must be com.paul.murmur"
    );
}

#[test]
fn tauri_conf_has_no_updater_plugin() {
    let conf = tauri_conf();
    let plugins = &conf["plugins"];
    assert!(
        plugins.get("updater").is_none(),
        "tauri updater plugin config must be removed, found: {plugins}"
    );
    let bundle = &conf["bundle"];
    // createUpdaterArtifacts may be absent or explicitly false; never true.
    let creates_updater = bundle
        .get("createUpdaterArtifacts")
        .and_then(|v| v.as_bool())
        .unwrap_or(false);
    assert!(
        !creates_updater,
        "bundle.createUpdaterArtifacts must not be true"
    );
}

#[test]
fn no_handy_release_endpoints_anywhere_in_packaging_config() {
    let raw = read("src-tauri/tauri.conf.json");
    assert!(
        !raw.contains("cjpais/Handy"),
        "tauri.conf.json must not reference cjpais/Handy release feed"
    );
    assert!(
        !raw.contains("handy.computer/donate"),
        "tauri.conf.json must not reference Handy donation surface"
    );
}

#[test]
fn rust_binary_metadata_is_versioned_0_1_0() {
    let cargo = read("src-tauri/Cargo.toml");
    assert!(
        cargo.contains("version = \"0.1.0\""),
        "src-tauri/Cargo.toml must declare version 0.1.0"
    );
    assert!(
        !cargo.contains("tauri-plugin-updater"),
        "tauri-plugin-updater dependency must be removed"
    );
}

#[test]
fn updater_plugin_not_registered_in_app() {
    let lib = read("src-tauri/src/lib.rs");
    assert!(
        !lib.contains("tauri_plugin_updater"),
        "tauri_plugin_updater must not be registered as a plugin"
    );
}

#[test]
fn capabilities_do_not_grant_updater_permissions() {
    for cap in [
        "src-tauri/capabilities/default.json",
        "src-tauri/capabilities/desktop.json",
    ] {
        let raw = read(cap);
        assert!(
            !raw.contains("updater:"),
            "{cap} must not grant updater capabilities"
        );
    }
}

#[test]
fn js_package_does_not_depend_on_tauri_updater_plugin() {
    let raw = read("package.json");
    assert!(
        !raw.contains("@tauri-apps/plugin-updater"),
        "package.json must not depend on @tauri-apps/plugin-updater"
    );
}

#[test]
fn release_workflow_is_macos_first() {
    let raw = read(".github/workflows/release.yml");
    // Official release surface must not promise non-macOS build artifacts.
    assert!(
        !raw.contains("linux-gnu"),
        "release.yml must not build Linux targets"
    );
    assert!(
        !raw.contains("pc-windows-msvc"),
        "release.yml must not build Windows targets"
    );
    assert!(
        !raw.contains("platform: \"ubuntu-"),
        "release.yml must not include ubuntu build platforms"
    );
    assert!(
        !raw.contains("platform: \"windows-"),
        "release.yml must not include windows build platforms"
    );
    assert!(
        raw.contains("apple-darwin"),
        "release.yml must still publish macOS artifacts"
    );
    assert!(
        !raw.contains("asset-prefix: \"handy\""),
        "release.yml must not label artifacts with the handy prefix"
    );
}
