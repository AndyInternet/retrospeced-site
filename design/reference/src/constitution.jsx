/* ====== Constitution-rules section (deep dive) ====== */

const RULES = [
  { id: "tdd",       name: "Test-Driven Development", desc: "Write tests before implementation. Red, green, refactor — enforced.", on: true },
  { id: "defensive", name: "Defensive Programming",   desc: "Validate inputs at boundaries. Handle unknown unknowns gracefully.", on: false },
  { id: "smallest",  name: "Smallest Changeset",      desc: "Minimize churn. Touch only what the ticket demands.", on: true },
  { id: "types",     name: "Type Safety",             desc: "No any. No as-casts without a comment. Strict everywhere.", on: true },
  { id: "docs",      name: "Documentation",           desc: "Add JSDoc on public APIs. Update README for user-facing changes.", on: false },
  { id: "commits",   name: "Conventional Commits",    desc: "feat:, fix:, chore:, refactor:. Machine-readable history.", on: true },
  { id: "lint",      name: "Lint Compliance",         desc: "The linter is the contract. No yellow squiggles make it in.", on: true },
  { id: "nodeps",    name: "No New Dependencies",     desc: "Don't reach for npm when a stdlib will do.", on: true },
  { id: "cleanup",   name: "Cleanup Technical Debt",  desc: "If you trip over debt on the way, fix it while you're there.", on: false },
];

function Constitution() {
  const [rules, setRules] = useState(RULES);
  const toggle = (id) => setRules((rs) => rs.map((r) => (r.id === id ? { ...r, on: !r.on } : r)));
  const activeCount = rules.filter((r) => r.on).length;

  return (
    <section id="constitution">
      <div className="page">
        <SectionHead
          eyebrow="constitution"
          title="Your taste, as a system prompt."
          sub="Toggle the engineering principles every build agent has to follow. Retro regenerates .retro/constitution.md on each change — click the rules, try it."
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
          <div style={{ border: "1px solid var(--border)", borderRadius: 3, background: "var(--bg-panel)" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-dim)" }}>
              <span>.retro/config.json · toggles</span>
              <span><span className="acc">●</span> {activeCount}/{rules.length} active</span>
            </div>
            <div style={{ padding: "4px 14px" }}>
              {rules.map((r) => (
                <div key={r.id} className={"rule-row " + (r.on ? "on" : "")} onClick={() => toggle(r.id)} style={{ cursor: "pointer" }}>
                  <span className="rule">
                    <span className="check" />
                    <span>
                      <div>{r.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{r.desc}</div>
                    </span>
                  </span>
                  <span style={{ fontSize: 10, color: r.on ? "var(--accent)" : "var(--text-dim)" }}>{r.on ? "ON" : "OFF"}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              generated → .retro/constitution.md
            </div>
            <div className="code" style={{ whiteSpace: "pre-wrap", fontSize: 12.5, minHeight: 340 }}>
{`${"/* system prompt · injected into every build agent */".split("").join("")}\n`}
<span className="c"># The Constitution</span>{"\n"}
<span className="c"># Regenerated {new Date().toISOString().slice(0,19)}Z</span>{"\n\n"}
You are a build agent. Follow these rules strictly.{"\n\n"}
{rules.filter(r => r.on).map((r, i) => (
  <span key={r.id}>
    <span className="k">## {r.name}</span>{"\n"}
    {r.desc}{"\n\n"}
  </span>
))}
{activeCount === 0 && <span className="c">// no rules active — chaos mode</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Constitution });
