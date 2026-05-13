function InstallBlock() {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <section id="install" className="install">
      <div className="install__inner">
        <div className="install__copy">
          <span className="t-caption-sm">install</span>
          <h2 className="install__title">one line. no account.</h2>
          <p className="install__body">macOS 12 or later, intel or apple silicon. ~140mb on disk.</p>
          <div className="install__pair">
            <div className="install__cmd">
              <span style={{color:"var(--mute)"}}>$</span>
              <span style={{color:"var(--ink)"}}>brew install</span>
              <span style={{color:"var(--signal)"}}>murmur</span>
            </div>
            <button className="murmur-btn murmur-btn--tertiary" onClick={copy}>
              {copied ? "copied." : "copy"}
            </button>
          </div>
          <div className="t-body-sm" style={{color:"var(--mute)",marginTop:14}}>
            or <a href="#" style={{color:"var(--on-dark)",textDecoration:"underline",textDecorationColor:"var(--hairline-strong)",textUnderlineOffset:3}}>download the .dmg</a> · linux build in progress
          </div>
        </div>
        <div className="install__visual">
          <img src="../../assets/app-icon.svg" alt="" width="160" height="160" style={{borderRadius:36}}/>
          <div className="t-caption" style={{marginTop:14,color:"var(--mute)"}}>Murmur 0.4.2 · 38 MB</div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { InstallBlock });
