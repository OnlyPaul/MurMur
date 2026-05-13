// MenubarDropdown.jsx — the popover from the menu-bar icon.
function MenubarDropdown({ onOpenSettings, onTrigger, history = [] }) {
  return (
    <div className="murmur-menubar">
      <div className="murmur-menubar__head">
        <div className="row" style={{gap:10,alignItems:"center"}}>
          <span className="murmur-menubar__mark" style={{color:"var(--signal)"}}>
            <Mark size={18}/>
          </span>
          <div>
            <div className="t-body-strong" style={{color:"var(--ink)"}}>Murmur</div>
            <div className="t-caption" style={{color:"var(--mute)"}}>ready · base.en · cpu</div>
          </div>
        </div>
        <span style={{
          background:"var(--ok-soft)", color:"var(--ok)",
          font:"500 11px/1 var(--font-sans)", padding:"4px 8px",
          borderRadius:4, letterSpacing:0.4, textTransform:"uppercase"
        }}>ready</span>
      </div>

      <button className="murmur-menubar__trigger" onClick={onTrigger}>
        <Mark size={16}/>
        <span style={{flex:1,textAlign:"left"}}>hold ⌥ to talk</span>
        <Keycap>⌥</Keycap>
      </button>

      <div className="murmur-menubar__section">
        <div className="t-caption-sm" style={{padding:"4px 12px"}}>recent</div>
        {history.length === 0 && (
          <div style={{padding:"8px 12px",color:"var(--mute)",fontSize:13}}>
            nothing yet. hold ⌥ to start.
          </div>
        )}
        {history.map((h, i) => (
          <div className="murmur-menubar__row" key={i}>
            <div className="t-body-sm" style={{color:"var(--ink)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.text}</div>
            <span className="t-caption">{h.time}</span>
          </div>
        ))}
      </div>

      <div className="murmur-menubar__foot">
        <button className="murmur-btn murmur-btn--ghost" onClick={onOpenSettings} style={{height:28,padding:"0 10px",fontSize:13}}>settings…</button>
        <button className="murmur-btn murmur-btn--ghost" style={{height:28,padding:"0 10px",fontSize:13}}>quit</button>
      </div>
    </div>
  );
}

Object.assign(window, { MenubarDropdown });
