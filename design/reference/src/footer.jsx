/* ====== Footer ====== */

function Footer() {
  return (
    <footer className="foot">
      <div className="page">
        <div className="foot-inner">
          <div className="foot-col">
            <div className="brand" style={{ marginBottom: 12 }}>
              <span className="caret">▊</span>
              <span className="brand-text">retro<span className="muted">(speced)</span></span>
            </div>
            <div style={{ maxWidth: 40 + "ch", lineHeight: 1.7 }}>
              A TUI for spec-driven AI development.<br />
              Runs on <span className="acc">Claude Code</span> and your taste.
            </div>
            <div className="ascii" style={{ marginTop: 20 }}>
{`   ┌─┐─┐─┐┌┬┐┬─┐┌─┐
   ├┬┘├┤  │ ├┬┘│ │
   ┴└─└─┘ ┴ ┴└─└─┘
   speced ── 2026`}
            </div>
          </div>
          <div className="foot-col">
            <h5>Product</h5>
            <a href="#how">Pipeline</a>
            <a href="#features">Features</a>
            <a href="#shortcuts">Shortcuts</a>
            <a href="#constitution">Constitution</a>
          </div>
          <div className="foot-col">
            <h5>Resources</h5>
            <a href="#install">Quickstart</a>
            <a href="#">Docs</a>
            <a href="#">Changelog</a>
            <a href="#">Blog</a>
          </div>
          <div className="foot-col">
            <h5>Source</h5>
            <a href="#">GitHub</a>
            <a href="#">Issues</a>
            <a href="#">Discussions</a>
            <a href="#">License</a>
          </div>
        </div>
        <div className="foot-bot">
          <span>© 2026 · MIT · built with bun, opentui, and entirely too much coffee</span>
          <span>
            <span className="dim">status:</span> <span className="grn">● all systems nominal</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Footer });
