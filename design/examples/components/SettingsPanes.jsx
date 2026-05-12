// SettingsPanes.jsx — all settings sections for the Murmur settings window.

const SECTIONS = [
  { id: "general",   label: "general",   icon: "settings" },
  { id: "models",    label: "models",    icon: "cpu" },
  { id: "shortcuts", label: "shortcuts", icon: "keyboard" },
  { id: "audio",     label: "audio",     icon: "mic" },
  { id: "language",  label: "language",  icon: "languages" },
  { id: "dictionary",label: "dictionary",icon: "book" },
  { id: "post",      label: "post-processing", icon: "wand" },
  { id: "history",   label: "history",   icon: "clock" },
  { id: "about",     label: "about",     icon: "info" },
];

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="row" style={{justifyContent:"space-between",alignItems:"flex-end",marginBottom:18,gap:16}}>
      <div className="col" style={{gap:4,minWidth:0}}>
        <div className="h-heading-lg">{title}</div>
        {subtitle && <div className="t-body-sm" style={{color:"var(--mute)",maxWidth:520,textWrap:"pretty"}}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

// ─── general ─────────────────────────────────────────────────
function GeneralPane({ s, set }) {
  return (
    <div className="col" style={{gap:0}}>
      <SectionHeader title="general" subtitle="how murmur sits on your machine."/>
      <Row title="launch at login" hint="start murmur quietly when your mac boots."
        control={<Toggle on={s.launchAtLogin} onChange={v => set("launchAtLogin", v)}/>}/>
      <Row title="show in menu bar" hint="the only chrome murmur adds to your desktop."
        control={<Toggle on={s.menuBar} onChange={v => set("menuBar", v)}/>}/>
      <Row title="show recording overlay" hint="the floating hud you see when listening. some compositors steal focus — turn off if pasting fails."
        control={<Toggle on={s.overlay} onChange={v => set("overlay", v)}/>}/>
      <Row title="overlay position" hint="where the listening hud sits."
        control={<Select width={160} value={s.overlayPos} options={["top-center","bottom-center","bottom-right","none"]} onChange={v => set("overlayPos", v)}/>}/>
      <Row title="play sound when done" hint="a soft tap when text is pasted."
        control={<Toggle on={s.audioFeedback} onChange={v => set("audioFeedback", v)}/>}/>
      <Row title="mute system audio while recording" hint="duck music and other apps so the model hears you cleanly."
        control={<Toggle on={s.muteWhileRecording} onChange={v => set("muteWhileRecording", v)}/>}/>
      <Row title="append trailing space" hint="adds a space after each transcript so the next dictation flows."
        control={<Toggle on={s.trailingSpace} onChange={v => set("trailingSpace", v)}/>}/>
      <Row title="auto-submit on paste" hint="hit return for you after pasting — useful in chat fields."
        control={<Toggle on={s.autoSubmit} onChange={v => set("autoSubmit", v)}/>}/>
      <Row title="app language" hint="for the settings window. transcription language is separate."
        control={<Select width={160} value={s.appLang} options={["english","deutsch","français","español","日本語","简体中文"]} onChange={v => set("appLang", v)}/>}/>
    </div>
  );
}

// ─── models ──────────────────────────────────────────────────
const MODELS = [
  { id:"parakeet-v3-int8", family:"Parakeet",  size:"478 mb", speed:"fast",     acc:"great",     desc:"cpu-optimised. automatic language detection.", recommended:true,  downloaded:true  },
  { id:"parakeet-v2-int8", family:"Parakeet",  size:"473 mb", speed:"fast",     acc:"great",     desc:"english-tuned. lighter than v3.",              recommended:false, downloaded:false },
  { id:"ggml-small",       family:"Whisper",   size:"487 mb", speed:"medium",   acc:"good",      desc:"good for everyday dictation.",                 recommended:false, downloaded:true  },
  { id:"whisper-medium-q4_1",family:"Whisper", size:"492 mb", speed:"medium",   acc:"better",    desc:"quantised medium. balanced.",                  recommended:false, downloaded:false },
  { id:"ggml-large-v3-turbo",family:"Whisper", size:"1.6 gb", speed:"fast",     acc:"excellent", desc:"distilled large-v3. gpu recommended.",         recommended:false, downloaded:false },
  { id:"ggml-large-v3-q5_0",family:"Whisper",  size:"1.1 gb", speed:"slow",     acc:"excellent", desc:"highest accuracy. needs a real gpu.",          recommended:false, downloaded:false },
];

function ModelsPane({ s, set, downloading, startDownload }) {
  return (
    <div className="col" style={{gap:14}}>
      <SectionHeader
        title="models"
        subtitle="the model runs entirely on your machine. nothing is sent anywhere."
        action={<button className="murmur-btn murmur-btn--ghost" style={{height:30,padding:"0 12px",fontSize:13}}><Lucide name="folder" size={14}/><span style={{marginLeft:6}}>open models folder</span></button>}
      />
      <Row title="acceleration" hint="metal is auto-detected on apple silicon."
        control={<Segmented value={s.acceleration} onChange={v => set("acceleration", v)} options={[
          {value:"auto",label:"auto"},
          {value:"metal",label:"metal"},
          {value:"cpu",label:"cpu"},
        ]}/>}/>
      <Row title="unload after idle" hint="free memory when you haven't dictated in a while."
        control={<Select width={140} value={s.unloadTimeout} options={["never","2 min","10 min","30 min","1 hour"]} onChange={v => set("unloadTimeout", v)}/>}/>
      <div className="col" style={{gap:8,marginTop:8}}>
        {MODELS.map(m => {
          const active = s.activeModel === m.id;
          const dl = downloading === m.id;
          return (
            <div key={m.id} className={"murmur-model-row " + (active ? "is-active" : "")}>
              <div className="col" style={{gap:4,flex:1,minWidth:0}}>
                <div className="row" style={{gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <span className="t-body-strong" style={{fontFamily:"var(--font-mono)",fontSize:13}}>{m.id}</span>
                  <span className="murmur-chip">{m.family}</span>
                  {m.recommended && <span className="murmur-chip murmur-chip--signal">recommended</span>}
                  {active && <span className="murmur-chip murmur-chip--ok">active</span>}
                </div>
                <div className="t-caption">{m.size} · {m.speed} · {m.acc}</div>
                <div className="t-caption" style={{color:"var(--ash)"}}>{m.desc}</div>
                {dl && (
                  <div className="murmur-progress" style={{marginTop:6}}>
                    <div className="murmur-progress__bar" style={{width:`${dl}%`}}/>
                  </div>
                )}
              </div>
              {active ? (
                <button className="murmur-btn murmur-btn--ghost" disabled>in use</button>
              ) : m.downloaded ? (
                <button className="murmur-btn murmur-btn--tertiary" onClick={() => set("activeModel", m.id)}>switch</button>
              ) : dl ? (
                <button className="murmur-btn murmur-btn--ghost" disabled>downloading…</button>
              ) : (
                <button className="murmur-btn murmur-btn--tertiary" onClick={() => startDownload(m.id)}>
                  <Lucide name="download" size={14}/><span style={{marginLeft:6}}>download</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── shortcuts ───────────────────────────────────────────────
function ShortcutRow({ title, hint, combo, onRecord, recording }) {
  return (
    <Row title={title} hint={hint} control={
      <button className={"murmur-shortcut " + (recording ? "is-recording" : "")} onClick={onRecord}>
        {recording ? (
          <span style={{color:"var(--signal)"}}>press keys<span className="dots"/></span>
        ) : (
          <span className="row" style={{gap:6}}>
            {combo.map((k, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{color:"var(--stone)"}}>+</span>}
                <Keycap>{k}</Keycap>
              </React.Fragment>
            ))}
          </span>
        )}
      </button>
    }/>
  );
}

function ShortcutsPane({ s, set }) {
  const [recording, setRecording] = React.useState(null);
  return (
    <div className="col" style={{gap:0}}>
      <SectionHeader title="shortcuts" subtitle="hold-to-talk is the murmur way; tap-to-toggle is there if you need hands free."/>
      <Row title="trigger mode" hint=""
        control={<Segmented value={s.triggerMode} onChange={v => set("triggerMode", v)} options={[
          {value:"hold",label:"hold"},
          {value:"toggle",label:"toggle"},
        ]}/>}/>
      <ShortcutRow title="hold to talk" hint="press and hold. release to paste."
        combo={["⌥","space"]} recording={recording === "hold"}
        onRecord={() => setRecording(recording === "hold" ? null : "hold")}/>
      <ShortcutRow title="tap to toggle" hint="tap once to start; tap again to stop and paste."
        combo={["⌘","⇧",";"]} recording={recording === "toggle"}
        onRecord={() => setRecording(recording === "toggle" ? null : "toggle")}/>
      <ShortcutRow title="post-process & paste" hint="run llm cleanup then paste."
        combo={["⌘","⇧","p"]} recording={recording === "post"}
        onRecord={() => setRecording(recording === "post" ? null : "post")}/>
      <ShortcutRow title="cancel" hint="abandon the current recording without pasting."
        combo={["⎋"]} recording={recording === "cancel"}
        onRecord={() => setRecording(recording === "cancel" ? null : "cancel")}/>
      <Row title="globe key as trigger" hint="(macos) use 🌐 instead of a modifier — experimental."
        control={<Toggle on={s.globeKey} onChange={v => set("globeKey", v)}/>}/>
    </div>
  );
}

// ─── audio ───────────────────────────────────────────────────
function AudioPane({ s, set }) {
  return (
    <div className="col" style={{gap:0}}>
      <SectionHeader title="audio" subtitle="murmur listens through your default input unless you pick another."/>
      <Row title="input device" hint="the microphone murmur listens through."
        control={<Select width={220} value={s.inputDevice} options={["system default","macbook pro microphone","airpods pro","blue yeti"]} onChange={v => set("inputDevice", v)}/>}/>
      <Row title="output device" hint="for the soft 'done' tone."
        control={<Select width={220} value={s.outputDevice} options={["system default","macbook pro speakers","airpods pro"]} onChange={v => set("outputDevice", v)}/>}/>
      <Row title="clamshell microphone" hint="switch to a fallback input when the lid is closed."
        control={<Select width={220} value={s.clamshellMic} options={["macbook pro microphone","airpods pro","none"]} onChange={v => set("clamshellMic", v)}/>}/>
      <Row title="always-on microphone" hint="keep the mic warm for instant response. uses a little battery."
        control={<Toggle on={s.alwaysOn} onChange={v => set("alwaysOn", v)}/>}/>
      <Row title="voice activity detection" hint="filter silence using silero vad before transcribing."
        control={<Toggle on={s.vad} onChange={v => set("vad", v)}/>}/>
      <Row title="vad sensitivity" hint={`${s.vadThreshold}% — higher means longer silences before stopping.`}
        control={<input type="range" min="10" max="90" value={s.vadThreshold} onChange={e => set("vadThreshold", +e.target.value)} className="murmur-range" style={{width:160}}/>}/>
      <Row title="lazy stream close" hint="keep the audio stream open between recordings — lower latency, slightly more cpu."
        control={<Toggle on={s.lazyStream} onChange={v => set("lazyStream", v)}/>}/>
    </div>
  );
}

// ─── language ────────────────────────────────────────────────
const LANGS = [
  {code:"auto", label:"auto-detect"},
  {code:"en",   label:"english"},
  {code:"es",   label:"español"},
  {code:"fr",   label:"français"},
  {code:"de",   label:"deutsch"},
  {code:"it",   label:"italiano"},
  {code:"pt",   label:"português"},
  {code:"ja",   label:"日本語"},
  {code:"zh",   label:"中文"},
  {code:"ko",   label:"한국어"},
  {code:"ar",   label:"العربية"},
  {code:"hi",   label:"हिन्दी"},
];

function LanguagePane({ s, set }) {
  return (
    <div className="col" style={{gap:14}}>
      <SectionHeader title="language" subtitle="parakeet detects automatically; whisper needs a hint."/>
      <Row title="primary language" hint="hint for the model. set to auto with parakeet v3."
        control={<Select width={200} value={LANGS.find(l => l.code === s.lang)?.label} options={LANGS.map(l => l.label)} onChange={v => set("lang", LANGS.find(l => l.label === v).code)}/>}/>
      <div className="t-caption-sm">supported languages</div>
      <div className="murmur-grid">
        {LANGS.slice(1).map(l => (
          <div key={l.code} className="murmur-lang-tile">
            <div className="t-body-strong">{l.label}</div>
            <div className="t-caption" style={{fontFamily:"var(--font-mono)",fontSize:11}}>{l.code}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── dictionary ──────────────────────────────────────────────
function DictionaryPane({ s, set, addWord, removeWord }) {
  const [draft, setDraft] = React.useState("");
  const submit = () => {
    if (!draft.trim()) return;
    addWord(draft.trim());
    setDraft("");
  };
  return (
    <div className="col" style={{gap:14}}>
      <SectionHeader title="dictionary" subtitle="proper nouns and jargon the model should always spell correctly."/>
      <div className="row" style={{gap:8}}>
        <input
          className="murmur-input"
          placeholder="add a word or phrase…"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          style={{flex:1}}
        />
        <button className="murmur-btn murmur-btn--tertiary" onClick={submit}>
          <Lucide name="plus" size={14}/><span style={{marginLeft:6}}>add</span>
        </button>
      </div>
      <div className="row" style={{gap:6,flexWrap:"wrap"}}>
        {s.words.length === 0 && <div className="t-caption">nothing yet. add a few to start.</div>}
        {s.words.map(w => (
          <span key={w} className="murmur-tag">
            {w}
            <button onClick={() => removeWord(w)} aria-label="remove"><Lucide name="x" size={12}/></button>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── post-processing ─────────────────────────────────────────
function PostPane({ s, set }) {
  return (
    <div className="col" style={{gap:0}}>
      <SectionHeader title="post-processing" subtitle="optional pass over the transcript before it lands. runs locally too."/>
      <Row title="enable post-processing" hint="clean up filler, capitalise, and punctuate."
        control={<Toggle on={s.postEnabled} onChange={v => set("postEnabled", v)}/>}/>
      <Row title="cleanup style" hint="how aggressively to rewrite."
        control={<Segmented value={s.postStyle} onChange={v => set("postStyle", v)} options={[
          {value:"light",label:"light"},
          {value:"normal",label:"normal"},
          {value:"strict",label:"strict"},
        ]}/>}/>
      <Row title="model" hint="small local llm used for cleanup."
        control={<Select width={200} value={s.postModel} options={["llama-3.2-1b","qwen-2.5-1.5b","phi-3-mini"]} onChange={v => set("postModel", v)}/>}/>
      <Row title="auto-punctuate" hint="add commas and periods even when you don't dictate them."
        control={<Toggle on={s.autoPunct} onChange={v => set("autoPunct", v)}/>}/>
      <Row title="strip filler" hint="remove 'um', 'uh', 'like'."
        control={<Toggle on={s.stripFiller} onChange={v => set("stripFiller", v)}/>}/>
    </div>
  );
}

// ─── history ─────────────────────────────────────────────────
function HistoryPane({ history, clear, copy }) {
  return (
    <div className="col" style={{gap:14}}>
      <SectionHeader
        title="history"
        subtitle="kept locally for 7 days, then forgotten. nothing leaves your machine."
        action={
          <button className="murmur-btn murmur-btn--ghost" onClick={clear}>
            <Lucide name="trash" size={14}/><span style={{marginLeft:6}}>clear all</span>
          </button>
        }
      />
      {history.length === 0 ? (
        <div className="murmur-empty">
          <Mark size={28} style={{color:"var(--ash)",marginBottom:10}}/>
          <div className="t-body-strong" style={{color:"var(--mute)"}}>nothing yet.</div>
          <div className="t-caption">hold ⌥ to start.</div>
        </div>
      ) : (
        <div className="col" style={{gap:6}}>
          {history.map((r, i) => (
            <div key={i} className="murmur-history-row">
              <div className="t-caption" style={{width:80,flex:"none"}}>{r.time}</div>
              <div style={{flex:1,color:"var(--ink)",minWidth:0,overflow:"hidden",textOverflow:"ellipsis"}}>{r.text}</div>
              <span className="t-caption" style={{color:"var(--mute)",width:80,textAlign:"right"}}>{r.app}</span>
              <button className="murmur-icon-btn" onClick={() => copy(r.text)} aria-label="copy"><Lucide name="copy" size={14}/></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── about ───────────────────────────────────────────────────
function AboutPane() {
  return (
    <div className="col" style={{gap:20,alignItems:"flex-start"}}>
      <SectionHeader title="about"/>
      <div className="row" style={{gap:18,alignItems:"center"}}>
        <img src="assets/app-icon.svg" alt="" width="72" height="72" style={{borderRadius:18,border:"1px solid var(--hairline)"}}/>
        <div className="col" style={{gap:4}}>
          <div className="h-heading-lg">Murmur 0.8.1</div>
          <div className="t-body-sm">local, open-source speech-to-text.</div>
          <div className="t-caption" style={{fontFamily:"var(--font-mono)"}}>build 20260511 · darwin arm64</div>
        </div>
      </div>
      <div className="t-body-sm" style={{maxWidth:520,textWrap:"pretty"}}>
        runs on whisper.cpp and parakeet. nothing is sent anywhere. you can read the source on github and verify it yourself.
      </div>
      <div className="row" style={{gap:8}}>
        <button className="murmur-btn murmur-btn--tertiary"><Lucide name="github" size={14}/><span style={{marginLeft:6}}>view source</span></button>
        <button className="murmur-btn murmur-btn--ghost"><Lucide name="check" size={14}/><span style={{marginLeft:6}}>check for updates</span></button>
        <button className="murmur-btn murmur-btn--ghost"><Lucide name="folder" size={14}/><span style={{marginLeft:6}}>app data</span></button>
      </div>
      <div className="murmur-about-grid">
        <div className="murmur-about-tile">
          <Lucide name="shield" size={18} style={{color:"var(--signal)"}}/>
          <div className="t-body-strong">local-only</div>
          <div className="t-caption">audio never leaves your machine. no analytics by default.</div>
        </div>
        <div className="murmur-about-tile">
          <Lucide name="github" size={18} style={{color:"var(--body)"}}/>
          <div className="t-body-strong">open source</div>
          <div className="t-caption">mit-licensed. inspect, fork, audit.</div>
        </div>
        <div className="murmur-about-tile">
          <Lucide name="zap" size={18} style={{color:"var(--body)"}}/>
          <div className="t-body-strong">fast</div>
          <div className="t-caption">~5× real-time on apple silicon with parakeet.</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SECTIONS, GeneralPane, ModelsPane, ShortcutsPane, AudioPane, LanguagePane, DictionaryPane, PostPane, HistoryPane, AboutPane });
