// Atoms.jsx — shared primitives (mark, keycap, toggle, select, slider, segmented).

function Mark({ size = 24, style, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill={color} style={style}>
      <rect x="6"  y="26" width="6" height="12" rx="3"/>
      <rect x="18" y="18" width="6" height="28" rx="3"/>
      <rect x="30" y="10" width="6" height="44" rx="3"/>
      <rect x="42" y="18" width="6" height="28" rx="3"/>
      <rect x="54" y="26" width="6" height="12" rx="3"/>
    </svg>
  );
}

function Keycap({ children, style }) {
  return <span className="murmur-keycap" style={style}>{children}</span>;
}

function Toggle({ on, onChange, disabled }) {
  return (
    <button
      className={"murmur-toggle " + (on ? "is-on" : "")}
      onClick={() => !disabled && onChange?.(!on)}
      aria-pressed={on}
      disabled={disabled}
      style={disabled ? { opacity: 0.5, cursor: "not-allowed" } : null}
    >
      <span className="murmur-toggle__thumb"/>
    </button>
  );
}

function Select({ value, options = [], onChange, width }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const off = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", off);
    return () => document.removeEventListener("mousedown", off);
  }, []);
  return (
    <div className="murmur-select-wrap" ref={ref} style={{ position: "relative", width }}>
      <button
        className="murmur-select"
        onClick={() => setOpen(o => !o)}
        style={{ width: width ? "100%" : null, justifyContent: "space-between" }}
      >
        <span>{value}</span>
        <span style={{color:"var(--mute)"}}>▾</span>
      </button>
      {open && (
        <div className="murmur-menu">
          {options.map(opt => (
            <button
              key={opt}
              className={"murmur-menu__item " + (opt === value ? "is-active" : "")}
              onClick={() => { onChange?.(opt); setOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Segmented({ value, options, onChange }) {
  return (
    <div className="murmur-seg">
      {options.map(o => (
        <button
          key={o.value}
          className={"murmur-seg__opt " + (value === o.value ? "is-active" : "")}
          onClick={() => onChange?.(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Row({ title, hint, control, children }) {
  return (
    <div className="murmur-setting-row">
      <div className="col" style={{gap:2,flex:1,minWidth:0}}>
        <div className="t-body-strong">{title}</div>
        {hint && <div className="t-caption" style={{textWrap:"pretty"}}>{hint}</div>}
        {children}
      </div>
      {control && <div style={{flexShrink:0}}>{control}</div>}
    </div>
  );
}

function Lucide({ name, size = 16, style }) {
  // tiny inline set — only what we need
  const c = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", style };
  switch (name) {
    case "settings": return <svg {...c}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case "cpu": return <svg {...c}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>;
    case "keyboard": return <svg {...c}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h0M10 10h0M14 10h0M18 10h0M7 14h10"/></svg>;
    case "clock": return <svg {...c}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "info": return <svg {...c}><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h0"/></svg>;
    case "mic": return <svg {...c}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4"/></svg>;
    case "languages": return <svg {...c}><path d="M5 8h6M8 5v3M5 14c2-3 4-4 6 0M3 5h10M14 19l4-8 4 8M15 17h6"/></svg>;
    case "book": return <svg {...c}><path d="M4 19V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 0-2 2z"/><path d="M19 17H7"/></svg>;
    case "wand": return <svg {...c}><path d="M3 21l12-12M14 4l2-2M18 8l2-2M9 9l2-2M20 14l2 0M16 18l2 2"/></svg>;
    case "x": return <svg {...c}><path d="M18 6L6 18M6 6l12 12"/></svg>;
    case "check": return <svg {...c}><path d="M5 12l4 4 10-12"/></svg>;
    case "download": return <svg {...c}><path d="M12 3v12m-5-5l5 5 5-5M5 21h14"/></svg>;
    case "trash": return <svg {...c}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/></svg>;
    case "copy": return <svg {...c}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
    case "play": return <svg {...c}><path d="M6 4l14 8-14 8z"/></svg>;
    case "github": return <svg {...c}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>;
    case "external": return <svg {...c}><path d="M14 3h7v7M10 14L21 3M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/></svg>;
    case "search": return <svg {...c}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case "plus": return <svg {...c}><path d="M12 5v14M5 12h14"/></svg>;
    case "folder": return <svg {...c}><path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>;
    case "shield": return <svg {...c}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z"/></svg>;
    case "zap": return <svg {...c}><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>;
    case "command": return <svg {...c}><path d="M15 9h-6v6h6zM9 9V6a3 3 0 1 0-3 3h3zm0 0v6m6-6h3a3 3 0 1 0-3-3v3zm0 0h-6m6 6h3a3 3 0 1 1-3 3v-3zm0 0v-6m-6 6v3a3 3 0 1 1-3-3h3z"/></svg>;
    case "chevron": return <svg {...c}><path d="M9 6l6 6-6 6"/></svg>;
    default: return null;
  }
}

Object.assign(window, { Mark, Keycap, Toggle, Select, Segmented, Row, Lucide });
