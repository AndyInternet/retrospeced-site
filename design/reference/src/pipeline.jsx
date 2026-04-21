/* ====== Interactive 5-phase pipeline ====== */

const PHASES = [
  {
    id: "planning",
    name: "Planning",
    sub: "reads codebase · writes plan + tasks",
    lines: [
      { t: "0.00s", tag: "PHASE", cls: "tag-phase", msg: <>planning · reading project map <span className="dim">(43 files)</span></> },
      { t: "1.14s", tag: "info",  cls: "tag-info",  msg: <>indexed <span className="br">src/api</span>, <span className="br">src/middleware</span>, <span className="br">src/lib</span></> },
      { t: "3.72s", tag: "run",   cls: "tag-run",   msg: <>drafting implementation plan → <span className="path">specs/rate-limit.md</span></> },
      { t: "5.08s", tag: "run",   cls: "tag-run",   msg: <>generating task list <span className="dim">(breaking into atomic units)</span></> },
      { t: "6.12s", tag: "ok",    cls: "tag-ok",    msg: <>plan written · <span className="br">5 tasks</span> · <span className="br">est. 12min</span></> },
    ],
  },
  {
    id: "execution",
    name: "Execution",
    sub: "claude writes code, task by task",
    lines: [
      { t: "0.00s", tag: "PHASE", cls: "tag-phase", msg: <>execution · 0/5 complete</> },
      { t: "0.42s", tag: "run",   cls: "tag-run",   msg: <><span className="br">[1/5]</span> scaffold rate-limit middleware</> },
      { t: "8.11s", tag: "ok",    cls: "tag-ok",    msg: <><span className="br">[1/5]</span> <span className="path">src/middleware/rate-limit.ts</span> <span className="grn">+84</span></> },
      { t: "8.90s", tag: "run",   cls: "tag-run",   msg: <><span className="br">[2/5]</span> wire redis store</> },
      { t: "16.3s", tag: "ok",    cls: "tag-ok",    msg: <><span className="br">[2/5]</span> <span className="path">src/lib/rl-store.ts</span> <span className="grn">+142</span> <span className="red">-3</span></> },
      { t: "16.9s", tag: "run",   cls: "tag-run",   msg: <><span className="br">[3/5]</span> write tests <span className="dim">(TDD rule active)</span></> },
      { t: "23.0s", tag: "ok",    cls: "tag-ok",    msg: <><span className="br">[3/5]</span> <span className="path">tests/rl.test.ts</span> <span className="grn">+211</span> · <span className="br">12 passing</span></> },
    ],
  },
  {
    id: "summary",
    name: "Summary",
    sub: "generates docs + testing notes",
    lines: [
      { t: "0.00s", tag: "PHASE", cls: "tag-phase", msg: <>summary · documentation</> },
      { t: "0.80s", tag: "run",   cls: "tag-run",   msg: <>analyzing final diff <span className="dim">(7 files, +512, -18)</span></> },
      { t: "2.90s", tag: "run",   cls: "tag-run",   msg: <>writing <span className="br">Summary</span> section</> },
      { t: "4.11s", tag: "run",   cls: "tag-run",   msg: <>writing <span className="br">Testing</span> instructions</> },
      { t: "5.42s", tag: "ok",    cls: "tag-ok",    msg: <>spec complete · <span className="br">6 sections</span> filled</> },
    ],
  },
  {
    id: "retro",
    name: "Retro Rollup",
    sub: "start · stop · continue",
    lines: [
      { t: "0.00s", tag: "PHASE", cls: "tag-phase", msg: <>retro · learning from this build</> },
      { t: "0.60s", tag: "info",  cls: "tag-info",  msg: <>reviewing <span className="br">23 tool calls</span> + <span className="br">4 retries</span></> },
      { t: "2.20s", tag: "run",   cls: "tag-run",   msg: <>appending notes → <span className="path">specs/retros.md</span></> },
      { t: "3.00s", tag: "ok",    cls: "tag-ok",    msg: <><span className="br">start:</span> use existing ioredis singleton, not new conn</> },
      { t: "3.01s", tag: "ok",    cls: "tag-ok",    msg: <><span className="br">stop:</span> don't re-scaffold tests dir layout each time</> },
      { t: "3.02s", tag: "ok",    cls: "tag-ok",    msg: <><span className="br">continue:</span> atomic task granularity works</> },
    ],
  },
  {
    id: "pr",
    name: "Pull Request",
    sub: "pushes branch · opens PR",
    lines: [
      { t: "0.00s", tag: "PHASE", cls: "tag-phase", msg: <>pull request</> },
      { t: "0.30s", tag: "run",   cls: "tag-run",   msg: <>pushing <span className="path">retro/rate-limit</span> → origin</> },
      { t: "2.41s", tag: "ok",    cls: "tag-ok",    msg: <>pushed · <span className="br">7 commits</span></> },
      { t: "2.70s", tag: "run",   cls: "tag-run",   msg: <>generating PR title + description</> },
      { t: "4.00s", tag: "ok",    cls: "tag-ok",    msg: <>PR opened · <span className="path">github.com/you/app/pull/312</span></> },
      { t: "4.01s", tag: "ok",    cls: "tag-ok",    msg: <>ticket → <span className="br">review</span></> },
    ],
  },
];

function Pipeline() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(1);

  useEffect(() => { setShown(1); }, [active]);

  useEffect(() => {
    const lines = PHASES[active].lines;
    if (shown >= lines.length) {
      const t = setTimeout(() => setActive((a) => (a + 1) % PHASES.length), 2500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((s) => s + 1), 750);
    return () => clearTimeout(t);
  }, [shown, active]);

  const phase = PHASES[active];

  return (
    <section id="how">
      <div className="page">
        <SectionHead
          eyebrow="how it works"
          title="A five-phase build loop you can watch in real time."
          sub="Retro orchestrates Claude Code through a deterministic pipeline. Every phase streams typed events — you see every tool call, every file touched, every retry. If a build fails, it resumes from the last good phase instead of starting from zero."
        />

        <div className="pipeline">
          <div className="pipe-steps">
            {PHASES.map((p, i) => (
              <div
                key={p.id}
                className={"pipe-step " + (i === active ? "active" : "")}
                onMouseEnter={() => setActive(i)}
              >
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <div className="label">{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{p.sub}</div>
                </span>
                <span className="arrow"><Icon name="arrow" size={14} /></span>
              </div>
            ))}
          </div>

          <div className="pipe-panel">
            <div className="pipe-panel-head">
              <span>.retro/worktrees/rate-limit · streaming</span>
              <span className="phase-tag">{phase.name}</span>
            </div>
            <div className="pipe-log">
              {phase.lines.slice(0, shown).map((l, i) => (
                <div key={i} className={"log-line" + (i === shown - 1 ? " new" : "")}>
                  <span className="ts">{l.t}</span>
                  <span className={l.cls}>[{l.tag.padEnd(5)}]</span>
                  <span className="msg">{l.msg}</span>
                </div>
              ))}
              {shown < phase.lines.length && (
                <div className="log-line">
                  <span className="ts">&nbsp;</span>
                  <span style={{ color: "var(--accent)" }}>[...]</span>
                  <span className="msg dim">streaming<span style={{ animation: "blink 0.9s infinite" }}>...</span></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Pipeline });
