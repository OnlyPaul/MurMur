function Hero() {
  return (
    <section className="hero">
      <div className="hero__glow" aria-hidden>
        <img src="../../assets/hero-waveform.svg" alt=""/>
      </div>
      <div className="hero__inner">
        <span className="hero__eyebrow">
          <span className="dot-signal" style={{display:"inline-block",marginRight:8,verticalAlign:1}}/>
          local, open-source speech-to-text
        </span>
        <h1 className="hero__headline">
          speak softly.<br/>
          your voice stays home.
        </h1>
        <p className="hero__sub">
          hold a key, speak, and your words land wherever your cursor is.
          nothing leaves your machine. ever.
        </p>
        <div className="hero__cta">
          <button className="murmur-btn murmur-btn--primary">download for mac</button>
          <a href="#" className="hero__github">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-1.92c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
            <span>view on github</span>
          </a>
          <span className="hero__keys">
            <span className="keycap">⌥</span>
            <span style={{color:"var(--mute)",font:"400 13px/1 var(--font-sans)"}}>+</span>
            <span className="keycap">space</span>
          </span>
        </div>

        <div className="hero__product">
          <div className="hero__overlay">
            <div className="hero__overlay-row">
              <span className="dot-signal"/>
              <div className="hero__wave">
                <svg viewBox="0 0 480 60" preserveAspectRatio="none" style={{width:"100%",height:40,color:"var(--signal)"}}>
                  <g fill="currentColor">
                    {Array.from({length: 32}).map((_, i) => {
                      const heights = [10,22,34,44,26,52,18,46,12,38,28,52,20,44,36,56,12,46,30,52,22,40,16,48,26,38,18,32,14,24,10,8];
                      const h = heights[i];
                      return <rect key={i} x={i*15} y={(60-h)/2} width="6" height={h} rx="3"/>;
                    })}
                  </g>
                </svg>
              </div>
              <span style={{color:"var(--signal)",font:"500 13px/1 var(--font-sans)"}}>listening…</span>
            </div>
            <div className="hero__overlay-tx">
              hold ⌥, talk, release. that's it.
            </div>
            <div className="hero__overlay-hint">
              <span className="keycap">⌥</span>
              <span style={{color:"var(--mute)",fontSize:12}}>hold to talk</span>
              <span style={{color:"var(--stone)",fontSize:12,margin:"0 6px"}}>·</span>
              <span className="keycap">⏎</span>
              <span style={{color:"var(--mute)",fontSize:12}}>paste</span>
              <span style={{color:"var(--stone)",fontSize:12,margin:"0 6px"}}>·</span>
              <span className="keycap">⎋</span>
              <span style={{color:"var(--mute)",fontSize:12}}>cancel</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Hero });
