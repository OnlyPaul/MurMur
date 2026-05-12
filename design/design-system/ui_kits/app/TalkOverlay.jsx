// TalkOverlay.jsx — the centered HUD that appears while ⌥ is held.
// States: 'idle' | 'listening' | 'transcribing' | 'pasted'
function TalkOverlay({ state = "listening", transcript = "" }) {
  const isListening = state === "listening";
  const isTranscribing = state === "transcribing";
  const isPasted = state === "pasted";

  return (
    <div className="murmur-overlay" role="dialog" aria-label="press to talk">
      <div className="murmur-overlay__row">
        <div className={"murmur-overlay__dot " + (isListening ? "is-on" : "")} />
        <div className="murmur-overlay__wave" aria-hidden>
          <LiveWaveform animate={isListening} dim={!isListening} />
        </div>
        <div className="murmur-overlay__status">
          {isListening    && <span style={{color:"var(--signal)"}}>listening…</span>}
          {isTranscribing && <span style={{color:"var(--body)"}}>transcribing…</span>}
          {isPasted       && <span style={{color:"var(--ok)"}}>pasted.</span>}
          {state === "idle" && <span style={{color:"var(--mute)"}}>hold ⌥ to talk</span>}
        </div>
      </div>
      {transcript && (
        <div className="murmur-overlay__transcript">{transcript}</div>
      )}
      <div className="murmur-overlay__hint">
        <Keycap>⌥</Keycap>
        <span style={{color:"var(--mute)",fontSize:12}}>hold to talk</span>
        <span style={{color:"var(--stone)",fontSize:12,margin:"0 8px"}}>·</span>
        <Keycap>⏎</Keycap>
        <span style={{color:"var(--mute)",fontSize:12}}>paste</span>
        <span style={{color:"var(--stone)",fontSize:12,margin:"0 8px"}}>·</span>
        <Keycap>⎋</Keycap>
        <span style={{color:"var(--mute)",fontSize:12}}>cancel</span>
      </div>
    </div>
  );
}

function LiveWaveform({ animate = true, dim = false }) {
  // 28 bars; CSS keyframes animate scaleY in a staggered loop.
  const bars = [];
  for (let i = 0; i < 28; i++) {
    bars.push(
      <span
        key={i}
        className={"wf-bar " + (animate ? "wf-bar--on" : "")}
        style={{ animationDelay: `${(i * 60) % 720}ms` }}
      />
    );
  }
  return (
    <div className={"wf " + (dim ? "wf--dim" : "")}>
      {bars}
    </div>
  );
}

Object.assign(window, { TalkOverlay, LiveWaveform });
