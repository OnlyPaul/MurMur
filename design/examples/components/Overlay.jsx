// Overlay.jsx — press-to-talk HUD + live waveform

function LiveWaveform({ animate = true, dim = false, bars = 36 }) {
  const arr = [];
  for (let i = 0; i < bars; i++) {
    arr.push(
      <span
        key={i}
        className={"wf-bar " + (animate ? "wf-bar--on" : "")}
        style={{ animationDelay: `${(i * 60) % 720}ms` }}
      />
    );
  }
  return <div className={"wf " + (dim ? "wf--dim" : "")}>{arr}</div>;
}

function TalkOverlay({ state = "idle", transcript = "", elapsed = 0 }) {
  const isListening = state === "listening";
  const isTranscribing = state === "transcribing";
  const isPasted = state === "pasted";
  const isCancel = state === "cancelled";
  return (
    <div className="murmur-overlay" role="dialog" aria-label="press to talk">
      <div className="murmur-overlay__row">
        <div className={"murmur-overlay__dot " + (isListening ? "is-on" : "")}/>
        <div className="murmur-overlay__wave" aria-hidden>
          <LiveWaveform animate={isListening} dim={!isListening}/>
        </div>
        <div className="murmur-overlay__status" style={{minWidth:96,textAlign:"right"}}>
          {isListening    && <span style={{color:"var(--signal)"}}>listening<span className="dots"/></span>}
          {isTranscribing && <span style={{color:"var(--body)"}}>transcribing<span className="dots"/></span>}
          {isPasted       && <span style={{color:"var(--ok)"}}>pasted.</span>}
          {isCancel       && <span style={{color:"var(--err)"}}>cancelled.</span>}
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
        <span style={{marginLeft:"auto",fontFamily:"var(--font-mono)",fontSize:12,color:"var(--ash)"}}>
          {isListening ? `${(elapsed/10).toFixed(1)}s` : ""}
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { TalkOverlay, LiveWaveform });
