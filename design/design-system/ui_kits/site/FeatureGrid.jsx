function FeatureGrid() {
  const features = [
    {
      title: "on-device",
      body: "the model runs on your cpu. there is no server, no api key, no telemetry pipeline pretending to be a privacy policy.",
      glyph: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>
      ),
    },
    {
      title: "anywhere your cursor is",
      body: "mail, slack, vs code, notion, your shell. murmur pastes into whatever's focused. no menu bars, no popup browser tabs.",
      glyph: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l8 18 2-8 8-2-18-8z"/></svg>
      ),
    },
    {
      title: "open source",
      body: "MIT-licensed. read the audio pipeline. swap the model. fork the whole thing if you want. there's nothing hidden.",
      glyph: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18c-4.5 1-5-2-7-2.5"/><path d="M16 22v-3.87a3.4 3.4 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.4 5.4 0 0 0 20 4.77 5 5 0 0 0 19.91 1S18.73.65 16 2.48a13.4 13.4 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5 5 0 0 0 5 4.77a5.4 5.4 0 0 0-1.5 3.75c0 5.42 3.3 6.61 6.44 7A3.4 3.4 0 0 0 9 18.13V22"/></svg>
      ),
    },
  ];
  return (
    <section id="features" className="features">
      <div className="features__inner">
        <h2 className="features__title">small. quiet. yours.</h2>
        <div className="features__grid">
          {features.map(f => (
            <article className="feature-card" key={f.title}>
              <span className="feature-card__glyph">{f.glyph}</span>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__body">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { FeatureGrid });
