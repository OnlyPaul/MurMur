use std::path::PathBuf;
use std::sync::OnceLock;
use tauri::Manager;

/// Portable mode support for Murmur.
///
/// When a file named `portable` exists next to the executable, all user data
/// (settings, models, recordings, database, logs) is stored in a `Data/`
/// directory alongside the executable instead of `%APPDATA%`.
///
/// Murmur is a clean fork: only the Murmur magic string is honored. Legacy
/// Handy markers are upgraded in place so existing portable installs still work.
pub const PORTABLE_MARKER_MAGIC: &str = "Murmur Portable Mode";
const LEGACY_PORTABLE_MARKER_MAGIC: &str = "Handy Portable Mode";
const LEGACY_APP_DATA_DIR_NAMES: &[&str] = &["handy", "Handy"];
const USER_DATA_SENTINELS: &[&str] = &[
    "settings_store.json",
    "history.db",
    "models",
    "recordings",
    "custom_start.wav",
    "custom_stop.wav",
];

static PORTABLE_DATA_DIR: OnceLock<Option<PathBuf>> = OnceLock::new();

/// Detect portable mode by looking for a `portable` marker file next to the exe.
/// Must be called once at startup before Tauri initializes.
pub fn init() {
    PORTABLE_DATA_DIR.get_or_init(|| {
        let exe_path = std::env::current_exe().ok()?;
        let exe_dir = exe_path.parent()?;

        let marker_path = exe_dir.join("portable");
        let data_dir = exe_dir.join("Data");

        let is_portable = if is_valid_portable_marker(&marker_path) {
            true
        } else if is_legacy_portable_marker(&marker_path) {
            eprintln!("[portable] upgrading legacy Handy marker to Murmur marker");
            let _ = std::fs::write(&marker_path, PORTABLE_MARKER_MAGIC);
            true
        } else if marker_path.exists() && data_dir.exists() {
            // Migration: v0.8.0 created an empty marker file. If we find an
            // empty/invalid marker alongside an existing Data/ dir, this is a
            // real portable install — upgrade the marker in place.
            eprintln!("[portable] upgrading legacy empty marker to magic string");
            let _ = std::fs::write(&marker_path, PORTABLE_MARKER_MAGIC);
            true
        } else {
            false
        };

        if is_portable {
            if !data_dir.exists() {
                std::fs::create_dir_all(&data_dir).ok()?;
            }
            eprintln!("[portable] data dir: {}", data_dir.display());
            Some(data_dir)
        } else {
            None
        }
    });
}

/// Returns `true` if running in portable mode.
pub fn is_portable() -> bool {
    PORTABLE_DATA_DIR.get().and_then(|v| v.as_ref()).is_some()
}

/// Get the portable data dir (if active). Does not require an AppHandle.
/// Returns `None` when not in portable mode.
pub fn data_dir() -> Option<&'static PathBuf> {
    PORTABLE_DATA_DIR.get().and_then(|v| v.as_ref())
}

/// Portable-aware replacement for `app.path().app_data_dir()`.
pub fn app_data_dir(app: &tauri::AppHandle) -> Result<PathBuf, tauri::Error> {
    if let Some(dir) = data_dir() {
        Ok(dir.clone())
    } else {
        app.path().app_data_dir()
    }
}

/// Portable-aware replacement for `app.path().app_log_dir()`.
pub fn app_log_dir(app: &tauri::AppHandle) -> Result<PathBuf, tauri::Error> {
    if let Some(dir) = data_dir() {
        Ok(dir.join("logs"))
    } else {
        app.path().app_log_dir()
    }
}

/// Resolve a relative path against the app data directory (portable-aware).
/// Replaces `app.path().resolve(path, BaseDirectory::AppData)`.
pub fn resolve_app_data(app: &tauri::AppHandle, relative: &str) -> Result<PathBuf, tauri::Error> {
    Ok(app_data_dir(app)?.join(relative))
}

/// Get the path to use with `tauri-plugin-store`.
/// Returns an absolute path in portable mode (so the store plugin writes to
/// the portable Data dir) or the original relative path otherwise.
pub fn store_path(relative: &str) -> PathBuf {
    if let Some(dir) = data_dir() {
        dir.join(relative)
    } else {
        PathBuf::from(relative)
    }
}

/// Check if a marker file path contains the portable magic string.
/// Extracted for testability.
fn is_valid_portable_marker(path: &std::path::Path) -> bool {
    std::fs::read_to_string(path)
        .map(|s| s.trim().starts_with(PORTABLE_MARKER_MAGIC))
        .unwrap_or(false)
}

fn is_legacy_portable_marker(path: &std::path::Path) -> bool {
    std::fs::read_to_string(path)
        .map(|s| s.trim().starts_with(LEGACY_PORTABLE_MARKER_MAGIC))
        .unwrap_or(false)
}

fn current_app_data_dir(app: &tauri::AppHandle) -> Result<PathBuf, std::io::Error> {
    app.path()
        .app_data_dir()
        .map_err(|e| std::io::Error::other(format!("app data dir: {}", e)))
}

fn find_legacy_app_data_dir(current_data_dir: &std::path::Path) -> Option<PathBuf> {
    let parent = current_data_dir.parent()?;
    LEGACY_APP_DATA_DIR_NAMES
        .iter()
        .map(|name| parent.join(name))
        .find(|candidate| candidate.exists() && candidate != current_data_dir)
}

fn has_existing_user_data(dir: &std::path::Path) -> bool {
    USER_DATA_SENTINELS
        .iter()
        .map(|entry| dir.join(entry))
        .any(|candidate| candidate.exists())
}

fn copy_dir_contents(
    source: &std::path::Path,
    destination: &std::path::Path,
) -> std::io::Result<()> {
    for entry in std::fs::read_dir(source)? {
        let entry = entry?;
        let entry_type = entry.file_type()?;
        let from = entry.path();
        let to = destination.join(entry.file_name());

        if entry_type.is_dir() {
            std::fs::create_dir_all(&to)?;
            copy_dir_contents(&from, &to)?;
        } else if entry_type.is_file() && !to.exists() {
            std::fs::copy(&from, &to)?;
        }
    }

    Ok(())
}

/// Copy first-run user data forward from the old Handy app-data directory.
///
/// This runs only for non-portable installs and only when the Murmur data dir
/// does not already contain user data. That keeps upgrades seamless without
/// risking overwriting new Murmur data on later launches.
pub fn migrate_legacy_app_data(app: &tauri::AppHandle) -> Result<Option<PathBuf>, std::io::Error> {
    if data_dir().is_some() {
        return Ok(None);
    }

    let current_data_dir = current_app_data_dir(app)?;
    if has_existing_user_data(&current_data_dir) {
        return Ok(None);
    }

    let Some(legacy_data_dir) = find_legacy_app_data_dir(&current_data_dir) else {
        return Ok(None);
    };

    if !has_existing_user_data(&legacy_data_dir) {
        return Ok(None);
    }

    std::fs::create_dir_all(&current_data_dir)?;
    copy_dir_contents(&legacy_data_dir, &current_data_dir)?;

    Ok(Some(legacy_data_dir))
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;

    #[test]
    fn test_valid_magic_string_enables_portable() {
        let dir = std::env::temp_dir().join("murmur_test_valid");
        std::fs::create_dir_all(&dir).unwrap();
        let marker = dir.join("portable");
        let mut f = std::fs::File::create(&marker).unwrap();
        write!(f, "Murmur Portable Mode").unwrap();
        assert!(is_valid_portable_marker(&marker));
        std::fs::remove_dir_all(dir).unwrap();
    }

    #[test]
    fn test_empty_file_does_not_enable_portable() {
        let dir = std::env::temp_dir().join("murmur_test_empty");
        std::fs::create_dir_all(&dir).unwrap();
        let marker = dir.join("portable");
        std::fs::File::create(&marker).unwrap();
        assert!(!is_valid_portable_marker(&marker));
        std::fs::remove_dir_all(dir).unwrap();
    }

    #[test]
    fn test_wrong_content_does_not_enable_portable() {
        let dir = std::env::temp_dir().join("murmur_test_wrong");
        std::fs::create_dir_all(&dir).unwrap();
        let marker = dir.join("portable");
        let mut f = std::fs::File::create(&marker).unwrap();
        write!(f, "some other content").unwrap();
        assert!(!is_valid_portable_marker(&marker));
        std::fs::remove_dir_all(dir).unwrap();
    }

    #[test]
    fn test_missing_file_does_not_enable_portable() {
        let path = std::path::Path::new("/nonexistent/portable");
        assert!(!is_valid_portable_marker(path));
    }

    #[test]
    fn test_legacy_empty_marker_without_data_dir_does_not_enable_portable() {
        // Empty marker alone (scoop scenario) — no Data/ dir → not portable
        let dir = std::env::temp_dir().join("murmur_test_legacy_no_data");
        std::fs::create_dir_all(&dir).unwrap();
        let marker = dir.join("portable");
        std::fs::File::create(&marker).unwrap();
        assert!(!is_valid_portable_marker(&marker));
        std::fs::remove_dir_all(dir).unwrap();
    }

    #[test]
    fn test_magic_string_with_whitespace_enables_portable() {
        let dir = std::env::temp_dir().join("murmur_test_ws");
        std::fs::create_dir_all(&dir).unwrap();
        let marker = dir.join("portable");
        let mut f = std::fs::File::create(&marker).unwrap();
        write!(f, "  Murmur Portable Mode\n").unwrap();
        assert!(is_valid_portable_marker(&marker));
        std::fs::remove_dir_all(dir).unwrap();
    }

    #[test]
    fn test_legacy_handy_marker_is_detected_for_upgrade() {
        let dir = std::env::temp_dir().join("murmur_test_legacy_handy");
        std::fs::create_dir_all(&dir).unwrap();
        let marker = dir.join("portable");
        let mut f = std::fs::File::create(&marker).unwrap();
        write!(f, "{LEGACY_PORTABLE_MARKER_MAGIC}").unwrap();
        assert!(is_legacy_portable_marker(&marker));
        std::fs::remove_dir_all(dir).unwrap();
    }

    #[test]
    fn test_magic_constant_is_murmur_namespace() {
        assert_eq!(PORTABLE_MARKER_MAGIC, "Murmur Portable Mode");
    }

    #[test]
    fn test_finds_legacy_handy_data_dir_next_to_murmur_dir() {
        let root = std::env::temp_dir().join("murmur_test_find_legacy_data_dir");
        let murmur = root.join("murmur");
        let handy = root.join("handy");
        std::fs::create_dir_all(&murmur).unwrap();
        std::fs::create_dir_all(&handy).unwrap();

        assert_eq!(find_legacy_app_data_dir(&murmur), Some(handy.clone()));

        std::fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn test_existing_user_data_detection_uses_expected_sentinels() {
        let dir = std::env::temp_dir().join("murmur_test_existing_user_data");
        std::fs::create_dir_all(&dir).unwrap();

        assert!(!has_existing_user_data(&dir));
        std::fs::write(dir.join("settings_store.json"), "{}").unwrap();
        assert!(has_existing_user_data(&dir));

        std::fs::remove_dir_all(dir).unwrap();
    }

    #[test]
    fn test_copy_dir_contents_copies_nested_files_without_overwrite() {
        let root = std::env::temp_dir().join("murmur_test_copy_dir_contents");
        let source = root.join("source");
        let destination = root.join("destination");
        std::fs::create_dir_all(source.join("recordings")).unwrap();
        std::fs::create_dir_all(&destination).unwrap();

        std::fs::write(source.join("settings_store.json"), "{\"migrated\":true}").unwrap();
        std::fs::write(source.join("recordings").join("clip.wav"), "legacy").unwrap();
        std::fs::write(
            destination.join("settings_store.json"),
            "{\"migrated\":false}",
        )
        .unwrap();

        copy_dir_contents(&source, &destination).unwrap();

        assert_eq!(
            std::fs::read_to_string(destination.join("settings_store.json")).unwrap(),
            "{\"migrated\":false}"
        );
        assert_eq!(
            std::fs::read_to_string(destination.join("recordings").join("clip.wav")).unwrap(),
            "legacy"
        );

        std::fs::remove_dir_all(root).unwrap();
    }
}
