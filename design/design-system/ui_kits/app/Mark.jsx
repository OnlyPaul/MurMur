// Mark.jsx — Murmur sound-wave glyph. Inherits currentColor.
function Mark({ size = 24, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" style={style}>
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

Object.assign(window, { Mark, Keycap });
