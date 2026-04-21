/* ====== Install / quickstart ====== */

function Install() {
  const [tab, setTab] = useState("git");

  const commands = {
    git: [
      { c: "# clone", k: "c" },
      { c: "git clone github.com/you/retrospeced-tui", k: "k" },
      { c: "cd retrospeced-tui", k: "k" },
      { c: "bun install", k: "k" },
      { c: "bun src/index.tsx", k: "k" },
    ],
    bin: [
      { c: "# build single binary", k: "c" },
      { c: "bun run build", k: "k" },
      { c: "cp bin/retro /usr/local/bin/", k: "k" },
      { c: "retro", k: "k" },
    ],
  };

  return (
    <section id="install">
      <div className="page">
        <SectionHead
          eyebrow="quickstart"
          title="Running in ninety seconds."
          sub="You'll need bun, the Claude Code CLI, the GitHub CLI, and an Anthropic API key. Retro is a single bun script — or a single binary, if you prefer."
        />

        <div className="install-grid">
          <div className="install-card">
            <h4>Prerequisites</h4>
            <ul className="steps">
              <li>Install <a href="https://bun.sh" target="_blank" rel="noreferrer">Bun</a> <code>curl -fsSL https://bun.sh/install | bash</code></li>
              <li>Install the <a href="https://docs.anthropic.com/en/docs/claude-code" target="_blank" rel="noreferrer">Claude Code CLI</a> <code>npm i -g @anthropic-ai/claude-code</code></li>
              <li>Install the <a href="https://cli.github.com" target="_blank" rel="noreferrer">GitHub CLI</a> and run <code>gh auth login</code></li>
              <li>Get an <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer">Anthropic API key</a> — paste it into Settings on first launch</li>
            </ul>
          </div>

          <div className="install-card" style={{ padding: 0 }}>
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
              <button
                onClick={() => setTab("git")}
                style={{
                  flex: 1, padding: "12px 16px", background: tab === "git" ? "var(--bg-active)" : "transparent",
                  border: "none", borderRight: "1px solid var(--border)", cursor: "pointer",
                  color: tab === "git" ? "var(--accent)" : "var(--text-dim)",
                  fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                from source
              </button>
              <button
                onClick={() => setTab("bin")}
                style={{
                  flex: 1, padding: "12px 16px", background: tab === "bin" ? "var(--bg-active)" : "transparent",
                  border: "none", cursor: "pointer",
                  color: tab === "bin" ? "var(--accent)" : "var(--text-dim)",
                  fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                standalone binary
              </button>
            </div>
            <div style={{ padding: 18 }}>
              <div className="code" style={{ background: "transparent", border: "none", padding: 0 }}>
                {commands[tab].map((l, i) => (
                  <div key={i}>
                    {l.k === "c" ? <span className="c">{l.c}</span> : <><span className="acc">$</span> <span className="br">{l.c}</span></>}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: 12, background: "var(--bg)", border: "1px dashed var(--border)", borderRadius: 2, fontSize: 12, color: "var(--text-dim)" }}>
                Retro creates a <code style={{ color: "var(--accent)" }}>.retro/</code> directory in your working directory on first launch.
                Your projects, worktrees, specs, and config all live there. Commit it, gitignore it, tar it — it's just files.
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, padding: "18px 20px", border: "1px solid var(--border)", borderRadius: 3, background: "var(--bg-panel)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>first run</div>
            <div style={{ color: "var(--text-bright)", fontSize: 14 }}>
              Launch, hit <Kbd>⌥3</Kbd> to open settings, paste your API key, then <Kbd>⌥2</Kbd> to add your first repo.
            </div>
          </div>
          <a className="btn primary" href="#">
            <Icon name="gh" size={13} /> Star on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Install });
