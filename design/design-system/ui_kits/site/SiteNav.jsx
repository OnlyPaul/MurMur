function SiteNav({ onDownload }) {
  return (
    <nav className="site-nav">
      <div className="site-nav__inner">
        <a className="site-nav__brand" href="#">
          <span style={{color:"var(--ink)",display:"inline-flex"}}>
            <svg width="18" height="18" viewBox="0 0 64 64" fill="currentColor"><rect x="6" y="26" width="6" height="12" rx="3"/><rect x="18" y="18" width="6" height="28" rx="3"/><rect x="30" y="10" width="6" height="44" rx="3"/><rect x="42" y="18" width="6" height="28" rx="3"/><rect x="54" y="26" width="6" height="12" rx="3"/></svg>
          </span>
          <span>Murmur</span>
        </a>
        <div className="site-nav__links">
          <a href="#features">features</a>
          <a href="#install">install</a>
          <a href="#privacy">privacy</a>
          <a href="#open-source">open source</a>
          <a href="#changelog">changelog</a>
        </div>
        <div className="site-nav__cta">
          <a href="#sign-in" className="site-nav__signin">sign in</a>
          <button className="murmur-btn murmur-btn--primary" onClick={onDownload}>download</button>
        </div>
      </div>
    </nav>
  );
}
Object.assign(window, { SiteNav });
