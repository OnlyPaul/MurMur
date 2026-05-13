import React from "react";
import ReactDOM from "react-dom/client";
import { platform } from "@tauri-apps/plugin-os";
import App from "./App";

// Set platform before render so CSS can scope per-platform (e.g. scrollbar styles).
// Tauri APIs are unavailable when the bundle is loaded in a plain browser
// (e.g. Playwright smoke tests against `vite dev`); fall back silently.
try {
  document.documentElement.dataset.platform = platform();
} catch {
  // No Tauri runtime — leave data-platform unset.
}

// Initialize i18n
import "./i18n";

// Initialize model store (loads models and sets up event listeners)
import { useModelStore } from "./stores/modelStore";
useModelStore.getState().initialize();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
