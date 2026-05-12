// SettingsWindow.jsx — macOS-window-chromed settings panel.
function SettingsWindow({ tab = "general", onTab, onClose }) {
  const tabs = [
    { id: "general",  label: "general",  icon: "settings" },
    { id: "model",    label: "model",    icon: "cpu" },
    { id: "shortcut", label: "shortcut", icon: "keyboard" },
    { id: "history",  label: "history",  icon: "clock" },
    { id: "about",    label: "about",    icon: "info" },
  ];
  return (
    <div className="murmur-window">
      <div className="murmur-window__chrome">
        <div className="murmur-window__lights">
          <span style={{background:"#ff5f57",cursor:"pointer"}} onClick={onClose}/>
          <span style={{background:"#febc2e"}}/>
          <span style={{background:"#28c840"}}/>
        </div>
        <div className="murmur-window__title">Murmur — settings</div>
        <div style={{width:54}}/>
      </div>
      <div className="murmur-window__body">
        <aside className="murmur-window__side">
          {tabs.map(t => (
            <button
              key={t.id}
              className={"murmur-tab " + (tab === t.id ? "is-active" : "")}
              onClick={() => onTab?.(t.id)}
            >
              <span className="murmur-tab__glyph">{glyph(t.icon)}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </aside>
        <main className="murmur-window__main">
          {tab === "general"  && <GeneralPane/>}
          {tab === "model"    && <ModelPane/>}
          {tab === "shortcut" && <ShortcutPane/>}
          {tab === "history"  && <HistoryPane/>}
          {tab === "about"    && <AboutPane/>}
        </main>
      </div>
    </div>
  );
}

function Row({ title, hint, control }) {
  return (
    <div className="murmur-setting-row">
      <div className="col" style={{gap:2,flex:1}}>
        <div className="t-body-strong">{title}</div>
        {hint && <div className="t-caption">{hint}</div>}
      </div>
      <div>{control}</div>
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      className={"murmur-toggle " + (on ? "is-on" : "")}
      onClick={() => onChange?.(!on)}
      aria-pressed={on}
    >
      <span className="murmur-toggle__thumb"/>
    </button>
  );
}

function Select({ value, options }) {
  return (
    <div className="murmur-select">
      <span>{value}</span>
      <span style={{color:"var(--mute)"}}>▾</span>
    </div>
  );
}

function GeneralPane() {
  const [launch, setLaunch] = React.useState(true);
  const [menu, setMenu] = React.useState(true);
  const [sound, setSound] = React.useState(false);
  return (
    <div className="col" style={{gap:0}}>
      <div className="h-heading-lg" style={{marginBottom:14}}>general</div>
      <Row title="launch at login" hint="start murmur quietly when your mac boots."
        control={<Toggle on={launch} onChange={setLaunch}/>}/>
      <Row title="show in menu bar" hint="the only chrome murmur adds to your desktop."
        control={<Toggle on={menu} onChange={setMenu}/>}/>
      <Row title="play sound on done" hint="a soft tap when text is pasted."
        control={<Toggle on={sound} onChange={setSound}/>}/>
      <Row title="language" hint="primary transcription language. murmur auto-detects others."
        control={<Select value="english (us)"/>}/>
    </div>
  );
}

function ModelPane() {
  const models = [
    { id:"tiny.en",  size:"39mb",  speed:"fastest",  acc:"good",     active:false },
    { id:"base.en",  size:"140mb", speed:"fast",     acc:"better",   active:true  },
    { id:"small.en", size:"460mb", speed:"medium",   acc:"great",    active:false },
    { id:"medium",   size:"1.4gb", speed:"slow",     acc:"excellent",active:false },
  ];
  return (
    <div className="col" style={{gap:14}}>
      <div className="h-heading-lg" style={{marginBottom:0}}>model</div>
      <div className="t-body-sm" style={{maxWidth:520}}>
        the whisper model runs entirely on your machine. pick a size based on the trade-off you want.
      </div>
      <div className="col" style={{gap:8}}>
        {models.map(m => (
          <div key={m.id} className={"murmur-model-row " + (m.active ? "is-active" : "")}>
            <div className="col" style={{gap:2,flex:1}}>
              <div className="row" style={{gap:8,alignItems:"center"}}>
                <span className="t-body-strong">{m.id}</span>
                {m.active && <span style={{background:"var(--signal-soft)",color:"var(--signal)",font:"500 11px/1 var(--font-sans)",padding:"3px 7px",borderRadius:4,letterSpacing:0.4,textTransform:"uppercase"}}>active</span>}
              </div>
              <div className="t-caption">{m.size} · {m.speed} · {m.acc}</div>
            </div>
            <button className={"murmur-btn " + (m.active ? "murmur-btn--ghost" : "murmur-btn--tertiary")}>{m.active ? "in use" : "switch"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShortcutPane() {
  return (
    <div className="col" style={{gap:14}}>
      <div className="h-heading-lg" style={{marginBottom:0}}>shortcut</div>
      <Row title="hold to talk" hint="press and hold. release to paste."
        control={
          <div className="row" style={{gap:6}}>
            <Keycap>⌥</Keycap>
            <span style={{color:"var(--mute)"}}>+</span>
            <Keycap>space</Keycap>
          </div>
        }/>
      <Row title="tap to toggle" hint="quick tap starts; tap again to stop."
        control={
          <div className="row" style={{gap:6}}>
            <Keycap>⌘</Keycap>
            <span style={{color:"var(--mute)"}}>+</span>
            <Keycap>⇧</Keycap>
            <span style={{color:"var(--mute)"}}>+</span>
            <Keycap>;</Keycap>
          </div>
        }/>
      <Row title="cancel" hint="abandon the current recording."
        control={<div className="row" style={{gap:6}}><Keycap>⎋</Keycap></div>}/>
    </div>
  );
}

function HistoryPane() {
  const rows = [
    { time:"2m ago",  app:"Mail",      text:"thanks for sending this over — i'll take a look tonight." },
    { time:"7m ago",  app:"Slack",     text:"yep, deploy when ready. ping me if anything breaks." },
    { time:"22m ago", app:"Notes",     text:"three things to remember: dentist, taxes, mom's birthday." },
    { time:"1h ago",  app:"VS Code",   text:"todo: refactor the audio pipeline; latency spikes on long recordings." },
    { time:"yesterday", app:"Messages",text:"on my way. five minutes." },
  ];
  return (
    <div className="col" style={{gap:12}}>
      <div className="row" style={{justifyContent:"space-between",alignItems:"center"}}>
        <div className="h-heading-lg">history</div>
        <button className="murmur-btn murmur-btn--ghost">clear all</button>
      </div>
      <div className="t-body-sm" style={{color:"var(--mute)"}}>kept locally for 7 days, then forgotten.</div>
      <div className="col" style={{gap:6}}>
        {rows.map((r,i) => (
          <div key={i} className="murmur-history-row">
            <div className="t-caption" style={{width:80,flex:"none"}}>{r.time}</div>
            <div style={{flex:1,color:"var(--ink)"}}>{r.text}</div>
            <span className="t-caption" style={{color:"var(--mute)"}}>{r.app}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutPane() {
  return (
    <div className="col" style={{gap:18,alignItems:"flex-start"}}>
      <img src="../../assets/app-icon.svg" alt="" width="80" height="80" style={{borderRadius:18}}/>
      <div className="col" style={{gap:4}}>
        <div className="h-heading-lg">Murmur 0.4.2</div>
        <div className="t-body-sm">local, open-source speech-to-text.</div>
      </div>
      <div className="t-body-sm" style={{maxWidth:480}}>
        runs on whisper.cpp. nothing is sent anywhere. you can read the source on github and
        verify it yourself.
      </div>
      <div className="row" style={{gap:8}}>
        <button className="murmur-btn murmur-btn--tertiary">view source</button>
        <button className="murmur-btn murmur-btn--ghost">check for updates</button>
      </div>
    </div>
  );
}

function glyph(name) {
  // minimal inline icons — keeps the kit dependency-free
  const common = { width:16, height:16, viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:1.5, strokeLinecap:"round", strokeLinejoin:"round" };
  switch (name) {
    case "settings": return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case "cpu":      return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>;
    case "keyboard": return <svg {...common}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h0M10 10h0M14 10h0M18 10h0M7 14h10"/></svg>;
    case "clock":    return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "info":     return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h0"/></svg>;
    default: return null;
  }
}

Object.assign(window, { SettingsWindow });
