/* ====== Hero section with interactive kanban ====== */

function Hero({ variant }) {
  const [hovered, setHovered] = useState("t-042");
  const [copied, setCopied] = useState(false);

  const copy = (text) => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <section className="hero">
      <div className="hero-grid" />
      <div className="page">
        <div className="hero-inner">
          <div>
            <span className="hero-badge">
              <span className="pulse" />
              v0.4 · open source · mit-ish
            </span>

            <h1>
              Spec-driven<br />
              AI dev from the<br />
              <span className="accent">command line.</span>
            </h1>

            <p className="tag">
              <strong>Retro</strong> is a terminal UI that runs the full feature lifecycle —
              <span className="br"> draft a spec, plan it, build it, ship the PR</span> —
              while you stay in control of the review loop. No IDE plugin, no web dashboard, no context switch.
            </p>

            <div className="hero-ctas">
              <button className="btn primary" onClick={() => copy("bun install && bun src/index.tsx")}>
                <Icon name="bolt" size={13} /> Install retro
              </button>
              <a className="btn" href="#how">
                How it works <Icon name="arrow" size={13} />
              </a>
              <a className="btn ghost" href="#shortcuts">
                <Icon name="gh" size={13} /> github
              </a>
            </div>

            <div className="install-strip">
              <span className="prompt">$</span>
              <span className="cmd">git clone github.com/you/retrospeced-tui &amp;&amp; cd $_ &amp;&amp; bun install</span>
              <button className="copy" onClick={() => copy("git clone github.com/you/retrospeced-tui && cd $_ && bun install")}>
                {copied ? "copied" : "copy"}
              </button>
            </div>

            <div className="hero-meta">
              <span><strong>bun</strong> native</span>
              <span className="dot">//</span>
              <span>runs on <strong>Claude</strong> Code</span>
              <span className="dot">//</span>
              <span>no db, no cloud</span>
              <span className="dot">//</span>
              <span><strong>80×24</strong> minimum</span>
            </div>
          </div>

          <HeroTerminal variant={variant} hovered={hovered} onHover={setHovered} />
        </div>
      </div>
    </section>
  );
}

function HeroTerminal({ variant, hovered, onHover }) {
  if (variant === "pipeline") return <HeroPipeline />;
  if (variant === "spec")     return <HeroSpec />;
  return <HeroKanban hovered={hovered} onHover={onHover} />;
}

/* --- Variant A: Kanban board (default) --- */

const TICKETS = {
  draft: [
    { id: "onboard-flow",  title: "Empty-state onboarding for new workspaces", tag: "ui" },
    { id: "csv-import",    title: "CSV import wizard w/ column mapping",       tag: "data" },
    { id: "oauth-refresh", title: "Auto-refresh expired OAuth tokens",          tag: "auth" },
  ],
  plan: [
    { id: "t-042",         title: "Add rate limiting to /api/* endpoints",      tag: "backend", hot: true },
    { id: "search-infra",  title: "Swap Postgres FTS for Meilisearch",          tag: "infra" },
  ],
  building: [
    { id: "t-039",         title: "Migrate billing to Stripe Billing v2",       tag: "billing", progress: 62 },
    { id: "webhook-retry", title: "Exponential backoff on outbound webhooks",   tag: "infra",   progress: 22 },
  ],
  review: [
    { id: "t-031",         title: "Fix Safari 17 focus trap regression",        tag: "bug" },
    { id: "t-029",         title: "Dark mode across marketing site",            tag: "ui" },
    { id: "t-022",         title: "SOC2 audit log export",                      tag: "sec" },
  ],
};

function HeroKanban({ hovered, onHover }) {
  return (
    <TerminalWindow title="retro@kanban" subtitle="tickets / 8 open">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: 11, color: "var(--text-dim)" }}>
        <span><span className="acc">●</span> all projects · filter: any</span>
        <span>⌥1 tickets  ⌥2 projects  ⌥3 settings  ⌥/ search</span>
      </div>
      <div className="kanban">
        {[
          { k: "draft",    label: "Draft",    list: TICKETS.draft },
          { k: "plan",     label: "Plan",     list: TICKETS.plan },
          { k: "building", label: "Building", list: TICKETS.building },
          { k: "review",   label: "Review",   list: TICKETS.review },
        ].map((col) => (
          <div key={col.k} className={"k-col " + col.k}>
            <div className="k-col-head">
              <span className="name">{col.label}</span>
              <span className="count">{col.list.length.toString().padStart(2, "0")}</span>
            </div>
            {col.list.map((t) => (
              <div
                key={t.id}
                className={"k-card " + (hovered === t.id ? "active" : "")}
                onMouseEnter={() => onHover(t.id)}
              >
                <div className="id">#{t.id}</div>
                <div className="title">{t.title}</div>
                <div className="meta">
                  <span className="tag">#{t.tag}</span>
                  {t.hot && <span style={{ color: "var(--red)" }}>● urgent</span>}
                  {t.progress != null && <span>{t.progress}%</span>}
                </div>
                {t.progress != null && (
                  <div className="bar"><div className="bar-fill" style={{ width: t.progress + "%", animation: "none" }} /></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 14, fontSize: 11, color: "var(--text-dim)", flexWrap: "wrap" }}>
        <span><span className="br">⌥n</span> new</span>
        <span><span className="br">⌥/</span> find</span>
        <span><span className="br">⌥f</span> filter project</span>
        <span><span className="br">↵</span> open</span>
        <span style={{ marginLeft: "auto" }}>retro v0.4.2 · streaming</span>
      </div>
    </TerminalWindow>
  );
}

/* --- Variant B: Spec editor --- */

function HeroSpec() {
  return (
    <TerminalWindow title="retro@draft" subtitle="specs/rate-limit.md">
      <div className="spec-mock">
        <div className="line"><span className="ln">1</span><span className="fm">---</span></div>
        <div className="line"><span className="ln">2</span><span className="fm">status:</span> <span className="dim">draft</span></div>
        <div className="line"><span className="ln">3</span><span className="fm">id:</span> <span className="dim">rate-limit</span></div>
        <div className="line"><span className="ln">4</span><span className="fm">---</span></div>
        <div className="line"><span className="ln">5</span>&nbsp;</div>
        <div className="line"><span className="ln">6</span><span className="h1"># Feature Specification</span></div>
        <div className="line"><span className="ln">7</span>&nbsp;</div>
        <div className="line"><span className="ln">8</span><span className="br">Add a token-bucket rate limiter to all /api/* endpoints.</span></div>
        <div className="line"><span className="ln">9</span><span className="br">Limits are per-API-key, configurable via dashboard.</span></div>
        <div className="line"><span className="ln">10</span>&nbsp;</div>
        <div className="line"><span className="ln">11</span><span className="h2">## Acceptance</span></div>
        <div className="line"><span className="ln">12</span><span className="bullet">- 429 response includes Retry-After header</span></div>
        <div className="line"><span className="ln">13</span><span className="bullet">- Counters persist across process restart</span></div>
        <div className="line"><span className="ln">14</span><span className="bullet">- Admin override bypasses limit</span><span className="caret" /></div>
      </div>
      <div style={{ marginTop: 14, padding: 10, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 2, fontSize: 11.5, color: "var(--text-dim)" }}>
        <div><span className="acc">pm-agent ›</span> <span className="br">I looked at src/api/*. You probably also want:</span></div>
        <div style={{ paddingLeft: 12, marginTop: 4 }}>
          <div>· A bypass header for health-check probes (they hit /api/health every 30s)</div>
          <div>· Explicit behavior when Redis is unreachable — fail-open or fail-closed?</div>
        </div>
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 14, fontSize: 11, color: "var(--text-dim)", flexWrap: "wrap" }}>
        <span><span className="br">⌥p</span> plan</span>
        <span><span className="br">⌥r</span> refs</span>
        <span><span className="br">Tab</span> chat</span>
        <span><span className="br">⌥m</span> preview</span>
      </div>
    </TerminalWindow>
  );
}

/* --- Variant C: Pipeline stream --- */

const PIPE_LINES = [
  { t: "0.00s", tag: "phase",  tagText: "PHASE", msg: <>planning · reading codebase <span className="dim">(src/api)</span></>, cls: "tag-phase" },
  { t: "2.31s", tag: "info",   tagText: "info",  msg: <>scanned <span className="br">38 files</span>, <span className="br">4 routes</span> matched</>, cls: "tag-info" },
  { t: "4.80s", tag: "run",    tagText: "run",   msg: <>writing plan → <span className="path">specs/rate-limit.md</span></>, cls: "tag-run" },
  { t: "6.12s", tag: "ok",     tagText: "ok",    msg: <>plan accepted · <span className="br">5 tasks</span></>, cls: "tag-ok" },
  { t: "6.13s", tag: "phase",  tagText: "PHASE", msg: <>execution</>, cls: "tag-phase" },
  { t: "7.40s", tag: "run",    tagText: "run",   msg: <><span className="br">[1/5]</span> add middleware scaffold</>, cls: "tag-run" },
  { t: "12.2s", tag: "ok",     tagText: "ok",    msg: <><span className="br">[1/5]</span> <span className="path">src/middleware/rate-limit.ts</span> +84</>, cls: "tag-ok" },
  { t: "13.0s", tag: "run",    tagText: "run",   msg: <><span className="br">[2/5]</span> wire redis backend</>, cls: "tag-run" },
  { t: "19.8s", tag: "ok",     tagText: "ok",    msg: <><span className="br">[2/5]</span> <span className="path">src/lib/rl-store.ts</span> +142</>, cls: "tag-ok" },
  { t: "20.1s", tag: "run",    tagText: "run",   msg: <><span className="br">[3/5]</span> add tests <span className="dim">(constitution: TDD)</span></>, cls: "tag-run" },
];

function HeroPipeline() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => Math.min(PIPE_LINES.length, c + 1)), 900);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (count >= PIPE_LINES.length) {
      const t = setTimeout(() => setCount(3), 3500);
      return () => clearTimeout(t);
    }
  }, [count]);

  return (
    <TerminalWindow title="retro@building" subtitle="#rate-limit · phase 2/5">
      <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8 }}>
        <span className="acc">●</span> claude-sonnet-4.6 · worktree <span className="br">.retro/worktrees/rate-limit</span>
      </div>
      <div className="pipe-log" style={{ padding: 0, minHeight: 300 }}>
        {PIPE_LINES.slice(0, count).map((l, i) => (
          <div key={i} className={"log-line" + (i === count - 1 ? " new" : "")}>
            <span className="ts">{l.t}</span>
            <span className={l.cls}>[{l.tagText.padEnd(5)}]</span>
            <span className="msg">{l.msg}</span>
          </div>
        ))}
        <div className="log-line">
          <span className="ts">&nbsp;</span>
          <span className="tag-run" style={{ color: "var(--accent)" }}>[...]</span>
          <span className="msg dim">streaming<span style={{ animation: "blink 0.9s infinite" }}>...</span></span>
        </div>
      </div>
    </TerminalWindow>
  );
}

Object.assign(window, { Hero });
