use clap::Parser;

pub const CLI_NAME: &str = "murmur";
pub const CLI_ABOUT: &str = "Murmur - Speech to Text";

#[derive(Parser, Debug, Clone, Default)]
#[command(name = CLI_NAME, about = CLI_ABOUT, version)]
pub struct CliArgs {
    /// Start with the main window hidden
    #[arg(long)]
    pub start_hidden: bool,

    /// Disable the system tray icon
    #[arg(long)]
    pub no_tray: bool,

    /// Toggle transcription on/off (sent to running instance)
    #[arg(long)]
    pub toggle_transcription: bool,

    /// Toggle transcription with post-processing on/off (sent to running instance)
    #[arg(long)]
    pub toggle_post_process: bool,

    /// Cancel the current operation (sent to running instance)
    #[arg(long)]
    pub cancel: bool,

    /// Enable debug mode with verbose logging
    #[arg(long)]
    pub debug: bool,
}

#[cfg(test)]
mod tests {
    use super::*;
    use clap::CommandFactory;

    #[test]
    fn cli_name_is_murmur() {
        let cmd = CliArgs::command();
        assert_eq!(cmd.get_name(), "murmur");
    }

    #[test]
    fn cli_about_is_murmur() {
        let cmd = CliArgs::command();
        let about = cmd.get_about().map(|s| s.to_string()).unwrap_or_default();
        assert!(about.contains("Murmur"));
        assert!(!about.contains("Handy"));
    }

    #[test]
    fn cli_version_is_package_version() {
        // Version reported by clap should match the crate's Cargo.toml version
        // (which is the first-party Murmur version, currently 0.1.0).
        let cmd = CliArgs::command();
        let version = cmd.get_version().map(|s| s.to_string()).unwrap_or_default();
        assert_eq!(version, env!("CARGO_PKG_VERSION"));
    }

    #[test]
    fn cli_constants_are_murmur_namespace() {
        assert_eq!(CLI_NAME, "murmur");
        assert!(CLI_ABOUT.starts_with("Murmur"));
    }
}
