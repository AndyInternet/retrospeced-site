/* ====== App shell ====== */

function TopNav({ theme, onTheme }) {
  return (
    <nav className="topnav">
      <div className="page topnav-inner">
        <div className="brand">
          <span className="caret">▊</span>
          <span className="brand-text">retro<span className="muted">(speced)</span></span>
          <span style={{ color: "var(--text-dim)", fontSize: 11, marginLeft: 6 }}>v0.4.2</span>
        </div>
        <div className="nav-links" style={{ display: "flex" }}>
          <a href="#how">how</a>
          <a href="#features">features</a>
          <a href="#shortcuts">shortcuts</a>
          <a href="#constitution">constitution</a>
          <a href="#install">install</a>
        </div>
        <div className="nav-cta">
          <button
            className="btn ghost"
            onClick={() => onTheme(theme === "dark" ? "light" : "dark")}
            aria-label="toggle theme"
            title="toggle theme"
            style={{ padding: "7px 10px" }}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={13} />
          </button>
          <a className="btn" href="#"><Icon name="gh" size={13} /> github</a>
          <a className="btn primary" href="#install">Install <Kbd>↵</Kbd></a>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [state, setState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("retro-tweaks") || "null");
      return saved ? { ...TWEAK_DEFAULTS, ...saved } : TWEAK_DEFAULTS;
    } catch { return TWEAK_DEFAULTS; }
  });
  const [tweaksOpen, setTweaksOpen] = useState(false);

  // apply attrs
  useEffect(() => {
    const r = document.documentElement;
    r.setAttribute("data-theme", state.theme);
    r.setAttribute("data-accent", state.accent);
    r.setAttribute("data-scanlines", state.scanlines);
    localStorage.setItem("retro-tweaks", JSON.stringify(state));
  }, [state]);

  // listen for edit-mode messages (Tweaks integration)
  useEffect(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode")   setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    // announce availability AFTER listener installed
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch {}
    return () => window.removeEventListener("message", handler);
  }, []);

  const updateState = (updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        window.parent.postMessage({ type: "__edit_mode_set_keys", edits: next }, "*");
      } catch {}
      return next;
    });
  };

  const setTheme = (t) => updateState((s) => ({ ...s, theme: t }));

  return (
    <>
      <TopNav theme={state.theme} onTheme={setTheme} />
      <Hero variant={state.heroVariant} />
      <Pipeline />
      <Features />
      <Shortcuts />
      <Constitution />
      <Install />
      <Footer />
      <TweaksPanel state={state} setState={updateState} visible={tweaksOpen} onClose={() => setTweaksOpen(false)} />
      {/* floating toggle if Tweaks not auto-activated */}
      {!tweaksOpen && (
        <button
          onClick={() => setTweaksOpen(true)}
          style={{
            position: "fixed", right: 16, bottom: 16, zIndex: 99,
            background: "var(--bg-panel)", border: "1px solid var(--border)",
            color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: 11,
            padding: "8px 12px", borderRadius: 3, cursor: "pointer",
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          ⟪ tweaks ⟫
        </button>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
