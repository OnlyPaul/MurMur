function Footer() {
  const cols = [
    { head:"product", links:["features","install","changelog","roadmap"] },
    { head:"open source", links:["github","contributing","license","models"] },
    { head:"docs", links:["getting started","shortcuts","privacy","faq"] },
    { head:"company", links:["about","blog","press","contact"] },
  ];
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span style={{color:"var(--ink)",display:"inline-flex"}}>
            <svg width="22" height="22" viewBox="0 0 64 64" fill="currentColor"><rect x="6" y="26" width="6" height="12" rx="3"/><rect x="18" y="18" width="6" height="28" rx="3"/><rect x="30" y="10" width="6" height="44" rx="3"/><rect x="42" y="18" width="6" height="28" rx="3"/><rect x="54" y="26" width="6" height="12" rx="3"/></svg>
          </span>
          <span style={{font:"600 18px/1 var(--font-sans)",color:"var(--ink)"}}>Murmur</span>
        </div>
        <div className="site-footer__cols">
          {cols.map(c => (
            <div className="site-footer__col" key={c.head}>
              <div className="site-footer__head">{c.head}</div>
              {c.links.map(l => <a href="#" key={l}>{l}</a>)}
            </div>
          ))}
        </div>
        <div className="site-footer__news">
          <div className="site-footer__head">stay quiet, stay updated</div>
          <div className="site-footer__form">
            <input placeholder="you@email" className="site-footer__input"/>
            <button className="murmur-btn murmur-btn--primary">subscribe</button>
          </div>
          <div className="t-caption" style={{marginTop:8,color:"var(--mute)"}}>
            one email per release. no tracking.
          </div>
        </div>
      </div>
      <div className="site-footer__legal">
        <span>© 2026 Murmur · MIT</span>
        <span>made quietly · privacy by design</span>
      </div>
    </footer>
  );
}
Object.assign(window, { Footer });
