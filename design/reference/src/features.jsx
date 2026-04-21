/* ====== Features grid ====== */

function Features() {
  return (
    <section id="features">
      <div className="page">
        <SectionHead
          eyebrow="features"
          title="Built for engineers who already live in the terminal."
          sub="No dashboards. No onboarding. Markdown files and git worktrees all the way down — so you keep every escape hatch you already rely on."
        />

        <div className="feat-grid">
          <div className="feat">
            <div className="label"><span className="num">01</span> spec editor</div>
            <h3>Specs are markdown. The whole feature lives in one file.</h3>
            <p>Frontmatter tracks state. Sections — spec, plan, tasks, summary, retro — are filled in as the ticket moves through the pipeline. Open it in your editor anytime; Retro syncs on save.</p>
            <div className="mock spec-mock">
              <div className="line"><span className="ln">1</span><span className="fm">---</span></div>
              <div className="line"><span className="ln">2</span><span className="fm">status:</span> <span className="dim">building</span></div>
              <div className="line"><span className="ln">3</span><span className="fm">id:</span> <span className="dim">rate-limit</span></div>
              <div className="line"><span className="ln">4</span><span className="fm">---</span></div>
              <div className="line"><span className="ln">5</span><span className="h1"># Feature Specification</span></div>
              <div className="line"><span className="ln">6</span><span className="h2">## Acceptance</span></div>
              <div className="line"><span className="ln">7</span><span className="bullet">- 429 w/ Retry-After</span></div>
            </div>
          </div>

          <div className="feat">
            <div className="label"><span className="num">02</span> pm agent · engineer agent</div>
            <h3>Two agents, two mindsets, one keystroke apart.</h3>
            <p>The PM agent interrogates your spec — edge cases, ambiguity, scope creep. Then the engineer agent takes over and argues with you about types, retries, and test strategy. Both read your codebase.</p>
            <div className="mock" style={{ padding: 0 }}>
              <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", fontSize: 11 }}>
                <span className="cyn">pm ›</span> <span className="br">What happens when Redis is down — fail-open or fail-closed?</span>
              </div>
              <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", fontSize: 11 }}>
                <span className="dim">you ›</span> fail-open, log to sentry
              </div>
              <div style={{ padding: "10px 12px", fontSize: 11 }}>
                <span className="cyn">pm ›</span> <span className="br">Noted. Adding to acceptance criteria.</span>
              </div>
            </div>
          </div>

          <div className="feat wide">
            <div className="label"><span className="num">03</span> deep maps</div>
            <h3>Focused AI analysis sessions, scoped to one lens at a time.</h3>
            <p>Point a deep map at <em>architecture</em>, <em>data flow</em>, or <em>testing</em> and get a persistent chat that has already read the relevant parts of your codebase. Come back to it later — the context sticks.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
              <div className="mock">
                <div style={{ marginBottom: 8, color: "var(--text)" }}>select a lens:</div>
                <div className="deepmap">
                  <span className="chip on">architecture</span>
                  <span className="chip">data flow</span>
                  <span className="chip">testing</span>
                  <span className="chip">auth</span>
                  <span className="chip">perf</span>
                  <span className="chip">migrations</span>
                </div>
              </div>
              <div className="mock">
                <div><span className="acc">deep-map ›</span> <span className="br">The auth flow branches at 3 points:</span></div>
                <div style={{ paddingLeft: 12 }}>
                  <div>1. <span className="path">src/auth/session.ts:42</span></div>
                  <div>2. <span className="path">src/middleware/auth.ts:18</span></div>
                  <div>3. <span className="path">src/api/oauth/callback.ts:91</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="feat">
            <div className="label"><span className="num">04</span> git worktrees</div>
            <h3>One worktree per ticket. Parallel builds, zero branch-hopping.</h3>
            <p>Retro creates a git worktree at <code style={{color:"var(--accent)"}}>.retro/worktrees/&lt;id&gt;</code> and checks out <code style={{color:"var(--accent)"}}>&lt;prefix&gt;/&lt;id&gt;</code>. Run five builds concurrently without ever touching your main checkout.</p>
            <div className="mock" style={{ fontFamily: "var(--font-mono)" }}>
              <div><span className="dim">.retro/worktrees/</span></div>
              <div>├── <span className="br">rate-limit</span>          <span className="dim">retro/rate-limit</span></div>
              <div>├── <span className="br">csv-import</span>          <span className="dim">retro/csv-import</span></div>
              <div>├── <span className="br">oauth-refresh</span>       <span className="dim">retro/oauth-refresh</span></div>
              <div>└── <span className="br">search-infra</span>        <span className="dim">retro/search-infra</span></div>
            </div>
          </div>

          <div className="feat">
            <div className="label"><span className="num">05</span> constitution</div>
            <h3>Toggle the rules Claude has to follow.</h3>
            <p>A small set of switches — TDD, type safety, no new dependencies — that assemble into a shared system prompt every build agent respects. Your taste, enforced.</p>
            <div className="mock" style={{ padding: "4px 12px" }}>
              <div className="rule-row on"><span className="rule"><span className="check" /> Test-Driven Development</span><span className="space">on</span></div>
              <div className="rule-row on"><span className="rule"><span className="check" /> Type Safety</span><span className="space">on</span></div>
              <div className="rule-row"><span className="rule"><span className="check" /> Defensive Programming</span><span className="space">off</span></div>
              <div className="rule-row on"><span className="rule"><span className="check" /> Smallest Changeset</span><span className="space">on</span></div>
              <div className="rule-row"><span className="rule"><span className="check" /> Documentation (JSDoc)</span><span className="space">off</span></div>
              <div className="rule-row on"><span className="rule"><span className="check" /> No New Dependencies</span><span className="space">on</span></div>
            </div>
          </div>

          <div className="feat third">
            <div className="label"><span className="num">06</span> queue</div>
            <h3>Persistent build queue.</h3>
            <p>Close your laptop. Reopen it. Builds pick up where they left off, retry failed phases up to three times, and resume from the last checkpoint.</p>
          </div>
          <div className="feat third">
            <div className="label"><span className="num">07</span> no database</div>
            <h3>Just files.</h3>
            <p>Everything lives in <code style={{color:"var(--accent)"}}>.retro/</code> — markdown, JSON, git worktrees. Grep it, diff it, commit it, or delete it. No migrations.</p>
          </div>
          <div className="feat third">
            <div className="label"><span className="num">08</span> bun-native</div>
            <h3>One binary.</h3>
            <p>Compile to a single self-contained executable that includes the Bun runtime. Drop it on your <code style={{color:"var(--accent)"}}>PATH</code> and never think about node_modules again.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Features });
