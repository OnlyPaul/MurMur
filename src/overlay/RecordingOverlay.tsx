import { listen } from "@tauri-apps/api/event";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import "./RecordingOverlay.css";
import { commands } from "@/bindings";
import i18n, { syncLanguageFromSettings } from "@/i18n";
import { getLanguageDirection } from "@/lib/utils/rtl";

type OverlayState = "recording" | "transcribing" | "processing";

const BAR_COUNT = 24;

const RecordingOverlay: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [state, setState] = useState<OverlayState>("recording");
  const [levels, setLevels] = useState<number[]>(Array(BAR_COUNT).fill(0));
  const smoothedLevelsRef = useRef<number[]>(Array(BAR_COUNT).fill(0));
  const direction = getLanguageDirection(i18n.language);

  useEffect(() => {
    const setupEventListeners = async () => {
      const unlistenShow = await listen("show-overlay", async (event) => {
        await syncLanguageFromSettings();
        const overlayState = event.payload as OverlayState;
        setState(overlayState);
        setIsVisible(true);
      });

      const unlistenHide = await listen("hide-overlay", () => {
        setIsVisible(false);
      });

      const unlistenLevel = await listen<number[]>("mic-level", (event) => {
        const newLevels = event.payload as number[];

        const smoothed = smoothedLevelsRef.current.map((prev, i) => {
          const target = newLevels[i] || 0;
          return prev * 0.7 + target * 0.3;
        });

        smoothedLevelsRef.current = smoothed;
        setLevels(smoothed.slice(0, BAR_COUNT));
      });

      return () => {
        unlistenShow();
        unlistenHide();
        unlistenLevel();
      };
    };

    setupEventListeners();
  }, []);

  return (
    <div
      dir={direction}
      className={`recording-overlay state-${state} ${isVisible ? "fade-in" : ""}`}
    >
      <span className="overlay-dot" aria-hidden />

      <div className="overlay-bars" aria-hidden>
        {levels.map((v, i) => (
          <span
            key={i}
            className="overlay-bar"
            style={{ ["--lvl" as string]: v.toFixed(3) } as React.CSSProperties}
          />
        ))}
      </div>

      <button
        type="button"
        className="overlay-cancel"
        aria-label={t("overlay.cancel")}
        onClick={() => {
          commands.cancelOperation();
        }}
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
};

export default RecordingOverlay;
